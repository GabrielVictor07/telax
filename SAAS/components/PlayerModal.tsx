'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Star, Settings, ShieldCheck, Play, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { MovieItem } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import Hls from 'hls.js';

interface PlayerModalProps {
  movie: MovieItem | null;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
}

export default function PlayerModal({ movie, onClose, onToggleFavorite }: PlayerModalProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('Auto (4K)');
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);

  const [loadingStream, setLoadingStream] = useState<boolean>(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!movie) return;

    let isMounted = true;
    setLoadingStream(true);
    setAccessDenied(false);
    setErrorMessage(null);
    setStreamUrl(null);

    // Valida permissão de streaming com o backend
    fetch(`/api/stream/${movie.id}`)
      .then(async (res) => {
        if (!isMounted) return;

        if (res.status === 401 || res.status === 403) {
          const data = await res.json().catch(() => ({}));
          setAccessDenied(true);
          setErrorMessage(data.error || 'Assinatura VIP necessária para reproduzir este filme.');
          setLoadingStream(false);
          return;
        }

        if (!res.ok) {
          throw new Error('Falha ao obter URL de streaming seguro.');
        }

        const data = await res.json();
        setStreamUrl(data.streamUrl || movie.videoUrl);
        setLoadingStream(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[PlayerModal] Erro ao validar stream:', err);
        // Fallback: Se for URL direta conhecida, utiliza se não houver bloqueio 403
        setStreamUrl(movie.videoUrl);
        setLoadingStream(false);
      });

    return () => {
      isMounted = false;
    };
  }, [movie]);

  const isDirectVideo = streamUrl?.includes('.mp4') || streamUrl?.includes('.m3u8') || streamUrl?.includes('blob:');

  useEffect(() => {
    if (!streamUrl || !isDirectVideo || !videoRef.current) return;

    if (streamUrl.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      setHlsInstance(hls);

      return () => {
        hls.destroy();
      };
    }
  }, [streamUrl, isDirectVideo]);

  if (!movie) return null;

  const qualities = ['Auto (4K)', '1080p Full HD', '720p HD', '480p SD'];

  const changeQuality = (q: string) => {
    setSelectedQuality(q);
    setShowQualityMenu(false);

    if (hlsInstance) {
      if (q.includes('1080')) hlsInstance.currentLevel = 0;
      else if (q.includes('720')) hlsInstance.currentLevel = 1;
      else if (q.includes('480')) hlsInstance.currentLevel = 2;
      else hlsInstance.currentLevel = -1; // Auto
    }
  };

  const formatEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&iv_load_policy=3&disablekb=0`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141c] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,11,55,0.25)]">
        {/* Header Modal */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <h3 className="text-sm md:text-lg font-bold text-white leading-tight break-words">{movie.title}</h3>
            <span className="hidden md:flex px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#ff0b37]/20 text-[#ff2a53] border border-[#ff0b37]/30 items-center gap-1 flex-shrink-0">
              <ShieldCheck className="w-3 h-3" />
              STREAMING PROTEGIDO
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ff0b37] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-4 md:p-6">
          {/* Player Container com Trava de Segurança */}
          <div className="relative aspect-video w-full bg-black rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 shadow-inner border border-white/10 group flex items-center justify-center">
            {loadingStream ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#ff0b37] border-t-transparent animate-spin mb-3" />
                <span className="text-xs text-gray-400 font-mono">Validando acesso ao streaming...</span>
              </div>
            ) : accessDenied ? (
              <div className="flex flex-col items-center justify-center p-6 text-center max-w-md bg-[#0d0f14]/90 rounded-2xl border border-red-500/30">
                <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Assinatura VIP Necessária</h4>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  {errorMessage || 'Seu pagamento ainda não foi confirmado ou sua conta não possui uma assinatura vitalícia ativa.'}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/plans');
                  }}
                  className="px-6 py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_20px_rgba(255,11,55,0.5)] hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Liberar Acesso Vitalício por R$ 10,90
                </button>
              </div>
            ) : isDirectVideo ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={movie.posterUrl}
                src={streamUrl?.includes('.m3u8') ? undefined : streamUrl || undefined}
              />
            ) : (
              <iframe
                src={formatEmbedUrl(streamUrl || movie.videoUrl)}
                title={movie.title}
                className="absolute -top-[9%] -left-[3%] w-[106%] h-[118%]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Menu Flutuante de Seletor de Qualidade HLS (Apenas se liberar o vídeo) */}
            {!loadingStream && !accessDenied && (
              <div className="absolute top-4 right-4 z-20">
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="px-2 py-1 md:px-3 md:py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] md:text-xs font-bold text-white flex items-center gap-1.5 md:gap-2 hover:bg-black/90 transition-all shadow-lg"
                  >
                    <Settings className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#ff0b37]" />
                    <span className="hidden md:inline">{selectedQuality}</span>
                    <span className="md:hidden">HD</span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#08090c] border border-white/20 shadow-2xl p-1.5 z-30">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase border-b border-white/10 mb-1">
                        Qualidade do Vídeo
                      </div>
                      {qualities.map((q) => (
                        <button
                          key={q}
                          onClick={() => changeQuality(q)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            selectedQuality === q
                              ? 'bg-[#ff0b37] text-white'
                              : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{q}</span>
                          {selectedQuality === q && <span className="text-[10px] font-extrabold">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Informações da Mídia */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="hidden md:block w-28 h-40 object-cover rounded-xl border border-white/10 shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#ffb800]/15 text-[#ffb800] border border-[#ffb800]/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#ffb800]" />
                  IMDb {movie.rating}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-white/10 text-white border border-white/10">
                  {movie.category}
                </span>
                <span className="text-xs text-gray-400">
                  {movie.year} • {movie.duration}
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {movie.description}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                {!accessDenied ? (
                  <button
                    onClick={() => {
                      if (videoRef.current) videoRef.current.play();
                    }}
                    className="px-4 md:px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Reproduzir Mídia
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      router.push('/plans');
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#ff0b37] to-[#ff2a53] shadow-[0_0_15px_rgba(255,11,55,0.4)] hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Assinar para Assistir (R$ 10,90)
                  </button>
                )}

                <button
                  onClick={() => {
                    onToggleFavorite?.(movie.id);
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-white/10 border border-white/10 hover:bg-white/20 transition-all"
                >
                  {movie.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
