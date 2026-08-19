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

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <p className="font-mono text-xs tracking-[0.25em] text-primary/70 uppercase mb-1">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl tracking-wide text-ink">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm text-primary underline underline-offset-4 hover:text-primary-dark transition-colors shrink-0"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// Elemento de assinatura da home: um placar no estilo marcador eletrônico
// de quadra, para o próximo jogo.
function NextMatchScoreboard({ game }: { game: Game | null }) {
  return (
    <div className="bg-court rounded-2xl px-6 py-5 sm:px-10 sm:py-7 text-sand-50 shadow-2xl">
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
  const played = game.status === "realizado";
  return (
    <div className="bg-white border border-sand-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between">
      <div>
        <p className="text-xs text-ink/50 font-mono">{formatDate(game.match_date)}</p>
        <p className="font-semibold text-ink mt-0.5">
          Resenha FC {game.is_home ? "x" : "@"} {game.opponent}
        </p>
        {game.competition && <p className="text-xs text-ink/50">{game.competition}</p>}
      </div>
      {played ? (
        <p className="font-mono text-2xl font-semibold text-court shrink-0 ml-3">
          {game.home_score}
          <span className="text-ink/30 text-base mx-1">x</span>
          {game.away_score}
        </p>
      ) : (
        <span className="font-mono text-xs bg-sand-100 text-primary px-2.5 py-1 rounded-full shrink-0 ml-3">
          {formatTime(game.match_date)}
        </span>
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

  const nextGame = upcoming[0] ?? null;
  const otherUpcoming = upcoming.slice(1);

  return (
    <main>
      {/* BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand-300 via-sand-100 to-white">
        {/* Textura sutil de bolinhas — reforça o clima esportivo sem pesar */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
            backgroundSize: "18px 18px",
            color: "#241C14",
          }}
        />

        {/* Para usar uma foto real de banner, coloque o arquivo em public/banner.jpg
            e troque este gradiente por uma tag <Image src="/banner.jpg" fill ... /> */}
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-10 sm:pt-24 sm:pb-14 flex flex-col items-center text-center gap-5">
          <Logo size={120} />
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide text-ink">
            RESENHA FC
          </h1>
          <p className="text-ink/70 max-w-xl text-lg">
            Notícias, jogos, loja oficial e a área exclusiva dos jogadores — tudo em
            um só lugar.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Link
              href="/loja"
              className="px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 transition-all"
            >
              Comprar camisa
            </Link>
            <Link
              href="/jogador"
              className="px-6 py-3 rounded-lg border-2 border-primary text-primary font-medium hover:bg-sand-100 hover:-translate-y-0.5 transition-all"
            >
              Área dos jogadores
            </Link>
          </div>
        </div>

        {/* Placar do próximo jogo — elemento de assinatura */}
        <div className="relative max-w-6xl mx-auto px-4 pb-14 sm:pb-16">
          <NextMatchScoreboard game={nextGame} />
        </div>
      </section>

      {/* PRÓXIMOS JOGOS E RESULTADOS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <SectionHeading eyebrow="Agenda" title="Próximos jogos" />
            {otherUpcoming.length === 0 ? (
              <p className="text-ink/50 text-sm">
                {nextGame
                  ? "Sem outros jogos agendados por enquanto."
                  : "Nenhum jogo agendado no momento."}
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
            <SectionHeading eyebrow="Retrospecto" title="Últimos resultados" />
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
      <section className="bg-sand-50 py-16 border-y border-sand-200">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading eyebrow="Fica por dentro" title="Notícias" action={{ href: "/noticias", label: "Ver todas" }} />

          {news.length === 0 ? (
            <p className="text-ink/50 text-sm">Nenhuma notícia publicada ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-6">
              {news.map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-video bg-sand-200 relative overflow-hidden">
                    {n.cover_url && (
                      <Image
                        src={n.cover_url}
                        alt={n.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-ink/50 font-mono">{formatDate(n.created_at)}</p>
                    <p className="font-semibold mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {n.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOTOS RECENTES */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <SectionHeading eyebrow="Bastidores" title="Fotos recentes" action={{ href: "/galeria", label: "Ver galeria" }} />

        {photos.length === 0 ? (
          <p className="text-ink/50 text-sm">Nenhuma foto publicada ainda.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((m) => (
              <div
                key={m.id}
                className="group aspect-square bg-sand-200 rounded-xl overflow-hidden relative shadow-sm"
              >
                <Image
                  src={m.url}
                  alt={m.caption ?? "Foto do Resenha FC"}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CHAMADA PARA PATROCÍNIO */}
      <section className="bg-ink py-14">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-gold uppercase mb-1">
              Apoie o time
            </p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-wide text-sand-50">
              QUER SER PATROCINADOR?
            </h2>
          </div>
          <Link
            href="/patrocinio"
            className="px-6 py-3 rounded-lg bg-gold text-ink font-medium hover:brightness-95 hover:-translate-y-0.5 transition-all shrink-0"
          >
            Enviar proposta
          </Link>
        </div>
      </section>
    </main>
  );
}
