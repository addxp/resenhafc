import { createClient } from "@/lib/supabase/server";
import type { Game, NewsItem, MediaItem } from "@/types/database.types";

// Todas as funções abaixo rodam no servidor (Server Components),
// então já respeitam automaticamente as políticas de RLS do banco.

export async function getUpcomingGames(limit = 3): Promise<Game[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("status", "agendado")
    .gte("match_date", new Date().toISOString())
    .order("match_date", { ascending: true })
    .limit(limit);

  return data ?? [];
}

export async function getRecentResults(limit = 3): Promise<Game[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("status", "realizado")
    .order("match_date", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getLatestNews(limit = 3): Promise<NewsItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getAllNews(): Promise<NewsItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ?? null;
}

export async function getRecentMedia(limit = 8): Promise<MediaItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("type", "foto")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ---------- Álbuns e mídia ----------

export async function getAlbums() {
  const supabase = createClient();
  const { data } = await supabase
    .from("albums")
    .select("*, players(name), media(count)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAlbumById(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("albums")
    .select("*, players(name)")
    .eq("id", id)
    .single();
  return data;
}

export async function getAlbumMedia(albumId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("album_id", albumId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getActivePlayers() {
  const supabase = createClient();
  const { data } = await supabase
    .from("players")
    .select("id, name, jersey_number")
    .eq("active", true)
    .order("name");
  return data ?? [];
}

// ---------- Loja ----------

export async function getActiveProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProductById(id: string) {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return data;
}

export async function getOrderById(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, images))")
    .eq("id", id)
    .single();
  return data;
}

export async function getMyOrders() {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllOrders() {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, profiles(full_name), order_items(*, products(name))")
    .order("created_at", { ascending: false });
  return data ?? [];
}
