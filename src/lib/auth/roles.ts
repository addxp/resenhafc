import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "jogador" | "cliente";

/**
 * Retorna o perfil (com role) do usuário autenticado no servidor,
 * ou null se não estiver logado.
 */
export async function getCurrentProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function requireRole(allowed: UserRole[]) {
  const profile = await getCurrentProfile();
  if (!profile || !allowed.includes(profile.role)) {
    return null;
  }
  return profile;
}
