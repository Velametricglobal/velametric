import React, { useEffect, useState } from 'react';
import { Service, ServiceCategory, ServicePackage } from '../../types/database.types';
import { serviceService } from '../../services/serviceService';
import { Link } from 'react-router-dom';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { PackageEnquiryModal } from '../../components/public/PackageEnquiryModal';
import { useCurrency } from '../../context/CurrencyContext';
import { 
  Laptop, ChevronRight, CheckCircle2, Search, Sparkles, ArrowRight, 
  HelpCircle, Check, X, LayoutGrid, Code2, Megaphone, Palette, 
  Video, Newspaper, Landmark, Calendar, SlidersHorizontal, Layers
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { formatAmount } = useCurrency();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Package Enquiry Modal State
  const [activeEnquiry, setActiveEnquiry] = useState<{ service: Service; packageItem: ServicePackage } | null>(null);

  useEffect(() => {
    serviceService.getCategories().then(setCategories);
    serviceService.getServices().then(setServices);
  }, []);

  // Helper function to map category icon dynamically
  const getCategoryIcon = (slugOrName: string) => {
    const s = slugOrName.toLowerCase();
    if (s.includes('all')) return LayoutGrid;
    if (s.includes('dev') || s.includes('website') || s.includes('app')) return Code2;
    if (s.includes('mktg') || s.includes('marketing')) return Megaphone;
    if (s.includes('brand') || s.includes('graphic')) return Palette;
    if (s.includes('vid') || s.includes('video')) return Video;
    if (s.includes('pr') || s.includes('media')) return Newspaper;
    if (s.includes('fin') || s.includes('consultancy') || s.includes('loan')) return Landmark;
    if (s.includes('event')) return Calendar;
    return Layers;
  };

  // Calculate service counts per category
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return services.length;
    return services.filter(s => s.category_id === catId || s.category_name?.toLowerCase().includes(catId.toLowerCase())).length;
  };

  const filteredServices = services.filter(s => {
    const matchesCat = selectedCat === 'all' || s.category_id === selectedCat || s.category_name?.toLowerCase().includes(selectedCat.toLowerCase());
    const matchesQuery = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.short_description.toLowerCase().includes(searchQuery.toLowerCase()) || s.category_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const activeCategoryObj = categories.find(c => c.id === selectedCat);

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Title Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/5">
          <Sparkles className="w-3.5 h-3.5" /> OUR PRODUCTS & SERVICES — PACKAGE & PRICING SYSTEM
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
          Transparent Packages & Custom Pricing
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Standardized <span className="text-white font-bold">Startup</span>, <span className="text-amber-400 font-bold">Enterprise</span>, and <span className="text-emerald-400 font-bold">Organization</span> tiers designed for Indian startups, growing businesses, and institutions.
        </p>
      </div>

      {/* ULTRA-CLEAN & ORGANIZED CATEGORY FILTER CONTROL PANEL */}
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Top Control Bar: Search Input & Currency Switcher */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Live Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search services, marketing, loans, web apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white p-0.5 rounded-full hover:bg-zinc-800 transition-colors"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Status Info & Currency Selector Pill */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              Showing <span className="text-amber-400 font-bold">{filteredServices.length}</span> of {services.length} offerings
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-950/90 px-4 py-2 rounded-2xl border border-zinc-800/90 shadow-sm">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase font-mono tracking-wider">Currency:</span>
              <CurrencySelector compact />
            </div>
          </div>
        </div>

        {/* Subtle Glowing Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* ORGANIZED CATEGORY NAVIGATION PILLS (CENTER ALIGNED) */}
        <div>
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" /> Select Category Filter:</span>
            {selectedCat !== 'all' && (
              <button 
                onClick={() => setSelectedCat('all')} 
                className="text-amber-400 hover:underline text-[10px] font-bold"
              >
                Reset to All ({services.length})
              </button>
            )}
          </div>

          {/* Centered Category Pills Flexbox Container */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* All Category Pill */}
            {(() => {
              const Icon = getCategoryIcon('all');
              const isSelected = selectedCat === 'all';
              const count = getCategoryCount('all');
              return (
                <button
                  key="cat-all"
                  onClick={() => setSelectedCat('all')}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-md ${
                    isSelected
                      ? 'bg-amber-400 text-black font-extrabold shadow-amber-500/20 scale-[1.02]'
                      : 'bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-850'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                  <span>All Offerings</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })()}

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug || cat.name);
              const isSelected = selectedCat === cat.id;
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 shadow-md ${
                    isSelected
                      ? 'bg-amber-400 text-black font-extrabold shadow-amber-500/20 scale-[1.02]'
                      : 'bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-850'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Detail Banner */}
        {activeCategoryObj && (
          <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Viewing Category: <strong className="text-white font-display">{activeCategoryObj.name}</strong></span>
              {activeCategoryObj.description && (
                <span className="hidden md:inline text-zinc-500">— {activeCategoryObj.description}</span>
              )}
            </div>
            <span className="text-amber-400 font-bold">{getCategoryCount(activeCategoryObj.id)} Service Packages</span>
          </div>
        )}
      </div>

      {/* Services List & Package Cards */}
      <div className="space-y-16">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">No Offerings Found</h3>
            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              We couldn't find any products or services matching "{searchQuery}". Try searching for keywords like "website", "marketing", "subsidy", or "reels".
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCat('all'); }} 
              className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all shadow-lg inline-flex items-center gap-1.5"
            >
              Reset All Search Filters
            </button>
          </div>
        ) : (
          filteredServices.map((srv) => (
            <div key={srv.id} className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 backdrop-blur-xl shadow-2xl">
              {/* Service Title Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full inline-block mb-1.5">
                    {srv.category_name}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">{srv.name}</h2>
                  <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">{srv.short_description}</p>
                </div>
                <Link
                  to={`/services/${srv.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-md"
                >
                  Full Details & Inclusions <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Package Tiers Grid: Startup, Enterprise, Organization */}
              {srv.packages && srv.packages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {srv.packages.map((pkg) => {
                    const isEnterprise = pkg.tier === 'ENTERPRISE';
                    const isOrg = pkg.tier === 'ORGANIZATION';

                    return (
                      <div
                        key={pkg.id}
                        className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                          isEnterprise
                            ? 'bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-950 border-2 border-amber-500/50 shadow-2xl scale-[1.02] z-10'
                            : 'bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        {/* Package Badge */}
                        {pkg.badge && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider font-mono shadow-lg">
                            {pkg.badge}
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Header & Target Audience */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
                              {pkg.tier}
                            </span>
                            <h3 className="text-xl font-bold text-white mt-0.5 font-display">{pkg.name}</h3>
                            <p className="text-[11px] text-amber-400/90 font-medium mt-1">{pkg.target_audience}</p>
                          </div>

                          {/* Price Tag */}
                          <div className="py-3 border-y border-zinc-800/80">
                            {isOrg ? (
                              <div>
                                <div className="text-2xl font-black text-white font-display">Contact Us</div>
                                <div className="text-[11px] text-emerald-400 font-semibold font-mono">For a Custom Quotation</div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-3xl font-black text-white font-display">
                                  {formatAmount(pkg.price)}
                                </div>
                                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                  {pkg.price_display_type === 'PER_MONTH' && 'Starting at / Month'}
                                  {pkg.price_display_type === 'PER_PROJECT' && 'Starting at / Project'}
                                  {pkg.price_display_type === 'PER_CASE' && 'Starting at / Case'}
                                  {pkg.price_display_type === 'STARTING_FROM' && 'Starting Price'}
                                  {pkg.price_display_type === 'FIXED' && 'Fixed Price Package'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Inclusions List */}
                          <div>
                            <div className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 font-mono">Key Inclusions:</div>
                            <ul className="space-y-2">
                              {pkg.inclusions.slice(0, 7).map((inc, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{inc}</span>
                                </li>
                              ))}
                              {pkg.inclusions.length > 7 && (
                                <li className="text-[10px] text-amber-400 font-semibold font-mono pt-1">
                                  + {pkg.inclusions.length - 7} more inclusions (view full details)
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Exclusions Brief */}
                          {pkg.exclusions && pkg.exclusions.length > 0 && (
                            <div className="pt-2 border-t border-zinc-800/60">
                              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Excludes:</div>
                              <div className="text-[11px] text-zinc-400 italic line-clamp-2">
                                {pkg.exclusions.slice(0, 3).join(', ')}...
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-2">
                          <button
                            onClick={() => setActiveEnquiry({ service: srv, packageItem: pkg })}
                            className={`w-full py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                              isEnterprise
                                ? 'bg-amber-400 hover:bg-amber-300 text-black'
                                : isOrg
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                : 'bg-white hover:bg-zinc-200 text-black'
                            }`}
                          >
                            {pkg.cta_text || (isOrg ? 'Request a Quotation' : 'Get Started')} <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/services/${srv.slug}`}
                            className="w-full py-2 text-center text-[11px] font-bold text-zinc-400 hover:text-white block transition-colors"
                          >
                            View Details & Comparison
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Service Disclaimer */}
              {srv.disclaimer && (
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{srv.disclaimer}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Package Enquiry & Quotation Modal */}
      {activeEnquiry && (
        <PackageEnquiryModal
          service={activeEnquiry.service}
          packageItem={activeEnquiry.packageItem}
          isOpen={!!activeEnquiry}
          onClose={() => setActiveEnquiry(null)}
        />
      )}
    </div>
  );
};
