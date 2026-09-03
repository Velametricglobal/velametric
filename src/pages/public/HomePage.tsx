import React, { useEffect, useState } from 'react';
import { Page, Service, PortfolioProject, CaseStudy } from '../../types/database.types';
import { pageService, defaultHomeSections } from '../../services/pageService';
import { serviceService } from '../../services/serviceService';
import { portfolioService } from '../../services/portfolioService';
import { SectionRenderer } from '../../components/public/SectionRenderer';

export const HomePage: React.FC = () => {
  const [page, setPage] = useState<Page | null>(() => ({
    id: 'home',
    title: 'Home',
    slug: 'home',
    is_published: true,
    created_at: '',
    updated_at: '',
    sections: defaultHomeSections
  } as Page));
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  const fetchPublishedPage = () => {
    Promise.all([
      pageService.getPublishedPageBySlug('home'),
      serviceService.getServices(),
      portfolioService.getProjects(),
      portfolioService.getCaseStudies()
    ]).then(([p, srv, proj, cs]) => {
      if (p) setPage(p);
      if (srv) setServices(srv);
      if (proj) setProjects(proj);
      if (cs) setCaseStudies(cs);
    }).catch((err) => {
      console.error('Error fetching homepage data:', err);
    });
  };

  useEffect(() => {
    fetchPublishedPage();

    // Listen for live page publication & portfolio updates across tabs/windows
    const handleUpdateEvent = () => fetchPublishedPage();
    window.addEventListener('velametric_page_published', handleUpdateEvent);
    window.addEventListener('velametric_portfolio_updated', handleUpdateEvent);
    window.addEventListener('velametric_services_updated', handleUpdateEvent);
    window.addEventListener('storage', handleUpdateEvent);

    return () => {
      window.removeEventListener('velametric_page_published', handleUpdateEvent);
      window.removeEventListener('velametric_portfolio_updated', handleUpdateEvent);
      window.removeEventListener('velametric_services_updated', handleUpdateEvent);
      window.removeEventListener('storage', handleUpdateEvent);
    };
  }, []);

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
