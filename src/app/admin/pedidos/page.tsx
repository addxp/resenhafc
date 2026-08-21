import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { getAllOrders } from "@/lib/queries";
import { MarkAsPaidButton } from "@/components/MarkAsPaidButton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAYMENT_LABELS: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

export default async function AdminPedidosPage() {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  const orders = await getAllOrders();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-6">PEDIDOS</h1>

      {orders.length === 0 ? (
        <p className="text-ink/50 text-sm">Nenhum pedido ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o: any) => (
            <div
              key={o.id}
              className="bg-white border border-sand-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium">{o.profiles?.full_name ?? "Cliente"}</p>
                  <p className="text-xs text-ink/40 font-mono">
                    {formatDate(o.created_at)} · {PAYMENT_LABELS[o.payment_method] ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-mono ${
                      o.payment_status === "aprovado"
                        ? "bg-court/10 text-court"
                        : "bg-sand-100 text-ink/60"
                    }`}
                  >
                    {o.payment_status}
                  </span>
                  {o.payment_method === "dinheiro" && o.payment_status === "pendente" && (
                    <MarkAsPaidButton orderId={o.id} />
                  )}
                </div>
              </div>

              <div className="text-sm text-ink/70">
                {o.order_items?.map((item: any) => (
                  <p key={item.id}>
                    {item.quantity}x {item.products?.name} ({item.size})
                  </p>
                ))}
              </div>

              <p className="font-mono font-semibold text-court mt-2">
                R$ {o.total.toFixed(2).replace(".", ",")}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
