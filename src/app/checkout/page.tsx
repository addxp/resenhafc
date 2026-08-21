"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const supabase = createClient();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "dinheiro">("pix");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login?redirectTo=/checkout");
        return;
      }
      setCheckingAuth(false);
    });
  }, []);

  useEffect(() => {
    if (!checkingAuth && items.length === 0) {
      router.push("/carrinho");
    }
  }, [checkingAuth, items.length]);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.productId,
            size: i.size,
            quantity: i.quantity,
          })),
          payment_method: paymentMethod,
          shipping_address: { name, phone, notes },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Não foi possível finalizar o pedido.");
        setLoading(false);
        return;
      }

      clear();
      router.push(`/pedido/${data.orderId}`);
    } catch (err: any) {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (checkingAuth) return null;

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-6">FINALIZAR PEDIDO</h1>

      <div className="bg-white border border-sand-200 rounded-xl p-4 mb-6">
        {items.map((i) => (
          <div
            key={`${i.productId}-${i.size}`}
            className="flex justify-between text-sm py-1"
          >
            <span>
              {i.quantity}x {i.name} ({i.size})
            </span>
            <span className="font-mono">R$ {(i.price * i.quantity).toFixed(2).replace(".", ",")}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t border-sand-200 mt-2 pt-2">
          <span>Total</span>
          <span className="font-mono text-court">R$ {total.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1 text-ink/70">Nome para retirada/entrega</label>
          <input
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">Telefone / WhatsApp</label>
          <input
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">
            Observações (endereço de entrega, ou combinar retirada)
          </label>
          <textarea
            rows={3}
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-ink/70 mb-2">Forma de pagamento</p>
        <div className="flex flex-col gap-2">
          <label
            className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
              paymentMethod === "pix" ? "border-primary bg-sand-50" : "border-sand-300"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "pix"}
              onChange={() => setPaymentMethod("pix")}
            />
            <div>
              <p className="font-medium">Pix</p>
              <p className="text-xs text-ink/50">
                Gera um QR Code na hora — confirmação automática.
              </p>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
              paymentMethod === "dinheiro" ? "border-primary bg-sand-50" : "border-sand-300"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "dinheiro"}
              onChange={() => setPaymentMethod("dinheiro")}
            />
            <div>
              <p className="font-medium">Dinheiro</p>
              <p className="text-xs text-ink/50">
                Combine o pagamento em mãos com o admin do time.
              </p>
            </div>
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark transition-colors text-white rounded-lg px-6 py-3 font-medium disabled:opacity-60"
      >
        {loading ? "Processando..." : "Confirmar pedido"}
      </button>
    </main>
  );
}
