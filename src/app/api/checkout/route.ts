import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPixPayment } from "@/lib/mercadopago";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Você precisa estar logado." }, { status: 401 });
  }

  const body = await request.json();
  const { items, payment_method, shipping_address } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  if (!["pix", "dinheiro"].includes(payment_method)) {
    return NextResponse.json({ error: "Forma de pagamento inválida." }, { status: 400 });
  }

  // Cria o pedido + itens + debita estoque, tudo atomicamente, via função
  // no banco (supabase/phase_loja.sql). Se o estoque não for suficiente
  // para algum item, essa chamada falha e nada é criado.
  const { data: orderId, error: rpcError } = await supabase.rpc("checkout", {
    p_items: items,
    p_shipping_address: shipping_address ?? null,
    p_payment_method: payment_method,
  });

  if (rpcError || !orderId) {
    return NextResponse.json(
      { error: rpcError?.message || "Não foi possível criar o pedido." },
      { status: 400 }
    );
  }

  if (payment_method === "pix") {
    const admin = createAdminClient();

    try {
      const { data: order } = await admin
        .from("orders")
        .select("total")
        .eq("id", orderId)
        .single();

      const pix = await createPixPayment({
        orderId,
        amount: order?.total ?? 0,
        payerEmail: user.email!,
        payerName: shipping_address?.name,
        description: `Pedido Resenha FC #${String(orderId).slice(0, 8)}`,
      });

      await admin
        .from("orders")
        .update({
          mercadopago_payment_id: pix.paymentId,
          pix_qr_code: pix.qrCodeBase64,
          pix_copy_paste: pix.copyPaste,
          pix_expires_at: pix.expiresAt,
        })
        .eq("id", orderId);
    } catch (err: any) {
      // O pedido já existe no banco; o Pix é que falhou ao ser gerado.
      // Deixa o cliente seguir para a página do pedido mesmo assim —
      // lá dá pra tentar de novo ou combinar outro pagamento com o admin.
      return NextResponse.json({
        orderId,
        warning: `Pedido criado, mas houve um erro ao gerar o Pix: ${err.message}`,
      });
    }
  }

  return NextResponse.json({ orderId });
}
