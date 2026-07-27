'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: formState.email,
        password: formState.password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08090c] text-white flex flex-col relative overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#ff0b37]/20 to-transparent blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff0b37] to-[#cc0026] flex items-center justify-center font-black text-lg text-white shadow-[0_0_15px_rgba(255,11,55,0.4)]">
            T
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            TELAX<span className="text-[#ff0b37]">.</span>
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto relative z-10 flex flex-col justify-center px-6 py-12">
        <div className="bg-[#101218] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-400 mb-8">Entre com sua conta para continuar assistindo.</p>

          {error && (
            <div className="p-3 mb-6 rounded-lg bg-[#ff0b37]/15 border border-[#ff0b37]/30 text-xs font-semibold text-[#ff2a53]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">E-mail</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-[#08090c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ff0b37] outline-none text-sm transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Senha</label>
              <input
                type="password"
                required
                value={formState.password}
                onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                className="w-full bg-[#08090c] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ff0b37] outline-none text-sm transition-colors"
                placeholder="Sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_25px_rgba(255,11,55,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Entrando...'
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Acessar Plataforma
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Ainda não tem uma conta?{' '}
            <Link href="/register" className="font-bold text-white hover:text-[#ff0b37] transition-colors">
              Assine Agora
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
