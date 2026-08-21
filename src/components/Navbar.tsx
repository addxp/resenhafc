import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/queries";
import { CartBadge } from "@/components/CartBadge";

const INSTAGRAM_URL = "https://www.instagram.com/resenhafc_mucambo/";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 bg-sand-50/95 backdrop-blur border-b border-sand-300">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={44} />
          <span className="font-display text-2xl tracking-wide text-ink hidden sm:inline">
            RESENHA FC
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link href="/noticias" className="text-ink/70 hover:text-primary transition-colors">
            Notícias
          </Link>
          <Link href="/galeria" className="text-ink/70 hover:text-primary transition-colors hidden sm:inline">
            Galeria
          </Link>
          <Link href="/loja" className="text-ink/70 hover:text-primary transition-colors">
            Loja
          </Link>
          <CartBadge />
          <Link href="/jogador" className="text-ink/70 hover:text-primary transition-colors hidden sm:inline">
            Área do jogador
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram do Resenha FC"
            className="text-ink/70 hover:text-primary transition-colors"
          >
            <InstagramIcon />
          </a>

          {user ? (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-court text-white hover:bg-court-dark transition-colors"
            >
              Minha conta
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-court text-white hover:bg-court-dark transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
