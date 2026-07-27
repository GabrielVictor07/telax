'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Film, Star, Users, Plus, Edit, Trash2, X, UploadCloud, Sparkles, Search } from 'lucide-react';
import { createMovie, updateMovie, deleteMovie, setFeaturedMovie } from '@/lib/actions/movie';
import { useRouter } from 'next/navigation';

export default function AdminClient({ initialMovies, categories }: { initialMovies: any[]; categories: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    title: '',
    categoryId: categories[0]?.id || '',
    year: 2023,
    rating: 4.5,
    duration: '2h 10m',
    posterUrl: '',
    bannerUrl: '',
    videoUrl: '',
    description: '',
    isFeatured: false,
  });

  const featuredMovie = initialMovies.find((m) => m.isFeatured);

  const filteredMovies = initialMovies.filter((m) =>
    searchQuery.trim() === '' ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingMovie(null);
    setFormState({
      title: '',
      categoryId: categories[0]?.id || '',
      year: new Date().getFullYear(),
      rating: 4.5,
      duration: '2h 10m',
      posterUrl: '',
      bannerUrl: '',
      videoUrl: '',
      description: '',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  // Função para extrair Título, Capa e Banner em HD a partir do link do YouTube
  const handleExtractYouTubeMedia = async (url: string) => {
    if (!url) return;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      const hdBanner = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      // Atualiza imagens e videoUrl imediatamente
      setFormState((prev) => ({
        ...prev,
        videoUrl: url,
        bannerUrl: hdBanner,
        posterUrl: prev.posterUrl || poster,
      }));

      // Busca título e dados adicionais via oEmbed do YouTube (Sem chave de API)
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (res.ok) {
          const data = await res.json();
          if (data.title) {
            // Limpa sufixos de trailer para ficar um nome limpo de filme
            const cleanTitle = data.title
              .replace(/[-|–]?\s*(Main\s+)?(Official\s+)?(Trailer|Teaser|Dublado|Legendado)\s*.*$/i, '')
              .trim() || data.title;

            setFormState((prev) => ({
              ...prev,
              title: prev.title ? prev.title : cleanTitle,
              description: prev.description ? prev.description : `Produção em alta qualidade (${data.author_name || 'YouTube'}).`,
            }));
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do YouTube:', err);
      }
    }
  };

  const handleOpenEditModal = (movie: any) => {
    setEditingMovie(movie);
    setFormState({
      title: movie.title,
      categoryId: movie.categoryId || categories[0]?.id || '',
      year: movie.year || 2023,
      rating: movie.rating || 4.5,
      duration: movie.duration || '2h 00m',
      posterUrl: movie.posterUrl || '',
      bannerUrl: movie.bannerUrl || '',
      videoUrl: movie.videoUrl || '',
      description: movie.description || '',
      isFeatured: movie.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleDeleteMovie = async (id: string) => {
    if (confirm(`Tem certeza que deseja remover este filme do catálogo?`)) {
      try {
        await deleteMovie(id);
        showToast('Filme removido do catálogo com sucesso!');
        router.refresh();
      } catch (err) {
        alert('Erro ao excluir filme: ' + (err as Error).message);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'posterUrl' | 'bannerUrl' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormState(prev => ({ ...prev, [field]: data.url }));
        showToast(`Arquivo para ${field === 'posterUrl' ? 'Capa' : field === 'bannerUrl' ? 'Banner' : 'Vídeo'} enviado!`);
      } else {
        alert('Erro no upload: ' + data.error);
      }
    } catch (err) {
      alert('Erro inesperado durante o upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.categoryId) {
      alert('Por favor, escolha ou crie uma categoria primeiro.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, formState);
        showToast(`Filme "${formState.title}" atualizado com sucesso!`);
      } else {
        await createMovie(formState);
        showToast(`Filme "${formState.title}" cadastrado com sucesso!`);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      alert('Erro ao salvar filme: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const setFeatured = async (id: string) => {
    await setFeaturedMovie(id);
    router.refresh();
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
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">{initialMovies.length}</h3>
                <p className="text-xs text-gray-400">Filmes no Catálogo</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#101218] border border-white/10 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#ffb800]/15 text-[#ffb800] flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white truncate max-w-[180px]">
                  {featuredMovie ? featuredMovie.title : 'Nenhum'}
                </h3>
                <p className="text-xs text-gray-400">Filme em Destaque</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#101218] border border-white/10 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">---</h3>
                <p className="text-xs text-gray-400">Verifique Aba Usuários</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Gerenciamento do Catálogo</h2>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Novo Filme
            </button>
          </div>

          <div className="bg-[#101218] border border-white/10 rounded-2xl overflow-x-auto shadow-xl">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  <th className="py-4 px-6">Capa</th>
                  <th className="py-4 px-6">Título</th>
                  <th className="py-4 px-6">Categoria</th>
                  <th className="py-4 px-6">Ano</th>
                  <th className="py-4 px-6">Nota</th>
                  <th className="py-4 px-6">Destaque</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-6">
                      <div className="w-10 h-14 rounded-md border border-white/10 overflow-hidden bg-[#08090c]">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover scale-105"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-6 font-bold text-white max-w-[220px] leading-snug break-words">
                      {movie.title}
                      <div className="text-[10px] text-gray-500 font-normal">{movie.duration}</div>
                    </td>
                    <td className="py-3 px-6">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-white/10 text-white border border-white/10">
                        {movie.category?.name || 'Sem Categoria'}
                      </span>
                    </td>
                    <td className="py-3 px-6">{movie.year}</td>
                    <td className="py-3 px-6 font-bold text-[#ffb800]">⭐ {movie.rating}</td>
                    <td className="py-3 px-6">
                      {movie.isFeatured ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ff0b37]/20 text-[#ff2a53] border border-[#ff0b37]/30">
                          EM DESTAQUE
                        </span>
                      ) : (
                        <button
                          onClick={() => setFeatured(movie.id)}
                          className="px-2 py-1 rounded text-[10px] font-semibold bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                        >
                          Tornar Destaque
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(movie)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="w-8 h-8 rounded-lg bg-[#ff0b37]/15 border border-[#ff0b37]/30 flex items-center justify-center text-[#ff2a53] hover:bg-[#ff0b37] hover:text-white transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161922] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingMovie ? 'Editar Filme' : 'Cadastrar Novo Filme'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              {/* Gerador de Capa e Banner via Link do YouTube */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-[#101218] border border-red-500/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff0b37]" />
                  <h4 className="font-bold text-white text-xs">Gerador Automático de Capa e Banner via YouTube</h4>
                </div>
                <p className="text-[11px] text-gray-400 mb-3">
                  Cole o link de um vídeo do YouTube abaixo. O sistema extrairá automaticamente a capa e o banner em alta resolução HD.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cole aqui o link do YouTube (ex: https://www.youtube.com/watch?v=... ou https://youtu.be/...)"
                    value={formState.videoUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      setFormState((prev) => ({ ...prev, videoUrl: url }));
                      handleExtractYouTubeMedia(url);
                    }}
                    className="flex-1 bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleExtractYouTubeMedia(formState.videoUrl)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#ff0b37] hover:bg-red-600 transition-all flex items-center gap-1.5"
                  >
                    Gerar Imagens
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Título *</label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                    placeholder="Ex: Batman Begins"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Categoria *</label>
                  <select
                    required
                    value={formState.categoryId}
                    onChange={(e) => setFormState({ ...formState, categoryId: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {categories.length === 0 && <option value="">Crie categorias primeiro</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Ano</label>
                  <input
                    type="number"
                    value={formState.year}
                    onChange={(e) => setFormState({ ...formState, year: parseInt(e.target.value) || 2023 })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Nota IMDb</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.rating}
                    onChange={(e) => setFormState({ ...formState, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Duração</label>
                  <input
                    type="text"
                    value={formState.duration}
                    onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  />
                </div>
              </div>

              {/* UPLOADS E URLS DE MÍDIA */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#ff0b37]"/> Arquivos de Mídia & Links
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Capa Vertical (URL / Poster)</label>
                    <input
                      type="text"
                      value={formState.posterUrl}
                      onChange={(e) => setFormState({ ...formState, posterUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'posterUrl')}
                      className="w-full text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#ff0b37]/20 file:text-[#ff0b37] hover:file:bg-[#ff0b37]/30"
                    />
                    {formState.posterUrl && (
                      <div className="mt-2 flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10">
                        <img src={formState.posterUrl} alt="Poster" className="w-8 h-12 object-cover rounded" />
                        <span className="text-[10px] text-emerald-400 font-semibold truncate">Capa Pronta</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 font-semibold mb-1">Banner Hero (URL / Horizontal)</label>
                    <input
                      type="text"
                      value={formState.bannerUrl}
                      onChange={(e) => setFormState({ ...formState, bannerUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'bannerUrl')}
                      className="w-full text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#ff0b37]/20 file:text-[#ff0b37] hover:file:bg-[#ff0b37]/30"
                    />
                    {formState.bannerUrl && (
                      <div className="mt-2 flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10">
                        <img src={formState.bannerUrl} alt="Banner" className="w-16 h-9 object-cover rounded" />
                        <span className="text-[10px] text-emerald-400 font-semibold truncate">Banner Pronto</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">URL do Vídeo (HLS .m3u8, MP4 ou Youtube)</label>
                  <input
                    type="text"
                    value={formState.videoUrl}
                    onChange={(e) => setFormState({ ...formState, videoUrl: e.target.value })}
                    placeholder="Cole aqui o link do vídeo (ex: https://...)"
                    className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none mb-2"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'videoUrl')}
                    className="w-full text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-[#ff0b37]/20 file:text-[#ff0b37] hover:file:bg-[#ff0b37]/30"
                  />
                  {formState.videoUrl && <p className="text-[10px] text-emerald-400 mt-1 truncate">Link do vídeo inserido: {formState.videoUrl}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Sinopse</label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-lg px-3 py-2 text-white focus:border-[#ff0b37] outline-none"
                  placeholder="Resumo da história..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formState.isFeatured}
                  onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                  className="accent-[#ff0b37] w-4 h-4"
                />
                <label htmlFor="featured-checkbox" className="text-white cursor-pointer select-none">
                  Definir como Filme Destaque do Hero Banner
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isSaving}
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Salvando Alterações...
                    </>
                  ) : isUploading ? (
                    'Aguarde Upload...'
                  ) : editingMovie ? (
                    'Atualizar Filme'
                  ) : (
                    'Cadastrar Filme'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161924] border border-emerald-500/40 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
