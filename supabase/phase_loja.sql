-- =========================================================
-- RESENHA FC — LOJA (camisas, carrinho, checkout, Pix)
-- Rode este arquivo no SQL Editor do Supabase (depois do schema.sql)
--
-- IMPORTANTE: rode a primeira linha (ALTER TYPE) sozinha, clique em "Run",
-- e só depois cole o resto do arquivo e rode de novo. O Postgres não
-- permite usar um valor novo de enum na mesma transação em que ele foi
-- criado.
-- =========================================================

alter type payment_method add value if not exists 'dinheiro';

-- =========================================================
-- Cole e rode a partir daqui, depois de rodar a linha acima sozinha
-- =========================================================

-- Dados do Pix gerado pelo Mercado Pago para cada pedido
alter table public.orders
  add column if not exists mercadopago_payment_id text,
  add column if not exists pix_qr_code text,        -- imagem do QR Code (base64)
  add column if not exists pix_copy_paste text,      -- código "copia e cola"
  add column if not exists pix_expires_at timestamptz;

create index if not exists idx_orders_mp_payment on public.orders(mercadopago_payment_id);

-- Função de checkout: valida estoque, cria o pedido + itens e debita
-- o estoque em uma única transação. Roda com privilégios elevados
-- (security definer) mas sempre a partir do usuário autenticado
-- (auth.uid()), então um cliente nunca cria pedido em nome de outro.
-- O pagamento em si (gerar o Pix) é feito depois, pelo backend do site,
-- que chama esta função e em seguida a API do Mercado Pago.
create or replace function public.checkout(
  p_items jsonb,              -- [{ "product_id": "...", "size": "M", "quantity": 2 }, ...]
  p_shipping_address jsonb,
  p_payment_method payment_method
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product record;
  v_current_stock int;
  v_total numeric(10,2) := 0;
  v_unit_price numeric(10,2);
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado';
  end if;

  if (select jsonb_array_length(p_items)) is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Carrinho vazio';
  end if;

  -- 1ª passada: valida estoque de todos os itens antes de criar qualquer coisa
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.products
      where id = (v_item->>'product_id')::uuid and active = true;

    if v_product is null then
      raise exception 'Produto não encontrado ou indisponível';
    end if;

    v_current_stock := coalesce((v_product.stock ->> (v_item->>'size'))::int, 0);
    if v_current_stock < (v_item->>'quantity')::int then
      raise exception 'Estoque insuficiente para % (tamanho %)', v_product.name, v_item->>'size';
    end if;
  end loop;

  -- cria o pedido (total é preenchido depois de somar os itens)
  insert into public.orders (customer_id, status, payment_method, payment_status, shipping_address, total)
  values (auth.uid(), 'pendente', p_payment_method, 'pendente', p_shipping_address, 0)
  returning id into v_order_id;

  -- 2ª passada: cria os itens e debita o estoque
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid;
    v_unit_price := v_product.price;
    v_total := v_total + v_unit_price * (v_item->>'quantity')::int;

    insert into public.order_items (order_id, product_id, size, quantity, unit_price)
    values (v_order_id, v_product.id, v_item->>'size', (v_item->>'quantity')::int, v_unit_price);

    update public.products
      set stock = jsonb_set(
        stock,
        array[v_item->>'size'],
        to_jsonb(coalesce((stock ->> (v_item->>'size'))::int, 0) - (v_item->>'quantity')::int)
      )
      where id = v_product.id;
  end loop;

  update public.orders set total = v_total where id = v_order_id;

  return v_order_id;
end;
$$;

grant execute on function public.checkout(jsonb, jsonb, payment_method) to authenticated;

-- =========================================================
-- FIM
-- =========================================================
