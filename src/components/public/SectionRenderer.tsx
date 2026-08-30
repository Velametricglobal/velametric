import React, { useState, useEffect } from 'react';
import { PageSection, Service, PortfolioProject, CaseStudy, VideoReel } from '../../types/database.types';
import { leadService } from '../../services/leadService';
import {
  Sparkles, ArrowRight, Play, CheckCircle2, Calculator, Building, Award, Users,
  Globe, Laptop, Video, Film, Instagram, ChevronDown, MapPin, Phone, Mail, Clock, Send,
  HelpCircle, Megaphone, Calendar, CreditCard, ShieldCheck, Newspaper, Camera, ExternalLink, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionRendererProps {
  section: PageSection;
  services?: Service[];
  projects?: PortfolioProject[];
  caseStudies?: CaseStudy[];
  onFormSubmit?: (data: any) => void;
}

// Helper to extract YouTube video embed URL
const getYouTubeEmbedUrl = (urlStr: string) => {
  if (!urlStr) return '';
  let videoId = '';
  if (urlStr.includes('v=')) {
    videoId = urlStr.split('v=')[1]?.split('&')[0];
  } else if (urlStr.includes('youtu.be/')) {
    videoId = urlStr.split('youtu.be/')[1]?.split('?')[0];
  } else if (urlStr.includes('embed/')) {
    videoId = urlStr.split('embed/')[1]?.split('?')[0];
  }
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&enablejsapi=1` : '';
};

// Universal Smart Link component that dynamically routes internal vs external links and open_in_new_tab
interface SmartLinkProps {
  to?: string;
  href?: string;
  openInNewTab?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const SmartLink: React.FC<SmartLinkProps> = ({ to, href, openInNewTab, className, children }) => {
  const targetUrl = to || href || '#';
  const isExternal = targetUrl.startsWith('http://') || targetUrl.startsWith('https://') || targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:');

  if (isExternal || openInNewTab) {
    return (
      <a
        href={targetUrl}
        target={openInNewTab !== false ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={targetUrl} className={className}>
      {children}
    </Link>
  );
};

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const content = section.content || {};

  // Form State for Enquiry Section
  const [enquiryForm, setEnquiryForm] = useState({
    first_name: '',
    company_name: '',
    phone: '',
    email: '',
    service_interest: 'Website & App Development',
    budget_range: '₹50,000–₹1 Lakh',
    message: '',
    preferred_contact: 'Phone',
    consent: true
  });
  const [enquiryStatus, setEnquiryStatus] = useState<{ submitted: boolean; enqId?: string }>({ submitted: false });

  // Modal State for Video Testimonials
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);

  // Event Countdown Clock State
  const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, mins: 30, secs: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.first_name || !enquiryForm.email || !enquiryForm.phone) return;
    const { enqId } = await leadService.createLead(enquiryForm);
    setEnquiryStatus({ submitted: true, enqId });
  };

  // 1. HERO — FULL-SCREEN CINEMATIC EVENT VIDEO
  if (section.section_type === 'hero_3d' || section.id.includes('hero')) {
    const videoSource = content.video_source || 'youtube';
    const youtubeEmbed = getYouTubeEmbedUrl(content.youtube_url || '');

    return (
      <section className="hero-cinematic-section relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white px-6 sm:px-12 lg:px-24 py-16">
        {/* VIDEO BACKGROUND LAYER */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {videoSource === 'youtube' && youtubeEmbed ? (
            <iframe
              src={youtubeEmbed}
              title="Hero Cinematic Event Video"
              className="w-full h-full scale-[1.5] sm:scale-[1.35] pointer-events-none object-cover opacity-60 transition-opacity duration-1000"
              allow="autoplay; muted; loop; encrypted-media"
            />
          ) : videoSource === 'upload' && content.upload_video_url ? (
            <video
              src={content.upload_video_url}
              poster={content.poster_url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              src={content.poster_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80'}
              alt="Hero Poster"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          {/* Dark Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50" />
        </div>

        {/* HERO CONTENT OVERLAY */}
        <div className="relative z-10 max-w-[1280px] mx-auto text-center space-y-6 sm:space-y-8 w-full">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-black/60 backdrop-blur-md !text-amber-300 border border-amber-400/40 shadow-2xl">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" /> Velametric Global Business & Media Engine
          </div>

          <h1 className="hero-title text-3xl sm:text-6xl lg:text-8xl font-black tracking-tight !text-white font-display uppercase leading-tight sm:leading-[1.02] max-w-5xl mx-auto break-words drop-shadow-2xl">
            {content.heading || 'We Create. We Market. We Grow.'}
          </h1>

          <p className="hero-subheading text-xs sm:text-xl lg:text-2xl !text-zinc-100 max-w-3xl mx-auto font-medium leading-relaxed px-2 drop-shadow-lg">
            {content.subheading || 'From digital experiences and marketing to media, video, finance and unforgettable events — we turn ideas into measurable impact.'}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 max-w-md sm:max-w-none mx-auto">
            <SmartLink
              to={content.primaryCtaUrl || '/request-quote'}
              openInNewTab={content.primaryCtaOpenNewTab}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-black !text-black !bg-white hover:!bg-zinc-200 transition-all transform active:scale-95 shadow-2xl text-center"
            >
              {content.primaryCtaText || 'Start a Project'}
            </SmartLink>
            <SmartLink
              to={content.secondaryCtaUrl || '/portfolio'}
              openInNewTab={content.secondaryCtaOpenNewTab}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-black !text-white !bg-black/70 hover:!bg-black/90 border border-white/30 backdrop-blur transition-all text-center shadow-xl"
            >
              {content.secondaryCtaText || 'Explore Our Work'}
            </SmartLink>
            {content.eventCtaText && (
              <SmartLink
                to={content.eventCtaUrl || '/event-registration'}
                openInNewTab={content.eventCtaOpenNewTab}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-black !text-amber-300 !bg-amber-500/30 hover:!bg-amber-500/40 border border-amber-400/60 backdrop-blur transition-all text-center shadow-xl"
              >
                {content.eventCtaText}
              </SmartLink>
            )}
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-zinc-300 uppercase">
          <span>{content.scrollIndicatorText || 'SCROLL TO EXPLORE'}</span>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-amber-400" />
        </div>
      </section>
    );
  }

  // 2. QUICK INTRO / ABOUT US
  if (section.id.includes('about') || section.name.includes('About')) {
    return (
      <section className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400 block">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight leading-tight">
              {content.heading || 'We Build Brands That Move Forward.'}
            </h2>
            <p className="text-slate-600 dark:text-zinc-300 text-xs sm:text-lg leading-relaxed">
              {content.subheading || 'Velametric Global brings together Technology, Marketing, Creative Design, Media, Video Production, Financial Consultancy, and Mega Event Management under one seamless agency ecosystem.'}
            </p>

            {content.stats && content.stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4 border-t border-slate-200 dark:border-zinc-800">
                {content.stats.map((st: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 sm:p-4 rounded-2xl shadow-sm">
                    <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400 font-display">{st.value}</div>
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">{st.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 sm:pt-4">
              <SmartLink
                to={content.primaryCtaUrl || '/about'}
                openInNewTab={content.primaryCtaOpenNewTab}
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all shadow-xl"
              >
                {content.primaryCtaText || 'Know More About Us'} <ArrowRight className="w-4 h-4" />
              </SmartLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl relative">
              <img
                src={content.image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'}
                alt="About Visual"
                className="w-full h-64 sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. SERVICES (WHAT WE DO)
  if (section.section_type === 'services' || section.id.includes('services')) {
    const categories = content.categories || [];

    const getIconForCategory = (name: string, num: string) => {
      const n = (name || '').toLowerCase();
      if (n.includes('dev') || n.includes('website') || n.includes('app') || num === '01') return Laptop;
      if (n.includes('mktg') || n.includes('marketing') || num === '02') return Megaphone;
      if (n.includes('brand') || n.includes('graphic') || num === '03') return Camera;
      if (n.includes('video') || num === '04') return Video;
      if (n.includes('pr') || n.includes('media') || num === '05') return Newspaper;
      if (n.includes('finan') || n.includes('loan') || num === '06') return Calculator;
      return Globe;
    };

    return (
      <section className="py-20 sm:py-32 bg-zinc-950 border-b border-zinc-800/80 relative overflow-hidden">
        {/* Subtle Background Ambient Radial Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-amber-500/10 via-brand-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/5">
              <Sparkles className="w-3.5 h-3.5" /> Capabilities & Offerings
            </span>
            <h2 className="text-3xl sm:text-6xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">
              {content.heading || 'What We Do'}
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {content.subheading || 'End-to-end solutions for brands, businesses and organizations ready to grow.'}
            </p>
          </div>

          {/* 3x2 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat: any, idx: number) => {
              const IconComp = getIconForCategory(cat.name, cat.num);

              return (
                <div
                  key={idx}
                  className="group relative bg-white dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800/80 hover:border-amber-500/50 p-6 sm:p-8 rounded-3xl space-y-6 transition-all duration-300 hover:-translate-y-2 shadow-lg dark:shadow-none hover:shadow-2xl dark:hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] flex flex-col justify-between backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon Container + Stylized Number */}
                    <div className="flex items-center justify-between">
                      <div className="w-13 h-13 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-500 dark:text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-4xl sm:text-5xl font-black font-display text-slate-200 dark:text-zinc-800 group-hover:text-amber-500/40 transition-colors select-none font-mono">
                        {cat.num}
                      </span>
                    </div>

                    {/* Card Title & Description */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mt-2">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cat.items?.map((item: string, i: number) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-950/90 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800/90 group-hover:border-slate-300 dark:group-hover:border-zinc-700 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-slate-200 dark:group-hover:bg-zinc-900 transition-all font-mono shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80">
                    <SmartLink
                      to={content.primaryCtaUrl || '/services'}
                      openInNewTab={content.primaryCtaOpenNewTab}
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-zinc-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors font-mono tracking-wider"
                    >
                      <span>Explore Capabilities</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </SmartLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 4. FEATURED PORTFOLIO / OUR WORK
  if (section.section_type === 'portfolio' || section.id.includes('portfolio') || section.name.toLowerCase().includes('portfolio') || section.name.toLowerCase().includes('work')) {
    const headerCtaText = content.header_cta_text || content.primaryCtaText || 'View All Work';
    const headerCtaUrl = content.header_cta_url || content.primaryCtaUrl || '/portfolio';
    const headerOpenNewTab = content.header_cta_open_new_tab || false;

    const card1Url = content.card1_url || 'https://navajowhite-ant-953565.hostingersite.com/';
    const card1Text = content.card1_button_text || content.buttonText || 'VISIT LIVE SITE';
    const card1Title = content.card1_title || 'Website & Real Estate CRM Platform';
    const card1Client = content.card1_client || 'Velametric Real Estate Group';
    const card1OpenNewTab = content.card1_open_new_tab !== false;

    const card2Url = content.card2_url || 'https://sienna-chimpanzee-129344.hostingersite.com/';
    const card2Text = content.card2_button_text || content.buttonText || 'VISIT LIVE SITE';
    const card2Title = content.card2_title || 'Website & Institute of Distance Education CRM';
    const card2Client = content.card2_client || 'Velametric Distance Education';
    const card2OpenNewTab = content.card2_open_new_tab !== false;

    const card3Url = content.card3_url || 'https://mediumvioletred-viper-351367.hostingersite.com/';
    const card3Text = content.card3_button_text || content.buttonText || 'VISIT LIVE SITE';
    const card3Title = content.card3_title || 'E-Commerce Website with Integrated CRM';
    const card3Client = content.card3_client || 'Velametric Global Retail';
    const card3OpenNewTab = content.card3_open_new_tab !== false;

    const portfolioCards = [
      {
        title: card1Title,
        client: card1Client,
        image: content.card1_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        live_url: card1Url,
        button_text: card1Text,
        open_new_tab: card1OpenNewTab
      },
      {
        title: card2Title,
        client: card2Client,
        image: content.card2_image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        live_url: card2Url,
        button_text: card2Text,
        open_new_tab: card2OpenNewTab
      },
      {
        title: card3Title,
        client: card3Client,
        image: content.card3_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        live_url: card3Url,
        button_text: card3Text,
        open_new_tab: card3OpenNewTab
      }
    ];

    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-4 sm:gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2 sm:mb-3">
                {content.tagline || 'Featured Case Studies'}
              </span>
              <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
                {content.heading || 'Work That Speaks For Us.'}
              </h2>
              {content.subheading && (
                <p className="text-zinc-400 text-xs sm:text-base mt-2">{content.subheading}</p>
              )}
            </div>
            <SmartLink
              to={headerCtaUrl}
              openInNewTab={headerOpenNewTab}
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white hover:underline"
            >
              {headerCtaText} <ArrowRight className="w-4 h-4" />
            </SmartLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {portfolioCards.map((p, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-600 transition-all flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="h-52 sm:h-60 relative overflow-hidden bg-zinc-950">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                    <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-1 bg-zinc-950/90 text-white rounded-full border border-zinc-700">
                      {p.client}
                    </span>
                    <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-1 bg-emerald-500 text-black rounded-full font-mono">
                      LIVE HOSTED ↗
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors">{p.title}</h3>
                  </div>
                </div>
                <div className="p-5 sm:p-6 pt-0 space-y-2">
                  <SmartLink
                    to={p.live_url}
                    openInNewTab={p.open_new_tab}
                    className="inline-flex justify-center items-center gap-2 w-full py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/20"
                  >
                    {p.button_text} <ExternalLink className="w-3.5 h-3.5" />
                  </SmartLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 5. EVENTS SECTION WITH MOBILE COUNTDOWN WIDGET
  if (section.id.includes('events')) {
    const featEvent = content.featured_event || {};
    return (
      <section id="events" className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block">
              Live Cultural & Business Summits
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'Experience What We Create.'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base">
              {content.subheading || 'Join our mega cultural events, fashion pageants, music festivals, and corporate summits.'}
            </p>
          </div>

          {/* Featured Event Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-12 rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <Calendar className="w-3.5 h-3.5" /> Featured Event
              </div>
              <h3 className="text-xl sm:text-4xl font-black text-white font-display uppercase leading-tight">
                {featEvent.title}
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">{featEvent.description}</p>
              
              <div className="text-xs text-zinc-400 space-y-1 font-mono">
                <div>📍 Venue: <span className="text-white font-bold">{featEvent.venue}</span></div>
              </div>

              {/* Mobile Responsive Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-2">
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.days}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Days</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.hours}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Hours</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.mins}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Mins</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-2 sm:p-3 rounded-2xl text-center">
                  <div className="text-lg sm:text-2xl font-black text-amber-400 font-display">{timeLeft.secs}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase font-bold text-zinc-500">Secs</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3">
                <SmartLink
                  to={featEvent.register_url || '/event-registration'}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all text-center shadow-xl"
                >
                  Register Now
                </SmartLink>
                <SmartLink
                  to={featEvent.sponsor_url || '/sponsor-registration'}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-all text-center"
                >
                  Become a Sponsor
                </SmartLink>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative h-64 sm:h-[400px]">
              <img src={featEvent.image} alt={featEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 6. WHY CHOOSE US (CREDIBILITY PILLARS)
  if (section.id.includes('why') || section.name.includes('Why Choose Us')) {
    const pillars = content.pillars || [];
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Proven Performance
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'More Than a Service Provider.'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base">
              {content.subheading || 'Why leading brands and enterprises partner with Velametric Global.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {pillars.map((pil: any, idx: number) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-10 rounded-3xl space-y-3 sm:space-y-4 hover:border-zinc-700 transition-all shadow-xl">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">{pil.num}</div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display">{pil.title}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{pil.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 7. TESTIMONIAL VIDEOS
  if (section.section_type === 'video_reels' || section.id.includes('video-testimonials')) {
    const vTestimonials = content.video_testimonials || [];
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Client Video Reviews
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || "Don't Take Our Word For It."}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-base">
              {content.subheading || 'Hear directly from the business leaders, founders, and partners we work with.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {vTestimonials.map((vt: any) => (
              <div key={vt.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl hover:border-zinc-700 transition-all group">
                <div className="h-48 sm:h-56 relative overflow-hidden bg-zinc-950 cursor-pointer" onClick={() => setActiveVideoModal(vt)}>
                  <img src={vt.thumbnail} alt={vt.client_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-3">
                  <p className="text-zinc-300 text-xs italic">"{vt.quote}"</p>
                  <div>
                    <div className="text-sm font-bold text-white font-display">{vt.client_name}</div>
                    <div className="text-[11px] text-amber-400 font-mono">{vt.designation}, {vt.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player Modal Popup */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-display">{activeVideoModal.client_name} — {activeVideoModal.company}</h3>
                  <p className="text-xs text-zinc-400">{activeVideoModal.designation}</p>
                </div>
                <button onClick={() => setActiveVideoModal(null)} className="text-zinc-400 hover:text-white text-lg font-bold">✕</button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800">
                <iframe
                  src={getYouTubeEmbedUrl(activeVideoModal.youtube_url)}
                  title="Client Testimonial Video"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  // 8. TEXT TESTIMONIALS
  if (section.section_type === 'testimonials' || section.id.includes('text-testimonials')) {
    const testimonials = content.testimonials || [];
    return (
      <section className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
              {content.heading || 'Trusted By People Who Believe In Growth.'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t: any, idx: number) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-sm font-bold text-white font-display">{t.client_name}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 9. ENQUIRY / REQUEST A QUOTE (CRM INTEGRATED FORM)
  if (section.id.includes('enquiry') || section.name.includes('Enquiry')) {
    return (
      <section id="enquiry" className="py-16 sm:py-28 bg-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-14 rounded-3xl shadow-2xl space-y-6 sm:space-y-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                Start a Conversation
              </span>
              <h2 className="text-2xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
                {content.heading || "Let's Build Something Great."}
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm">
                {content.subheading || "Tell us what you're looking to build, promote, create or organize. Our team will get back to you."}
              </p>
            </div>

            {enquiryStatus.submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 sm:p-8 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Thank You! Enquiry Received</h3>
                <p className="text-zinc-300 text-xs max-w-md mx-auto">
                  We've received your enquiry. Your tracking ID is <span className="text-emerald-400 font-mono font-bold">{enquiryStatus.enqId}</span>. Our sales team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setEnquiryStatus({ submitted: false })}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 sm:space-y-6 text-base sm:text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anish Kapoor"
                      value={enquiryForm.first_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, first_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Enterprise"
                      value={enquiryForm.company_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, company_name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="anish@company.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Interested Service *</label>
                    <select
                      value={enquiryForm.service_interest}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, service_interest: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {content.services_list?.map((s: string, i: number) => (
                        <option key={i} value={s} className="bg-zinc-900 text-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Estimated Budget Range</label>
                    <select
                      value={enquiryForm.budget_range}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, budget_range: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {content.budget_options?.map((b: string, i: number) => (
                        <option key={i} value={b} className="bg-zinc-900 text-white">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5 sm:mb-2 text-xs">Project Requirement Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project, objectives, campaign goals, or event specifications..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-base sm:text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={enquiryForm.consent}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, consent: e.target.checked })}
                      className="accent-white"
                    />
                    <label htmlFor="consent" className="text-zinc-400 text-[11px]">
                      I agree to the Privacy Policy & Terms.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl text-center"
                  >
                    Send Enquiry →
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>
    );
  }

  // 10. CONTACT US
  if (section.id.includes('contact') || section.name.includes('Contact')) {
    return (
      <section className="py-16 sm:py-28 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-mono">
              Direct Contact
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">
              {content.heading || "Let's Talk."}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-xs font-mono">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px]">Phone Support</div>
                  <div className="text-slate-900 dark:text-white font-bold">{content.phone || '+1 (800) 555-VELA'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px]">Email Address</div>
                  <div className="text-slate-900 dark:text-white font-bold">{content.email || 'hello@velametric.com'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px]">Uttarakhand Headquarters</div>
                  <div className="text-slate-900 dark:text-white font-bold">{content.office_dehradun || 'Dehradun, Uttarakhand'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 h-64 sm:h-[380px] shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.74618210356!2d78.009183!3d30.316494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888b5%3A0x76707323605e542!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              title="Dehradun Map"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    );
  }

  // 11. FINAL CTA BANNER
  return (
    <section className="py-16 sm:py-28 bg-zinc-950 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6 sm:space-y-8">
        <h2 className="text-3xl sm:text-6xl font-black text-white font-display uppercase tracking-tight leading-tight">
          {content.heading || 'Ready To Make Your Next Move?'}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-lg max-w-2xl mx-auto">
          {content.subheading || "Let's turn your next idea into something people remember."}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
          <SmartLink
            to={content.primaryCtaUrl || '/request-quote'}
            openInNewTab={content.primaryCtaOpenNewTab}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl text-center"
          >
            {content.primaryCtaText || 'Start a Conversation'}
          </SmartLink>
          <SmartLink
            to={content.secondaryCtaUrl || '/portfolio'}
            openInNewTab={content.secondaryCtaOpenNewTab}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-zinc-900 text-white font-extrabold text-xs uppercase tracking-widest border border-zinc-800 hover:bg-zinc-800 transition-all text-center"
          >
            {content.secondaryCtaText || 'View Our Work'}
          </SmartLink>
        </div>
      </div>
    </section>
  );
};
