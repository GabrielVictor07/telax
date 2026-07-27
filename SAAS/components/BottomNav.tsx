'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Heart, User, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === 'ADMIN';

  // Ocultar na landing page se não tiver sessão, 
  // mas o layout padrão geralmente cobre isso. 
  // No caso de rotas que não queremos a barra (ex: tela cheia de vídeo), poderiamos adicionar lógica aqui.
  if (!session || pathname === '/login' || pathname === '/register') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08090c]/95 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${pathname === '/' ? 'text-[#ff0b37]' : 'text-gray-400 hover:text-white'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Início</span>
        </Link>
        
        <Link 
          href="/catalog" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${pathname === '/catalog' ? 'text-[#ff0b37]' : 'text-gray-400 hover:text-white'}`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-bold">Catálogo</span>
        </Link>

        <Link 
          href="/favorites" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${pathname === '/favorites' ? 'text-[#ff0b37]' : 'text-gray-400 hover:text-white'}`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-bold">Minha Lista</span>
        </Link>

        <Link 
          href="/profile" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${pathname === '/profile' ? 'text-[#ff0b37]' : 'text-gray-400 hover:text-white'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}
