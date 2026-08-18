const INSTAGRAM_URL = "https://www.instagram.com/resenhafc_mucambo/";

export function Footer() {
  return (
    <footer className="bg-ink text-sand-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <p className="font-display text-xl tracking-wide text-sand-100">RESENHA FC</p>
          <p className="text-sm text-sand-300 mt-1">Mucambo, Ceará</p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 text-sm">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-sand-100"
          >
            @resenhafc_mucambo
          </a>
          <div className="flex gap-4 text-sand-300">
            <a href="/noticias" className="hover:underline">Notícias</a>
            <a href="/galeria" className="hover:underline">Galeria</a>
            <a href="/loja" className="hover:underline">Loja</a>
            <a href="/patrocinio" className="hover:underline">Seja patrocinador</a>
          </div>
        </div>
      </div>

      <div className="border-t border-sand-100/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-sand-300">
          &copy; {new Date().getFullYear()} Resenha FC. Site desenvolvido por Emmanuel Duarte.
        </div>
      </div>
    </footer>
  );
}
