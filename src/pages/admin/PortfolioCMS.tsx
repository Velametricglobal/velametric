import React, { useEffect, useState } from 'react';
import { PortfolioProject, CaseStudy } from '../../types/database.types';
import { portfolioService } from '../../services/portfolioService';

export const PortfolioCMS: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    portfolioService.getProjects().then(setProjects);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Portfolio Projects CMS</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage completed client projects published to the public showcase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 shadow-sm">
            <div className="text-xs font-bold text-brand-600 dark:text-brand-400 font-mono">Client: {proj.client}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{proj.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Case Studies CMS</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage quantifiable ROI studies with performance metrics.</p>
      </div>

      <div className="space-y-4">
        {studies.map((cs) => (
          <div key={cs.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-2 shadow-sm">
            <div className="text-xs font-bold text-brand-600 dark:text-brand-400 font-mono">Client: {cs.client}</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{cs.title}</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{cs.results}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

