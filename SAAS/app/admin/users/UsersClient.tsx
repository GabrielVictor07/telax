'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Users, Trash2 } from 'lucide-react';
import { deleteUser } from '@/lib/actions/user';
import { useRouter } from 'next/navigation';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = initialUsers.filter((u) =>
    searchQuery.trim() === '' ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, role: string) => {
    if (role === 'ADMIN') {
      alert('Não é possível excluir um Administrador pela interface.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir permanentemente este usuário?')) {
      await deleteUser(id);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        <Header isAdmin onSearch={(val) => setSearchQuery(val)} />

        <main className="p-4 md:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-[#101218] border border-white/10 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#ff0b37]/15 text-[#ff0b37] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">{initialUsers.length}</h3>
                <p className="text-xs text-gray-400">Usuários Registrados</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Gerenciamento de Usuários</h2>
          </div>

          <div className="bg-[#101218] border border-white/10 rounded-2xl overflow-x-auto shadow-xl">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  <th className="py-4 px-6">Nome / Email</th>
                  <th className="py-4 px-6">Permissão</th>
                  <th className="py-4 px-6">Plano / Status</th>
                  <th className="py-4 px-6">Data de Cadastro</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {filteredUsers.map((user) => {
                  const sub = user.subscriptions?.[0];
                  return (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-6">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-gray-400 text-[10px]">{user.email}</div>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'ADMIN' 
                            ? 'bg-[#ffb800]/20 text-[#ffb800] border border-[#ffb800]/30' 
                            : 'bg-white/10 text-white border border-white/10'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        {sub ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-emerald-400">{sub.plan}</span>
                            <span className="text-[10px] text-gray-400">{sub.status}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Sem Assinatura</span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(user.id, user.role)}
                            className="w-8 h-8 rounded-lg bg-[#ff0b37]/15 border border-[#ff0b37]/30 flex items-center justify-center text-[#ff2a53] hover:bg-[#ff0b37] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Excluir"
                            disabled={user.role === 'ADMIN'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
