import type { Metadata } from "next";
import { Anton, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";

// Fonte de destaque (títulos, placar) — traço condensado e forte, remete a
// numeração de camisa e placar de quadra.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

// Fonte de texto corrido — legível e amigável no corpo do site.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

// Fonte monoespaçada — usada nos números do placar e dados técnicos,
// reforçando a referência a marcador eletrônico de quadra.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Resenha FC — Site Oficial",
  description: "Site oficial do Resenha FC: notícias, jogos, loja e área dos jogadores.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="flex flex-col min-h-screen font-body text-ink">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
