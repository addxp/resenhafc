"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function MediaUploader({
  albumId,
  category,
  playerId,
}: {
  albumId: string;
  category: string;
  playerId: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`Enviando ${i + 1} de ${files.length}...`);

      const isVideo = file.type.startsWith("video/");
      const ext = file.name.split(".").pop();
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      // Organiza no storage por categoria/álbum, ex: jogadores/<albumId>/arquivo.jpg
      const path = `${category}/${albumId}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file);

      if (uploadError) {
        setError(`Erro ao enviar ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(path);

      await supabase.from("media").insert({
        album_id: albumId,
        player_id: playerId,
        type: isVideo ? "video" : "foto",
        storage_path: path,
        url: publicUrl.publicUrl,
      });
    }

    setUploading(false);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="bg-white border border-sand-200 rounded-xl p-4 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enviar fotos ou vídeos
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        disabled={uploading}
        onChange={(e) => handleFiles(e.target.files)}
        className="text-sm"
      />
      {progress && <p className="text-sm text-gray-500 mt-2">{progress}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
