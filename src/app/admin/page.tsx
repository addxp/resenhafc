import { requireRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import Link from "next/link";

// Painel administrativo — protegido pelo middleware + checagem aqui também.
// O restante (jogadores, loja, notícias) entra nas próximas fases.
export default async function AdminPage() {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
      <p className="text-gray-600 mt-2 mb-6">Olá, {profile.full_name ?? "Administrador"}.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/midia"
          className="bg-white border border-sand-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="font-semibold text-primary">Nuvem de mídia</p>
          <p className="text-sm text-gray-500 mt-1">
            Álbuns por jogador, treinos, jogos, campeonatos e eventos.
          </p>
        </Link>
      </div>
    </main>
  );
}
