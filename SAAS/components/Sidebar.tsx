'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Heart, CreditCard, LayoutDashboard, Terminal, User, Users } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <aside className="hidden md:flex w-64 h-screen fixed top-0 left-0 z-50 bg-[#0c0e14]/90 backdrop-blur-xl border-r border-white/10 flex-col p-6 transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff0b37] to-[#cc0026] flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(255,11,55,0.5)]">
          T
        </div>
        <span className="text-2xl font-black tracking-tight text-white">
          TELAX<span className="text-[#ff0b37]">.</span>
        </span>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 space-y-1">
        <p className="px-3 text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2">
          {isAdmin ? 'Painel Admin' : 'Menu Principal'}
        </p>

        {!isAdmin ? (
          <>
            <Link
              href="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-5 h-5 text-[#ff0b37]" />
              Início
            </Link>

            <Link
              href="/catalog"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/catalog'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-5 h-5" />
              Catálogo
            </Link>

            <Link
              href="/favorites"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/favorites'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-5 h-5" />
              Favoritos
            </Link>

            <Link
              href="/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/profile'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-5 h-5" />
              Meu Perfil
            </Link>

            <Link
              href="/plans"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/plans'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Planos VIP
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-[#ff0b37]" />
              Gerenciar Filmes
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin/categories'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-5 h-5 text-[#ff0b37]" />
              Categorias
            </Link>

            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin/users'
                  ? 'bg-gradient-to-r from-[#ff0b37]/20 to-transparent border-l-4 border-[#ff0b37] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5 text-[#ff0b37]" />
              Usuários
            </Link>

            <Link
              href="/admin/logs"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin/logs'
                  ? 'bg-gradient-to-r from-[#ffb800]/20 to-transparent border-l-4 border-[#ffb800] text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-5 h-5 text-[#ffb800]" />
              Logs & Erros SaaS
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
