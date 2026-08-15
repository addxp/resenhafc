import { requireRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

// Painel administrativo — protegido pelo middleware + checagem aqui também.
// O conteúdo completo (jogadores, loja, mídia, notícias) entra na Fase 6.
export default async function AdminPage() {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
      <p className="text-gray-600 mt-2">Olá, {profile.full_name ?? "Administrador"}.</p>
    </main>
  );
}
