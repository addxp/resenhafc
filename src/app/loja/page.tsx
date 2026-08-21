import Link from "next/link";
import Image from "next/image";
import { getActiveProducts } from "@/lib/queries";

function totalStock(stock: Record<string, number>) {
  return Object.values(stock || {}).reduce((sum, n) => sum + (n || 0), 0);
}

export default async function LojaPage() {
  const products = await getActiveProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-2">LOJA</h1>
      <p className="text-ink/60 mb-8">Camisas oficiais do Resenha FC.</p>

      {products.length === 0 ? (
        <p className="text-ink/50 text-sm">Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {products.map((p) => {
            const outOfStock = totalStock(p.stock) === 0;
            return (
              <Link
                key={p.id}
                href={`/loja/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square bg-sand-200 relative overflow-hidden">
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {outOfStock && (
                    <span className="absolute top-2 left-2 bg-ink/80 text-white text-xs px-2 py-1 rounded font-mono">
                      Esgotado
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {p.name}
                  </p>
                  <p className="font-mono text-court font-semibold mt-1">
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
