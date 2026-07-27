'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Zap, Tv, Infinity, Star, Play, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LandingView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[#08090c] text-white font-sans min-h-screen overflow-x-hidden selection:bg-[#ff0b37] selection:text-white">
      {/* Estilos CSS da Landing Page TELAX */}
      <style jsx global>{`
        :root {
          --black: #08090c;
          --surface: #0c0e14;
          --surface-2: #101218;
          --red: #ff0b37;
          --red-glow: rgba(255, 11, 55, 0.45);
          --gold: #ffb800;
          --gold-glow: rgba(255, 184, 0, 0.35);
          --muted: rgba(255, 255, 255, 0.68);
          --hairline: rgba(255, 255, 255, 0.08);
          --hairline-bright: rgba(255, 255, 255, 0.18);
          --radius: 14px;
          --radius-lg: 24px;
        }

        @keyframes driftUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes driftDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes reelZoomPulse {
          0% { transform: scale(0.94); }
          50% { transform: scale(1.04); }
          100% { transform: scale(0.94); }
        }
        @keyframes imgZoomPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes redPulse {
          0% { box-shadow: inset 0 0 25px rgba(255, 11, 55, 0.1), 0 10px 30px rgba(255, 11, 55, 0.25); }
          50% { box-shadow: inset 0 0 45px rgba(255, 11, 55, 0.2), 0 16px 45px rgba(255, 11, 55, 0.5); }
          100% { box-shadow: inset 0 0 25px rgba(255, 11, 55, 0.1), 0 10px 30px rgba(255, 11, 55, 0.25); }
        }

        .reel-col-up { animation: driftUp 24s linear infinite; }
        .reel-col-down { animation: driftDown 24s linear infinite; }
        .ep-card-pulse { animation: reelZoomPulse 4.5s ease-in-out infinite; }
        .ep-img-pulse { animation: imgZoomPulse 5s ease-in-out infinite; }
        .plan-premium-pulse { animation: redPulse 4s ease-in-out infinite alternate; }
      `}</style>

      {/* Navbar Superior Principal */}
      <header className="sticky top-0 z-50 bg-[#08090c]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between py-3.5">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 font-black text-xl sm:text-2xl tracking-tight text-white">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#ff0b37] to-[#cc0026] flex items-center justify-center text-white font-black text-base sm:text-lg shadow-[0_0_15px_rgba(255,11,55,0.4)]">
                T
              </div>
              <span>
                TELAX<span className="text-[#ff0b37]">.</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
              <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
              <Link href="/catalog" className="hover:text-[#ff2a53] transition-colors">Catálogo</Link>
              <a href="#planos" className="hover:text-white transition-colors">Planos & Preços</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="text-xs font-semibold text-gray-300 hover:text-white px-2.5 sm:px-3 py-2">
                Entrar
              </Link>
              <Link
                href="/plans"
                className="bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] text-white font-bold text-xs px-3.5 sm:px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(255,11,55,0.45)] hover:scale-105 transition-all whitespace-nowrap"
              >
                <span className="md:hidden">Assinar</span>
                <span className="hidden md:inline">Garantir Vitalício (R$ 10,90)</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Esquerda: Textos */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ff2a53] bg-[#ff0b37]/10 border border-[#ff0b37]/25 px-3.5 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff0b37] animate-pulse" />
              PAGAMENTO ÚNICO • SEM MENSALIDADES
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 text-white">
              Milhares de histórias <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a53] to-[#ff0b37]">inesquecíveis</span> em 4K vitalício.
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-lg mb-8 leading-relaxed">
              Assista a filmes de sucesso, séries exclusivas, lançamentos de cinema e animações em alta definição na palma da sua mão. Pague uma única vez e tenha acesso para sempre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/plans"
                className="bg-gradient-to-r from-[#ff0b37] via-[#ff2a53] to-[#ff0b37] text-white font-extrabold text-xs sm:text-sm px-6 sm:px-7 py-4 rounded-xl shadow-[0_10px_28px_rgba(255,11,55,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Play className="w-4 h-4 fill-white" />
                Garantir Vitalício por R$ 10,90
              </Link>
              <Link
                href="/catalog"
                className="border border-white/20 bg-white/5 text-white font-semibold text-xs sm:text-sm px-6 py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Explorar Catálogo
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs text-gray-400 border-t border-white/10 pt-5">
              <div>
                <b className="block text-white text-xs sm:text-sm font-bold">+1.200h</b>
                <span>De Conteúdo em 4K</span>
              </div>
              <div>
                <b className="block text-white text-xs sm:text-sm font-bold">Sem Mensalidades</b>
                <span>Pague Apenas R$ 10,90</span>
              </div>
              <div>
                <b className="block text-white text-xs sm:text-sm font-bold">Acesso Vitalício</b>
                <span>Liberado no PIX ou Cartão</span>
              </div>
            </div>
          </div>

          {/* Direita: Movie Reel Vertical Animation */}
          <div className="lg:col-span-5 h-[420px] sm:h-[480px] relative rounded-3xl overflow-hidden pointer-events-auto bg-transparent border-none">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#08090c] via-[#08090c]/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#08090c] via-[#08090c]/80 to-transparent z-20 pointer-events-none" />

            <div className="absolute inset-0 flex gap-3 sm:gap-4 p-2 justify-center">
              {/* Coluna 1: Subindo */}
              <div className="w-[130px] sm:w-[140px] flex flex-col gap-4 reel-col-up shrink-0">
                <div className="relative w-full h-[200px] sm:h-[210px] rounded-2xl overflow-hidden bg-[#101218] border border-white/15 shrink-0 ep-card-pulse">
                  <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop" alt="The Batman" className="w-full h-full object-cover ep-img-pulse" />
                  <span className="absolute top-2.5 left-2.5 z-10 bg-black/75 text-[9px] font-bold px-2 py-0.5 rounded border border-white/15 text-white">AÇÃO</span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-left">
                    <div className="text-[9px] font-bold text-[#ff2a53] uppercase">Ficção & Ação</div>
                    <div className="text-xs font-bold text-white truncate">The Batman</div>
                    <div className="text-[10px] text-[#ffb800] font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#ffb800]" /> 4.6 / 5.0
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-[200px] sm:h-[210px] rounded-2xl overflow-hidden bg-[#101218] border border-white/15 shrink-0 ep-card-pulse">
                  <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop" alt="Jumanji" className="w-full h-full object-cover ep-img-pulse" />
                  <span className="absolute top-2.5 left-2.5 z-10 bg-black/75 text-[9px] font-bold px-2 py-0.5 rounded border border-white/15 text-white">AVENTURA</span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-left">
                    <div className="text-[9px] font-bold text-[#ff2a53] uppercase">Aventura</div>
                    <div className="text-xs font-bold text-white truncate">Jumanji: Next Level</div>
                    <div className="text-[10px] text-[#ffb800] font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#ffb800]" /> 4.3 / 5.0
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Descendo */}
              <div className="w-[130px] sm:w-[140px] flex flex-col gap-4 reel-col-down shrink-0">
                <div className="relative w-full h-[200px] sm:h-[210px] rounded-2xl overflow-hidden bg-[#101218] border border-white/15 shrink-0 ep-card-pulse">
                  <img src="https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400&auto=format&fit=crop" alt="Black Panther" className="w-full h-full object-cover ep-img-pulse" />
                  <span className="absolute top-2.5 left-2.5 z-10 bg-black/75 text-[9px] font-bold px-2 py-0.5 rounded border border-white/15 text-white">MARVEL</span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-left">
                    <div className="text-[9px] font-bold text-[#ff2a53] uppercase">Ação / Drama</div>
                    <div className="text-xs font-bold text-white truncate">Wakanda Forever</div>
                    <div className="text-[10px] text-[#ffb800] font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#ffb800]" /> 4.5 / 5.0
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-[200px] sm:h-[210px] rounded-2xl overflow-hidden bg-[#101218] border border-white/15 shrink-0 ep-card-pulse">
                  <img src="https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=400&auto=format&fit=crop" alt="Dune" className="w-full h-full object-cover ep-img-pulse" />
                  <span className="absolute top-2.5 left-2.5 z-10 bg-black/75 text-[9px] font-bold px-2 py-0.5 rounded border border-white/15 text-white">SCIFI</span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 text-left">
                    <div className="text-[9px] font-bold text-[#ff2a53] uppercase">Ficção Científica</div>
                    <div className="text-xs font-bold text-white truncate">Dune: Part One</div>
                    <div className="text-[10px] text-[#ffb800] font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#ffb800]" /> 4.8 / 5.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrub Bar Divider */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 my-8">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          <span>OFERTA VITALÍCIA</span>
          <span>Vantagens Exclusivas TELAX</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_12px_rgba(255,11,55,0.5)] rounded-full" />
        </div>
      </div>

      {/* Benefícios */}
      <section id="beneficios" className="py-14 relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12 text-left">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Feito para quem quer dar play sem limites.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Desenvolvido para oferecer máxima velocidade de streaming, qualidade 4K e facilidade de navegação em qualquer tela.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Catálogo Completo */}
            <div className="group relative p-7 rounded-3xl bg-gradient-to-b from-[#12151e] to-[#0c0e14] border border-white/10 hover:border-[#ff0b37]/50 shadow-2xl hover:shadow-[0_10px_30px_rgba(255,11,55,0.2)] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff0b37]/20 to-[#ff2a53]/10 border border-[#ff0b37]/30 text-[#ff2a53] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ff0b37] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,11,55,0.25)]">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff2a53] transition-colors">Catálogo Completo</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Acesso ilimitado a todos os filmes, séries e lançamentos sem restrições ou travamentos.
              </p>
            </div>

            {/* Card 2: Liberação Instantânea */}
            <div className="group relative p-7 rounded-3xl bg-gradient-to-b from-[#12151e] to-[#0c0e14] border border-white/10 hover:border-[#ff0b37]/50 shadow-2xl hover:shadow-[0_10px_30px_rgba(255,11,55,0.2)] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff0b37]/20 to-[#ff2a53]/10 border border-[#ff0b37]/30 text-[#ff2a53] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ff0b37] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,11,55,0.25)]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff2a53] transition-colors">Liberação Instantânea</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Pagamento seguro via PIX ou Cartão com liberação automática de acesso no mesmo instante.
              </p>
            </div>

            {/* Card 3: Multi-dispositivos */}
            <div className="group relative p-7 rounded-3xl bg-gradient-to-b from-[#12151e] to-[#0c0e14] border border-white/10 hover:border-[#ff0b37]/50 shadow-2xl hover:shadow-[0_10px_30px_rgba(255,11,55,0.2)] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff0b37]/20 to-[#ff2a53]/10 border border-[#ff0b37]/30 text-[#ff2a53] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ff0b37] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,11,55,0.25)]">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff2a53] transition-colors">Multi-dispositivos</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Assista no celular, tablet, computador ou na Smart TV com transmissão fluida em 4K.
              </p>
            </div>

            {/* Card 4: Sem Mensalidades */}
            <div className="group relative p-7 rounded-3xl bg-gradient-to-b from-[#12151e] to-[#0c0e14] border border-white/10 hover:border-[#ff0b37]/50 shadow-2xl hover:shadow-[0_10px_30px_rgba(255,11,55,0.2)] hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff0b37]/20 to-[#ff2a53]/10 border border-[#ff0b37]/30 text-[#ff2a53] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ff0b37] group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,11,55,0.25)]">
                <Infinity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff2a53] transition-colors">Sem Mensalidades</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                Esqueça faturas no cartão no final do mês. Pague R$ 10,90 uma única vez e aproveite para sempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section (Modal / Card de Preço Responsivo e Perfeitamente Alinhado) */}
      <section id="planos" className="py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Garanta seu acesso ao TELAX</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-8 sm:mb-10 max-w-xl mx-auto">Oferta de lançamento com valor único promocional. Sem faturas recorrentes.</p>

          <div className="max-w-2xl mx-auto w-full text-left">
            {/* Card de Preço Totalmente Responsivo e Alinhado */}
            <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-b from-[#ff0b37]/20 via-[#101218] to-[#0c0e14] border-2 border-[#ff0b37] flex flex-col justify-between plan-premium-pulse">
              
              {/* Header do Card: Título + Badge Alinhados */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#ff2a53]">Passaporte VIP TELAX</h3>
                  <p className="text-xs text-emerald-400 font-bold mt-0.5">Pagamento Único • Acesso Vitalício</p>
                </div>
                <span className="w-fit bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg">
                  OFERTA VITALÍCIA • SEM MENSALIDADES
                </span>
              </div>

              <div>
                {/* Bloco de Valor */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-gray-400 text-sm line-through font-semibold">De R$ 199,00</span>
                  <div className="text-4xl sm:text-5xl font-black text-[#ffb800] tracking-tight">
                    R$ 10<span className="text-2xl font-bold">,90</span>
                  </div>
                </div>

                {/* Lista de Vantagens em Grid Responsiva */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-200 mb-8 border-t border-white/10 pt-6 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff2a53] font-bold">✓</span> Qualidade Ultra HD 4K + HDR
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff2a53] font-bold">✓</span> Catálogo Completo Liberado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff2a53] font-bold">✓</span> Smart TVs, Celulares e PCs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff2a53] font-bold">✓</span> Downloads Offline Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff2a53] font-bold">✓</span> Novos filmes toda semana
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff2a53] font-bold">✓</span> Suporte VIP Prioritário
                  </li>
                </ul>
              </div>

              {/* Botão de Ação CTA Responsivo */}
              <Link 
                href="/plans" 
                className="w-full py-4 sm:py-5 rounded-2xl text-xs sm:text-sm font-black uppercase text-center text-white bg-gradient-to-r from-[#ff0b37] via-[#ff2a53] to-[#ff0b37] shadow-[0_8px_30px_rgba(255,11,55,0.6)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                Garantir Acesso Vitalício por R$ 10,90
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-12 border-t border-white/10">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Perguntas Frequentes</h2>
          <p className="text-xs text-gray-400 mb-8">Tire suas dúvidas sobre o TELAX antes de garantir seu acesso.</p>

          <div className="space-y-3 text-left">
            {[
              {
                q: 'Como funciona o Pagamento Único?',
                a: 'Você paga apenas R$ 10,90 uma única vez via PIX ou Cartão e seu acesso ao TELAX fica garantido para sempre, sem nenhuma fatura mensal ou cobrança recorrente.',
              },
              {
                q: 'Posso assistir no celular e na Smart TV?',
                a: 'Sim! O TELAX funciona perfeitamente em celulares (iOS e Android), tablets, computadores e Smart TVs diretamente através do navegador com máxima velocidade.',
              },
              {
                q: 'O catálogo é atualizado?',
                a: 'Sim! Atualizamos nosso catálogo constantemente com lançamentos do cinema, novas temporadas de séries e conteúdos em alta definição.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#101218] border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 sm:px-6 py-4 text-xs font-bold text-white text-left flex justify-between items-center"
                >
                  <span>{item.q}</span>
                  <span className="text-[#ff2a53] text-base ml-2">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#050608] border-t border-white/10 text-xs text-gray-400">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#ff0b37] to-[#cc0026] flex items-center justify-center text-white font-black text-xs shadow-md">
              T
            </div>
            <span className="font-extrabold text-lg text-white">TELAX<span className="text-[#ff0b37]">.</span></span>
            <span className="text-[11px] text-gray-500 ml-2">&copy; 2026 TELAX. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white">Login</Link>
            <Link href="/plans" className="hover:text-white">Planos</Link>
            <Link href="/register" className="hover:text-white">Criar Conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
