import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

// Font utama — JetBrains Mono untuk semua halaman
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Font judul besar — tidak berubah
const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IndoBERT Pantun AI — Generasi Pantun Melayu Modern",
  description: "Implementasi model deep learning NLP IndoBERT untuk generasi bait pantun Melayu secara otomatis, cerdas, dan presisi sesuai kaidah sastra klasik rima a-b-a-b.",
  keywords: ["IndoBERT", "Pantun Melayu", "Generasi Pantun", "NLP Indonesia", "Kecerdasan Buatan", "Sastra Melayu", "Artificial Intelligence", "Deep Learning"],
  authors: [{ name: "Tim Peneliti NLP Melayu" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`h-full antialiased scroll-smooth ${serifFont.variable} ${jetbrainsMono.variable} font-sans`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-[#D4AF37] selection:text-black">
        {children}
      </body>
    </html>
  );
}
