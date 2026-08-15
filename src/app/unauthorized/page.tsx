export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-primary">Acesso não autorizado</h1>
        <p className="text-gray-600 mt-2">
          Você não tem permissão para acessar esta área.
        </p>
        <a href="/" className="text-primary underline mt-4 inline-block">
          Voltar para a página inicial
        </a>
      </div>
    </main>
  );
}
