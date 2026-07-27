'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import MovieCard from '@/components/MovieCard';
import PlayerModal from '@/components/PlayerModal';
import Sidebar from '@/components/Sidebar';
import LandingView from '@/components/LandingView';

export default function HomeClient({ initialMovies, categories, hasAccess = false }: { initialMovies: any[], categories: any[], hasAccess?: boolean }) {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<any[]>(initialMovies.map(m => ({
    ...m,
    category: m.category?.name || 'Sem Categoria'
  })));
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMovieModal, setActiveMovieModal] = useState<any | null>(null);

  if (status === 'unauthenticated') {
    return <LandingView />;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full bg-[#08090c] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#ff0b37] animate-pulse flex items-center justify-center font-black text-xl">
            T
          </div>
          <span className="text-xs text-gray-400 font-mono">Carregando TELAX...</span>
        </div>
      </div>
    );
  }

  const featuredMovie = movies.find((m) => m.isFeatured) || movies[0];
  const categoryNames = ['Todos', ...categories.map(c => c.name)];

  const filteredMovies = movies.filter((movie) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory = selectedCategory === 'Todos' || movie.category === selectedCategory;
    const matchesSearch = query === '' || 
      movie.title.toLowerCase().includes(query) ||
      movie.category.toLowerCase().includes(query) ||
      (movie.description && movie.description.toLowerCase().includes(query)) ||
      (movie.year && movie.year.toString().includes(query));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = async (id: string) => {
    // Atualiza otimisticamente a UI
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );

    try {
      // Usamos import dinâmico para não quebrar no topo (Server Action dentro de Client Component)
      const { toggleFavoriteAction } = await import('@/lib/actions/favorite');
      await toggleFavoriteAction(id);
    } catch (e) {
      // Reverte se falhar
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
      );
      alert('Erro ao favoritar: ' + (e as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        <Header onSearch={(val) => setSearchQuery(val)} />

        <main className="p-4 md:p-8 flex-1">
          {featuredMovie && (
            <HeroBanner
              movie={featuredMovie}
              hasAccess={hasAccess}
              onPlay={(movie) => setActiveMovieModal(movie)}
              onToggleFavorite={toggleFavorite}
            />
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Recomendações'}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 mb-6 md:mb-8 scrollbar-hide">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#ff0b37] text-white shadow-[0_4px_15px_rgba(255,11,55,0.4)]'
                    : 'bg-[#161922] text-gray-400 border border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[#101218] border border-white/10 rounded-2xl p-8 mb-16">
              <div className="w-14 h-14 rounded-full bg-[#ff0b37]/15 border border-[#ff0b37]/30 text-[#ff2a53] flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nenhum filme encontrado</h3>
              <p className="text-xs text-gray-400 mb-6">
                Não encontramos títulos para <strong className="text-white">"{searchQuery}"</strong>. Tente buscar por outro termo ou categoria.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all"
              >
                Limpar Pesquisa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 mb-16">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  hasAccess={hasAccess}
                  onPlay={(m) => setActiveMovieModal(m)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <PlayerModal
        movie={activeMovieModal}
        onClose={() => setActiveMovieModal(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
