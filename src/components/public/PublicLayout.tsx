import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SiteSettings, Service } from '../../types/database.types';
import { settingsService } from '../../services/settingsService';
import { serviceService } from '../../services/serviceService';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer';
import { ThemeToggle } from '../common/ThemeToggle';
import { Laptop, Phone, Mail, ArrowRight, ChevronDown, Menu, X, User, Video, MessageSquare, Send, Zap } from 'lucide-react';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    settingsService.getSiteSettings().then(setSiteSettings);
    serviceService.getServices().then(setServices);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-white selection:text-black font-sans pb-20 lg:pb-0 relative overflow-x-hidden">
      {/* Background Slow Music Player */}
      <BackgroundMusicPlayer />

      {/* Squarespace-Style Ultra-Clean Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800/60 print:hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Velametric Signature Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-2 sm:mr-4">
            <span className="font-black text-xl sm:text-2xl tracking-tighter text-black dark:text-white font-display uppercase logo-brand-text">
              VELAMETRIC
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-2 xl:gap-4 mx-2">
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                to="/services"
                className="text-[11px] xl:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1.5 py-6 transition-colors whitespace-nowrap"
              >
                Products & Services <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              </Link>

              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 grid grid-cols-2 gap-3 backdrop-blur-3xl">
                  {services.map((srv) => (
                    <Link
                      key={srv.id}
                      to={`/services/${srv.slug}`}
                      className="p-3.5 rounded-2xl hover:bg-amber-100/80 dark:hover:bg-zinc-800/90 border border-transparent hover:border-amber-300 dark:hover:border-amber-500/30 transition-all flex items-start gap-3 group"
                    >
                      <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-white/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-400 group-hover:text-black dark:group-hover:bg-amber-400 dark:group-hover:text-black transition-colors shrink-0">
                        {srv.slug.includes('video') ? <Video className="w-4 h-4 text-rose-500 dark:text-rose-400" /> : <Laptop className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors font-display">
                          {srv.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 group-hover:text-slate-700 dark:group-hover:text-zinc-200 line-clamp-1 mt-0.5">{srv.short_description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/portfolio" className="text-[11px] xl:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-white transition-colors whitespace-nowrap">
              Our Work
            </Link>
            <Link to="/case-studies" className="text-[11px] xl:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-white transition-colors whitespace-nowrap">
              Case Studies
            </Link>
            <Link to="/resources" className="text-[11px] xl:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-white transition-colors whitespace-nowrap">
              Resources
            </Link>

            <Link to="/about" className="text-[11px] xl:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-white transition-colors whitespace-nowrap">
              About Us
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 ml-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-[11px] xl:text-xs font-bold uppercase tracking-widest text-slate-700 hover:text-amber-800 dark:text-zinc-300 dark:hover:text-white transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-amber-100/70 border border-slate-200 hover:border-amber-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 whitespace-nowrap touch-target"
            >
              <User className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Log In
            </Link>
            <Link
              to="/tools/document-generator"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] xl:text-xs font-extrabold text-black bg-amber-400 hover:bg-amber-300 transition-all transform hover:scale-105 whitespace-nowrap shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              <Zap className="w-3.5 h-3.5 fill-black" /> Document Generator
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Switcher, Doc Gen Shortcut & Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <ThemeToggle />
            <Link
              to="/tools/document-generator"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-extrabold text-black bg-amber-400 hover:bg-amber-300 whitespace-nowrap shadow-md"
            >
              <Zap className="w-3 h-3 fill-black" /> Doc Gen
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 touch-target"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay & Dropdown */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="lg:hidden bg-white/98 dark:bg-zinc-900/98 border-b border-slate-200 dark:border-zinc-800 p-5 space-y-3 text-xs font-bold uppercase tracking-wider absolute top-full left-0 right-0 z-50 shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="pb-1">
                <ThemeToggle variant="expanded" />
              </div>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-slate-800 dark:text-white py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 border-b border-slate-200/60 dark:border-zinc-800/40">
                <span>Home</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </Link>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-slate-800 dark:text-white py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 border-b border-slate-200/60 dark:border-zinc-800/40">
                <span>Products & Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </Link>
              <Link to="/portfolio" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-slate-800 dark:text-white py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 border-b border-slate-200/60 dark:border-zinc-800/40">
                <span>Our Work & Video Reels</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </Link>
              <Link to="/case-studies" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-slate-800 dark:text-white py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 border-b border-slate-200/60 dark:border-zinc-800/40">
                <span>Case Studies</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </Link>
              <Link to="/resources" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-slate-800 dark:text-white py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 border-b border-slate-200/60 dark:border-zinc-800/40">
                <span>Resources</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-slate-800 dark:text-white py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/80 border-b border-slate-200/60 dark:border-zinc-800/40">
                <span>About Us</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-amber-600 dark:text-amber-400 py-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span>Log In (Agent Portal)</span>
                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </Link>
              <div className="pt-2">
                <Link to="/tools/document-generator" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-xl">
                  <Zap className="w-4 h-4 fill-black" /> Free Document Generator
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        {children || <Outlet />}
      </main>

      {/* STICKY MOBILE ACTION BAR (CALL | WHATSAPP | ENQUIRE) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 border-t border-slate-200 dark:border-zinc-800/80 backdrop-blur-xl px-3 py-2 pb-safe flex items-center justify-around text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 print:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
        <a href="tel:+919876543210" className="flex flex-col items-center gap-1 py-1 px-2.5 text-slate-900 dark:text-white touch-target">
          <Phone className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>Call</span>
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-1 px-2.5 text-emerald-600 dark:text-emerald-400 touch-target">
          <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>WhatsApp</span>
        </a>
        <Link to="/login" className="flex flex-col items-center gap-1 py-1 px-2.5 text-amber-600 dark:text-amber-400 touch-target">
          <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Portal</span>
        </Link>
        <Link to="/contact" className="flex items-center gap-1.5 py-2 px-3.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-extrabold shadow-md touch-target">
          <Send className="w-3 h-3 text-white dark:text-black" />
          <span>Enquire</span>
        </Link>
      </div>

      {/* Squarespace-Inspired Editorial Footer */}
      <footer className="bg-slate-100 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 text-xs pt-12 sm:pt-16 lg:pt-20 pb-12 print:hidden">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          
          {/* Big Signature Brand Header */}
          <div className="border-b border-slate-200 dark:border-zinc-800 pb-8 sm:pb-12 mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-black dark:text-white tracking-tighter font-display uppercase logo-brand-text">
                VELAMETRIC
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm max-w-md mt-2 sm:mt-3 leading-relaxed">
                Everything to build your website, run your CRM, manage financial loan advisory, and produce high-impact video reels with Destiny, Dapflix & Ekraahee Films.
              </p>
            </div>
            <Link
              to="/contact"
              className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl touch-target"
            >
              Start Your Free Consultation
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12">
            <div>
              <h4 className="text-black dark:text-white font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest">Products</h4>
              <ul className="space-y-2 sm:space-y-3 font-medium text-[11px] sm:text-xs">
                <li><Link to="/services/web-app-development" className="hover:text-black dark:hover:text-white transition-colors">Website Builder</Link></li>
                <li><Link to="/services/digital-marketing" className="hover:text-black dark:hover:text-white transition-colors">Commerce Tools</Link></li>
                <li><Link to="/services/government-subsidy-loans" className="hover:text-black dark:hover:text-white transition-colors">Financial Advisory</Link></li>
                <li><Link to="/services/video-production-and-events" className="hover:text-black dark:hover:text-white transition-colors">Video & Events</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black dark:text-white font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest">Production Partners</h4>
              <ul className="space-y-2 sm:space-y-3 font-medium text-[11px] sm:text-xs">
                <li><a href="https://www.instagram.com/destiny_in_productions/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">Destiny Productions ↗</a></li>
                <li><a href="https://www.instagram.com/dapflix/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">Dapflix ↗</a></li>
                <li><a href="https://www.instagram.com/ekraaheefilms/?hl=en#" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">Ekraahee Films ↗</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black dark:text-white font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest">Resources</h4>
              <ul className="space-y-2 sm:space-y-3 font-medium text-[11px] sm:text-xs">
                <li><Link to="/resources" className="hover:text-black dark:hover:text-white transition-colors">Resource Center</Link></li>
                <li><Link to="/case-studies" className="hover:text-black dark:hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors">Help & Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black dark:text-white font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 sm:space-y-3 font-medium text-[11px] sm:text-xs">
                <li><Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About Velametric</Link></li>
                <li><Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/login" className="hover:text-black dark:hover:text-white transition-colors">Log In (Agent Portal)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black dark:text-white font-bold mb-3 sm:mb-4 text-xs uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2 sm:space-y-3 font-medium text-[11px] sm:text-xs">
                <li><Link to="/privacy-policy" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/payment-terms" className="hover:text-black dark:hover:text-white transition-colors">Security & SLA</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 dark:text-zinc-500 text-center sm:text-left gap-2">
            <p>© {new Date().getFullYear()} Velametric Inc. All rights reserved.</p>
            <p className="font-mono text-[10px] sm:text-[11px]">Sub-Second Performance & Video Production Infrastructure</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
