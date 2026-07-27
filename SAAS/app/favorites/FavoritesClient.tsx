'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import PlayerModal from '@/components/PlayerModal';
import Sidebar from '@/components/Sidebar';
import { toggleFavoriteAction } from '@/lib/actions/favorite';
import { HeartCrack } from 'lucide-react';
import AccessDenied from '@/components/AccessDenied';

export default function FavoritesClient({ initialMovies, hasAccess = true }: { initialMovies: any[], hasAccess?: boolean }) {
  const [movies, setMovies] = useState<any[]>(initialMovies.map(m => ({
    ...m,
    category: m.category?.name || 'Sem Categoria'
  })));
  const [activeMovieModal, setActiveMovieModal] = useState<any | null>(null);

  const toggleFavorite = async (id: string) => {
    // Remove otimisticamente da lista de favoritos na UI
    setMovies((prev) => prev.filter((m) => m.id !== id));

    try {
      await toggleFavoriteAction(id);
    } catch (e) {
      // Falhou em remover, o ideal seria reverter adicionando de volta, mas 
      // para simplificar, apenas alertamos. (ou forçamos reload)
      alert('Erro ao remover favorito: ' + (e as Error).message);
    }
  };

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen bg-[#08090c]">
          <Header />
          <main className="p-4 md:p-8 flex-1 flex items-center justify-center">
            <AccessDenied message="A lista de favoritos é exclusiva para membros com Acesso Vitalício ativo (R$ 29,90)." />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen bg-[#08090c] pb-20 md:pb-0">
        <Header />

        <main className="p-4 md:p-8 flex-1">
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">Minha Lista</h1>
            <p className="text-sm text-gray-400">Filmes e séries salvos para assistir mais tarde.</p>
          </div>

          {movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border-t border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <HeartCrack className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sua lista está vazia</h3>
              <p className="text-sm text-gray-400">Navegue pelo catálogo e clique no coração para adicionar títulos aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 mb-16">
              {movies.map((movie) => (
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
