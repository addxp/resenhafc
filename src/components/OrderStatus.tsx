"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types/database.types";

const STATUS_LABELS: Record<string, string> = {
  pendente: "Aguardando pagamento",
  pago: "Pago",
  preparando: "Preparando",
  enviado: "Enviado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export function OrderStatus({ initialOrder }: { initialOrder: Order }) {
  const supabase = createClient();
  const [order, setOrder] = useState(initialOrder);
  const [copied, setCopied] = useState(false);

  const isPendingPix =
    order.payment_method === "pix" && order.payment_status === "pendente";

  // Enquanto o Pix estiver pendente, verifica a cada 5s se o pagamento caiu
  // (o webhook do Mercado Pago atualiza o banco assim que confirma).
  useEffect(() => {
    if (!isPendingPix) return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("id", order.id)
        .single();
      if (data) setOrder(data as Order);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPendingPix, order.id]);

  function handleCopy() {
    if (!order.pix_copy_paste) return;
    navigator.clipboard.writeText(order.pix_copy_paste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-sand-200 rounded-xl p-5">
        <p className="text-sm text-ink/50">Status do pedido</p>
        <p className="font-display text-2xl tracking-wide text-ink mt-1">
          {STATUS_LABELS[order.status]?.toUpperCase()}
        </p>
        <p className="font-mono text-court font-semibold mt-2">
          R$ {order.total.toFixed(2).replace(".", ",")}
        </p>
      </div>

      {isPendingPix && order.pix_qr_code && (
        <div className="bg-white border border-sand-200 rounded-xl p-5 text-center">
          <p className="font-medium mb-3">Pague com Pix para confirmar automaticamente</p>
          <img
            src={`data:image/png;base64,${order.pix_qr_code}`}
            alt="QR Code Pix"
            className="mx-auto w-56 h-56"
          />
          <button
            onClick={handleCopy}
            className="mt-4 w-full bg-primary text-white rounded-lg px-4 py-2.5 font-medium"
          >
            {copied ? "Copiado! ✓" : "Copiar código Pix"}
          </button>
          <p className="text-xs text-ink/40 mt-3">
            Assim que o pagamento cair, esta página atualiza sozinha.
          </p>
        </div>
      )}

      {order.payment_method === "dinheiro" && order.payment_status === "pendente" && (
        <div className="bg-sand-100 border border-sand-300 rounded-xl p-5 text-center">
          <p className="font-medium">Combine o pagamento em dinheiro com o admin do time.</p>
          <p className="text-sm text-ink/60 mt-1">
            O pedido fica reservado, mas o pagamento é confirmado manualmente.
          </p>
        </div>
      )}

      {order.payment_status === "aprovado" && (
        <div className="bg-court/10 border border-court/30 rounded-xl p-5 text-center">
          <p className="font-medium text-court">Pagamento confirmado! 🎉</p>
        </div>
      )}
    </div>
  );
}
