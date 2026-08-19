"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

// Cadastro público = por padrão cria um usuário com role "cliente".
// Se a pessoa informar um código de jogador válido, a conta é
// automaticamente vinculada ao registro de jogador correspondente
// (e vira "jogador" ou "admin", dependendo do código).
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [playerCode, setPlayerCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [codeWarning, setCodeWarning] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [readyToContinue, setReadyToContinue] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCodeWarning(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Com a confirmação de e-mail desativada no Supabase, o cadastro já
    // vem com sessão ativa. Se um código de jogador foi informado, tenta
    // vincular a conta ao registro do jogador correspondente.
    if (data.session && playerCode.trim()) {
      const { error: claimError } = await supabase.rpc("claim_player_code", {
        p_code: playerCode.trim(),
      });

      setLoading(false);

      if (claimError) {
        // A conta já foi criada normalmente (como cliente); só o vínculo
        // de jogador falhou. Avisa e deixa a pessoa seguir mesmo assim.
        setCodeWarning(
          "Conta criada, mas o código de jogador informado é inválido ou já foi usado. Fale com o admin do time para corrigir."
        );
        setReadyToContinue(true);
        return;
      }
    } else {
      setLoading(false);
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setPendingConfirmation(true);
  }

  if (codeWarning && readyToContinue) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-sand-100 via-sand-50 to-white text-center">
        <div className="w-full max-w-sm">
          <div className="flex justify-center -mb-10 relative z-10">
            <Logo size={96} />
          </div>
          <div className="bg-white pt-14 p-6 rounded-2xl shadow-xl border border-sand-200 flex flex-col gap-4">
            <p className="text-amber-700 text-sm">{codeWarning}</p>
            <button
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              className="bg-primary text-white rounded-lg px-4 py-2.5 font-medium"
            >
              Continuar para o site
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (pendingConfirmation) {
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
            <p className="text-sm text-gray-500">Cadastre-se no site do Resenha FC</p>
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

          <div>
            <label className="block text-sm mb-1 text-gray-700">
              Código de jogador <span className="text-gray-400">(se você recebeu um)</span>
            </label>
            <input
              className="w-full border border-sand-300 rounded-lg px-3 py-2 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: 7X4KQ2"
              maxLength={6}
              value={playerCode}
              onChange={(e) => setPlayerCode(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-gray-400 mt-1">
              Só preencha se você é jogador do time e recebeu um código do admin.
            </p>
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
