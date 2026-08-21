import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { getAllProducts } from "@/lib/queries";

export default async function AdminProdutosPage() {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  const products = await getAllProducts();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-wide text-ink">PRODUTOS</h1>
        <Link
          href="/admin/produtos/novo"
          className="px-4 py-2 rounded-lg bg-primary text-white font-medium"
        >
          + Nova camisa
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-ink/50 text-sm">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/admin/produtos/${p.id}`}
              className="bg-white border border-sand-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-sand-200 relative">
                {p.images?.[0] && (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                )}
                {!p.active && (
                  <span className="absolute top-2 left-2 bg-ink/80 text-white text-xs px-2 py-1 rounded">
                    Inativo
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium truncate">{p.name}</p>
                <p className="font-mono text-sm text-court">
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-xs text-ink/40 mt-1 font-mono">
                  {Object.entries(p.stock || {})
                    .map(([size, qty]) => `${size}:${qty}`)
                    .join(" · ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
