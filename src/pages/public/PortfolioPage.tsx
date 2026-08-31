import React, { useEffect, useState, useCallback } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Globe,
  Sparkles,
  Video,
  Play,
  Instagram,
  ArrowRight,
  Film,
  Camera,
  Images,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  Flame,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PHOTOSHOOT' | 'WEB' | 'VIDEO'>('PHOTOSHOOT');
  const [photoshootViewMode, setPhotoshootViewMode] = useState<'3D' | 'GRID'>('3D');
  const [activeReelModal, setActiveReelModal] = useState<VideoReel | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<{ images: string[]; index: number; title: string; client?: string; category?: string } | null>(null);

  // 3D Photoshoot Stage Active Index & Drag State
  const [active3DIndex, setActive3DIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);

  useEffect(() => {
    portfolioService.getProjects().then((projs) => {
      setProjects(projs);
    });
  }, []);

  const photoshootProjects = projects.filter(
    p => p.project_type === 'photoshoot' || (p.gallery && p.gallery.length > 0 && !p.live_url && !p.production_partner)
  );

  const filteredProjects = projects.filter(p => {
    if (filter === 'WEB') return p.project_type === 'web_app' || p.live_url;
    if (filter === 'VIDEO') return p.project_type === 'video_production' || p.production_partner;
    if (filter === 'PHOTOSHOOT') return p.project_type === 'photoshoot' || (p.gallery && p.gallery.length > 0 && !p.live_url && !p.production_partner);
    return true;
  });

  const total3D = photoshootProjects.length || 1;

  const next3DSlide = useCallback(() => {
    setActive3DIndex(prev => (prev + 1) % total3D);
  }, [total3D]);

  const prev3DSlide = useCallback(() => {
    setActive3DIndex(prev => (prev - 1 + total3D) % total3D);
  }, [total3D]);

  // Touch / Drag Handlers for 3D Photoshoot Stage
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
    if (dragDelta > 50) {
      prev3DSlide();
    } else if (dragDelta < -50) {
      next3DSlide();
    }
    setDragDelta(0);
  };

  const current3DProject = photoshootProjects[active3DIndex] || photoshootProjects[0];

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="py-10 sm:py-16 lg:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 font-sans space-y-10 sm:space-y-14 selection:bg-amber-400 selection:text-black secure-media select-none"
    >
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Velametric Global Showcase
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display">
          OUR WORK
        </h1>

        <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto px-2">
          Explore high-fashion photoshoots, commercial video reels with Destiny & Dapflix, and enterprise web and CRM platforms.
        </p>
      </div>

      {/* 2. CATEGORY SWITCHER PILLS */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
        <button
          onClick={() => setFilter('PHOTOSHOOT')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 touch-target ${
            filter === 'PHOTOSHOOT'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          <Camera className="w-4 h-4 text-black dark:text-inherit" /> Fashion & Photoshoots (3D Stage)
        </button>

        <button
          onClick={() => setFilter('ALL')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target ${
            filter === 'ALL'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-black shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          All Grid Work ({projects.length})
        </button>

        <button
          onClick={() => setFilter('WEB')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target ${
            filter === 'WEB'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-black shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Web & CRM Builds
        </button>

        <button
          onClick={() => setFilter('VIDEO')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 touch-target ${
            filter === 'VIDEO'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Video Production & Reels
        </button>
      </div>

      {/* 3. CONDITIONAL RENDER: 3D ANIMATED PHOTOSHOOT STAGE */}
      {filter === 'PHOTOSHOOT' && photoshootViewMode === '3D' && photoshootProjects.length > 0 ? (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Sub-Header with View Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Interactive 3D Runway Stage • {photoshootProjects.length} Editorial Lookbooks</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <button
                onClick={() => setPhotoshootViewMode('3D')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-400 text-black shadow-sm flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 fill-black" /> 3D Stage View
              </button>
              <button
                onClick={() => setPhotoshootViewMode('GRID')}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              >
                ⊞ Grid View
              </button>
            </div>
          </div>

          {/* 3D Runway Stage */}
          <div
            className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing [perspective:1800px] overflow-hidden rounded-3xl bg-zinc-950/80 border border-zinc-900 shadow-2xl backdrop-blur-2xl"
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Atmosphere Glows */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-black/60 pointer-events-none" />

            {/* 3D Cards Map */}
            {photoshootProjects.map((proj, i) => {
              let offset = i - active3DIndex;
              if (offset < -Math.floor(total3D / 2)) offset += total3D;
              if (offset > Math.floor(total3D / 2)) offset -= total3D;

              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              const isVisible = absOffset <= 2;

              if (!isVisible) return null;

              const translateX = offset * 280 + (isDragging ? dragDelta * 0.5 : 0);
              const translateZ = -absOffset * 180;
              const rotateY = offset * -36;
              const scale = 1 - absOffset * 0.14;
              const transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
              const zIndex = 50 - absOffset * 10;
              const opacity = Math.max(0, 1 - absOffset * 0.25);
              const filterStyle = absOffset > 0 ? `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.2})` : 'none';

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    if (!isCenter) setActive3DIndex(i);
                  }}
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    filter: filterStyle,
                    transformStyle: 'preserve-3d',
                    transition: isDragging ? 'none' : 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                  }}
                  className={`absolute w-[280px] sm:w-[340px] lg:w-[390px] h-[390px] sm:h-[460px] lg:h-[510px] rounded-3xl p-1 bg-gradient-to-b ${
                    isCenter
                      ? 'from-amber-400 via-amber-500/50 to-zinc-900 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.4),0_0_35px_rgba(245,158,11,0.2)] ring-2 ring-amber-400'
                      : 'from-zinc-700/60 to-zinc-900/90 shadow-xl border border-zinc-800'
                  } group cursor-pointer`}
                >
                  <div className="w-full h-full bg-zinc-950 rounded-[22px] overflow-hidden relative flex flex-col justify-between p-5 select-none">
                    {/* Background Cover */}
                    <img
                      src={proj.featured_image}
                      alt={proj.title}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className={`absolute inset-0 w-full h-full object-cover secure-image pointer-events-none transition-transform duration-700 ${
                        isCenter ? 'scale-105 group-hover:scale-110' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/80 text-white text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur border border-white/20">
                        {proj.gallery?.length || 8} Frames
                      </span>

                      <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black font-mono uppercase tracking-wider flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 fill-black" /> PHOTOSHOOT
                      </span>
                    </div>

                    {/* Bottom Details */}
                    <div className="relative z-10 space-y-3">
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" /> {proj.industry}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display drop-shadow-md">
                          {proj.title}
                        </h3>
                        <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                          {proj.client} • {proj.description}
                        </p>
                      </div>

                      {isCenter && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoModal({
                                images: proj.gallery && proj.gallery.length > 0 ? proj.gallery : [proj.featured_image],
                                index: 0,
                                title: proj.title,
                                client: proj.client,
                                category: proj.industry
                              });
                            }}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all"
                          >
                            <Eye className="w-4 h-4" /> Open 4K Lookbook
                          </button>

                          <Link
                            to={`/portfolio/${proj.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-11 h-11 rounded-xl bg-black/70 hover:bg-white hover:text-black text-white border border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-md"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Navigation Floating Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev3DSlide();
              }}
              className="absolute left-3 sm:left-6 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black border border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-2xl"
              aria-label="Previous Lookbook"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                next3DSlide();
              }}
              className="absolute right-3 sm:right-6 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black border border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-2xl"
              aria-label="Next Lookbook"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* 4. CLASSIC WORK SHOWCASE GRID */
        <div className="space-y-6">
          {filter === 'PHOTOSHOOT' && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase font-mono">
                Showing Photoshoot Grid View
              </span>
              <button
                onClick={() => setPhotoshootViewMode('3D')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-black flex items-center gap-1 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" /> Switch to 3D Runway Stage
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1400px]">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group relative bg-white/95 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-xl transform-gpu transition-all duration-500 ease-out hover:-translate-y-3 hover:rotate-x-[3deg] hover:rotate-y-[-1.5deg] hover:shadow-[0_25px_60px_-12px_rgba(245,158,11,0.28),0_18px_36px_-12px_rgba(0,0,0,0.6)] hover:border-amber-400/80 dark:hover:border-amber-500/60"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-400/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl z-20" />

                <div>
                  <div className="h-64 sm:h-72 relative overflow-hidden bg-slate-100 dark:bg-zinc-950 rounded-t-3xl select-none">
                    <img
                      src={proj.featured_image}
                      alt={proj.title}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out secure-image pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                    
                    <span className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-black/85 text-white rounded-full border border-white/20 backdrop-blur-md shadow-lg transform group-hover:translate-z-10 group-hover:scale-105 transition-all">
                      {proj.client}
                    </span>

                    {proj.project_type === 'photoshoot' ? (
                      <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-black rounded-full font-mono flex items-center gap-1 shadow-xl border border-amber-300/40 transform group-hover:scale-105 transition-all">
                        <Camera className="w-3.5 h-3.5" /> PHOTOSHOOT
                      </span>
                    ) : proj.project_type === 'video_production' ? (
                      <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-mono flex items-center gap-1 shadow-xl border border-purple-400/30 transform group-hover:scale-105 transition-all">
                        <Video className="w-3.5 h-3.5" /> VIDEO REELS
                      </span>
                    ) : (
                      <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-black rounded-full font-mono shadow-xl border border-emerald-300/30 transform group-hover:scale-105 transition-all">
                        LIVE HOSTED ↗
                      </span>
                    )}

                    {proj.project_type === 'photoshoot' && proj.gallery && proj.gallery.length > 0 && (
                      <button
                        onClick={() =>
                          setActivePhotoModal({
                            images: proj.gallery || [],
                            index: 0,
                            title: proj.title || 'Photoshoot',
                            client: proj.client,
                            category: proj.industry
                          })
                        }
                        className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-amber-400 text-white hover:text-black border border-white/25 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Lookbook ({proj.gallery.length})
                      </button>
                    )}

                    {proj.project_type === 'video_production' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <a
                          href={proj.instagram_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:scale-115 hover:bg-amber-500 hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                        >
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                      <span>{proj.industry}</span>
                      <span>•</span>
                      <span>{proj.completion_date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {proj.project_type === 'photoshoot' && proj.gallery && proj.gallery.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-1 font-mono">
                          <Images className="w-3 h-3 text-amber-500" /> Lookbook ({proj.gallery.length} Frames)
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {proj.gallery.slice(0, 4).map((thumb, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                setActivePhotoModal({
                                  images: proj.gallery || [],
                                  index: idx,
                                  title: proj.title,
                                  client: proj.client,
                                  category: proj.industry
                                })
                              }
                              className="h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800 cursor-pointer hover:border-amber-400 hover:scale-105 transition-all relative group/thumb shadow-sm"
                            >
                              <img
                                src={thumb}
                                alt="Thumb"
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                className="w-full h-full object-cover secure-image pointer-events-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {proj.deliverables && proj.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.deliverables.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800/80 mt-4 pt-4">
                  {proj.live_url ? (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" /> Visit Live Project <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : proj.instagram_url ? (
                    <a
                      href={proj.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" /> View Reel on Instagram <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> {proj.gallery?.length || 8} Lookbook Frames
                    </span>
                  )}

                  <Link
                    to={`/portfolio/${proj.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors group-hover:translate-x-1 duration-300"
                  >
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROTECTED 4K CINEMATIC LOOKBOOK MODAL */}
      {activePhotoModal && (
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none secure-media"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                {activePhotoModal.category || 'Photoshoot'} • Frame {activePhotoModal.index + 1} of {activePhotoModal.images.length}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {activePhotoModal.title} {activePhotoModal.client ? `(${activePhotoModal.client})` : ''}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
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

          {/* Main Zoom Stage with Invisible Anti-Save Shield */}
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

          {/* Bottom Scrubber */}
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

      {/* 5. REEL MODAL OVERLAY */}
      {activeReelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest block font-mono">
                  {activeReelModal.partner_name}
                </span>
                <h3 className="text-base font-bold text-white font-display">{activeReelModal.title}</h3>
              </div>
              <button onClick={() => setActiveReelModal(null)} className="text-zinc-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div className="h-72 rounded-2xl overflow-hidden relative border border-zinc-800 bg-zinc-950">
              <img src={activeReelModal.thumbnail_url} alt={activeReelModal.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <a
                  href={activeReelModal.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </a>
                <p className="text-xs text-white font-bold">Watch reel directly on Instagram</p>
              </div>
            </div>

            <a
              href={activeReelModal.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 w-full py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider"
            >
              <Instagram className="w-4 h-4" /> Watch on Instagram ↗ ({activeReelModal.views_count} Views)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
