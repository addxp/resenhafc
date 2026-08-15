"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-sand-100 via-sand-50 to-white">
      <div className="w-full max-w-sm">
        {/* Logo centralizada, sobreposta ao topo do card */}
        <div className="flex justify-center -mb-10 relative z-10">
          <Logo size={96} />
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 bg-white pt-14 p-6 rounded-2xl shadow-xl border border-sand-200"
        >
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-primary">Resenha FC</h1>
            <p className="text-sm text-gray-500">Entre para acessar sua conta</p>
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
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Ainda não tem conta?{" "}
            <a href="/register" className="text-primary font-medium underline">
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
