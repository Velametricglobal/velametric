import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Service, ServicePackage } from '../../types/database.types';
import { serviceService } from '../../services/serviceService';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { PackageEnquiryModal } from '../../components/public/PackageEnquiryModal';
import { useCurrency } from '../../context/CurrencyContext';
import { Laptop, ArrowRight, CheckCircle2, HelpCircle, ChevronRight, Check, X, ShieldCheck, Sparkles, MessageCircle, Phone, FileText } from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatAmount } = useCurrency();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Enquiry Modal State
  const [activeEnquiryPkg, setActiveEnquiryPkg] = useState<ServicePackage | null>(null);

  useEffect(() => {
    if (slug) {
      serviceService.getServiceBySlug(slug).then(srv => {
        setService(srv);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Service Not Found</h2>
        <Link to="/services" className="text-amber-400 font-semibold underline">Return to Products & Services</Link>
      </div>
    );
  }

  const startupPkg = service.packages?.find(p => p.tier === 'STARTUP');
  const enterprisePkg = service.packages?.find(p => p.tier === 'ENTERPRISE');
  const orgPkg = service.packages?.find(p => p.tier === 'ORGANIZATION');

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Breadcrumb & Currency Switcher Bar */}
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link to="/services" className="hover:text-white font-semibold">Products & Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-bold">{service.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase font-mono hidden sm:inline">Pricing Currency:</span>
          <CurrencySelector compact />
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 rounded-3xl backdrop-blur-xl">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest font-mono">
            {service.category_name || 'Enterprise Solution'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-display">
            {service.name}
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
            {service.full_description || service.short_description}
          </p>

          {service.benefits && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => {
                if (enterprisePkg) setActiveEnquiryPkg(enterprisePkg);
                else if (startupPkg) setActiveEnquiryPkg(startupPkg);
              }}
              className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
            >
              Get Started / Order Package <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xl"
            >
              <MessageCircle className="w-4 h-4" /> Instant WhatsApp Inquiry
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative">
          <img src={service.cover_image} alt={service.name} className="w-full h-80 lg:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
        </div>
      </div>

      {/* Package Pricing Tiers */}
      {service.packages && service.packages.length > 0 && (
        <div className="space-y-12 md:space-y-16 pt-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">SELECT YOUR PACKAGE TIER</span>
            <h2 className="text-3xl font-bold text-white font-display">Standardized Package Pricing</h2>
            <p className="text-zinc-400 text-xs sm:text-sm">Transparent starting packages for Indian startups, growing companies, and large organizations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {service.packages.map((pkg) => {
              const isEnterprise = pkg.tier === 'ENTERPRISE';
              const isOrg = pkg.tier === 'ORGANIZATION';

              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                    isEnterprise
                      ? 'bg-amber-50/50 dark:bg-gradient-to-b dark:from-amber-500/10 dark:via-zinc-900 dark:to-zinc-950 border-2 border-amber-500 shadow-2xl scale-105 z-10'
                      : 'bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 shadow-lg dark:shadow-none'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-wider font-mono shadow-lg">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-mono">
                        {pkg.tier}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{pkg.name}</h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">{pkg.target_audience}</p>
                    </div>

                    <div className="py-4 border-y border-slate-200 dark:border-zinc-800">
                      {isOrg ? (
                        <div>
                          <div className="text-3xl font-black text-slate-900 dark:text-white font-display">Contact Us</div>
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono mt-1">Request a Custom Quotation</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl font-black text-slate-900 dark:text-white font-display">
                            {formatAmount(pkg.price)}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono mt-1">
                            {pkg.price_display_type === 'PER_MONTH' && 'Starting at / Month'}
                            {pkg.price_display_type === 'PER_PROJECT' && 'Starting at / Project'}
                            {pkg.price_display_type === 'PER_CASE' && 'Starting at / Case'}
                            {pkg.price_display_type === 'STARTING_FROM' && 'Starting Price'}
                            {pkg.price_display_type === 'FIXED' && 'Fixed Price Package'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* What's Included */}
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono">What's Included:</div>
                      <ul className="space-y-2.5">
                        {pkg.inclusions.map((inc, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-zinc-300">
                            <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Excluded */}
                    {pkg.exclusions && pkg.exclusions.length > 0 && (
                      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
                        <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2 font-mono">What's Excluded:</div>
                        <ul className="space-y-1.5">
                          {pkg.exclusions.map((exc, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 dark:text-zinc-400 italic">
                              <X className="w-3.5 h-3.5 text-rose-500/80 shrink-0 mt-0.5" />
                              <span>{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-200 dark:border-zinc-800">
                    <button
                      onClick={() => setActiveEnquiryPkg(pkg)}
                      className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl ${
                        isEnterprise
                          ? 'bg-amber-500 hover:bg-amber-400 text-black'
                          : isOrg
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black'
                      }`}
                    >
                      {pkg.cta_text || (isOrg ? 'Request a Quotation' : 'Get Started')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Package Comparison Table */}
      {startupPkg && enterprisePkg && orgPkg && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">PACKAGE COMPARISON</span>
            <h3 className="text-2xl font-bold text-white font-display">Side-by-Side Feature Matrix</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-4">Feature / Parameter</th>
                  <th className="p-4 text-center">STARTUP</th>
                  <th className="p-4 text-center text-amber-400">ENTERPRISE (POPULAR)</th>
                  <th className="p-4 text-center text-emerald-400">ORGANIZATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="p-4 font-bold text-white">Starting Price</td>
                  <td className="p-4 text-center font-bold text-white">{formatAmount(startupPkg.price)}</td>
                  <td className="p-4 text-center font-bold text-amber-400">{formatAmount(enterprisePkg.price)}</td>
                  <td className="p-4 text-center font-bold text-emerald-400">Custom Quotation</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Target Audience</td>
                  <td className="p-4 text-center text-zinc-400">{startupPkg.target_audience}</td>
                  <td className="p-4 text-center text-zinc-300 font-semibold">{enterprisePkg.target_audience}</td>
                  <td className="p-4 text-center text-zinc-300">{orgPkg.target_audience}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Features Scope</td>
                  <td className="p-4 text-center text-zinc-400">Essential Scope</td>
                  <td className="p-4 text-center text-amber-300 font-bold">Advanced Custom Scope</td>
                  <td className="p-4 text-center text-emerald-300 font-bold">Full Enterprise Architecture</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Technical Support</td>
                  <td className="p-4 text-center text-zinc-400">1 Month Basic Support</td>
                  <td className="p-4 text-center text-amber-300 font-semibold">3 Months Dedicated Support</td>
                  <td className="p-4 text-center text-emerald-300 font-bold">24/7 Dedicated SLA Support</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-zinc-300">Action CTA</td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveEnquiryPkg(startupPkg)} className="px-4 py-1.5 rounded-xl bg-white text-black font-bold text-[11px]">
                      Get Started
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveEnquiryPkg(enterprisePkg)} className="px-4 py-1.5 rounded-xl bg-amber-400 text-black font-bold text-[11px]">
                      Get Started
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setActiveEnquiryPkg(orgPkg)} className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-[11px]">
                      Request Quote
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Execution Process Steps */}
      {service.process_steps && service.process_steps.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">DELIVERY METHODOLOGY</span>
            <h3 className="text-2xl font-bold text-white font-display">6-Step Execution Process</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process_steps.map((step, idx) => (
              <div key={idx} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-2 relative">
                <span className="text-2xl font-black text-amber-400 font-mono opacity-40">0{idx + 1}</span>
                <h4 className="text-sm font-bold text-white font-display">{step.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Disclaimer */}
      {service.disclaimer && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white">Important Service Disclaimer:</div>
            <div>{service.disclaimer}</div>
          </div>
        </div>
      )}

      {/* Interactive Package Enquiry Modal */}
      {activeEnquiryPkg && (
        <PackageEnquiryModal
          service={service}
          packageItem={activeEnquiryPkg}
          isOpen={!!activeEnquiryPkg}
          onClose={() => setActiveEnquiryPkg(null)}
        />
      )}
    </div>
  );
};
