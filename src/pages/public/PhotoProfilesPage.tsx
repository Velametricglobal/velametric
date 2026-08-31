import React, { useState, useEffect, useRef, useCallback } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { PortfolioProject } from '../../types/database.types';
import { Link } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Layers,
  Star,
  Award,
  Images,
  ArrowRight,
  ExternalLink,
  Sliders,
  X,
  Share2,
  ShieldCheck,
  Info,
  Calendar,
  MapPin,
  Compass,
  CheckCircle2,
  Flame
} from 'lucide-react';

interface PhotoProfile {
  id: string;
  name: string;
  category: string;
  theme: string;
  avatarImage: string;
  coverImage: string;
  gallery: string[];
  stats: {
    frames: number;
    year: string;
    location: string;
    equipment: string;
    lighting: string;
  };
  quote: string;
  description: string;
  tags: string[];
  slug: string;
}

const DEFAULT_PROFILES: PhotoProfile[] = [
  {
    id: 'prof-1',
    name: 'Aurelia Vance',
    category: 'Haute Couture & Runway',
    theme: 'Parisian Velvet & Monochromatic Drama',
    avatarImage: '/images/photoshoot/_dsc9548.jpg',
    coverImage: '/images/photoshoot/_dsc9548.jpg',
    gallery: [
      '/images/photoshoot/_dsc9548.jpg',
      '/images/photoshoot/_dsc9547.jpg',
      '/images/photoshoot/_dsc9546.jpg',
      '/images/photoshoot/_dsc9545.jpg',
      '/images/photoshoot/_dsc9544.jpg',
      '/images/photoshoot/_dsc9543.jpg',
      '/images/photoshoot/_dsc9542.jpg',
      '/images/photoshoot/_dsc9541.jpg',
      '/images/photoshoot/_dsc9540.jpg',
      '/images/photoshoot/_dsc9539.jpg',
      '/images/photoshoot/_dsc9538.jpg',
    ],
    stats: {
      frames: 11,
      year: '2026',
      location: 'Milan & Paris Studio',
      equipment: 'Sony A7R V + 85mm GM',
      lighting: 'Profoto B10X Deep Octa'
    },
    quote: 'Elegance is refusal. High fashion captured in sharp contours and shadows.',
    description: 'A bespoke editorial showcase blending modern tailored silhouette aesthetics with dramatic monochrome studio lighting and avant-garde staging.',
    tags: ['Haute Couture', 'Lookbook', 'Studio Editorial', 'Parisian Chic'],
    slug: 'haute-couture-fashion-lookbook'
  },
  {
    id: 'prof-2',
    name: 'Samaira Rajput',
    category: 'Heritage Bridal & Royal Haute Couture',
    theme: 'Royal Crimson, Zardozi & Heritage Embroidery',
    avatarImage: '/images/photoshoot/_dsc9531.jpg',
    coverImage: '/images/photoshoot/_dsc9531.jpg',
    gallery: [
      '/images/photoshoot/_dsc9531.jpg',
      '/images/photoshoot/_dsc9530.jpg',
      '/images/photoshoot/_dsc9529.jpg',
      '/images/photoshoot/_dsc9528.jpg',
      '/images/photoshoot/_dsc9549.jpg',
      '/images/photoshoot/_dsc9550.jpg',
      '/images/photoshoot/_dsc9551.jpg',
      '/images/photoshoot/_dsc9552.jpg',
      '/images/photoshoot/_dsc9553.jpg',
      '/images/photoshoot/_dsc9554.jpg',
      '/images/photoshoot/_dsc9555.jpg',
      '/images/photoshoot/_dsc9556.jpg',
    ],
    stats: {
      frames: 12,
      year: '2026',
      location: 'Heritage Palace Jaipur',
      equipment: 'Hasselblad X2D 100C',
      lighting: 'Elinchrom ELC Warm Tone'
    },
    quote: 'Centuries of Indian artisanal splendor celebrated in timeless high-definition bridal portraits.',
    description: 'Ornate handcrafted lehengas, intricate gold jewelry, and royal bridal portraiture framed with classic Mughal architectural symmetry.',
    tags: ['Royal Bridal', 'Zardozi Embroidery', 'Luxury Jewellery', 'Indian Couture'],
    slug: 'heritage-bridal-haute-couture'
  },
  {
    id: 'prof-3',
    name: 'Celeste Laurent',
    category: 'Fine-Art Jewellery & Diamond Portraits',
    theme: 'Silver Glow, Minimalist Obsidian & Chiaroscuro',
    avatarImage: '/images/photoshoot/_dsc9558.jpg',
    coverImage: '/images/photoshoot/_dsc9558.jpg',
    gallery: [
      '/images/photoshoot/_dsc9557.jpg',
      '/images/photoshoot/_dsc9558.jpg',
      '/images/photoshoot/_dsc9559.jpg',
      '/images/photoshoot/_dsc9560.jpg',
      '/images/photoshoot/_dsc9561.jpg',
      '/images/photoshoot/_dsc9562.jpg',
      '/images/photoshoot/_dsc9563.jpg',
      '/images/photoshoot/_dsc9564.jpg',
      '/images/photoshoot/_dsc9565.jpg',
      '/images/photoshoot/_dsc9566.jpg',
      '/images/photoshoot/_dsc9567.jpg',
      '/images/photoshoot/_dsc9568.jpg',
      '/images/photoshoot/_dsc9569.jpg',
    ],
    stats: {
      frames: 13,
      year: '2026',
      location: 'Zurich Fine Art Studio',
      equipment: 'Phase One IQ4 150MP',
      lighting: 'Broncolor Para 133FB Macro'
    },
    quote: 'Where precious stones meet human poise. Every cut, facet, and reflection documented with surgical clarity.',
    description: 'Precision macro studio portraiture focusing on diamond jewelry, platinum neckpieces, and high-contrast editorial expressions.',
    tags: ['Fine Jewellery', 'Macro Luxury', 'Monochrome Studio', 'Chiaroscuro'],
    slug: 'fine-art-studio-jewellery-portraits'
  },
  {
    id: 'prof-4',
    name: 'Bianca & Penelope',
    category: 'Beauty, Glamour & Salon Editorial',
    theme: 'Gloss Makeover, Silk Waves & Vibrant Portraiture',
    avatarImage: '/images/photoshoot/bp_photo_12.jpg',
    coverImage: '/images/photoshoot/bp_photo_12.jpg',
    gallery: [
      '/images/photoshoot/bp_photo_1.jpg',
      '/images/photoshoot/bp_photo_2.jpg',
      '/images/photoshoot/bp_photo_3.jpg',
      '/images/photoshoot/bp_photo_4.jpg',
      '/images/photoshoot/bp_photo_5.jpg',
      '/images/photoshoot/bp_photo_6.jpg',
      '/images/photoshoot/bp_photo_7.jpg',
      '/images/photoshoot/bp_photo_8.jpg',
      '/images/photoshoot/bp_photo_9.jpg',
      '/images/photoshoot/bp_photo_10.jpg',
      '/images/photoshoot/bp_photo_11.jpg',
      '/images/photoshoot/bp_photo_12.jpg',
      '/images/photoshoot/bp_photo_13.jpg',
    ],
    stats: {
      frames: 13,
      year: '2026',
      location: 'London Beauty Studio',
      equipment: 'Canon EOS R5 + RF 50mm 1.2',
      lighting: 'Nanlite Halo 18 Ringlight'
    },
    quote: 'Radiance magnified. Flawless beauty aesthetics engineered for commercial lookbooks and cosmetic brands.',
    description: 'Modern hair styling, glossy makeup gradients, and lively studio energy tailored for premium cosmetic and salon portfolio branding.',
    tags: ['Glamour Lookbook', 'Salon Aesthetics', 'Beauty Portraiture', 'Editorial Hair'],
    slug: 'contemporary-beauty-glamour-portfolio'
  },
  {
    id: 'prof-5',
    name: 'Zara Sterling',
    category: 'Gold Sequin Haute Couture & Silk Studio',
    theme: 'Gilded Shimmer, Liquid Gold & Evening Glamour',
    avatarImage: '/images/photoshoot/6c1a4692.jpg',
    coverImage: '/images/photoshoot/6c1a4692.jpg',
    gallery: [
      '/images/photoshoot/6c1a4689.jpg',
      '/images/photoshoot/6c1a4690.jpg',
      '/images/photoshoot/6c1a4691.jpg',
      '/images/photoshoot/6c1a4692.jpg',
      '/images/photoshoot/6c1a4705.jpg',
      '/images/photoshoot/6c1a4708.jpg',
      '/images/photoshoot/6c1a4709.jpg',
      '/images/photoshoot/6c1a4711.jpg',
      '/images/photoshoot/6c1a4712.jpg',
      '/images/photoshoot/6c1a4715.jpg',
    ],
    stats: {
      frames: 10,
      year: '2026',
      location: 'Dubai Luxury Skyline Studio',
      equipment: 'Sony A1 + 135mm f/1.8 GM',
      lighting: 'Profoto Pro-11 Dual Grids'
    },
    quote: 'Catching light like liquid metal. The intersection of golden evening wear and bold silhouette staging.',
    description: 'Shimmering sequin couture, silky satin backdrops, and dramatic rim-lit studio captures built for international luxury magazine spreads.',
    tags: ['Gold Sequin', 'High Glamour', 'Silk Staging', 'Evening Couture'],
    slug: 'gold-sequin-haute-couture-studio'
  },
  {
    id: 'prof-6',
    name: 'Kai & Mia',
    category: 'Pop Editorial & Urban Model Lookbook',
    theme: 'Vibrant Neon, Contemporary Streetwear & Dynamic Poses',
    avatarImage: '/images/photoshoot/img_4776.jpg',
    coverImage: '/images/photoshoot/img_4776.jpg',
    gallery: [
      '/images/photoshoot/6c1a4723.jpg',
      '/images/photoshoot/6c1a4724.jpg',
      '/images/photoshoot/6c1a4725.jpg',
      '/images/photoshoot/6c1a4726.jpg',
      '/images/photoshoot/6c1a4727.jpg',
      '/images/photoshoot/6c1a4729.jpg',
      '/images/photoshoot/6c1a4730.jpg',
      '/images/photoshoot/6c1a4742.jpg',
      '/images/photoshoot/img_4756.jpg',
      '/images/photoshoot/img_4757.jpg',
      '/images/photoshoot/img_4762.jpg',
      '/images/photoshoot/img_4776.jpg',
      '/images/photoshoot/img_4777.jpg',
      '/images/photoshoot/img_4780.jpg',
      '/images/photoshoot/img_4781.jpg',
      '/images/photoshoot/img_4782.jpg',
      '/images/photoshoot/img_4785.jpg',
      '/images/photoshoot/img_4792.jpg',
      '/images/photoshoot/img_4796.jpg',
      '/images/photoshoot/img_4797.jpg',
      '/images/photoshoot/img_4798.jpg',
      '/images/photoshoot/img_4803.jpg',
      '/images/photoshoot/img_4804.jpg',
      '/images/photoshoot/img_4808.jpg',
    ],
    stats: {
      frames: 24,
      year: '2026',
      location: 'Tokyo & Brooklyn Loft',
      equipment: 'Fujifilm GFX 100 II',
      lighting: 'Aputure 600d + RGB Gel Accent'
    },
    quote: 'Youth culture captured in bold saturation and unstoppable kinetic poise.',
    description: 'Energetic studio and street aesthetic lookbook showcasing high-concept styling, bright pop color blocking, and modern commercial attitude.',
    tags: ['Pop Editorial', 'Urban Streetwear', 'Model Lookbook', 'Kinetic Energy'],
    slug: 'pop-editorial-urban-model-lookbook'
  }
];

export const PhotoProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<PhotoProfile[]>(DEFAULT_PROFILES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [sliderMode, setSliderMode] = useState<'coverflow' | 'cylinder' | 'stack'>('coverflow');
  const [activeLightbox, setActiveLightbox] = useState<{ images: string[]; index: number; profile: PhotoProfile } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load custom saved profiles from portfolio service if available
  useEffect(() => {
    portfolioService.getProjects().then((projs) => {
      const photoshootProjects = projs.filter(p => p.project_type === 'photoshoot' && p.gallery && p.gallery.length > 0);
      if (photoshootProjects.length > 0) {
        const dynamicProfiles: PhotoProfile[] = photoshootProjects.map((p, idx) => {
          const fallback = DEFAULT_PROFILES[idx % DEFAULT_PROFILES.length];
          return {
            id: p.id || `dyn-${idx}`,
            name: p.client || fallback.name,
            category: p.industry || fallback.category,
            theme: fallback.theme,
            avatarImage: p.featured_image || fallback.avatarImage,
            coverImage: p.featured_image || fallback.coverImage,
            gallery: p.gallery || fallback.gallery,
            stats: {
              frames: p.gallery?.length || fallback.stats.frames,
              year: p.completion_date?.split('-')[0] || '2026',
              location: fallback.stats.location,
              equipment: fallback.stats.equipment,
              lighting: fallback.stats.lighting
            },
            quote: fallback.quote,
            description: p.description || fallback.description,
            tags: fallback.tags,
            slug: p.slug || fallback.slug
          };
        });
        setProfiles(dynamicProfiles);
      }
    });
  }, []);

  const total = profiles.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay ticker
  useEffect(() => {
    if (isAutoPlay && !activeLightbox) {
      autoPlayTimerRef.current = setInterval(() => {
        nextSlide();
      }, 5500);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlay, activeLightbox, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape' && activeLightbox) setActiveLightbox(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, activeLightbox]);

  // Drag Gesture Handlers
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
    if (dragDelta > 60) {
      prevSlide();
    } else if (dragDelta < -60) {
      nextSlide();
    }
    setDragDelta(0);
  };

  const currentProfile = profiles[activeIndex] || profiles[0];

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="min-h-screen bg-slate-950 text-white selection:bg-amber-400 selection:text-black font-sans pb-24 relative overflow-hidden secure-media select-none"
    >
      
      {/* 3D Radiant Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[60%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-10 sm:space-y-14 relative z-10">

        {/* 1. EDITORIAL TITLE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-zinc-800/80 pb-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/25 backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5" /> 3D Photo Profiles & Model Showcase
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-amber-200">
              PHOTO PROFILES
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Immersive 3D interactive lookbook portfolios capturing haute couture, royal bridal traditions, diamond jewellery, and commercial model profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono font-semibold text-zinc-400 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Drag / Swipe to Rotate Lookbooks</span>
            </div>
          </div>
        </div>

        {/* 2. THE SIGNATURE 3D ANIMATED SLIDER STAGE */}
        <div
          className="coverflow-stage relative w-full h-[460px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing [perspective:1800px] overflow-hidden rounded-3xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900/90 shadow-2xl backdrop-blur-2xl"
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle 3D Runway Lighting Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950/40 to-transparent pointer-events-none" />

          {/* 3D Profile Cards Array */}
          {profiles.map((profile, i) => {
            let offset = i - activeIndex;
            // Wrap offset for circular continuity
            if (offset < -Math.floor(total / 2)) offset += total;
            if (offset > Math.floor(total / 2)) offset -= total;

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            const isVisible = absOffset <= 2;

            if (!isVisible) return null;

            // Compute dynamic 3D transformation matrices based on chosen sliderMode
            let transform = '';
            let zIndex = 50 - absOffset * 10;
            let opacity = Math.max(0, 1 - absOffset * 0.25);
            let filter = absOffset > 0 ? `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.2})` : 'none';

            if (sliderMode === 'coverflow') {
              const translateX = offset * 280 + (isDragging ? dragDelta * 0.5 : 0);
              const translateZ = -absOffset * 180;
              const rotateY = offset * -36;
              const scale = 1 - absOffset * 0.14;
              transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            } else if (sliderMode === 'cylinder') {
              const radius = 420;
              const angle = (offset * 40 * Math.PI) / 180;
              const translateX = Math.sin(angle) * radius + (isDragging ? dragDelta * 0.4 : 0);
              const translateZ = Math.cos(angle) * radius - radius;
              const rotateY = offset * -40;
              const scale = 1 - absOffset * 0.12;
              transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            } else {
              // Stack mode
              const translateX = offset * 110 + (isDragging ? dragDelta * 0.4 : 0);
              const translateY = absOffset * 20;
              const translateZ = -absOffset * 140;
              const rotateZ = offset * 4;
              const scale = 1 - absOffset * 0.1;
              transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateZ(${rotateZ}deg) scale(${scale})`;
            }

            return (
              <div
                key={profile.id}
                onClick={() => {
                  if (!isCenter) setActiveIndex(i);
                }}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  filter,
                  transformStyle: 'preserve-3d',
                  transition: isDragging ? 'none' : 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className={`coverflow-card absolute w-[280px] sm:w-[340px] lg:w-[400px] h-[390px] sm:h-[470px] lg:h-[530px] rounded-3xl p-1 bg-gradient-to-b ${
                  isCenter
                    ? 'from-amber-400 via-amber-500/50 to-zinc-900 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.45),0_15px_30px_-10px_rgba(0,0,0,0.15)] ring-2 ring-amber-400'
                    : 'from-zinc-700/60 to-zinc-900/90 shadow-xl border border-zinc-700/80 dark:border-zinc-800'
                } group cursor-pointer`}
              >
                {/* Inner Card Frame */}
                <div className="w-full h-full bg-zinc-950 rounded-[22px] overflow-hidden relative flex flex-col justify-between p-5 select-none text-white">
                  {/* Background Profile Photo with 3D Parallax & Anti-Theft Protection */}
                  <img
                    src={profile.coverImage}
                    alt={profile.name}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    className={`absolute inset-0 w-full h-full object-cover secure-image pointer-events-none transition-transform duration-700 ${
                      isCenter ? 'scale-105 group-hover:scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 pointer-events-none" />

                  {/* 3D Holographic Glare */}
                  {isCenter && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-400/10 to-white/20 opacity-70 group-hover:opacity-100 transition-opacity rounded-[22px]" />
                  )}

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="card-client-badge px-3 py-1 rounded-full bg-black/85 text-white text-[10px] font-bold font-mono uppercase tracking-wider backdrop-blur border border-white/20 shadow-md">
                      {profile.stats.frames} High-Res Frames
                    </span>

                    <span className="card-frames-badge px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black font-mono uppercase tracking-wider flex items-center gap-1 shadow-lg border border-amber-300/40">
                      <Star className="w-3 h-3 fill-black" /> {profile.stats.year}
                    </span>
                  </div>

                  {/* Bottom Profile Details */}
                  <div className="relative z-10 space-y-3">
                    <div className="space-y-1">
                      <div className="card-category text-[11px] font-extrabold font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5 drop-shadow">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> {profile.category}
                      </div>
                      <h3 className="card-title text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {profile.name}
                      </h3>
                      <p className="card-desc text-[11px] text-zinc-200 line-clamp-2 leading-relaxed drop-shadow">
                        {profile.theme}
                      </p>
                    </div>

                    {/* Action Button for Active Center Card */}
                    {isCenter && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLightbox({ images: profile.gallery, index: 0, profile });
                          }}
                          className="card-action-btn flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                          <Eye className="w-4 h-4" /> Open 4K Lookbook
                        </button>

                        <Link
                          to={`/portfolio/${profile.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-11 h-11 rounded-xl bg-black/80 hover:bg-amber-400 hover:text-black text-white border border-white/20 backdrop-blur flex items-center justify-center transition-all shadow-md shrink-0"
                          title="View Full Story"
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

          {/* Left / Right 3D Floating Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="coverflow-arrow-btn absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 dark:bg-black/70 hover:bg-amber-400 text-slate-800 dark:text-white hover:text-black border border-slate-300 dark:border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group"
            aria-label="Previous Profile"
          >
            <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="coverflow-arrow-btn absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 dark:bg-black/70 hover:bg-amber-400 text-slate-800 dark:text-white hover:text-black border border-slate-300 dark:border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group"
            aria-label="Next Profile"
          >
            <ChevronRight className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3. THUMBNAIL TRACK SCRUBBER & ACTIVE INDICATORS */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto p-2 scrollbar-none max-w-full">
            {profiles.map((p, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex items-center gap-2.5 p-1.5 sm:p-2 rounded-2xl transition-all border shrink-0 ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-black shrink-0">
                    <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left hidden sm:block pr-2">
                    <div className={`text-xs font-bold truncate ${isActive ? 'text-amber-400' : 'text-white'}`}>
                      {p.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">{p.stats.frames} Photos</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slider Progress Bar */}
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 ease-out"
              style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* 4. ACTIVE PROFILE SPOTLIGHT & LOOKBOOK EXPANSION PANEL */}
        <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          {/* Top Spotlight Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Main Stats & Intro */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500 text-black text-[10px] font-mono font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" /> Featured Spotlight Profile
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase font-display tracking-tight">
                  {currentProfile.name}
                </h2>
                <div className="text-xs font-bold uppercase font-mono text-amber-400 mt-1">
                  {currentProfile.category}
                </div>
              </div>

              <blockquote className="border-l-2 border-amber-400 pl-4 py-1 italic text-zinc-300 text-sm leading-relaxed">
                "{currentProfile.quote}"
              </blockquote>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {currentProfile.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {currentProfile.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Col: Technical Specifications Grid & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold font-mono text-zinc-500 uppercase flex items-center gap-1">
                    <Images className="w-3 h-3 text-amber-400" /> Frames Count
                  </div>
                  <div className="text-lg font-black text-white font-mono">{currentProfile.stats.frames} Photos</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold font-mono text-zinc-500 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> Shoot Location
                  </div>
                  <div className="text-xs font-bold text-white truncate">{currentProfile.stats.location}</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                  <div className="text-[10px] font-bold font-mono text-zinc-500 uppercase flex items-center gap-1">
                    <Camera className="w-3 h-3 text-amber-400" /> Camera Body
                  </div>
                  <div className="text-xs font-bold text-white truncate">{currentProfile.stats.equipment}</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1 col-span-2 sm:col-span-3">
                  <div className="text-[10px] font-bold font-mono text-zinc-500 uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Studio Lighting Array
                  </div>
                  <div className="text-xs font-bold text-white">{currentProfile.stats.lighting}</div>
                </div>
              </div>

              {/* Lookbook Quick Strip (First 6 Frames) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase font-mono flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> High-Resolution Lookbook Gallery
                  </span>
                  <button
                    onClick={() => setActiveLightbox({ images: currentProfile.gallery, index: 0, profile: currentProfile })}
                    className="text-amber-400 hover:text-amber-300 font-bold font-mono text-[11px] flex items-center gap-1"
                  >
                    Expand All ({currentProfile.gallery.length}) <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 select-none">
                  {currentProfile.gallery.slice(0, 6).map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveLightbox({ images: currentProfile.gallery, index: i, profile: currentProfile })}
                      className="h-20 sm:h-24 rounded-xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-amber-400 hover:scale-105 transition-all relative group/thumb shadow-md"
                    >
                      <img
                        src={imgUrl}
                        alt={`Frame ${i + 1}`}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className="w-full h-full object-cover secure-image pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Shoot CTA Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Want a custom lookbook shoot like {currentProfile.name}?</h4>
                  <p className="text-[11px] text-zinc-400">Our crew handles styling, studio lighting, high-fashion models, and color grading.</p>
                </div>

                <Link
                  to="/request-quote"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider whitespace-nowrap shadow-lg transition-all"
                >
                  Book Photoshoot ↗
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 5. 4K CINEMATIC LIGHTBOX MODAL (PROTECTED VIEW) */}
      {activeLightbox && (
        <div
          onContextMenu={(e) => e.preventDefault()}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none secure-media"
        >
          {/* Top Lightbox Bar */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                {activeLightbox.profile.name} • Frame {activeLightbox.index + 1} of {activeLightbox.images.length}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {activeLightbox.profile.category}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Protected Lookbook
              </span>

              <button
                onClick={() => setActiveLightbox(null)}
                className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-rose-600 text-white flex items-center justify-center transition-colors border border-zinc-800 shadow-lg"
                title="Close Lookbook"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Zoom Stage with Transparent Protection Shield */}
          <div
            onContextMenu={(e) => e.preventDefault()}
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
          >
            <div className="relative max-w-full max-h-[72vh] flex items-center justify-center">
              <img
                src={activeLightbox.images[activeLightbox.index]}
                alt={`Frame ${activeLightbox.index + 1}`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-scaleUp secure-image pointer-events-none"
              />
              {/* Invisible Click & Drag Shield Layer */}
              <div
                className="secure-shield"
                onContextMenu={(e) => e.preventDefault()}
              />
              {/* Watermark Protection Tag */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 pointer-events-none select-none tracking-widest uppercase z-30 whitespace-nowrap shadow-lg">
                🔒 VELAMETRIC GLOBAL • PROTECTED WORK
              </div>
            </div>

            {/* Lightbox Nav Arrows */}
            {activeLightbox.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveLightbox({
                      ...activeLightbox,
                      index: (activeLightbox.index - 1 + activeLightbox.images.length) % activeLightbox.images.length
                    })
                  }
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center backdrop-blur border border-white/20 transition-all shadow-xl z-40"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() =>
                    setActiveLightbox({
                      ...activeLightbox,
                      index: (activeLightbox.index + 1) % activeLightbox.images.length
                    })
                  }
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center backdrop-blur border border-white/20 transition-all shadow-xl z-40"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Scrubber */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 scrollbar-none">
            {activeLightbox.images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLightbox({ ...activeLightbox, index: idx })}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative ${
                  activeLightbox.index === idx
                    ? 'border-amber-400 scale-110 shadow-lg'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
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
