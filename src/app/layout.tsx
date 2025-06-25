// src/app/layout.tsx

import { config } from "@/config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
// ALTERAÇÃO: Importamos a fonte 'Quicksand' em vez de 'Inter'
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster"; // Adicionando o Toaster aqui

// ALTERAÇÃO: Configurando a Quicksand com os pesos que você precisa
const fontQuicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans", // Continuamos usando a variável --font-sans para facilitar a integração com o Tailwind
  weight: ["400", "500", "700"], // Carregando os pesos Regular (400), Medium (500) e Bold (700)
});

export const metadata: Metadata = {
  title: {
    absolute: config.blog.metadata.title.absolute,
    default: config.blog.metadata.title.default,
    template: config.blog.metadata.title.template,
  },
  description: config.blog.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ALTERAÇÃO: Aplicamos a variável da fonte Quicksand ao corpo da página.
        A classe 'font-sans' do Tailwind agora usará a Quicksand como padrão.
      */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-6xl m-auto",
          fontQuicksand.variable
        )}
      >
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}