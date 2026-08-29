import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';
import { ChevronRight, ArrowRight, TrendingUp } from 'lucide-react';

export const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      portfolioService.getCaseStudyBySlug(slug).then(res => {
        setCs(res);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cs) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Case Study Not Found</h2>
        <Link to="/case-studies" className="text-brand-400 font-semibold underline">Return to Case Studies</Link>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link to="/case-studies" className="hover:text-white">Case Studies</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-200">{cs.title}</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
          Client Impact Study: {cs.client}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight">
          {cs.title}
        </h1>

        {cs.metrics && cs.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-6 my-10 bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center">
            {cs.metrics.map(m => (
              <div key={m.id}>
                <div className="text-3xl sm:text-4xl font-black text-brand-400 mb-1">
                  {m.prefix}{m.value}{m.suffix}
                </div>
                <div className="text-xs font-semibold text-slate-300">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-3xl overflow-hidden mb-12 border border-slate-800">
          <img src={cs.featured_image} alt={cs.title} className="w-full h-96 object-cover" />
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-slate-300">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Background & Challenge</h2>
            <p className="leading-relaxed">{cs.challenge}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Strategic Solution</h2>
            <p className="leading-relaxed">{cs.solution}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Key Outcomes & ROI</h2>
            <p className="leading-relaxed">{cs.results}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
