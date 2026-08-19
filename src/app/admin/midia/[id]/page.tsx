import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { getAlbumById, getAlbumMedia } from "@/lib/queries";
import { MediaUploader } from "@/components/MediaUploader";
import { PhotoGrid } from "@/components/PhotoGrid";

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
        <p className="text-xs text-gray-400 mt-1">
          Clique em uma foto ou vídeo para ampliar e baixar.
        </p>
      </div>

      <div className="mb-8">
        <MediaUploader
          albumId={album.id}
          category={album.category}
          playerId={album.player_id}
        />
      </div>

      <PhotoGrid media={media} albumTitle={album.title} showDelete />
    </main>
  );
}
