import { requireRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

// Área do jogador — protegida pelo middleware + checagem aqui também.
// Perfil completo (foto, número, posição, mídias) entra na Fase 4.
export default async function JogadorAreaPage() {
  const profile = await requireRole(["jogador", "admin"]);
  if (!profile) redirect("/unauthorized");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Área do Jogador</h1>
      <p className="text-gray-600 mt-2">Bem-vindo, {profile.full_name ?? "jogador"}.</p>
    </main>
  );
}
