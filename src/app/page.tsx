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
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Elemento de assinatura da home: um placar no estilo marcador eletrônico
// de quadra, para o próximo jogo — em vez de mais um card genérico.
function NextMatchScoreboard({ game }: { game: Game | null }) {
  return (
    <div className="bg-court rounded-2xl px-6 py-5 sm:px-10 sm:py-7 text-sand-50 shadow-xl">
      <p className="font-mono text-xs tracking-[0.3em] text-gold uppercase mb-3">
        Próximo jogo
      </p>
      {game ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono">
            <p className="text-2xl sm:text-3xl font-semibold">
              RESENHA {game.is_home ? "x" : "@"} {game.opponent.toUpperCase()}
            </p>
            {game.competition && (
              <p className="text-sand-300 text-sm mt-1">{game.competition}</p>
            )}
          </div>
          <div className="font-mono text-right">
            <p className="text-3xl sm:text-4xl text-gold font-semibold">
              {formatDate(game.match_date)}
            </p>
            <p className="text-sand-300 text-sm">
              {formatTime(game.match_date)} · {game.location ?? "local a definir"}
            </p>
          </div>
        </div>
      ) : (
        <p className="font-mono text-sand-300">Nenhum jogo agendado no momento.</p>
      )}
    </div>
  );
}

function ResultCard({ game }: { game: Game }) {
  return (
    <div className="bg-white border border-sand-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-ink/50 font-mono">{formatDate(game.match_date)}</p>
        <p className="font-semibold text-ink mt-0.5">
          Resenha FC {game.is_home ? "x" : "@"} {game.opponent}
        </p>
        {game.competition && <p className="text-xs text-ink/50">{game.competition}</p>}
      </div>
      <p className="font-mono text-2xl font-semibold text-court shrink-0 ml-3">
        {game.home_score}
        <span className="text-ink/30 text-base mx-1">x</span>
        {game.away_score}
      </p>
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

  const nextGame = upcoming[0] ?? null;
  const otherUpcoming = upcoming.slice(1);

  return (
    <main>
      {/* BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand-300 via-sand-100 to-white">
        {/* Para usar uma foto real de banner, coloque o arquivo em public/banner.jpg
            e troque este gradiente por uma tag <Image src="/banner.jpg" fill ... /> */}
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-10 sm:pt-20 sm:pb-14 flex flex-col items-center text-center gap-5">
          <Logo size={110} />
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide text-ink">
            RESENHA FC
          </h1>
          <p className="text-ink/70 max-w-xl">
            Notícias, jogos, loja oficial e a área exclusiva dos jogadores — tudo em
            um só lugar.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link
              href="/loja"
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Comprar camisa
            </Link>
            <Link
              href="/jogador"
              className="px-5 py-2.5 rounded-lg border border-primary text-primary font-medium hover:bg-sand-100 transition-colors"
            >
              Área dos jogadores
            </Link>
          </div>
        </div>

        {/* Placar do próximo jogo — elemento de assinatura */}
        <div className="max-w-6xl mx-auto px-4 pb-14 sm:pb-16">
          <NextMatchScoreboard game={nextGame} />
        </div>
      </section>

      {/* PRÓXIMOS JOGOS E RESULTADOS */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-ink mb-4">
              PRÓXIMOS JOGOS
            </h2>
            {otherUpcoming.length === 0 ? (
              <p className="text-ink/50 text-sm">
                {nextGame ? "Sem outros jogos agendados por enquanto." : "Nenhum jogo agendado no momento."}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {otherUpcoming.map((g) => (
                  <ResultCard key={g.id} game={g} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wide text-ink mb-4">
              ÚLTIMOS RESULTADOS
            </h2>
            {results.length === 0 ? (
              <p className="text-ink/50 text-sm">Nenhum resultado registrado ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((g) => (
                  <ResultCard key={g.id} game={g} />
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
            <h2 className="font-display text-2xl tracking-wide text-ink">NOTÍCIAS</h2>
            <Link href="/noticias" className="text-sm text-primary underline">
              Ver todas
            </Link>
          </div>

          {news.length === 0 ? (
            <p className="text-ink/50 text-sm">Nenhuma notícia publicada ainda.</p>
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
                    <p className="text-xs text-ink/50 font-mono">{formatDate(n.created_at)}</p>
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
          <h2 className="font-display text-2xl tracking-wide text-ink">FOTOS RECENTES</h2>
          <Link href="/galeria" className="text-sm text-primary underline">
            Ver galeria
          </Link>
        </div>

        {photos.length === 0 ? (
          <p className="text-ink/50 text-sm">Nenhuma foto publicada ainda.</p>
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
