"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Cadastro público = sempre cria um usuário com role "cliente"
// (contas de admin/jogador só são criadas pelo painel administrativo).
export default function RegisterPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <p>Verifique seu e-mail para confirmar o cadastro antes de entrar.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm flex flex-col gap-4 bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold text-primary text-center">Criar conta</h1>

        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input
            required
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            type="email"
            required
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>
    </main>
  );
}
