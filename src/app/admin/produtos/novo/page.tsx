"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SIZES = ["P", "M", "G", "GG"];

export default function NovoProdutoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Envia as fotos para o bucket "products"
      const images: string[] = [];
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = file.name.split(".").pop();
          const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(path, file);
          if (uploadError) throw new Error(uploadError.message);
          const { data } = supabase.storage.from("products").getPublicUrl(path);
          images.push(data.publicUrl);
        }
      }

      // 2. Monta o estoque por tamanho (0 para os que não foram preenchidos)
      const stockJson: Record<string, number> = {};
      SIZES.forEach((s) => {
        stockJson[s] = parseInt(stock[s] || "0", 10) || 0;
      });

      // 3. Cria o produto
      const { data: product, error: insertError } = await supabase
        .from("products")
        .insert({
          name,
          description: description || null,
          price: parseFloat(price.replace(",", ".")),
          images,
          sizes: SIZES,
          stock: stockJson,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      router.push(`/admin/produtos/${product.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-6">NOVA CAMISA</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-sand-200 shadow-sm"
      >
        <div>
          <label className="block text-sm mb-1 text-ink/70">Nome</label>
          <input
            required
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Camisa Oficial Resenha FC"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Descrição</label>
          <textarea
            rows={3}
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Preço (R$)</label>
          <input
            required
            inputMode="decimal"
            className="w-full border border-sand-300 rounded-lg px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="89,90"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Estoque por tamanho</label>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <div key={s}>
                <label className="block text-xs text-ink/50 mb-1">{s}</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border border-sand-300 rounded-lg px-2 py-2 text-center"
                  value={stock[s] || ""}
                  onChange={(e) => setStock((prev) => ({ ...prev, [s]: e.target.value }))}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Fotos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded-lg px-4 py-2.5 font-medium disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Cadastrar camisa"}
        </button>
      </form>
    </main>
  );
}
