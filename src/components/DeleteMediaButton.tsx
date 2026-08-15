"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteMediaButton({
  mediaId,
  storagePath,
}: {
  mediaId: string;
  storagePath: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Excluir este arquivo? Essa ação não pode ser desfeita.")) return;
    setLoading(true);

    await supabase.storage.from("media").remove([storagePath]);
    await supabase.from("media").delete().eq("id", mediaId);

    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="absolute top-2 right-2 bg-black/60 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {loading ? "..." : "Excluir"}
    </button>
  );
}
