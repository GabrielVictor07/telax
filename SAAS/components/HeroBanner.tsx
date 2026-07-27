'use client';

import { Play, Star, Heart } from 'lucide-react';
import { MovieItem } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

interface HeroBannerProps {
  movie: MovieItem;
  hasAccess?: boolean;
  onPlay: (movie: MovieItem) => void;
  onToggleFavorite?: (id: string) => void;
}

export default function HeroBanner({ movie, hasAccess = false, onPlay, onToggleFavorite }: HeroBannerProps) {
  const router = useRouter();

  return (
    <div className="relative w-full h-[280px] md:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-10 border border-white/10 shadow-2xl bg-[#101218]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${movie.bannerUrl}')` }}
      />

      {/* Dark Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090c] via-[#08090c]/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-xl">
        <span className="text-xs md:text-xs font-black uppercase tracking-widest text-[#ff2a53] mb-1.5">
          🔥 EM DESTAQUE NA TELAX
        </span>
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2 md:mb-3 drop-shadow-md leading-tight">
          {movie.title}
        </h1>

        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-[#ffb800] font-bold text-xs md:text-sm">
            <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-[#ffb800]" />
            IMDb {movie.rating}
          </div>
          <span className="hidden md:inline px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/10 text-white border border-white/10">
            {movie.category}
          </span>
          <span className="text-[10px] md:text-xs text-gray-400">
            {movie.year} • {movie.duration}
          </span>
        </div>

        <p className="hidden md:block text-sm text-gray-300 line-clamp-3 mb-6 leading-relaxed">
          {movie.description}
        </p>

        <div className="flex items-center gap-4">
          {hasAccess ? (
            <button
              onClick={() => onPlay(movie)}
              className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_25px_rgba(255,11,55,0.5)] hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Assistir
            </button>
          ) : (
            <button
              onClick={() => router.push('/plans')}
              className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_25px_rgba(255,11,55,0.5)] hover:scale-105 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Liberar Acesso (R$ 29,90)
            </button>
          )}

          <button
            onClick={() => hasAccess ? onToggleFavorite?.(movie.id) : router.push('/plans')}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
              movie.isFavorite
                ? 'bg-[#ff0b37]/20 border-[#ff0b37]/50 text-[#ff2a53]'
                : 'bg-white/5 border-white/10 text-white hover:bg-[#ff0b37] hover:border-[#ff0b37]'
            }`}
          >
            <Heart className={`w-4 h-4 md:w-5 md:h-5 ${movie.isFavorite ? 'fill-[#ff2a53]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
