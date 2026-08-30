import React, { useEffect, useState } from 'react';
import { PortfolioProject, CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Camera, Globe, Video, ExternalLink, Images, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortfolioCMS: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    portfolioService.getProjects().then(setProjects);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold uppercase mb-2">
            <Sparkles className="w-3 h-3" /> Visual Showcase & CMS
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">Portfolio Projects & Lookbooks</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage completed client web apps, photoshoot lookbooks, and commercial video reels.</p>
        </div>
        <Link
          to="/portfolio"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs hover:bg-amber-500 hover:text-black transition-all shadow-md"
        >
          <Eye className="w-3.5 h-3.5" /> View Live Portfolio ↗
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="h-44 relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img
                  src={proj.featured_image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 bg-black/80 text-white rounded-full backdrop-blur">
                  {proj.client}
                </span>

                {proj.project_type === 'photoshoot' ? (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 bg-amber-500 text-black rounded-full font-mono flex items-center gap-1">
                    <Camera className="w-3 h-3" /> PHOTOSHOOT
                  </span>
                ) : proj.project_type === 'video_production' ? (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 bg-purple-500 text-white rounded-full font-mono flex items-center gap-1">
                    <Video className="w-3 h-3" /> VIDEO REELS
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-1 bg-emerald-500 text-black rounded-full font-mono">
                    LIVE PLATFORM
                  </span>
                )}

                {proj.gallery && proj.gallery.length > 0 && (
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 bg-black/80 text-amber-400 rounded-lg backdrop-blur font-mono flex items-center gap-1">
                    <Images className="w-3 h-3" /> {proj.gallery.length} Photos
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase font-mono">{proj.industry}</div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display line-clamp-1">{proj.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-3">
              <span className="text-[10px] font-mono text-slate-400">{proj.completion_date}</span>
              <Link
                to={`/portfolio/${proj.slug}`}
                target="_blank"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1"
              >
                Preview Page <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CaseStudiesCMS: React.FC = () => {
  const [studies, setStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    portfolioService.getCaseStudies().then(setStudies);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">Case Studies CMS</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage quantifiable ROI studies with performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studies.map((cs) => (
          <div key={cs.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">Client: {cs.client}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{cs.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cs.results}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

