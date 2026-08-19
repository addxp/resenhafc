"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { MediaItem } from "@/types/database.types";

export function PhotoGrid({
  media,
  albumTitle,
  showDelete = false,
}: {
  media: MediaItem[];
  albumTitle?: string;
  showDelete?: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [selected, setSelected] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fecha o visualizador com a tecla Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleDownload(item: MediaItem) {
    setDownloading(true);
    try {
      const res = await fetch(item.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = item.storage_path?.split("/").pop() || `resenha-fc-${item.id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Se o download direto falhar (ex: CORS), abre em nova aba como alternativa
      window.open(item.url, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm("Excluir este arquivo? Essa ação não pode ser desfeita.")) return;
    setDeleting(true);
    await supabase.storage.from("media").remove([item.storage_path]);
    await supabase.from("media").delete().eq("id", item.id);
    setDeleting(false);
    setSelected(null);
    router.refresh();
  }

  if (media.length === 0) {
    return <p className="text-ink/50 text-sm">Nenhum arquivo enviado ainda.</p>;
  }

  const current = selected !== null ? media[selected] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {media.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setSelected(i)}
            className="group relative aspect-square bg-sand-200 rounded-lg overflow-hidden"
          >
            {m.type === "video" ? (
              <>
                <video
                  src={m.url}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white text-3xl bg-black/20">
                  ▶
                </span>
              </>
            ) : (
              // Next/Image otimiza e redimensiona a imagem automaticamente —
              // muito mais leve que carregar a foto original do celular.
              <Image
                src={m.url}
                alt={m.caption ?? albumTitle ?? "Foto do Resenha FC"}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {current.type === "video" ? (
              <video
                src={current.url}
                controls
                autoPlay
                className="w-full max-h-[75vh] rounded-lg"
              />
            ) : (
              // Aqui usamos <img> normal (não otimizada) de propósito: no
              // visualizador ampliado queremos a foto em resolução real.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.url}
                alt={current.caption ?? albumTitle ?? "Foto do Resenha FC"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            )}

            <div className="flex items-center justify-between gap-3 w-full">
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(current)}
                  disabled={downloading}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-60"
                >
                  {downloading ? "Baixando..." : "Baixar"}
                </button>
                {showDelete && (
                  <button
                    onClick={() => handleDelete(current)}
                    disabled={deleting}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium disabled:opacity-60"
                  >
                    {deleting ? "Excluindo..." : "Excluir"}
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20"
              >
                Fechar ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
