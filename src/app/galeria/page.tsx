import { getRecentMedia } from "@/lib/queries";
import { PhotoGrid } from "@/components/PhotoGrid";

export default async function GaleriaPage() {
  const photos = await getRecentMedia(60);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-primary mb-2">Galeria</h1>
      <p className="text-gray-500 mb-6">
        Fotos de jogos, campeonatos e eventos do Resenha FC. Clique em uma foto para
        ampliar e baixar.
      </p>

      <PhotoGrid media={photos} albumTitle="Resenha FC" />
    </main>
  );
}
