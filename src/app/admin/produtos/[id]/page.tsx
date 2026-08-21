import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { getProductById } from "@/lib/queries";
import { EditProductForm } from "@/components/EditProductForm";

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-6">
        {product.name.toUpperCase()}
      </h1>
      <EditProductForm product={product} />
    </main>
  );
}
