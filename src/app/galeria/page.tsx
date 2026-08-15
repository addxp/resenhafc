import Image from "next/image";
import { getRecentMedia } from "@/lib/queries";

export default async function GaleriaPage() {
  const photos = await getRecentMedia(60);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-primary mb-2">Galeria</h1>
      <p className="text-gray-500 mb-6">
        Fotos de jogos, campeonatos e eventos do Resenha FC.
      </p>

      {photos.length === 0 ? (
        <p className="text-gray-500">Nenhuma foto publicada ainda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((m) => (
            <div
              key={m.id}
              className="aspect-square bg-sand-200 rounded-lg overflow-hidden relative"
            >
              <Image
                src={m.url}
                alt={m.caption ?? "Foto do Resenha FC"}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
