import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { SponsorshipStatusSelect } from "@/components/SponsorshipStatusSelect";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPatrociniosPage() {
  const profile = await requireRole(["admin"]);
  if (!profile) redirect("/unauthorized");

  const supabase = createClient();
  const { data: inquiries } = await supabase
    .from("sponsorship_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl tracking-wide text-ink mb-1">
        PROPOSTAS DE PATROCÍNIO
      </h1>
      <p className="text-ink/60 text-sm mb-6">
        Pedidos enviados pelo formulário público em /patrocinio.
      </p>

      {!inquiries || inquiries.length === 0 ? (
        <p className="text-ink/50 text-sm">Nenhuma proposta recebida ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((i) => (
            <div
              key={i.id}
              className="bg-white border border-sand-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-ink">{i.company_name}</p>
                <p className="text-sm text-ink/70">
                  {i.contact_name} · {i.email}
                  {i.phone ? ` · ${i.phone}` : ""}
                </p>
                {i.message && (
                  <p className="text-sm text-ink/60 mt-1 max-w-xl">{i.message}</p>
                )}
                <p className="text-xs text-ink/40 mt-1 font-mono">{formatDate(i.created_at)}</p>
              </div>
              <SponsorshipStatusSelect id={i.id} status={i.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
