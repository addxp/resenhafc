import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/queries";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-sand-200">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={44} />
          <span className="font-bold text-primary text-lg hidden sm:inline">
            Resenha FC
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm sm:text-base">
          <Link href="/noticias" className="text-gray-700 hover:text-primary">
            Notícias
          </Link>
          <Link href="/galeria" className="text-gray-700 hover:text-primary hidden sm:inline">
            Galeria
          </Link>
          <Link href="/loja" className="text-gray-700 hover:text-primary">
            Loja
          </Link>
          <Link href="/jogador" className="text-gray-700 hover:text-primary hidden sm:inline">
            Área do jogador
          </Link>

          {user ? (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-primary text-white"
            >
              Minha conta
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-primary text-white"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
