'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Star, User, XCircle, Clock, CreditCard, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { cancelSubscription } from '@/lib/actions/subscription';

import { getAvatarGradient, getAvatarInitial } from '@/lib/avatar';

interface SubscriptionData {
  id: string;
  plan: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  paymentGatewayId: string | null;
}

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  activeSub: SubscriptionData | null;
  isFree: boolean;
  subscriptionHistory: SubscriptionData[];
}

export default function ProfileClient({ user, activeSub, isFree, subscriptionHistory }: ProfileClientProps) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleCancel = async () => {
    if (!activeSub) return;
    setCanceling(true);
    setCancelError(null);

    try {
      await cancelSubscription(activeSub.id);
      setShowCancelModal(false);
      router.refresh();
    } catch (e) {
      setCancelError((e as Error).message);
    } finally {
      setCanceling(false);
    }
  };

  const planColors: Record<string, string> = {
    GOLD: '#ffb800',
    PLATINUM: '#ff2a53',
    DIAMOND: '#a78bfa',
  };

  const planPrices: Record<string, string> = {
    GOLD: 'R$ 29/mês',
    PLATINUM: 'R$ 49/mês',
    DIAMOND: 'R$ 79/mês',
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> ATIVA
          </span>
        );
      case 'CANCELED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" /> CANCELADA
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" /> PENDENTE
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 md:mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Informações da Conta */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#101218] border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${getAvatarGradient(user.email || user.name)} flex items-center justify-center text-xl md:text-2xl font-black shadow-[0_0_20px_rgba(255,11,55,0.3)]`}>
                {getAvatarInitial(user.name, user.email)}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
                {user.role === 'ADMIN' && (
                  <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ffb800]/20 text-[#ffb800] border border-[#ffb800]/30">
                    ADMINISTRADOR
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Membro Desde</label>
                <div className="text-sm font-semibold text-white">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Status da Conta</label>
                <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Conta Verificada
                </div>
              </div>
            </div>
          </div>

          {/* Histórico de Assinaturas */}
          <div className="bg-[#101218] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full p-5 md:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff0b37]/15 text-[#ff0b37] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white">Histórico de Assinaturas</h3>
                  <p className="text-[11px] text-gray-400">{subscriptionHistory.length} registro(s)</p>
                </div>
              </div>
              <ArrowUpRight className={`w-4 h-4 text-gray-400 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
            </button>

            {showHistory && (
              <div className="border-t border-white/10">
                {subscriptionHistory.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    Nenhuma assinatura encontrada no histórico.
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {subscriptionHistory.map((sub) => (
                      <div key={sub.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                            style={{ backgroundColor: `${planColors[sub.plan] || '#fff'}20`, color: planColors[sub.plan] || '#fff' }}
                          >
                            {sub.plan.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">Plano {sub.plan}</div>
                            <div className="text-[10px] text-gray-400">
                              {new Date(sub.createdAt).toLocaleDateString('pt-BR')} → {new Date(sub.expiresAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-gray-400">{planPrices[sub.plan]}</span>
                          {statusBadge(sub.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Lateral: Plano Atual */}
        <div className="space-y-6">
          <div className={`border rounded-2xl md:rounded-3xl p-5 md:p-6 ${
            isFree 
              ? 'bg-[#101218] border-white/10' 
              : `bg-gradient-to-b from-[${planColors[activeSub?.plan || 'GOLD']}]/20 to-[#101218] border-[${planColors[activeSub?.plan || 'GOLD']}]/50 shadow-[0_0_30px_${planColors[activeSub?.plan || 'GOLD']}15]`
          }`}>
            <div className="flex items-center gap-2 mb-4">
              {isFree ? (
                <User className="w-5 h-5 text-gray-400" />
              ) : (
                <Star className="w-5 h-5 fill-[#ffb800] text-[#ffb800]" />
              )}
              <h3 className="font-bold text-lg text-white">Plano Atual</h3>
            </div>

            {isFree ? (
              <>
                <div className="text-xl md:text-2xl font-black text-white mb-2">Conta Gratuita</div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Você pode navegar pelo catálogo, mas precisa de uma assinatura para assistir e favoritar.
                </p>
                <Link
                  href="/plans"
                  className="w-full py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_20px_rgba(255,11,55,0.4)] flex justify-center hover:scale-105 transition-all"
                >
                  Assinar Premium
                </Link>
              </>
            ) : user.role === 'ADMIN' && !activeSub ? (
              <>
                <div className="text-xl md:text-2xl font-black mb-1 text-[#ffb800]">
                  Acesso Administrador
                </div>
                <div className="text-lg font-bold text-white mb-1">Acesso Ilimitado</div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-6">
                  <ShieldCheck className="w-3 h-3" />
                  Conta Corporativa / Vitalícia
                </div>
              </>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-black mb-1 text-[#ff2a53]">
                  Acesso Vitalício VIP
                </div>
                <div className="text-sm font-bold text-white mb-1">Pagamento Único R$ 29,90</div>
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-6">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Acesso Ilimitado Vitalício Ativo
                </div>

                <div className="space-y-2">
                  <Link
                    href="/"
                    className="w-full py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] flex justify-center hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,11,55,0.3)]"
                  >
                    Acessar Catálogo
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cancelar Assinatura?</h3>
              <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                Ao cancelar seu plano <strong className="text-white">{activeSub?.plan}</strong>, você perderá imediatamente o acesso a:
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 mb-6 text-left w-full">
                <li className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  Assistir filmes e séries
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  Salvar títulos nos favoritos
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  Downloads offline e qualidade 4K
                </li>
              </ul>

              {cancelError && (
                <div className="w-full p-3 mb-4 rounded-lg bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-400">
                  {cancelError}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-3 w-full">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 rounded-full text-xs font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all"
                >
                  Manter Assinatura
                </button>
                <button
                  onClick={handleCancel}
                  disabled={canceling}
                  className="flex-1 py-3 rounded-full text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {canceling ? 'Cancelando...' : 'Sim, Cancelar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
