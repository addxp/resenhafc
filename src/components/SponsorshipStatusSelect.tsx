"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "em_conversa", label: "Em conversa" },
  { value: "fechado", label: "Fechado" },
  { value: "recusado", label: "Recusado" },
];

export function SponsorshipStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setLoading(true);
    await supabase.from("sponsorship_inquiries").update({ status: newStatus }).eq("id", id);
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      className="text-sm border border-sand-300 rounded-lg px-2 py-1 disabled:opacity-60"
      defaultValue={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
