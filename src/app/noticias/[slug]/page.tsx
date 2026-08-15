import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function NoticiaPage({
  params,
}: {
  params: { slug: string };
}) {
  const news = await getNewsBySlug(params.slug);
  if (!news) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {news.cover_url && (
        <div className="aspect-video bg-sand-200 rounded-xl overflow-hidden relative mb-6">
          <Image src={news.cover_url} alt={news.title} fill className="object-cover" />
        </div>
      )}
      <p className="text-sm text-gray-500">{formatDate(news.created_at)}</p>
      <h1 className="text-3xl font-bold text-primary mt-1 mb-6">{news.title}</h1>
      <div className="prose max-w-none whitespace-pre-line text-gray-800">
        {news.content}
      </div>
    </main>
  );
}
