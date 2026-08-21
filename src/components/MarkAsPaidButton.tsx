"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MarkAsPaidButton({ orderId }: { orderId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await supabase
      .from("orders")
      .update({ payment_status: "aprovado", status: "pago" })
      .eq("id", orderId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg bg-court text-white font-medium disabled:opacity-60"
    >
      {loading ? "..." : "Marcar como pago"}
    </button>
  );
}
