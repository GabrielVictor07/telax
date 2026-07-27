'use client';

import { Heart, Star } from 'lucide-react';
import { MovieItem } from '@/lib/mockData';

import { useRouter } from 'next/navigation';

interface MovieCardProps {
  movie: MovieItem;
  hasAccess?: boolean;
  onPlay: (movie: MovieItem) => void;
  onToggleFavorite?: (id: string) => void;
}

export default function MovieCard({ movie, hasAccess = false, onPlay, onToggleFavorite }: MovieCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => hasAccess ? onPlay(movie) : router.push('/plans')}
      className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-[#101218] border border-white/10 hover:border-[#ff0b37]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(255,11,55,0.2)] transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 md:hover:-translate-y-2"
    >
      {/* Poster sem barras pretas superiores/inferiores */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#101218]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover scale-[1.32] group-hover:scale-[1.42] transition-transform duration-500"
        />

        {/* Overlay Badges sem sombras ou degradês pretos */}
        <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between">
          <div className="flex items-center justify-between pointer-events-auto">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#ff0b37] text-white backdrop-blur-md shadow-md uppercase">
              VITALÍCIO
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (hasAccess) {
                  onToggleFavorite?.(movie.id);
                } else {
                  router.push('/plans');
                }
              }}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#ff0b37] transition-all shadow-md"
            >
              <Heart className={`w-3.5 h-3.5 ${movie.isFavorite ? 'fill-[#ff0b37] text-[#ff0b37]' : ''}`} />
            </button>
          </div>

          <div className="pointer-events-auto">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center gap-1 w-fit shadow-md">
              <Star className="w-3 h-3 fill-[#ffb800] text-[#ffb800]" />
              {movie.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="p-2.5 md:p-3.5 flex flex-col justify-between flex-1 min-h-[64px] md:min-h-[72px]">
        <h3
          title={movie.title}
          className="text-xs md:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#ff2a53] transition-colors"
        >
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-400 mt-1.5 font-medium">
          <span className="truncate max-w-[65%]">{movie.category}</span>
          <span className="shrink-0">{movie.year}</span>
        </div>
      </div>
    </div>
  );
}
