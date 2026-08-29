import React, { useEffect, useState } from 'react';
import { CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp } from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    portfolioService.getCaseStudies().then(setCaseStudies);
  }, []);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
          Enterprise Case Studies
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-6">
          Quantifiable Business Impact
        </h1>
        <p className="text-slate-400 text-lg">
          In-depth breakdowns showing how strategy, custom technology, and automated CRM pipelines drive exceptional ROI.
        </p>
      </div>

      <div className="space-y-12">
        {caseStudies.map((cs) => (
          <div key={cs.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider block mb-2">
                Client: {cs.client}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{cs.title}</h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">{cs.results}</p>

              {cs.metrics && cs.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  {cs.metrics.map((m) => (
                    <div key={m.id} className="text-center">
                      <div className="text-2xl font-extrabold text-brand-400">
                        {m.prefix}{m.value}{m.suffix}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to={`/case-studies/${cs.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all"
              >
                Read Full Case Study <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800">
              <img src={cs.featured_image} alt={cs.title} className="w-full h-72 object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
