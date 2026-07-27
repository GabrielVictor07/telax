'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Check, Sparkles, Zap, Infinity, Star, Film, Tv, Download, Award } from 'lucide-react';
import { useSession } from 'next-auth/react';
import CheckoutModal from '@/components/CheckoutModal';

export default function PlansPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = () => {
    if (!session) {
      window.location.href = '/login?callbackUrl=/plans';
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#08090c] text-white flex flex-col relative overflow-hidden">
      {/* Glow Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#ff0b37]/25 via-[#ff0b37]/10 to-transparent blur-[160px] pointer-events-none" />

      {/* Header Standalone */}
      <header className="h-20 border-b border-white/10 px-4 md:px-8 flex items-center justify-between relative z-10 bg-[#08090c]/60 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff0b37] to-[#cc0026] flex items-center justify-center font-black text-lg text-white shadow-[0_0_15px_rgba(255,11,55,0.4)]">
            T
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            TELAX<span className="text-[#ff0b37]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">{session ? 'Voltar para o Dashboard' : 'Voltar para a Landing Page'}</span>
            <span className="md:hidden">Voltar</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal de Pagamento Único */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 md:py-16 relative z-10 flex flex-col justify-center items-center">
        {/* Badge Hero */}
        <span className="px-4 py-1.5 rounded-full text-xs font-black bg-[#ff0b37]/20 text-[#ff2a53] border border-[#ff0b37]/40 inline-flex items-center gap-2 mb-4 uppercase tracking-widest shadow-[0_0_15px_rgba(255,11,55,0.3)]">
          <Infinity className="w-4 h-4" />
          PAGAMENTO ÚNICO • SEM MENSALIDADES
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-center text-white mb-4 tracking-tight leading-tight">
          Adquira seu Acesso Vitalício ao TELAX
        </h1>

        <p className="text-sm md:text-base text-gray-300 text-center max-w-2xl mb-10 leading-relaxed">
          Esqueça faturas mensais e assinaturas recorrentes. Pague apenas uma vez e tenha acesso ilimitado para sempre a todos os filmes e lançamentos em 4K.
        </p>

        {/* Card Único Hero de Altíssima Conversão */}
        <div className="w-full max-w-2xl relative rounded-3xl bg-gradient-to-b from-[#ff0b37]/20 via-[#101218] to-[#0d0f14] border-2 border-[#ff0b37] p-8 md:p-10 shadow-[0_0_60px_rgba(255,11,55,0.35)] overflow-hidden">
          {/* Selo Promocional Topo */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ff0b37] to-[#ff2a53] text-white text-[10px] font-black uppercase px-6 py-1.5 rounded-bl-2xl tracking-wider shadow-md flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> OFERTA POR TEMPO LIMITADO
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-[#ff2a53] uppercase tracking-wider">Acesso Vitalício Completo</span>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1">Passaporte VIP TELAX</h3>
              <p className="text-xs text-gray-400 mt-1">Válido para todos os dispositivos</p>
            </div>

            <div className="text-center md:text-right">
              <div className="text-xs text-gray-400 line-through">De R$ 199,00</div>
              <div className="text-4xl md:text-5xl font-black text-[#ffb800] tracking-tight">
                R$ 10<span className="text-2xl font-bold">,90</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold mt-0.5">Pagamento Único (Sem Mensalidades)</div>
            </div>
          </div>

          {/* Lista de Benefícios Inclusos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
              <Film className="w-5 h-5 text-[#ff0b37] shrink-0" />
              <span className="text-xs font-semibold text-gray-200">Catálogo Completo Liberado</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
              <Star className="w-5 h-5 text-[#ffb800] shrink-0" />
              <span className="text-xs font-semibold text-gray-200">Qualidade Ultra HD 4K + HDR</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
              <Tv className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-gray-200">Smart TVs, Celulares e PCs</span>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
              <Download className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-gray-200">Downloads Offline Ilimitados</span>
            </div>
          </div>

          {/* Botão Único de Ação */}
          <button
            onClick={handleBuyClick}
            className="w-full py-4 md:py-5 rounded-2xl text-sm md:text-base font-extrabold text-white bg-gradient-to-r from-[#ff0b37] via-[#ff2a53] to-[#ff0b37] shadow-[0_0_30px_rgba(255,11,55,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            <Zap className="w-5 h-5 fill-white" />
            Garantir Acesso Vitalício por R$ 10,90
          </button>

          <p className="text-[11px] text-center text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Liberação instantânea após pagamento via PIX, Crédito ou Débito
          </p>
        </div>
      </main>

      {/* Modal de Checkout Transparente Nativo */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
