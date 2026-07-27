'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Search, LogOut, LogIn } from 'lucide-react';

interface HeaderProps {
  onSearch?: (value: string) => void;
  isAdmin?: boolean;
}

export default function Header({ onSearch, isAdmin }: HeaderProps) {
  const { data: session, status } = useSession();
  const user = session?.user as any;

  return (
    <header className="h-16 md:h-20 sticky top-0 z-40 bg-[#08090c]/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between gap-3">
      {/* Esquerda / Título */}
      <div className="flex items-center gap-4">
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <h1 className="text-sm md:text-xl font-bold text-white">Painel Admin</h1>
            <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#ff0b37]/20 text-[#ff2a53] border border-[#ff0b37]/30">
              MODO GESTOR
            </span>
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/" className="text-white border-b-2 border-[#ff0b37] pb-1">Filmes</Link>
            <Link href="/catalog" className="text-gray-400 hover:text-white transition-colors">Séries</Link>
            <Link href="/catalog" className="text-gray-400 hover:text-white transition-colors">Em Destaque</Link>
          </nav>
        )}
      </div>

      {/* Direita / Busca & Perfil */}
      <div className="flex flex-1 md:flex-none items-center justify-end gap-3 md:gap-6 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={isAdmin ? "Filtrar tabela..." : "Pesquisar filme..."}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-[#161922] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff0b37] focus:ring-1 focus:ring-[#ff0b37] transition-all"
          />
        </div>

        {status === 'authenticated' && user ? (
          <div className="hidden md:flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border-2 border-[#ff0b37] overflow-hidden shadow-[0_0_10px_rgba(255,11,55,0.3)] group-hover:scale-105 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-white group-hover:text-[#ff0b37] transition-colors">{user.name || user.email}</span>
                <span className="text-[10px] font-bold text-[#ff0b37]">
                  {user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'CLIENTE VIP'}
                </span>
              </div>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ff0b37] transition-all"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all"
            >
              Criar Conta
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
