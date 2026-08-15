// Página inicial — versão provisória da Fase 1.
// A versão completa (banner, próximos jogos, notícias, fotos, botões)
// entra na Fase 2 do projeto.
export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold text-primary">Resenha FC</h1>
      <p className="text-gray-600">
        Site oficial em construção — Fase 1 concluída: estrutura, banco de dados e autenticação.
      </p>
      <div className="flex gap-4 mt-4">
        <a href="/login" className="px-4 py-2 rounded bg-primary text-white">
          Entrar
        </a>
        <a href="/register" className="px-4 py-2 rounded border border-primary text-primary">
          Criar conta de cliente
        </a>
      </div>
    </main>
  );
}
