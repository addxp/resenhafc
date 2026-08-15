export function Footer() {
  return (
    <footer className="bg-sand-900 text-sand-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col sm:flex-row justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Resenha FC. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <a href="/noticias" className="hover:underline">Notícias</a>
          <a href="/galeria" className="hover:underline">Galeria</a>
          <a href="/loja" className="hover:underline">Loja</a>
        </div>
      </div>
    </footer>
  );
}
