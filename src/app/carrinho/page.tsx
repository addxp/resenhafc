"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl tracking-wide text-ink mb-3">
          SEU CARRINHO ESTÁ VAZIO
        </h1>
        <Link href="/loja" className="text-primary underline">
          Ver camisas na loja
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-6">CARRINHO</h1>

      <div className="flex flex-col gap-3 mb-8">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="bg-white border border-sand-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-sand-200 rounded-lg overflow-hidden relative shrink-0">
              {item.image && (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-ink/50 font-mono">Tamanho {item.size}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                className="w-7 h-7 rounded border border-sand-300 font-mono text-sm"
              >
                −
              </button>
              <span className="font-mono w-5 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                className="w-7 h-7 rounded border border-sand-300 font-mono text-sm"
              >
                +
              </button>
            </div>

            <p className="font-mono font-semibold w-20 text-right shrink-0">
              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
            </p>

            <button
              onClick={() => removeItem(item.productId, item.size)}
              className="text-ink/30 hover:text-red-600 transition-colors shrink-0"
              aria-label="Remover"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-sand-200 pt-4 mb-6">
        <span className="font-medium">Total</span>
        <span className="font-mono text-xl font-semibold text-court">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="w-full bg-primary hover:bg-primary-dark transition-colors text-white rounded-lg px-6 py-3 font-medium"
      >
        Finalizar pedido
      </button>
    </main>
  );
}
