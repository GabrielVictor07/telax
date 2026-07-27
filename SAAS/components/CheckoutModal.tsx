'use client';

import { X, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SINGLE_PAYMENT_INFO = {
  title: 'Acesso Vitalício TELAX',
  price: 10.90,
  description: 'Pagamento Único • Sem Mensalidades',
};

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Se o usuário não estiver logado, redireciona para login
    if (!session || !session.user) {
      router.push('/login?callbackUrl=/plans');
      onClose();
      return;
    }

    const email = session.user.email || '';
    const name = session.user.name || '';
    const userId = (session.user as any).id || '';

    // Monta o link da Cakto com os parâmetros para rastreio e retorno pós-pagamento
    // src = userId (usado para identificar o usuário no webhook)
    const caktoUrl = new URL('https://pay.cakto.com.br/32yj46o_1002839');
    
    if (email) caktoUrl.searchParams.append('email', email);
    if (name) caktoUrl.searchParams.append('name', name);
    if (userId) caktoUrl.searchParams.append('src', userId);

    // Redireciona de volta para a tela de confirmação do TELAX após conclusão
    const returnUrl = `${window.location.origin}/plans/success`;
    caktoUrl.searchParams.append('redirect_url', returnUrl);
    caktoUrl.searchParams.append('return_url', returnUrl);

    // Redireciona o cliente para o Checkout da Cakto
    window.location.href = caktoUrl.toString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141c] border border-white/15 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(255,11,55,0.3)] relative max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#161924] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ff0b37] fill-[#ff0b37]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pagamento Único TELAX
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ff0b37] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo do Checkout */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center text-center py-4 animate-fade-in">
            <h4 className="text-xl font-extrabold text-white mb-2">
              Liberar Acesso Vitalício
            </h4>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Você será redirecionado para o ambiente 100% seguro da Cakto para concluir o seu pagamento.
            </p>
            
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#ff0b37]/15 to-[#161924] border border-[#ff0b37]/30 flex items-center justify-between w-full mb-6 text-left">
              <div>
                <div className="text-xs text-gray-400 font-semibold">{SINGLE_PAYMENT_INFO.description}</div>
                <div className="text-base font-extrabold text-white">{SINGLE_PAYMENT_INFO.title}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[#ffb800]">
                  R$ {SINGLE_PAYMENT_INFO.price.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Pagamento Único</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-[11px] text-gray-400 w-full mb-6 text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              Ambiente de pagamento seguro encriptado.
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_20px_rgba(255,11,55,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Comprar Agora via Cakto
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
