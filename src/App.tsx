import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

import { PublicLayout } from './components/public/PublicLayout';
import { HomePage } from './pages/public/HomePage';

// Lazy Loaded Public Pages
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./pages/public/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const PortfolioDetailPage = lazy(() => import('./pages/public/PortfolioDetailPage').then(m => ({ default: m.PortfolioDetailPage })));
const PhotoProfilesPage = lazy(() => import('./pages/public/PhotoProfilesPage').then(m => ({ default: m.PhotoProfilesPage })));
const CaseStudiesPage = lazy(() => import('./pages/public/CaseStudiesPage').then(m => ({ default: m.CaseStudiesPage })));
const CaseStudyDetailPage = lazy(() => import('./pages/public/CaseStudyDetailPage').then(m => ({ default: m.CaseStudyDetailPage })));
const ResourcesPage = lazy(() => import('./pages/public/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const ResourceDetailPage = lazy(() => import('./pages/public/ResourcesPage').then(m => ({ default: m.ResourceDetailPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const QuoteRequestPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.QuoteRequestPage })));
const EventRegistrationPage = lazy(() => import('./pages/public/EventRegistrationPage').then(m => ({ default: m.EventRegistrationPage })));
const SponsorRegistrationPage = lazy(() => import('./pages/public/SponsorRegistrationPage').then(m => ({ default: m.SponsorRegistrationPage })));
const LegalPages = lazy(() => import('./pages/public/LegalPages').then(m => ({ default: m.LegalPages })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Lazy Loaded Admin & CMS Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import('./pages/admin/LoginPage').then(m => ({ default: m.LoginPage })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const HomepageBuilder = lazy(() => import('./pages/admin/HomepageBuilder').then(m => ({ default: m.HomepageBuilder })));
const LeadsCRM = lazy(() => import('./pages/admin/LeadsCRM').then(m => ({ default: m.LeadsCRM })));
const PipelineKanban = lazy(() => import('./pages/admin/PipelineKanban').then(m => ({ default: m.PipelineKanban })));
const FollowUps = lazy(() => import('./pages/admin/FollowUps').then(m => ({ default: m.FollowUps })));
const ServicesCMS = lazy(() => import('./pages/admin/ServicesCMS').then(m => ({ default: m.ServicesCMS })));
const TestimonialsCMS = lazy(() => import('./pages/admin/TestimonialsCMS').then(m => ({ default: m.TestimonialsCMS })));
const PortfolioCMS = lazy(() => import('./pages/admin/PortfolioCMS').then(m => ({ default: m.PortfolioCMS })));
const CaseStudiesCMS = lazy(() => import('./pages/admin/PortfolioCMS').then(m => ({ default: m.CaseStudiesCMS })));
const ProposalsInvoices = lazy(() => import('./pages/admin/ProposalsInvoices').then(m => ({ default: m.ProposalsInvoices })));
const MediaLibrary = lazy(() => import('./pages/admin/MediaLibrary').then(m => ({ default: m.MediaLibrary })));
const SiteSettingsAdmin = lazy(() => import('./pages/admin/SiteSettingsAdmin').then(m => ({ default: m.SiteSettingsAdmin })));
const NavigationAdmin = lazy(() => import('./pages/admin/SiteSettingsAdmin').then(m => ({ default: m.NavigationAdmin })));
const EventsAdmin = lazy(() => import('./pages/admin/EventsAdmin').then(m => ({ default: m.EventsAdmin })));
const CommunicationCenterAdmin = lazy(() => import('./pages/admin/CommunicationCenterAdmin').then(m => ({ default: m.CommunicationCenterAdmin })));
const ReelMarketingAdmin = lazy(() => import('./pages/admin/ReelMarketingAdmin').then(m => ({ default: m.ReelMarketingAdmin })));
const UserManagementAdmin = lazy(() => import('./pages/admin/UserManagementAdmin').then(m => ({ default: m.UserManagementAdmin })));
const RolesPermissionsAdmin = lazy(() => import('./pages/admin/RolesPermissionsAdmin').then(m => ({ default: m.RolesPermissionsAdmin })));
const DepartmentsAdmin = lazy(() => import('./pages/admin/DepartmentsAdmin').then(m => ({ default: m.DepartmentsAdmin })));
const SecurityAuditAdmin = lazy(() => import('./pages/admin/SecurityAuditAdmin').then(m => ({ default: m.SecurityAuditAdmin })));
const InitialSetupAdmin = lazy(() => import('./pages/admin/InitialSetupAdmin').then(m => ({ default: m.InitialSetupAdmin })));

// Lazy Loaded Document Generator Pages
const DocumentGeneratorLanding = lazy(() => import('./pages/public/DocumentGeneratorLanding'));
const DocumentWizard = lazy(() => import('./pages/public/DocumentWizard'));
const MyDocuments = lazy(() => import('./pages/user/MyDocuments'));
const SubscriptionManagement = lazy(() => import('./pages/user/SubscriptionManagement'));
const CompanyProfile = lazy(() => import('./pages/user/CompanyProfile'));
const DocumentAnalytics = lazy(() => import('./pages/admin/DocumentAnalytics'));
const DocumentGeneratorSettings = lazy(() => import('./pages/admin/DocumentGeneratorSettings'));

// Lightweight, sleek loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-transparent py-20">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin" />
      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Loading...</span>
    </div>
  </div>
);
// ScrollToTop Component: Always scroll to top of page upon route or anchor button click
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

// Global Safe Error Boundary to prevent constructor injection / malformed SSR crashes
class SafeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; errorMessage: string; errorStack?: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '', errorStack: '' };
  }

  static getDerivedStateFromError(error: unknown) {
    const msg = error instanceof Error ? error.message : 'An unexpected error occurred.';
    const stack = error instanceof Error ? error.stack : '';
    return { hasError: true, errorMessage: msg, errorStack: stack };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error('Unhandled application error caught safely:', error, errorInfo);
  }

  handleResetAndRecover = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed clearing storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 text-red-500 border border-red-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 font-display">Something went wrong</h1>
          <p className="text-zinc-400 max-w-md mb-4 text-xs leading-relaxed">
            The application caught an unexpected state. Click below to recover and clear stale local cache.
          </p>

          {this.state.errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-amber-400 max-w-lg text-left overflow-x-auto">
              <div className="font-bold text-red-400 mb-1">Error: {this.state.errorMessage}</div>
              {this.state.errorStack && (
                <div className="text-[10px] text-zinc-500 line-clamp-3 font-mono">{this.state.errorStack}</div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold text-xs transition-all shadow-lg"
            >
              Return to Home
            </button>
            <button 
              onClick={this.handleResetAndRecover}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl font-bold text-xs transition-all"
            >
              Clear Storage & Reset
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  return (
    <SafeErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <CurrencyProvider>
              <AudioProvider>
                <SpeedInsights />
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                  {/* PUBLIC WEBSITE ROUTES (NO LOGIN REQUIRED) */}
                  <Route path="/" element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="services/:slug" element={<ServiceDetailPage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
                  <Route path="photo-profiles" element={<PhotoProfilesPage />} />
                  <Route path="profiles" element={<PhotoProfilesPage />} />
                  <Route path="case-studies" element={<CaseStudiesPage />} />
                  <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="resources/:slug" element={<ResourceDetailPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="request-quote" element={<QuoteRequestPage />} />
                  <Route path="event-registration" element={<EventRegistrationPage />} />
                  <Route path="sponsor-registration" element={<SponsorRegistrationPage />} />
                  <Route path="become-a-sponsor" element={<SponsorRegistrationPage />} />
                  <Route path="privacy-policy" element={<LegalPages />} />
                  <Route path="terms-and-conditions" element={<LegalPages />} />
                  <Route path="payment-terms" element={<LegalPages />} />
                  <Route path="cookie-policy" element={<LegalPages />} />
                  <Route path="security" element={<LegalPages />} />
                  
                  {/* DOCUMENT GENERATOR PUBLIC ROUTES & ALIASES */}
                  <Route path="documents" element={<DocumentGeneratorLanding />} />
                  <Route path="documents/create" element={<DocumentWizard />} />
                  <Route path="documents/create/:templateId" element={<DocumentWizard />} />
                  <Route path="documents/wizard" element={<DocumentWizard />} />
                  <Route path="documents/wizard/:templateId" element={<DocumentWizard />} />

                  <Route path="document-generator" element={<DocumentGeneratorLanding />} />
                  <Route path="document-generator/wizard" element={<DocumentWizard />} />
                  <Route path="document-generator/wizard/:templateId" element={<DocumentWizard />} />
                  <Route path="document-generator/create" element={<DocumentWizard />} />
                  <Route path="document-generator/create/:templateId" element={<DocumentWizard />} />

                  <Route path="tools/document-generator" element={<DocumentGeneratorLanding />} />
                  <Route path="tools/document-generator/wizard" element={<DocumentWizard />} />
                  <Route path="tools/document-generator/wizard/:templateId" element={<DocumentWizard />} />
                  <Route path="tools/document-generator/create" element={<DocumentWizard />} />
                  <Route path="tools/document-generator/create/:templateId" element={<DocumentWizard />} />
                </Route>

                {/* LOGIN & AUTHENTICATION ROUTES (RESOLVE /login, /admin/login, /auth/login) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/portal" element={<LoginPage />} />
                <Route path="/agent-portal" element={<LoginPage />} />

                {/* ADMIN PANEL PROTECTED ROUTES */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserManagementAdmin />} />
                  <Route path="roles" element={<RolesPermissionsAdmin />} />
                  <Route path="departments" element={<DepartmentsAdmin />} />
                  <Route path="security" element={<SecurityAuditAdmin />} />
                  <Route path="setup" element={<InitialSetupAdmin />} />
                  <Route path="homepage-builder" element={<HomepageBuilder />} />
                  <Route path="pages" element={<HomepageBuilder />} />
                  <Route path="leads" element={<LeadsCRM />} />
                  <Route path="clients" element={<LeadsCRM />} />
                  <Route path="pipeline" element={<PipelineKanban />} />
                  <Route path="follow-ups" element={<FollowUps />} />
                  <Route path="communication" element={<CommunicationCenterAdmin />} />
                  <Route path="notifications" element={<CommunicationCenterAdmin />} />
                  <Route path="marketing/reels" element={<ReelMarketingAdmin />} />
                  <Route path="campaigns" element={<ReelMarketingAdmin />} />
                  <Route path="services" element={<ServicesCMS />} />
                  <Route path="testimonials" element={<TestimonialsCMS />} />
                  <Route path="portfolio" element={<PortfolioCMS />} />
                  <Route path="case-studies" element={<CaseStudiesCMS />} />
                  <Route path="proposals" element={<ProposalsInvoices />} />
                  <Route path="invoices" element={<ProposalsInvoices />} />
                  <Route path="payments" element={<ProposalsInvoices />} />
                  <Route path="media" element={<MediaLibrary />} />
                  <Route path="blog" element={<MediaLibrary />} />
                  <Route path="team" element={<RolesPermissionsAdmin />} />
                  <Route path="analytics" element={<Dashboard />} />
                  <Route path="settings" element={<SiteSettingsAdmin />} />
                  <Route path="navigation" element={<NavigationAdmin />} />
                  <Route path="events" element={<EventsAdmin />} />
                  
                  {/* DOCUMENT GENERATOR ADMIN */}
                  <Route path="documents/analytics" element={<DocumentAnalytics />} />
                  <Route path="documents/settings" element={<DocumentGeneratorSettings />} />
                </Route>

                {/* USER PROTECTED ROUTES */}
                <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route path="/my-documents" element={<MyDocuments />} />
                  <Route path="/account/subscription" element={<SubscriptionManagement />} />
                  <Route path="/account/company-profile" element={<CompanyProfile />} />
                </Route>

                {/* FALLBACK CATCH-ALL 404 ROUTE */}
                <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
              </Routes>
                </Suspense>
            </AudioProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </SafeErrorBoundary>
  );
};
export default App;
