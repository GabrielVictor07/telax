'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Zap, RefreshCw, Film } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function PlanSuccessPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/user/subscription/status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.hasAccess) {
          setHasAccess(true);
          setLoading(false);
          return true;
        }
      }
    } catch (e) {
      console.error('Erro no polling de confirmação:', e);
    }
    return false;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const poll = async () => {
      const isOk = await checkStatus();
      if (!isOk) {
        setAttempts((prev) => {
          if (prev >= 30) {
            // Para após 30 tentativas (90 segundos)
            setLoading(false);
            return prev;
          }
          return prev + 1;
        });
        timer = setTimeout(poll, 3000); // Polling a cada 3 segundos
      }
    };

    poll();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#08090c] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#ff0b37]/20 via-[#ff2a53]/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Header Simplificado */}
      <header className="absolute top-6 left-6 md:left-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff0b37] to-[#cc0026] flex items-center justify-center font-black text-lg text-white shadow-[0_0_15px_rgba(255,11,55,0.4)]">
            T
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            TELAX<span className="text-[#ff0b37]">.</span>
          </span>
        </Link>
      </header>

      <main className="w-full max-w-lg mx-auto relative z-10">
        <div className="bg-[#12141c]/90 border border-white/15 rounded-3xl p-6 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,11,55,0.2)] backdrop-blur-xl text-center">
          {loading && !hasAccess ? (
            <div className="flex flex-col items-center py-6 animate-fade-in">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#ff0b37]/20 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-[#ff0b37]/10 border border-[#ff0b37]/40 flex items-center justify-center text-[#ff2a53]">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#ff0b37]/20 text-[#ff2a53] border border-[#ff0b37]/30 mb-3 uppercase tracking-wider">
                PROCESSANDO COMPRA CAKTO
              </span>

              <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
                Verificando seu Pagamento...
              </h1>

              <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                Assim que a Cakto confirmar o seu pagamento via PIX ou Cartão, seu acesso VIP será ativado automaticamente.
              </p>

              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs text-gray-400 mb-6">
                <span>Tempo de busca:</span>
                <span className="font-mono text-white font-bold">{attempts * 3}s / 90s</span>
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  checkStatus();
                }}
                className="w-full py-3 rounded-full text-xs font-bold text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Verificar Novamente Agora
              </button>
            </div>
          ) : hasAccess ? (
            <div className="flex flex-col items-center py-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                PAGAMENTO CONFIRMADO
              </span>

              <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                Seu Acesso VIP está Ativo!
              </h1>

              <p className="text-xs md:text-sm text-gray-300 mb-8 leading-relaxed">
                Parabéns! Seu pagamento foi processado com sucesso. Você já tem acesso ilimitado a todo o catálogo do TELAX.
              </p>

              <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#ff0b37]/15 to-[#161924] border border-[#ff0b37]/30 text-left mb-8">
                <div className="flex items-center gap-3 mb-1">
                  <Zap className="w-4 h-4 text-[#ff0b37] fill-[#ff0b37]" />
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Plano Ativado: Passaporte VIP TELAX
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 pl-7">
                  Status: <strong className="text-emerald-400 font-bold">Ativo & Vitalício</strong>
                </p>
              </div>

              <Link
                href="/"
                className="w-full py-4 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_25px_rgba(255,11,55,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Film className="w-4 h-4" />
                Acessar Catálogo Agora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>

              <h1 className="text-xl font-bold text-white mb-2">
                Pagamento em Processamento
              </h1>

              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Ainda não recebemos a confirmação da Cakto. Se você efetuou o pagamento via PIX ou Cartão agora pouco, aguarde alguns instantes ou atualize a página.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    setLoading(true);
                    setAttempts(0);
                    checkStatus();
                  }}
                  className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </button>

                <Link
                  href="/"
                  className="w-full py-3 rounded-full text-xs font-semibold text-gray-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  Ir para a Página Inicial
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
