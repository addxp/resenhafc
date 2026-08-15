// Tipos manuais para as tabelas usadas até aqui.
// Assim que você tiver a Supabase CLI configurada, pode trocar por tipos
// gerados automaticamente com `npm run types:generate` (veja package.json).

export type GameStatus = "agendado" | "realizado" | "cancelado" | "adiado";

export interface Game {
  id: string;
  opponent: string;
  competition: string | null;
  match_date: string;
  location: string | null;
  is_home: boolean;
  status: GameStatus;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
}

export type MediaType = "foto" | "video";

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  caption: string | null;
  created_at: string;
  album_id: string | null;
}

export type PlayerPosition = "goleiro" | "fixo" | "ala" | "pivo";

export interface Player {
  id: string;
  name: string;
  jersey_number: number;
  position: PlayerPosition;
  photo_url: string | null;
  bio: string | null;
  active: boolean;
}
