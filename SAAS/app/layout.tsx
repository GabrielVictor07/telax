import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'TELAX - Plataforma de Streaming & Catálogo Premium',
  description: 'Assista aos melhores filmes, séries e produções em alta definição na plataforma TELAX.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#08090c] text-white min-h-screen">
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
