import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/queries";
import { OrderStatus } from "@/components/OrderStatus";

export default async function PedidoPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-6">SEU PEDIDO</h1>

      <div className="bg-white border border-sand-200 rounded-xl p-4 mb-6">
        {(order as any).order_items?.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>
              {item.quantity}x {item.products?.name} ({item.size})
            </span>
            <span className="font-mono">
              R$ {(item.unit_price * item.quantity).toFixed(2).replace(".", ",")}
            </span>
          </div>
        ))}
      </div>

      <OrderStatus initialOrder={order as any} />
    </main>
  );
}
