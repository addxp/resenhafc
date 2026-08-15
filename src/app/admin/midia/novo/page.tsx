"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AlbumCategory } from "@/types/database.types";

const CATEGORIES: { value: AlbumCategory; label: string }[] = [
  { value: "jogadores", label: "Jogadores (pasta por jogador)" },
  { value: "treinos", label: "Treinos" },
  { value: "jogos", label: "Jogos" },
  { value: "campeonatos", label: "Campeonatos" },
  { value: "eventos", label: "Eventos" },
];

export default function NovoAlbumPage() {
  const router = useRouter();
  const supabase = createClient();

  const [category, setCategory] = useState<AlbumCategory>("jogadores");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [players, setPlayers] = useState<{ id: string; name: string; jersey_number: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("players")
      .select("id, name, jersey_number")
      .eq("active", true)
      .order("name")
      .then(({ data }) => setPlayers(data ?? []));
  }, []);

  // Ao escolher um jogador, preenche o título do álbum automaticamente com o nome dele
  function handlePlayerChange(id: string) {
    setPlayerId(id);
    const p = players.find((pl) => pl.id === id);
    if (p) setTitle(`Fotos de ${p.name}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("albums")
      .insert({
        title,
        category,
        description: description || null,
        player_id: category === "jogadores" ? playerId || null : null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/admin/midia/${data.id}`);
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-primary mb-6">Novo álbum</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-sand-200 shadow-sm">
        <div>
          <label className="block text-sm mb-1 text-gray-700">Categoria</label>
          <select
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value as AlbumCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {category === "jogadores" && (
          <div>
            <label className="block text-sm mb-1 text-gray-700">Jogador</label>
            <select
              required
              className="w-full border border-sand-300 rounded-lg px-3 py-2"
              value={playerId}
              onChange={(e) => handlePlayerChange(e.target.value)}
            >
              <option value="">Selecione...</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.jersey_number} — {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm mb-1 text-gray-700">
            Nome do álbum {category === "treinos" && "(ex: Treino 14/08)"}
          </label>
          <input
            required
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700">Descrição (opcional)</label>
          <textarea
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-lg px-4 py-2.5 font-medium disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar álbum"}
        </button>
      </form>
    </main>
  );
}
