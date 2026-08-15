import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { getAlbums } from "@/lib/queries";
import type { AlbumCategory } from "@/types/database.types";

const CATEGORY_LABELS: Record<AlbumCategory, string> = {
  treinos: "Treinos",
  jogos: "Jogos",
  campeonatos: "Campeonatos",
  eventos: "Eventos",
  jogadores: "Jogadores",
};

const CATEGORY_ORDER: AlbumCategory[] = [
  "jogadores",
  "treinos",
  "jogos",
  "campeonatos",
  "eventos",
];

export default async function AdminMidiaPage() {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  const albums = await getAlbums();

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    albums: albums.filter((a: any) => a.category === cat),
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Nuvem de mídia</h1>
          <p className="text-gray-500 text-sm">
            Álbuns organizados por jogador, treino, jogo, campeonato e evento.
          </p>
        </div>
        <Link
          href="/admin/midia/novo"
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium"
        >
          + Novo álbum
        </Link>
      </div>

      {grouped.map(({ category, albums: catAlbums }) => (
        <section key={category} className="mb-10">
          <h2 className="text-lg font-semibold text-primary mb-3">
            {CATEGORY_LABELS[category]}
          </h2>

          {catAlbums.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum álbum ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {catAlbums.map((album: any) => (
                <Link
                  key={album.id}
                  href={`/admin/midia/${album.id}`}
                  className="bg-white border border-sand-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="aspect-video bg-sand-200 bg-cover bg-center"
                    style={
                      album.cover_url
                        ? { backgroundImage: `url(${album.cover_url})` }
                        : undefined
                    }
                  />
                  <div className="p-3">
                    <p className="font-medium truncate">
                      {album.title}
                      {album.players?.name && category !== "jogadores"
                        ? ` — ${album.players.name}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {album.media?.[0]?.count ?? 0} arquivo(s)
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
