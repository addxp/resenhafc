"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PatrocinioPage() {
  const supabase = createClient();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("sponsorship_inquiries").insert({
      company_name: companyName,
      contact_name: contactName,
      email,
      phone: phone || null,
      message: message || null,
    });

    setLoading(false);

    if (error) {
      setError("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-3xl tracking-wide text-ink mb-3">
          RECEBIDO!
        </h1>
        <p className="text-ink/70">
          Obrigado pelo interesse em patrocinar o Resenha FC. Nosso time vai entrar
          em contato em breve pelo e-mail ou telefone informado.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <h1 className="font-display text-3xl tracking-wide text-ink mb-2">
        SEJA PATROCINADOR
      </h1>
      <p className="text-ink/70 mb-8">
        Sua marca junto do Resenha FC — em jogos, uniformes e nas redes sociais do
        time. Preencha o formulário abaixo que a gente entra em contato.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-sand-200"
      >
        <div>
          <label className="block text-sm mb-1 text-ink/70">Nome da empresa</label>
          <input
            required
            className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Seu nome</label>
          <input
            required
            className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">E-mail</label>
          <input
            type="email"
            required
            className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Telefone / WhatsApp (opcional)</label>
          <input
            className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-ink/70">Mensagem (opcional)</label>
          <textarea
            rows={4}
            className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Conte um pouco sobre a proposta de patrocínio..."
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark transition-colors text-white rounded-lg px-4 py-2.5 font-medium disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Enviar proposta"}
        </button>
      </form>
    </main>
  );
}
