"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database.types";

export function EditProductForm({ product }: { product: Product }) {
  const supabase = createClient();
  const router = useRouter();

  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState<Record<string, string>>(
    Object.fromEntries(product.sizes.map((s) => [s, String(product.stock?.[s] ?? 0)]))
  );
  const [active, setActive] = useState(product.active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);

    const stockJson: Record<string, number> = {};
    product.sizes.forEach((s) => {
      stockJson[s] = parseInt(stock[s] || "0", 10) || 0;
    });

    const { error } = await supabase
      .from("products")
      .update({
        price: parseFloat(price.replace(",", ".")),
        stock: stockJson,
        active,
      })
      .eq("id", product.id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-sand-200 shadow-sm">
      <div>
        <label className="block text-sm mb-1 text-ink/70">Preço (R$)</label>
        <input
          className="w-full border border-sand-300 rounded-lg px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-ink/70">Estoque por tamanho</label>
        <div className="grid grid-cols-4 gap-2">
          {product.sizes.map((s) => (
            <div key={s}>
              <label className="block text-xs text-ink/50 mb-1">{s}</label>
              <input
                type="number"
                min={0}
                className="w-full border border-sand-300 rounded-lg px-2 py-2 text-center"
                value={stock[s] || ""}
                onChange={(e) => setStock((prev) => ({ ...prev, [s]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Produto ativo (visível na loja)
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-primary text-white rounded-lg px-4 py-2.5 font-medium disabled:opacity-60"
      >
        {loading ? "Salvando..." : saved ? "Salvo! ✓" : "Salvar alterações"}
      </button>
    </div>
  );
}
