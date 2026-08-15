import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import {
  getUpcomingGames,
  getRecentResults,
  getLatestNews,
  getRecentMedia,
} from "@/lib/queries";
import type { Game } from "@/types/database.types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GameCard({ game }: { game: Game }) {
  const played = game.status === "realizado";
  return (
    <div className="bg-white border border-sand-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500">{formatDate(game.match_date)}</p>
      <p className="font-semibold text-primary mt-1">
        Resenha FC {game.is_home ? "x" : "@"} {game.opponent}
      </p>
      {game.competition && (
        <p className="text-xs text-gray-500">{game.competition}</p>
      )}
      {played ? (
        <p className="text-2xl font-bold mt-2">
          {game.home_score} <span className="text-gray-400 text-base">x</span>{" "}
          {game.away_score}
        </p>
      ) : (
        <p className="text-sm text-gray-600 mt-2">{game.location ?? "Local a definir"}</p>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [upcoming, results, news, photos] = await Promise.all([
    getUpcomingGames(3),
    getRecentResults(3),
    getLatestNews(3),
    getRecentMedia(8),
  ]);

  return (
    <main>
      {/* BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand-200 via-sand-100 to-white">
        {/* Para usar uma foto real de banner, coloque o arquivo em public/banner.jpg
            e troque a div de fundo abaixo por uma tag <Image src="/banner.jpg" ... /> */}
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center gap-5">
          <Logo size={120} />
          <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight">
            Resenha FC
          </h1>
          <p className="text-gray-700 max-w-xl">
            Notícias, jogos, loja oficial e a área exclusiva dos jogadores — tudo em
            um só lugar.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link
              href="/loja"
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Visitar a loja
            </Link>
            <Link
              href="/jogador"
              className="px-5 py-2.5 rounded-lg border border-primary text-primary font-medium hover:bg-sand-100 transition-colors"
            >
              Área dos jogadores
            </Link>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS JOGOS E RESULTADOS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">Próximos jogos</h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum jogo agendado no momento.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {upcoming.map((g) => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-4">Últimos resultados</h2>
            {results.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum resultado registrado ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((g) => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NOTÍCIAS */}
      <section className="bg-sand-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Notícias</h2>
            <Link href="/noticias" className="text-sm text-primary underline">
              Ver todas
            </Link>
          </div>

          {news.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma notícia publicada ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-5">
              {news.map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-sand-200 relative">
                    {n.cover_url && (
                      <Image
                        src={n.cover_url}
                        alt={n.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">{formatDate(n.created_at)}</p>
                    <p className="font-semibold mt-1 line-clamp-2">{n.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOTOS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Fotos recentes</h2>
          <Link href="/galeria" className="text-sm text-primary underline">
            Ver galeria
          </Link>
        </div>

        {photos.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma foto publicada ainda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((m) => (
              <div
                key={m.id}
                className="aspect-square bg-sand-200 rounded-lg overflow-hidden relative"
              >
                <Image src={m.url} alt={m.caption ?? "Foto do Resenha FC"} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
