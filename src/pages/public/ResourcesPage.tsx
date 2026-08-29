import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const mockResources = [
  {
    id: 'res-1',
    slug: 'headless-cms-architecture-guide',
    title: 'The 2026 Enterprise Guide to Headless CMS & Supabase Architecture',
    excerpt: 'Learn how to decouple content management from public presentation layers to achieve sub-second load times.',
    category: 'Architecture',
    readTime: '8 min read'
  },
  {
    id: 'res-2',
    slug: 'government-loan-subsidy-playbook',
    title: 'Navigating Government Subsidy Loans & Capital Financing in 2026',
    excerpt: 'Step-by-step documentation audit roadmap for corporate debt financing and capital loan schemes.',
    category: 'Finance',
    readTime: '12 min read'
  }
];

export const ResourcesPage: React.FC = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
          Knowledge Base
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-4 mb-6">
          Resource Center & Whitepapers
        </h1>
        <p className="text-slate-400 text-lg">
          Insights, architectural guides, and financial playbooks prepared by senior consultants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockResources.map((res) => (
          <div key={res.id} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-brand-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {res.category}
                </span>
                <span className="text-xs text-slate-500">{res.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 hover:text-brand-400 transition-colors">
                {res.title}
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{res.excerpt}</p>
            </div>
            <Link
              to={`/resources/${res.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300"
            >
              Read Full Resource <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResourceDetailPage: React.FC = () => {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase tracking-wider">
        Architecture Guide
      </span>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight">
        The 2026 Enterprise Guide to Headless CMS & Supabase Architecture
      </h1>
      <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
        <p className="text-lg text-slate-200">
          Decoupling content management from public rendering engines empowers enterprise organizations to iterate quickly while enforcing strict Row Level Security.
        </p>
        <h2 className="text-xl font-bold text-white">Why Headless Web Architecture Matters</h2>
        <p>Traditional monolithic web builders blur database logic with rendering templates. Modern platforms leverage Supabase PostgreSQL, edge functions, and typed component repositories to achieve zero latency.</p>
      </div>
    </div>
  );
};
