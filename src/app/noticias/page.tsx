import Link from "next/link";
import Image from "next/image";
import { getAllNews } from "@/lib/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function NoticiasPage() {
  const news = await getAllNews();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-primary mb-6">Notícias</h1>

      {news.length === 0 ? (
        <p className="text-gray-500">Nenhuma notícia publicada ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n) => (
            <Link
              key={n.id}
              href={`/noticias/${n.slug}`}
              className="bg-white rounded-xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-sand-200 relative">
                {n.cover_url && (
                  <Image src={n.cover_url} alt={n.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500">{formatDate(n.created_at)}</p>
                <p className="font-semibold mt-1">{n.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
