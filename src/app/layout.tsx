import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resenha FC — Site Oficial",
  description: "Site oficial do Resenha FC: notícias, jogos, loja e área dos jogadores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
