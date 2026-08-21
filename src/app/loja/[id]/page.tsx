import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/queries";
import { AddToCartForm } from "@/components/AddToCartForm";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product || !product.active) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 grid sm:grid-cols-2 gap-10">
      <div className="aspect-square bg-sand-200 rounded-2xl overflow-hidden relative">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <div>
        <h1 className="font-display text-3xl tracking-wide text-ink mb-2">
          {product.name.toUpperCase()}
        </h1>
        <p className="font-mono text-2xl text-court font-semibold mb-4">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
        {product.description && (
          <p className="text-ink/70 mb-6">{product.description}</p>
        )}

        <AddToCartForm product={product} />
      </div>
    </main>
  );
}
