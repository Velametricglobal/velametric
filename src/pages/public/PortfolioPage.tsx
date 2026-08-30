import React, { useEffect, useState } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe, Sparkles, Video, Play, Instagram, ArrowRight, Film } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'WEB' | 'VIDEO'>('ALL');
  const [activeReelModal, setActiveReelModal] = useState<VideoReel | null>(null);

  useEffect(() => {
    portfolioService.getProjects().then(setProjects);
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filter === 'WEB') return p.project_type === 'web_app' || p.live_url;
    if (filter === 'VIDEO') return p.project_type === 'video_production' || p.production_partner;
    return true;
  });

  return (
    <div className="py-10 sm:py-16 lg:py-20 max-w-[1320px] mx-auto px-4 sm:px-6 font-sans space-y-10 sm:space-y-16 selection:bg-white selection:text-black">
      
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-zinc-900 text-amber-400 border border-zinc-800 backdrop-blur">
          <Sparkles className="w-3.5 h-3.5" /> Velametric Global Showcase
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tight font-display">
          OUR WORK
        </h1>

        <p className="text-zinc-400 text-sm sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-2">
          Featured web platforms, specialized industry CRM systems, and commercial video reels with Destiny, Dapflix & Ekraahee Films.
        </p>
      </div>

      {/* 2. CATEGORY SWITCHER PILLS */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target ${
            filter === 'ALL' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All Work ({projects.length})
        </button>
        <button
          onClick={() => setFilter('WEB')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target ${
            filter === 'WEB' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Web & CRM Builds
        </button>
        <button
          onClick={() => setFilter('VIDEO')}
          className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 touch-target ${
            filter === 'VIDEO' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Video Production & Reels
        </button>
      </div>

      {/* 3. WORK SHOWCASE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xl backdrop-blur">
            <div>
              {/* Media Thumbnail Container */}
              <div className="h-60 relative overflow-hidden bg-zinc-950">
                <img
                  src={proj.featured_image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                
                {/* Client Tag */}
                <span className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-zinc-950/90 text-white rounded-full border border-zinc-700 backdrop-blur">
                  {proj.client}
                </span>

                {/* Type Badge */}
                {proj.project_type === 'video_production' ? (
                  <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-purple-500 text-white rounded-full font-mono flex items-center gap-1">
                    <Video className="w-3 h-3" /> VIDEO REELS
                  </span>
                ) : (
                  <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-black rounded-full font-mono">
                    LIVE HOSTED ↗
                  </span>
                )}

                {/* Video Play Button Overlay */}
                {proj.project_type === 'video_production' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={proj.instagram_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl"
                    >
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </a>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{proj.description}</p>

                {/* Reels Strip */}
                {proj.video_reels && proj.video_reels.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1 font-mono">
                      <Film className="w-3 h-3 text-amber-400" /> Featured Video Reels
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {proj.video_reels.map((reel) => (
                        <div
                          key={reel.id}
                          onClick={() => setActiveReelModal(reel)}
                          className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center gap-2 group/reel"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 relative bg-zinc-900">
                            <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>
                          <div className="truncate">
                            <div className="text-[10px] font-bold text-white truncate group-hover/reel:text-amber-400">{reel.title}</div>
                            <div className="text-[9px] text-zinc-500 font-mono">{reel.views_count} Views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-6 pt-0 space-y-3">
              {proj.project_type === 'video_production' && proj.instagram_url ? (
                <a
                  href={proj.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl"
                >
                  <Instagram className="w-4 h-4" /> Our Work ↗
                </a>
              ) : proj.live_url ? (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl"
                >
                  <Globe className="w-4 h-4 text-emerald-600" /> Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}

              <div className="text-center">
                <Link
                  to={`/portfolio/${proj.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white font-bold transition-colors"
                >
                  View Full Case Study <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reel Modal Overlay */}
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
              <Instagram className="w-4 h-4" /> Our Work ↗ ({activeReelModal.views_count} Views)
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
