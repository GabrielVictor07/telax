'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Tag, Plus, Edit, Trash2, X } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category';
import { useRouter } from 'next/navigation';

export default function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  
  const [formState, setFormState] = useState({ name: '', slug: '' });

  const filteredCategories = initialCategories.filter((c) =>
    searchQuery.trim() === '' ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormState({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: any) => {
    setEditingCategory(category);
    setFormState({ name: category.name, slug: category.slug });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Todos os filmes associados a ela poderão ficar órfãos.')) {
      await deleteCategory(id);
      router.refresh();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, formState.name, formState.slug);
    } else {
      await createCategory(formState.name, formState.slug);
    }
    setIsModalOpen(false);
    router.refresh();
  };

  const generateSlug = (name: string) => {
    setFormState({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    });
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
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">{initialCategories.length}</h3>
                <p className="text-xs text-gray-400">Categorias Cadastradas</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Gerenciamento de Categorias</h2>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              Nova Categoria
            </button>
          </div>

          <div className="bg-[#101218] border border-white/10 rounded-2xl overflow-x-auto shadow-xl">
            <table className="w-full min-w-[500px] text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  <th className="py-4 px-6">Nome</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6 text-center">Total de Filmes</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-6 font-bold text-white">{category.name}</td>
                    <td className="py-3 px-6 text-gray-400 font-mono text-[10px]">{category.slug}</td>
                    <td className="py-3 px-6 text-center font-bold text-[#ff0b37]">
                      {category._count.movies}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="w-8 h-8 rounded-lg bg-[#ff0b37]/15 border border-[#ff0b37]/30 flex items-center justify-center text-[#ff2a53] hover:bg-[#ff0b37] hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => generateSlug(e.target.value)}
                  className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  placeholder="Ex: Ação, Terror..."
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formState.slug}
                  onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-gray-400 font-mono focus:border-[#ff0b37] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)]"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
