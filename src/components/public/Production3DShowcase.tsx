import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import {
  Play,
  Camera,
  Video,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Instagram,
  ExternalLink,
  Star,
  Film,
  X,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';

interface ProductionItem {
  id: string;
  title: string;
  client: string;
  type: 'video' | 'photo';
  category: string;
  coverImage: string;
  videoUrl?: string;
  instagramUrl?: string;
  viewsCount?: string;
  gallery?: string[];
  description: string;
  year: string;
  slug?: string;
}

export const Production3DShowcase: React.FC = () => {
  const [items, setItems] = useState<ProductionItem[]>([]);
  const [activeType, setActiveType] = useState<'ALL' | 'VIDEO' | 'PHOTO'>('ALL');
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);

  // Modals State
  const [activeVideoModal, setActiveVideoModal] = useState<ProductionItem | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<{ images: string[]; index: number; title: string; client: string; category: string } | null>(null);

  useEffect(() => {
    portfolioService.getProjects().then((projects) => {
      const compiled: ProductionItem[] = [];

      // Add Video Productions
      projects
        .filter(p => p.project_type === 'video_production' || p.production_partner)
        .forEach(p => {
          compiled.push({
            id: p.id,
            title: p.title,
            client: p.production_partner?.name || p.client,
            type: 'video',
            category: p.industry || 'Commercial Video & Cinema',
            coverImage: p.featured_image,
            videoUrl: p.videos?.[0] || p.instagram_url,
            instagramUrl: p.instagram_url,
            viewsCount: p.video_reels?.[0]?.views_count || '1.2M+',
            description: p.description,
            year: p.completion_date?.split('-')[0] || '2026',
            slug: p.slug
          });
        });

      // Add Photoshoot Projects
      projects
        .filter(p => p.project_type === 'photoshoot' || (p.gallery && p.gallery.length > 0 && !p.live_url && !p.production_partner))
        .forEach(p => {
          compiled.push({
            id: p.id,
            title: p.title,
            client: p.client,
            type: 'photo',
            category: p.industry || 'High-Fashion Photoshoot',
            coverImage: p.featured_image,
            gallery: p.gallery && p.gallery.length > 0 ? p.gallery : [p.featured_image],
            description: p.description,
            year: p.completion_date?.split('-')[0] || '2026',
            slug: p.slug
          });
        });

      if (compiled.length > 0) {
        setItems(compiled);
      }
    });
  }, []);

  const filteredItems = items.filter(item => {
    if (activeType === 'VIDEO') return item.type === 'video';
    if (activeType === 'PHOTO') return item.type === 'photo';
    return true;
  });

  const total = filteredItems.length || 1;

  const nextSlide = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Touch / Drag Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragDelta(clientX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDelta > 45) {
      prevSlide();
    } else if (dragDelta < -45) {
      nextSlide();
    }
    setDragDelta(0);
  };

  const currentItem = filteredItems[activeIndex] || filteredItems[0];

  if (filteredItems.length === 0) return null;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-slate-200 dark:border-zinc-800/90 select-none secure-media"
    >
      {/* 3D Showcase Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest bg-gradient-to-r from-purple-500/15 to-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 3D Production & Reel Stage
          </div>
          <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight mt-2">
            Commercial Cinema & Fashion Shoots
          </h3>
          <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Drag to rotate high-energy video reels with Destiny & Dapflix, alongside high-fashion editorial lookbooks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-800 shrink-0 shadow-sm">
          <button
            onClick={() => {
              setActiveType('ALL');
              setActiveIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeType === 'ALL'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            All Creative ({items.length})
          </button>
          <button
            onClick={() => {
              setActiveType('VIDEO');
              setActiveIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeType === 'VIDEO'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Video className="w-3 h-3" /> Video Reels ({items.filter(i => i.type === 'video').length})
          </button>
          <button
            onClick={() => {
              setActiveType('PHOTO');
              setActiveIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeType === 'PHOTO'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" /> Lookbooks ({items.filter(i => i.type === 'photo').length})
          </button>
        </div>
      </div>

      {/* 3D Runway Carousel Stage */}
      <div
        className="coverflow-stage relative w-full h-[440px] sm:h-[500px] lg:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing [perspective:1800px] overflow-hidden rounded-3xl bg-slate-50 dark:bg-zinc-950/90 border border-slate-200 dark:border-zinc-900 shadow-2xl backdrop-blur-2xl"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-amber-500/5 to-black/80 pointer-events-none" />

        {/* 3D Cards */}
        {filteredItems.map((item, i) => {
          let offset = i - activeIndex;
          if (offset < -Math.floor(total / 2)) offset += total;
          if (offset > Math.floor(total / 2)) offset -= total;

          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 2;

          if (!isVisible) return null;

          const translateX = offset * 270 + (isDragging ? dragDelta * 0.5 : 0);
          const translateZ = -absOffset * 170;
          const rotateY = offset * -34;
          const scale = 1 - absOffset * 0.13;
          const transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
          const zIndex = 50 - absOffset * 10;
          const opacity = Math.max(0, 1 - absOffset * 0.25);
          const filterStyle = absOffset > 0 ? `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.2})` : 'none';

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isCenter) setActiveIndex(i);
              }}
              style={{
                transform,
                zIndex,
                opacity,
                filter: filterStyle,
                transformStyle: 'preserve-3d',
                transition: isDragging ? 'none' : 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className={`coverflow-card absolute w-[270px] sm:w-[320px] lg:w-[370px] h-[370px] sm:h-[440px] lg:h-[480px] rounded-3xl p-1 bg-gradient-to-b ${
                isCenter
                  ? item.type === 'video'
                    ? 'from-purple-500 via-pink-500/50 to-zinc-900 shadow-[0_25px_60px_-15px_rgba(168,85,247,0.45)] ring-2 ring-purple-400'
                    : 'from-amber-400 via-amber-500/50 to-zinc-900 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.45),0_15px_30px_-10px_rgba(0,0,0,0.15)] ring-2 ring-amber-400'
                  : 'from-zinc-700/60 to-zinc-900/90 shadow-xl border border-zinc-700/80 dark:border-zinc-800'
              } group cursor-pointer`}
            >
              <div className="w-full h-full bg-zinc-950 rounded-[22px] overflow-hidden relative flex flex-col justify-between p-5 select-none text-white">
                {/* Media Image */}
                <img
                  src={item.coverImage}
                  alt={item.title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className={`absolute inset-0 w-full h-full object-cover secure-image pointer-events-none transition-transform duration-700 ${
                    isCenter ? 'scale-105 group-hover:scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/25 pointer-events-none" />

                {/* Video Play Overlay */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isCenter
                          ? 'bg-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.8)] scale-110'
                          : 'bg-black/60 text-white border border-white/20'
                      }`}
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="card-client-badge px-3 py-1 rounded-full bg-black/85 text-white text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur border border-white/20 shadow-md">
                    {item.client}
                  </span>

                  {item.type === 'video' ? (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-black font-mono uppercase tracking-wider flex items-center gap-1 shadow-lg border border-purple-300/30">
                      <Film className="w-3 h-3" /> {item.viewsCount} REEL
                    </span>
                  ) : (
                    <span className="card-frames-badge px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black font-mono uppercase tracking-wider flex items-center gap-1 shadow-lg border border-amber-300/40">
                      <Star className="w-3 h-3 fill-black" /> {item.gallery?.length || 8} FRAMES
                    </span>
                  )}
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-3">
                  <div className="space-y-1">
                    <div className="card-category text-[11px] font-extrabold font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5 drop-shadow">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> {item.category}
                    </div>
                    <h3 className="card-title text-lg sm:text-xl font-black text-white uppercase tracking-tight font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      {item.title}
                    </h3>
                    <p className="card-desc text-[11px] text-zinc-200 line-clamp-2 leading-relaxed drop-shadow">
                      {item.description}
                    </p>
                  </div>

                  {isCenter && (
                    <div className="pt-2 flex items-center gap-2">
                      {item.type === 'video' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideoModal(item);
                          }}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Watch Video Reel
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePhotoModal({
                              images: item.gallery || [item.coverImage],
                              index: 0,
                              title: item.title,
                              client: item.client,
                              category: item.category
                            });
                          }}
                          className="card-action-btn flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Open Lookbook
                        </button>
                      )}

                      {item.slug && (
                        <Link
                          to={`/portfolio/${item.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 rounded-xl bg-black/80 hover:bg-amber-400 hover:text-black text-white border border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-md shrink-0"
                          title="View Project Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="coverflow-arrow-btn absolute left-3 sm:left-6 z-40 w-12 h-12 rounded-full bg-white/95 dark:bg-black/70 hover:bg-amber-400 text-slate-800 dark:text-white hover:text-black border border-slate-300 dark:border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-2xl"
          aria-label="Previous Project"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="coverflow-arrow-btn absolute right-3 sm:right-6 z-40 w-12 h-12 rounded-full bg-white/95 dark:bg-black/70 hover:bg-amber-400 text-slate-800 dark:text-white hover:text-black border border-slate-300 dark:border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-2xl"
          aria-label="Next Project"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Explore Link */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-zinc-400">
        <span className="font-mono">
          Showing 3D showcase item <span className="text-amber-600 dark:text-amber-400 font-bold">#{activeIndex + 1}</span> of {filteredItems.length}
        </span>

        <Link
          to="/portfolio"
          className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-500 font-bold uppercase tracking-wider"
        >
          <span>Explore All Video Reels & Photoshoots in Our Work</span> <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* VIDEO MODAL */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block font-mono">
                  {activeVideoModal.client} • {activeVideoModal.viewsCount} Views
                </span>
                <h3 className="text-lg font-bold text-white font-display">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-950">
              <img
                src={activeVideoModal.coverImage}
                alt={activeVideoModal.title}
                draggable={false}
                className="w-full h-full object-cover secure-image"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <a
                  href={activeVideoModal.instagramUrl || activeVideoModal.videoUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </a>
                <p className="text-xs text-white font-bold">Watch full vertical reel on Instagram</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">{activeVideoModal.description}</p>

            <a
              href={activeVideoModal.instagramUrl || activeVideoModal.videoUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity"
            >
              <Instagram className="w-4 h-4" /> Watch on Instagram ↗ ({activeVideoModal.viewsCount})
            </a>
          </div>
        </div>
      )}

      {/* PROTECTED 4K LOOKBOOK MODAL */}
      {activePhotoModal && (
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none secure-media"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                {activePhotoModal.category} • Frame {activePhotoModal.index + 1} of {activePhotoModal.images.length}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {activePhotoModal.title} ({activePhotoModal.client})
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Protected Lookbook
              </span>

              <button
                onClick={() => setActivePhotoModal(null)}
                className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-rose-600 text-white flex items-center justify-center transition-colors border border-zinc-800 shadow-lg"
                title="Close Lookbook"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Stage */}
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
          >
            <div className="relative max-w-full max-h-[72vh] flex items-center justify-center">
              <img
                src={activePhotoModal.images[activePhotoModal.index]}
                alt={`Lookbook ${activePhotoModal.index + 1}`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-scaleUp secure-image pointer-events-none"
              />
              <div
                className="secure-shield"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 pointer-events-none select-none tracking-widest uppercase z-30 whitespace-nowrap shadow-lg">
                🔒 VELAMETRIC GLOBAL • PROTECTED WORK
              </div>
            </div>

            {/* Arrows */}
            {activePhotoModal.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActivePhotoModal({
                      ...activePhotoModal,
                      index: (activePhotoModal.index - 1 + activePhotoModal.images.length) % activePhotoModal.images.length
                    })
                  }
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center backdrop-blur border border-white/20 transition-all shadow-xl z-40"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() =>
                    setActivePhotoModal({
                      ...activePhotoModal,
                      index: (activePhotoModal.index + 1) % activePhotoModal.images.length
                    })
                  }
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center backdrop-blur border border-white/20 transition-all shadow-xl z-40"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-4xl mx-auto scrollbar-none">
            {activePhotoModal.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoModal({ ...activePhotoModal, index: idx })}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all relative ${
                  activePhotoModal.index === idx ? 'border-amber-400 scale-110 shadow-lg' : 'border-zinc-800 opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover secure-image pointer-events-none"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
