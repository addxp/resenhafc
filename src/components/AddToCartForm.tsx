"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/types/database.types";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();

  const availableSizes = product.sizes.filter((s) => (product.stock?.[s] ?? 0) > 0);
  const [size, setSize] = useState(availableSizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const maxQty = product.stock?.[size] ?? 0;

  function handleAdd() {
    if (!size) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? null,
      size,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (availableSizes.length === 0) {
    return (
      <p className="font-mono text-sm bg-sand-100 text-ink/60 px-4 py-3 rounded-lg">
        Esgotado no momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-ink/70 mb-2">Tamanho</p>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((s) => {
            const disabled = (product.stock?.[s] ?? 0) === 0;
            return (
              <button
                key={s}
                disabled={disabled}
                onClick={() => {
                  setSize(s);
                  setQuantity(1);
                }}
                className={`px-4 py-2 rounded-lg border font-mono text-sm transition-colors ${
                  size === s
                    ? "bg-primary text-white border-primary"
                    : disabled
                    ? "border-sand-200 text-ink/30 cursor-not-allowed line-through"
                    : "border-sand-300 text-ink hover:border-primary"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink/70 mb-2">Quantidade</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-lg border border-sand-300 font-mono"
          >
            −
          </button>
          <span className="font-mono w-6 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="w-9 h-9 rounded-lg border border-sand-300 font-mono"
          >
            +
          </button>
          <span className="text-xs text-ink/40 font-mono">{maxQty} em estoque</span>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="bg-primary hover:bg-primary-dark transition-colors text-white rounded-lg px-6 py-3 font-medium"
      >
        {added ? "Adicionado! ✓" : "Adicionar ao carrinho"}
      </button>

      {added && (
        <button
          onClick={() => router.push("/carrinho")}
          className="text-sm text-primary underline text-center"
        >
          Ver carrinho
        </button>
      )}
    </div>
  );
}
