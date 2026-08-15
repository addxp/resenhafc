"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

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
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-sand-100 via-sand-50 to-white text-center">
        <div className="w-full max-w-sm">
          <div className="flex justify-center -mb-10 relative z-10">
            <Logo size={96} />
          </div>
          <div className="bg-white pt-14 p-6 rounded-2xl shadow-xl border border-sand-200">
            <p className="text-gray-700">
              Verifique seu e-mail para confirmar o cadastro antes de entrar.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-sand-100 via-sand-50 to-white">
      <div className="w-full max-w-sm">
        <div className="flex justify-center -mb-10 relative z-10">
          <Logo size={96} />
        </div>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 bg-white pt-14 p-6 rounded-2xl shadow-xl border border-sand-200"
        >
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-primary">Criar conta</h1>
            <p className="text-sm text-gray-500">Cadastre-se para comprar na loja</p>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Nome</label>
            <input
              required
              className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">E-mail</label>
            <input
              type="email"
              required
              className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border border-sand-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark transition-colors text-white rounded-lg px-4 py-2.5 font-medium disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Já tem conta?{" "}
            <a href="/login" className="text-primary font-medium underline">
              Entrar
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
