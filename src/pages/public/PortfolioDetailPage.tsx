import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortfolioProject } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { ChevronRight, ChevronLeft, ExternalLink, Globe, Quote, ShieldCheck, Camera, Images, X, Eye, ArrowLeft, Layers, Wrench } from 'lucide-react';

export const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoModalIndex, setActivePhotoModalIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      portfolioService.getProjectBySlug(slug).then(proj => {
        setProject(proj);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Project Not Found</h2>
        <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Return to Portfolio
        </Link>
      </div>
    );
  }

  const gallery = project.gallery || [];

  return (
    <div className="py-12 sm:py-16 lg:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 font-sans space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
        <Link to="/portfolio" className="hover:text-amber-600 dark:hover:text-white transition-colors">Portfolio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 dark:text-zinc-200 truncate">{project.title}</span>
      </div>

      {/* Header Info */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-zinc-900 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-zinc-800 uppercase tracking-wider font-mono">
            Client: {project.client}
          </span>
          {project.project_type === 'photoshoot' && (
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-amber-500 text-black uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> High-Fashion Photoshoot Lookbook
            </span>
          )}
          {project.live_url && (
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 uppercase tracking-wider font-mono">
              ● Live Hosted Platform
            </span>
          )}
          {project.industry && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800">
              {project.industry}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-display leading-tight">
          {project.title}
        </h1>

        <p className="text-slate-600 dark:text-zinc-300 text-base sm:text-xl max-w-3xl leading-relaxed">
          {project.description}
        </p>

        {/* Live URL Action Button */}
        {project.live_url && (
          <div className="pt-2">
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-slate-950 dark:bg-white text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-500 hover:text-black transition-all shadow-xl"
            >
              <Globe className="w-4 h-4 text-emerald-500" /> Visit Live Hosted Website <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Main Cover Image */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl relative bg-slate-100 dark:bg-zinc-950 group">
        <img
          src={project.featured_image}
          alt={project.title}
          className="w-full h-[380px] sm:h-[540px] object-cover group-hover:scale-102 transition-transform duration-500"
        />
        {gallery.length > 0 && (
          <button
            onClick={() => setActivePhotoModalIndex(0)}
            className="absolute bottom-6 right-6 px-5 py-2.5 rounded-full bg-black/80 hover:bg-amber-400 text-white hover:text-black border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur flex items-center gap-2 transition-all shadow-xl"
          >
            <Images className="w-4 h-4" /> View Full Gallery ({gallery.length} Frames)
          </button>
        )}
      </div>

      {/* Services & Tech Tags Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
        {project.services_used && project.services_used.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Services Provided
            </div>
            <div className="flex flex-wrap gap-2">
              {project.services_used.map((srv, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 text-xs font-semibold border border-slate-200 dark:border-zinc-800">
                  {srv}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
              <Wrench className="w-4 h-4" /> Equipment & Tools
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 text-xs font-semibold border border-slate-200 dark:border-zinc-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Challenge vs Solution vs Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl space-y-3 shadow-lg">
          <h3 className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-display uppercase tracking-wider">The Creative Brief</h3>
          <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">{project.challenge}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl space-y-3 shadow-lg">
          <h3 className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-display uppercase tracking-wider">Execution & Approach</h3>
          <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">{project.solution}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl space-y-3 shadow-lg">
          <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-display uppercase tracking-wider">Measurable Impact</h3>
          <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">{project.results}</p>
        </div>
      </div>

      {/* Complete Photoshoot Gallery Masonry / Grid */}
      {gallery.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
                High-Resolution Visual Archive
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                Complete Photoshoot Gallery ({gallery.length} Frames)
              </h2>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 text-xs">
              Click any photo to open full-screen high-res lightbox
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhotoModalIndex(idx)}
                className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 cursor-pointer group relative bg-slate-100 dark:bg-zinc-950 shadow-md hover:shadow-2xl transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery Frame ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Eye className="w-3 h-3" /> Zoom
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Quote */}
      {project.testimonial_quote && (
        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 sm:p-12 rounded-3xl relative shadow-xl">
          <Quote className="w-12 h-12 text-slate-200 dark:text-zinc-800 absolute top-6 right-8" />
          <p className="text-lg sm:text-2xl font-medium text-slate-900 dark:text-white italic mb-6 leading-relaxed">
            "{project.testimonial_quote}"
          </p>
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
            — {project.testimonial_author}
          </div>
        </div>
      )}

      {/* Bottom Return Button */}
      <div className="text-center pt-8">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-500 hover:text-black transition-all shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Return to All Work
        </Link>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoModalIndex !== null && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-mono">
                {project.client} • {project.title}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white font-display">
                Frame {activePhotoModalIndex + 1} of {gallery.length}
              </h3>
            </div>
            <button
              onClick={() => setActivePhotoModalIndex(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Stage */}
          <div className="flex-1 flex items-center justify-center relative my-4 overflow-hidden">
            <button
              onClick={() => setActivePhotoModalIndex((activePhotoModalIndex - 1 + gallery.length) % gallery.length)}
              className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center transition-all shadow-2xl border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={gallery[activePhotoModalIndex]}
              alt={`Frame ${activePhotoModalIndex + 1}`}
              className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setActivePhotoModalIndex((activePhotoModalIndex + 1) % gallery.length)}
              className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black flex items-center justify-center transition-all shadow-2xl border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 max-w-4xl mx-auto scrollbar-none">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoModalIndex(idx)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activePhotoModalIndex === idx ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
