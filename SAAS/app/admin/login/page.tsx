'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Server, Lock, Mail, KeyRound, Activity, Cpu, Database, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@telax.com');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        securityKey: twoFactorCode,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Falha de conexão com a autoridade de autenticação.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#040507] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Cyber Mesh Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00f0ff]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#ff0b37]/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Main Container - Split Screen Design */}
      <div className="w-full max-w-5xl bg-[#090b10]/90 border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] grid grid-cols-1 lg:grid-cols-12 relative z-10 backdrop-blur-2xl">
        
        {/* Painel Esquerdo: System Command Status (Cyber Monitor) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c0f17] to-[#06080d] p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#00f0ff] uppercase block">
                  SYSTEM COMMAND CENTER
                </span>
                <span className="text-xl font-black text-white tracking-tight">TELAX ADMIN</span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-3">
              Portal de Gestão & Infraestrutura
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-8">
              Painel restrito a engenheiros e administradores do ecossistema SaaS.
            </p>

            {/* Server Metrics Dashboard Widget */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <Database className="w-4 h-4 text-[#00f0ff]" />
                  <span>PostgreSQL Master Node</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ONLINE
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <Activity className="w-4 h-4 text-[#ffb800]" />
                  <span>Redis Cache Memory</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-300">12ms • 100% OK</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <Cpu className="w-4 h-4 text-[#ff0b37]" />
                  <span>Segurança SSL / Auth JWT</span>
                </div>
                <span className="text-[11px] font-mono text-[#00f0ff]">256-bit AES</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>NODE: SRV-TELAX-MAIN</span>
            <span>PROD V2.4</span>
          </div>
        </div>

        {/* Painel Direito: Formulário de Autenticação Distinto */}
        <div className="lg:col-span-7 p-10 lg:p-12 flex flex-col justify-center bg-[#090b10]">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 uppercase tracking-widest">
                MODO GESTOR ISOLADO
              </span>
              <Link href="/login" className="text-xs text-gray-400 hover:text-white transition-colors">
                Ir para Login Cliente →
              </Link>
            </div>

            <h3 className="text-2xl font-black text-white mb-1">Acesso Administrativo</h3>
            <p className="text-xs text-gray-400 mb-8">Insira suas credenciais mestre para acessar os logs e catálogo.</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-[#ff0b37]/15 border border-[#ff0b37]/30 text-xs font-semibold text-[#ff2a53] flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 text-[#ff0b37]" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Identificador Administrativo
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@telax.com"
                    className="w-full bg-[#040508] border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Chave Mestre de Segurança
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00f0ff]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#040508] border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Token 2FA / Autenticador (Opcional)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="000 000"
                    className="w-full bg-[#040508] border border-white/15 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:border-[#00f0ff] outline-none transition-all font-mono tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-xs font-black text-black bg-gradient-to-r from-[#00f0ff] to-[#00c8ff] shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wider mt-4"
              >
                {loading ? 'Validando Autoridade...' : 'Conectar ao Terminal Admin'}
              </button>
            </form>

            <div className="mt-8 text-center text-[10px] text-gray-500">
              Tentativas de acesso não autorizadas são gravadas na central de audit logs (`/admin/logs`).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
