import React, { useEffect, useState } from 'react';
import { PortfolioProject, VideoReel } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { ExternalLink, Globe, Sparkles, Video, Play, Instagram, ArrowRight, Film, Camera, X, ChevronLeft, ChevronRight, CheckCircle2, Calendar, Phone, MessageSquare, Wand2, Eye, ZoomIn, ZoomOut } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'FASHION' | 'WEB' | 'VIDEO'>('ALL');
  const [activeReelModal, setActiveReelModal] = useState<VideoReel | null>(null);

  // Photoshoot Lightbox Modal State
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    title: string;
    description?: string;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  });

  // Retouching View Mode: 'retouched' (default) vs 'raw'
  const [isRawView, setIsRawView] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    portfolioService.getProjects().then(setProjects);
  }, []);

  const openLightbox = (images: string[], index: number, title: string, description?: string) => {
    setLightboxData({
      isOpen: true,
      images,
      currentIndex: index,
      title,
      description
    });
    setIsRawView(false);
    setIsZoomed(false);
  };

  const handleNextImage = () => {
    setLightboxData(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
    setIsZoomed(false);
  };

  const handlePrevImage = () => {
    setLightboxData(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
    setIsZoomed(false);
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'FASHION') return p.project_type === 'fashion_photography' || p.id.includes('fashion');
    if (filter === 'WEB') return p.project_type === 'web_app' || p.live_url;
    if (filter === 'VIDEO') return p.project_type === 'video_production' || p.production_partner;
    return true;
  });

  const fashionShoots = projects.filter(p => p.project_type === 'fashion_photography' || p.id.includes('fashion'));

  // Calculate current image URL based on Retouched vs RAW toggle
  const currentImageUrl = lightboxData.images[lightboxData.currentIndex] || '';
  const displayImageUrl = isRawView && currentImageUrl.includes('/images/portfolio/')
    ? currentImageUrl.replace('/images/portfolio/', '/images/portfolio/originals/')
    : currentImageUrl;

  return (
    <div className="py-10 sm:py-16 lg:py-20 max-w-[1360px] mx-auto px-4 sm:px-6 font-sans space-y-10 sm:space-y-16 selection:bg-white selection:text-black">
      
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-zinc-900 text-amber-400 border border-zinc-800 backdrop-blur">
          <Sparkles className="w-3.5 h-3.5" /> Velametric Global Work Showcase
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tight font-display">
          PORTFOLIO & WORK
        </h1>

        <p className="text-zinc-400 text-sm sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-2">
          High-fashion model portfolio shoots with studio-grade skin retouching & dynamic lighting, custom enterprise CRM platforms, and commercial video reels with Destiny, Dapflix & Ekraahee Films.
        </p>

        {/* Studio Retouching Quality Seal */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold">
          <Wand2 className="w-3.5 h-3.5" /> Master Color Graded • Radiant Skin Retouching • Studio HDR Lighting
        </div>
      </div>

      {/* 2. CATEGORY SWITCHER PILLS (With Fashion Shoots) */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center gap-2 sm:gap-3 overflow-x-auto custom-scrollbar pb-2 sm:pb-0">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target whitespace-nowrap ${
            filter === 'ALL' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All Work ({projects.length})
        </button>

        <button
          onClick={() => setFilter('FASHION')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 touch-target whitespace-nowrap ${
            filter === 'FASHION' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold shadow-2xl scale-105 shadow-amber-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" /> Fashion & Model Shoots ({fashionShoots.length})
        </button>

        <button
          onClick={() => setFilter('WEB')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all touch-target whitespace-nowrap ${
            filter === 'WEB' ? 'bg-white text-black font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          Web & CRM Platforms
        </button>

        <button
          onClick={() => setFilter('VIDEO')}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 touch-target whitespace-nowrap ${
            filter === 'VIDEO' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold shadow-2xl scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> Video Production & Reels
        </button>
      </div>

      {/* 3. WORK SHOWCASE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((proj) => {
          const isFashion = proj.project_type === 'fashion_photography' || proj.id.includes('fashion');
          const isVideo = proj.project_type === 'video_production';

          return (
            <div
              key={proj.id}
              className={`bg-zinc-900/90 border rounded-3xl overflow-hidden group transition-all flex flex-col justify-between shadow-2xl backdrop-blur ${
                isFashion ? 'border-amber-500/40 hover:border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.08)]' : 'border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <div>
                {/* Media Thumbnail Container with Lightbox Trigger */}
                <div
                  className="h-72 sm:h-80 relative overflow-hidden bg-zinc-950 cursor-pointer"
                  onClick={() => {
                    if (isFashion && proj.gallery && proj.gallery.length > 0) {
                      openLightbox(proj.gallery, 0, proj.title, proj.description);
                    }
                  }}
                >
                  <img
                    src={proj.featured_image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Client Tag */}
                  <span className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 bg-zinc-950/90 text-white rounded-full border border-zinc-700 backdrop-blur">
                    {proj.client}
                  </span>

                  {/* Type Badge */}
                  {isFashion ? (
                    <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-amber-400 text-black rounded-full font-mono flex items-center gap-1 shadow-lg">
                      <Sparkles className="w-3 h-3" /> STUDIO RETOUCHED
                    </span>
                  ) : isVideo ? (
                    <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-purple-500 text-white rounded-full font-mono flex items-center gap-1">
                      <Video className="w-3 h-3" /> VIDEO REELS
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 text-[10px] font-extrabold px-3 py-1 bg-emerald-500 text-black rounded-full font-mono">
                      LIVE HOSTED ↗
                    </span>
                  )}

                  {/* Fashion Shoot Lightbox Tap Prompt */}
                  {isFashion && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                      <span className="px-4 py-2 rounded-full bg-white/90 text-black font-extrabold text-xs shadow-2xl flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                        <Wand2 className="w-3.5 h-3.5 text-amber-500" /> View Master Gallery ({proj.gallery?.length || 1} Frames)
                      </span>
                    </div>
                  )}

                  {/* Video Play Button Overlay */}
                  {isVideo && (
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

                  {/* Multi-Photo Gallery Thumbnail Strip for Fashion Shoots */}
                  {isFashion && proj.gallery && proj.gallery.length > 1 && (
                    <div className="pt-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1 font-mono">
                        <Camera className="w-3 h-3" /> Shoot Gallery Preview ({proj.gallery.length} Frames)
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {proj.gallery.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() => openLightbox(proj.gallery!, imgIdx, proj.title, proj.description)}
                            className="h-20 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-400 cursor-pointer relative group/thumb transition-all shadow-md"
                          >
                            <img src={imgUrl} alt={`Thumbnail ${imgIdx + 1}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reels Strip */}
                  {proj.video_reels && proj.video_reels.length > 0 && !isFashion && (
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
                {isFashion ? (
                  <button
                    onClick={() => openLightbox(proj.gallery || [proj.featured_image], 0, proj.title, proj.description)}
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl touch-target"
                  >
                    <Wand2 className="w-4 h-4" /> View Retouched Studio Gallery
                  </button>
                ) : isVideo && proj.instagram_url ? (
                  <a
                    href={proj.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl touch-target"
                  >
                    <Instagram className="w-4 h-4" /> Watch Reels ↗
                  </a>
                ) : proj.live_url ? (
                  <a
                    href={proj.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-xl touch-target"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" /> Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}

                <div className="text-center">
                  <Link
                    to={`/contact?service=Model+Portfolio+Photoshoot`}
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 font-bold transition-colors"
                  >
                    Book Similar Photoshoot Shoot <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. HIGH-RESOLUTION FULL-SCREEN PHOTOSHOOT LIGHTBOX MODAL WITH RETOUCHING TOGGLE */}
      {lightboxData.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 z-10 border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" /> Master Color Graded & Skin Retouched (4K Studio)
              </span>
              <h3 className="text-sm sm:text-lg font-bold text-white font-display mt-0.5">{lightboxData.title}</h3>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Compare Mode Toggle: Retouched vs RAW */}
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-0.5">
                <button
                  onClick={() => setIsRawView(false)}
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all ${
                    !isRawView ? 'bg-amber-400 text-black shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Wand2 className="w-3 h-3" /> Master Retouched
                </button>
                <button
                  onClick={() => setIsRawView(true)}
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all ${
                    isRawView ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" /> Original RAW
                </button>
              </div>

              {/* Zoom Toggle */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all touch-target"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              <span className="text-xs font-mono text-zinc-400 hidden md:inline">
                {lightboxData.currentIndex + 1} / {lightboxData.images.length}
              </span>

              <button
                onClick={() => setLightboxData(prev => ({ ...prev, isOpen: false }))}
                className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all touch-target"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo View Area with Left/Right Navigation */}
          <div className="relative flex-1 flex items-center justify-center my-3 max-h-[75vh] overflow-hidden">
            {/* Prev Button */}
            {lightboxData.images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur transition-all touch-target"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Active Image with Retouching View Mode & Zoom */}
            <div className={`max-w-full max-h-full flex items-center justify-center overflow-auto rounded-2xl border border-zinc-800 shadow-2xl transition-all duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={() => setIsZoomed(!isZoomed)}>
              <img
                src={displayImageUrl}
                alt={`Shoot Photo ${lightboxData.currentIndex + 1}`}
                className={`max-w-full object-contain rounded-xl transition-all duration-300 ${
                  isZoomed ? 'scale-150 max-h-[90vh]' : 'max-h-[66vh] sm:max-h-[70vh] w-auto'
                }`}
              />
            </div>

            {/* Retouching Mode Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                isRawView ? 'bg-zinc-900/90 text-zinc-300 border-zinc-700' : 'bg-amber-400/90 text-black border-amber-300 font-extrabold shadow-lg'
              }`}>
                {isRawView ? '📸 Original Unretouched RAW' : '✨ Velvet Skin & Studio Light Master'}
              </span>
            </div>

            {/* Next Button */}
            {lightboxData.images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur transition-all touch-target"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer with Filmstrip & Book CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-3 z-10">
            {/* Thumbnails Filmstrip */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar max-w-full sm:max-w-md py-1">
              {lightboxData.images.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLightboxData(prev => ({ ...prev, currentIndex: idx }));
                    setIsZoomed(false);
                  }}
                  className={`w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    lightboxData.currentIndex === idx ? 'border-amber-400 scale-105 shadow-lg' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={thumb} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Shoot Enquiry Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/919876543210?text=Hi%20Velametric,%20I%20would%20like%20to%20book%20a%20model%20portfolio%20shoot%20with%20high-end%20studio%20retouching."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg touch-target"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Booking
              </a>
              <Link
                to="/contact?service=Model+Portfolio+Photoshoot"
                onClick={() => setLightboxData(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl touch-target"
              >
                <Camera className="w-3.5 h-3.5" /> Book Photoshoot
              </Link>
            </div>
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
              className="inline-flex justify-center items-center gap-2 w-full py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl"
            >
              <Instagram className="w-4 h-4" /> Watch On Instagram ↗ ({activeReelModal.views_count} Views)
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
