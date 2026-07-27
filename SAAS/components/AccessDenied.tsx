'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface AccessDeniedProps {
  message?: string;
}

export default function AccessDenied({ message = 'Para assistir aos filmes e usar a lista de favoritos, é necessário realizar o pagamento único de R$ 10,90.' }: AccessDeniedProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 md:p-8 text-center w-full max-w-full overflow-hidden">
      <div className="w-20 h-20 rounded-full bg-[#ff0b37]/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,11,55,0.2)] flex-shrink-0">
        <ShieldAlert className="w-10 h-10 text-[#ff2a53]" />
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight break-words">Pagamento Único Necessário</h2>
      <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
        {message}
      </p>
      
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <Link 
          href="/plans"
          className="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_25px_rgba(255,11,55,0.4)] hover:scale-105 transition-all"
        >
          Garantir Acesso Vitalício (R$ 10,90) <ArrowRight className="w-4 h-4" />
        </Link>
        <Link 
          href="/"
          className="w-full md:w-auto flex justify-center items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    </div>
  );
}
