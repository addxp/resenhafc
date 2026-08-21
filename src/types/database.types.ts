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
  storage_path: string;
  caption: string | null;
  created_at: string;
  album_id: string | null;
  player_id: string | null;
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

export type AlbumCategory =
  | "treinos"
  | "jogos"
  | "campeonatos"
  | "eventos"
  | "jogadores";

export interface Album {
  id: string;
  title: string;
  category: AlbumCategory;
  description: string | null;
  cover_url: string | null;
  player_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  sizes: string[];
  stock: Record<string, number>;
  active: boolean;
  created_at: string;
}

export type OrderStatus =
  | "pendente"
  | "pago"
  | "preparando"
  | "enviado"
  | "concluido"
  | "cancelado";

export type PaymentMethod = "pix" | "cartao" | "dinheiro";
export type PaymentStatus = "pendente" | "aprovado" | "recusado" | "reembolsado";

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  mercadopago_payment_id: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  pix_expires_at: string | null;
  total: number;
  shipping_address: Record<string, string> | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  size: string;
  quantity: number;
  unit_price: number;
}
