'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import PlayerModal from '@/components/PlayerModal';
import Sidebar from '@/components/Sidebar';
import { Search, Lock, Star, Play, X, Shield, Sparkles } from 'lucide-react';

export default function CatalogClient({ initialMovies, categories, hasAccess = false }: { initialMovies: any[], categories: any[], hasAccess?: boolean }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const [movies, setMovies] = useState<any[]>(initialMovies.map(m => ({
    ...m,
    category: m.category?.name || 'Sem Categoria'
  })));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeMovieModal, setActiveMovieModal] = useState<any | null>(null);
  const [guestPreviewMovie, setGuestPreviewMovie] = useState<any | null>(null);

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
    if (!isAuthenticated) return;
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );

    try {
      const { toggleFavoriteAction } = await import('@/lib/actions/favorite');
      await toggleFavoriteAction(id);
    } catch (e) {
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
      );
      alert('Erro ao favoritar: ' + (e as Error).message);
    }
  };

  // VISTA PÚBLICA PARA VISITANTES (SEM CONTA / NÃO LOGADOS)
  if (!isAuthenticated && status !== 'loading') {
    return (
      <div className="bg-[#070709] text-white font-sans min-h-screen">
        {/* Header Público */}
        <header className="sticky top-0 z-50 bg-[#070709]/90 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-[1200px] mx-auto px-5">
            <nav className="flex items-center justify-between py-3.5">
              <Link href="/" className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1">
                Vício<span className="text-[#E50914] drop-shadow-[0_0_12px_rgba(229,9,20,0.45)]">+</span>
              </Link>

              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                <Link href="/" className="hover:text-white transition-colors">Início</Link>
                <Link href="/catalog" className="text-[#E50914] font-bold">Catálogo Completo</Link>
                <Link href="/plans" className="hover:text-white transition-colors">Planos & Preços</Link>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/login" className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-2">
                  Entrar
                </Link>
                <Link
                  href="/plans"
                  className="bg-[#E50914] text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-[0_4px_16px_rgba(229,9,20,0.45)] hover:brightness-110 transition-all"
                >
                  Assinar Agora
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Banner do Catálogo Público */}
        <div className="bg-gradient-to-b from-[#12131A] to-[#070709] border-b border-white/10 py-10 md:py-14">
          <div className="max-w-[1200px] mx-auto px-5 text-center">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/25 px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Acervo Completo e Atualizado
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
              Explore Todos os Filmes
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Navegue pelo nosso catálogo completo de produções exclusivas. Crie sua conta ou faça login para liberar a reprodução ilimitada em 4K.
            </p>

            {/* Barra de Busca e Filtros */}
            <div className="max-w-md mx-auto relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou categoria..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1C26] border border-white/15 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all shadow-lg"
              />
            </div>

            {/* Categorias */}
            <div className="flex items-center justify-center gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#E50914] text-white shadow-[0_4px_15px_rgba(229,9,20,0.45)]'
                      : 'bg-[#1A1C26] text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Filmes Público */}
        <main className="max-w-[1200px] mx-auto px-5 py-10">
          {filteredMovies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[#12131A] border border-white/10 rounded-3xl p-8 mb-16">
              <div className="w-14 h-14 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#FF4D57] flex items-center justify-center mb-4 text-2xl font-bold">
                🔍
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Nenhum filme encontrado</h3>
              <p className="text-xs text-gray-400 mb-6">
                Não encontramos resultados para <strong className="text-white">"{searchQuery}"</strong>. Tente buscar por outro nome ou categoria.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E50914] shadow-[0_4px_15px_rgba(229,9,20,0.45)] hover:scale-105 transition-all"
              >
                Limpar Busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-16">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setGuestPreviewMovie(movie)}
                  className="group relative rounded-2xl overflow-hidden bg-[#12131A] border border-white/10 hover:border-[#E50914]/50 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(229,9,20,0.3)] transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-2"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#12131A]">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover scale-[1.32] group-hover:scale-[1.42] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between">
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-[#E50914] text-white shadow-md uppercase w-fit">
                        PREVIEW
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center gap-1 w-fit shadow-md">
                        <Star className="w-3 h-3 fill-[#FFC72C] text-[#FFC72C]" />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1 min-h-[60px]">
                    <h3
                      title={movie.title}
                      className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF4D57] transition-colors"
                    >
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span className="truncate max-w-[70%]">{movie.category}</span>
                      <span>{movie.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modal de Prévia do Filme para Visitante (Sem Conta) */}
        {guestPreviewMovie && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#12131A] border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
              <button
                onClick={() => setGuestPreviewMovie(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white hover:bg-[#E50914] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={guestPreviewMovie.bannerUrl || guestPreviewMovie.posterUrl}
                  alt={guestPreviewMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12131A] via-[#12131A]/40 to-transparent" />
              </div>

              <div className="p-6 -mt-10 relative z-10">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#E50914]/20 text-[#FF4D57] border border-[#E50914]/30 uppercase inline-block mb-2">
                  {guestPreviewMovie.category} • {guestPreviewMovie.year}
                </span>
                <h3 className="text-2xl font-black text-white mb-2">{guestPreviewMovie.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  {guestPreviewMovie.description}
                </p>

                <div className="p-4 rounded-2xl bg-[#1A1C26] border border-white/10 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914] flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Conteúdo Exclusivo para Assinantes</div>
                    <div className="text-[11px] text-gray-400">Faça login ou assine um plano para dar o play instantâneo.</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/login"
                    className="flex-1 py-3.5 rounded-xl text-xs font-bold text-center text-white bg-white/10 border border-white/15 hover:bg-white/20 transition-all"
                  >
                    Já tenho conta (Entrar)
                  </Link>
                  <Link
                    href="/plans"
                    className="flex-1 py-3.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-[#FF1E27] to-[#E50914] shadow-[0_8px_24px_rgba(229,9,20,0.45)] hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Assinar e Assistir
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="py-8 bg-[#040405] border-t border-white/10 text-xs text-gray-500 text-center">
          <p>&copy; 2026 Vício+ Streaming. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
  }

  // VISTA DO DASHBOARD PRIVADO (USUÁRIO LOGADO)
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen bg-[#08090c] pb-20 md:pb-0">
        <Header onSearch={(val) => setSearchQuery(val)} />

        <main className="p-4 md:p-8 flex-1">
          <h1 className="text-xl md:text-2xl font-extrabold text-white mb-2">Catálogo Completo</h1>
          <p className="text-xs text-gray-400 mb-6">Explore todos os filmes e produções disponíveis na TELAX.</p>

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
              <div className="w-14 h-14 rounded-full bg-[#ff0b37]/15 border border-[#ff0b37]/30 text-[#ff2a53] flex items-center justify-center mb-4 text-2xl font-bold">
                🔍
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
