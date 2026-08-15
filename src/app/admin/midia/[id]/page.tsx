import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { getAlbumById, getAlbumMedia } from "@/lib/queries";
import { MediaUploader } from "@/components/MediaUploader";
import { DeleteMediaButton } from "@/components/DeleteMediaButton";

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  const album = await getAlbumById(params.id);
  if (!album) notFound();

  const media = await getAlbumMedia(params.id);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <p className="text-sm text-primary uppercase tracking-wide">{album.category}</p>
        <h1 className="text-2xl font-bold text-primary">
          {album.title}
          {(album as any).players?.name ? ` — ${(album as any).players.name}` : ""}
        </h1>
        {album.description && <p className="text-gray-500 mt-1">{album.description}</p>}
      </div>

      <div className="mb-8">
        <MediaUploader
          albumId={album.id}
          category={album.category}
          playerId={album.player_id}
        />
      </div>

      {media.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhum arquivo enviado ainda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {media.map((m) => (
            <div
              key={m.id}
              className="group relative aspect-square bg-sand-200 rounded-lg overflow-hidden"
            >
              {m.type === "video" ? (
                <video src={m.url} className="w-full h-full object-cover" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.url}
                  alt={m.caption ?? album.title}
                  className="w-full h-full object-cover"
                />
              )}
              <DeleteMediaButton mediaId={m.id} storagePath={m.storage_path} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
