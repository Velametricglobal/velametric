import React, { useEffect, useState } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe, Sparkles, Video, Play, Instagram, ArrowRight, Film, Camera, Images, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WEB' | 'VIDEO' | 'PHOTOSHOOT'>('ALL');
  const [activeReelModal, setActiveReelModal] = useState<VideoReel | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<{ images: string[]; index: number; title: string } | null>(null);

  useEffect(() => {
    portfolioService.getProjects().then(setProjects);
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filter === 'WEB') return p.project_type === 'web_app' || p.live_url;
    if (filter === 'VIDEO') return p.project_type === 'video_production' || p.production_partner;
    if (filter === 'PHOTOSHOOT') return p.project_type === 'photoshoot' || (p.gallery && p.gallery.length > 0 && !p.live_url && !p.production_partner);
    return true;
  });

  return (
    <div className="py-10 sm:py-16 lg:py-20 max-w-[1320px] mx-auto px-4 sm:px-6 font-sans space-y-10 sm:space-y-16 selection:bg-amber-400 selection:text-black">
      
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-amber-500/10 dark:bg-zinc-900 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-zinc-800 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" /> Velametric Global Showcase
          </div>

          <Link
            to="/admin/portfolio"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-slate-900 dark:bg-white hover:bg-amber-500 text-white dark:text-black dark:hover:bg-amber-400 transition-all shadow-sm"
          >
            <Images className="w-3.5 h-3.5 text-amber-400 dark:text-black" /> Manage Photos & Profile ⚙️
          </Link>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-display">
          OUR WORK
        </h1>

        <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-2">
          Featured web platforms, specialized CRM systems, high-fashion photoshoots, and commercial video reels with Destiny, Dapflix & Ekraahee Films.
        </p>
      </div>

      {/* 2. CATEGORY SWITCHER PILLS */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target ${
            filter === 'ALL'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-black font-extrabold shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          All Work ({projects.length})
        </button>

        <button
          onClick={() => setFilter('PHOTOSHOOT')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 touch-target ${
            filter === 'PHOTOSHOOT'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Fashion & Photoshoots
        </button>

        <button
          onClick={() => setFilter('WEB')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target ${
            filter === 'WEB'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-black font-extrabold shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          Web & CRM Builds
        </button>

        <button
          onClick={() => setFilter('VIDEO')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 touch-target ${
            filter === 'VIDEO'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-xl scale-105'
              : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Video Production & Reels
        </button>
      </div>

      {/* 3. WORK SHOWCASE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1400px]">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="group relative bg-white/95 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl backdrop-blur-xl transform-gpu transition-all duration-500 ease-out hover:-translate-y-3 hover:rotate-x-[3deg] hover:rotate-y-[-1.5deg] hover:shadow-[0_25px_60px_-12px_rgba(245,158,11,0.28),0_18px_36px_-12px_rgba(0,0,0,0.6)] hover:border-amber-400/80 dark:hover:border-amber-500/60"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D Holographic Glare Sheen Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-400/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl z-20" />

            <div>
              {/* Media Thumbnail Container with 3D Depth */}
              <div className="h-64 sm:h-72 relative overflow-hidden bg-slate-100 dark:bg-zinc-950 rounded-t-3xl">
                <img
                  src={proj.featured_image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                
                {/* Floating 3D Client Tag */}
                <span className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-black/85 text-white rounded-full border border-white/20 backdrop-blur-md shadow-lg transform group-hover:translate-z-10 group-hover:scale-105 transition-all">
                  {proj.client}
                </span>

                {/* Floating 3D Type Badge */}
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

                {/* Photoshoot Quick View 3D Overlay Button */}
                {proj.project_type === 'photoshoot' && proj.gallery && proj.gallery.length > 0 && (
                  <button
                    onClick={() => setActivePhotoModal({ images: proj.gallery || [], index: 0, title: proj.title || 'Photoshoot' })}
                    className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-amber-400 text-white hover:text-black border border-white/25 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Gallery ({proj.gallery.length})
                  </button>
                )}

                {/* Video Play Button Overlay */}
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

              {/* Card Body */}
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

                {/* Photoshoot Gallery 3D Pop-Out Thumbnail Strip */}
                {proj.project_type === 'photoshoot' && proj.gallery && proj.gallery.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-1 font-mono">
                      <Images className="w-3 h-3 text-amber-500" /> Shoot Lookbook ({proj.gallery.length} High-Res Frames)
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {proj.gallery.slice(0, 4).map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setActivePhotoModal({ images: proj.gallery || [], index: i, title: proj.title || 'Photoshoot' })}
                          className="h-14 rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-zinc-800 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/50 hover:shadow-lg hover:-translate-y-1 transition-all relative group/thumb"
                        >
                          <img src={imgUrl} alt={`Frame ${i + 1}`} className="w-full h-full object-cover group-hover/thumb:scale-115 transition-transform duration-300" />
                          {i === 3 && proj.gallery && proj.gallery.length > 4 && (
                            <div className="absolute inset-0 bg-black/65 text-white text-[10px] font-extrabold flex items-center justify-center font-mono">
                              +{proj.gallery.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reels Strip */}
                {proj.video_reels && proj.video_reels.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 flex items-center gap-1 font-mono">
                      <Film className="w-3 h-3 text-amber-400" /> Featured Video Reels
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {proj.video_reels.map((reel) => (
                        <div
                          key={reel.id}
                          onClick={() => setActiveReelModal(reel)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-amber-400 cursor-pointer flex items-center gap-2 group/reel hover:-translate-y-0.5 hover:shadow-md transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 relative bg-zinc-900">
                            <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                          <div className="truncate">
                            <div className="text-[10px] font-bold text-slate-900 dark:text-white truncate group-hover/reel:text-amber-500">{reel.title}</div>
                            <div className="text-[9px] text-slate-500 dark:text-zinc-500 font-mono">{reel.views_count} Views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions with 3D Button Depth */}
            <div className="p-6 pt-0 space-y-3 z-10">
              {proj.project_type === 'photoshoot' ? (
                <button
                  onClick={() => setActivePhotoModal({ images: proj.gallery || [proj.featured_image || ''], index: 0, title: proj.title || 'Photoshoot' })}
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-all shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Eye className="w-4 h-4" /> Open High-Res Lookbook ({proj.gallery?.length || 1} Photos)
                </button>
              ) : proj.project_type === 'video_production' && proj.instagram_url ? (
                <a
                  href={proj.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  <Instagram className="w-4 h-4" /> Watch Reels on Instagram ↗
                </a>
              ) : proj.live_url ? (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  <Globe className="w-4 h-4 text-emerald-500" /> Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}

              <div className="text-center">
                <Link
                  to={`/portfolio/${proj.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white font-bold transition-colors"
                >
                  View Full Case Study & Credits <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. PHOTOSHOOT LIGHTBOX MODAL */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">
                Velametric Photoshoot Lookbook
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {activePhotoModal.title}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                {activePhotoModal.index + 1} / {activePhotoModal.images.length}
              </span>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="flex-1 flex items-center justify-center relative my-4 overflow-hidden">
            <button
              onClick={() => setActivePhotoModal({
                ...activePhotoModal,
                index: (activePhotoModal.index - 1 + activePhotoModal.images.length) % activePhotoModal.images.length
              })}
              className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center transition-all shadow-2xl border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={activePhotoModal.images[activePhotoModal.index]}
              alt={`Photoshoot Frame ${activePhotoModal.index + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />

            <button
              onClick={() => setActivePhotoModal({
                ...activePhotoModal,
                index: (activePhotoModal.index + 1) % activePhotoModal.images.length
              })}
              className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center transition-all shadow-2xl border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-4xl mx-auto scrollbar-none">
            {activePhotoModal.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoModal({ ...activePhotoModal, index: idx })}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activePhotoModal.index === idx ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
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
