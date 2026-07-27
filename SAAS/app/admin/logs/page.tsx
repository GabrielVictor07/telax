'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Terminal, AlertCircle, AlertTriangle, CheckCircle, Info, RefreshCw, Filter, ShieldAlert } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'SUCCESS';
  module: 'AUTH' | 'DATABASE' | 'R2_STORAGE' | 'REDIS';
  message: string;
  details?: string;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-2',
    timestamp: '2026-07-23 16:50:02',
    level: 'WARN',
    module: 'R2_STORAGE',
    message: 'Latência elevada no upload do bucket Cloudflare R2 (840ms)',
    details: 'Tentativa de upload de capa poster: the_batman_poster.jpg (1.8MB)',
  },
  {
    id: 'log-3',
    timestamp: '2026-07-23 16:48:33',
    level: 'SUCCESS',
    module: 'AUTH',
    message: 'Login realizado com sucesso via CredentialsProvider',
    details: 'Usuário: admin@telax.com (Role: ADMIN). Session JWT Token gerado.',
  },
  {
    id: 'log-4',
    timestamp: '2026-07-23 16:45:10',
    level: 'INFO',
    module: 'DATABASE',
    message: 'Prisma Client conectado ao PostgreSQL 16 (Pool Connection: 5 conexões ativas)',
  },
  {
    id: 'log-5',
    timestamp: '2026-07-23 16:42:01',
    level: 'SUCCESS',
    module: 'REDIS',
    message: 'Cache de catálogo invalidado e atualizado no Redis com sucesso',
  },
  {
    id: 'log-6',
    timestamp: '2026-07-23 16:30:15',
    level: 'ERROR',
    module: 'AUTH',
    message: 'Tentativa indevida de acesso à rota restrita /admin/movies sem privilégios de gestor',
    details: 'IP tentado: 177.33.20.14 - Bloqueado por middleware.ts',
  },
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesSearch = searchQuery.trim() === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#ff0b37]/20 text-[#ff2a53] border border-[#ff0b37]/30 flex items-center gap-1 w-fit">
            <AlertCircle className="w-3 h-3 text-[#ff0b37]" /> ERROR
          </span>
        );
      case 'WARN':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#ffb800]/20 text-[#ffb800] border border-[#ffb800]/30 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-[#ffb800]" /> WARN
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> SUCCESS
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 w-fit">
            <Info className="w-3 h-3 text-blue-400" /> INFO
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        <Header isAdmin onSearch={(val) => setSearchQuery(val)} />

        <main className="p-4 md:p-8 flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-6 h-6 text-[#ffb800]" />
                <h1 className="text-lg md:text-2xl font-extrabold text-white">Central de Logs</h1>
              </div>
              <p className="text-xs text-gray-400">Monitoramento em tempo real de erros, auth, rotas de webhook e banco de dados.</p>
            </div>

            <button
              onClick={() => setLogs([...INITIAL_LOGS])}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Atualizar Logs
            </button>
          </div>

          {/* Cards de Métricas de Saúde */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-[#101218] border border-white/10">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Erros Críticos (24h)</span>
              <div className="text-2xl font-extrabold text-[#ff2a53] mt-1">2 Erros</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101218] border border-white/10">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">PostgreSQL Status</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (12ms)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#101218] border border-white/10">
              <span className="text-[11px] text-gray-400 font-semibold uppercase">Redis Cache</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                CONECTADO
              </div>
            </div>


          </div>

          {/* Filtros de Logs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            {['ALL', 'ERROR', 'WARN', 'SUCCESS', 'INFO'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === level
                    ? 'bg-[#ffb800] text-black font-extrabold'
                    : 'bg-[#161922] text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {level === 'ALL' ? 'Todos os Logs' : level}
              </button>
            ))}
          </div>

          {/* Tabela Terminal de Logs */}
          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl overflow-x-auto font-mono text-xs shadow-2xl">
            <div className="bg-[#12141c] px-6 py-3 border-b border-white/10 flex items-center justify-between text-gray-400 text-[11px] min-w-[600px]">
              <span>LOG STREAM // TELAX SAAS ENGINE</span>
              <span>{filteredLogs.length} Entradas Encontradas</span>
            </div>

            <div className="divide-y divide-white/5 min-w-[600px]">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-gray-500">{log.timestamp}</span>
                    {getLevelBadge(log.level)}
                    <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 font-bold border border-white/10">
                      [{log.module}]
                    </span>
                    <span className="text-white font-semibold">{log.message}</span>
                  </div>

                  {log.details && (
                    <div className="mt-2 pl-4 border-l-2 border-white/10 text-gray-400 text-[11px] font-mono leading-relaxed bg-black/30 p-2 rounded-r-lg">
                      {log.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
