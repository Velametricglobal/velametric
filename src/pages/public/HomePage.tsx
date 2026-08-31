import React, { useEffect, useState } from 'react';
import { Page, Service, PortfolioProject, CaseStudy } from '../../types/database.types';
import { pageService, defaultHomeSections } from '../../services/pageService';
import { serviceService } from '../../services/serviceService';
import { portfolioService } from '../../services/portfolioService';
import { SectionRenderer } from '../../components/public/SectionRenderer';

export const HomePage: React.FC = () => {
  const [page, setPage] = useState<Page | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublishedPage = () => {
    Promise.all([
      pageService.getPublishedPageBySlug('home'),
      serviceService.getServices(),
      portfolioService.getProjects(),
      portfolioService.getCaseStudies()
    ]).then(([p, srv, proj, cs]) => {
      setPage(p);
      setServices(srv);
      setProjects(proj);
      setCaseStudies(cs);
      setLoading(false);
    }).catch((err) => {
      console.error('Error fetching homepage data:', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPublishedPage();

    // Listen for live page publication events across tabs/windows
    const handlePublishEvent = () => fetchPublishedPage();
    window.addEventListener('velametric_page_published', handlePublishEvent);
    window.addEventListener('storage', handlePublishEvent);

    return () => {
      window.removeEventListener('velametric_page_published', handlePublishEvent);
      window.removeEventListener('storage', handlePublishEvent);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const rawSections = page?.sections && page.sections.length > 0 ? page.sections : defaultHomeSections;
  const enabledSections = rawSections.filter(s => s.is_enabled !== false);
  const sections = enabledSections.length > 0 ? enabledSections : defaultHomeSections;

  return (
    <div className="bg-zinc-950 text-white font-sans selection:bg-amber-400 selection:text-black min-h-screen">
      {sections.map((sec) => (
        <SectionRenderer
          key={sec.id}
          section={sec}
          services={services}
          projects={projects}
          caseStudies={caseStudies}
        />
      ))}
    </div>
  );
};
