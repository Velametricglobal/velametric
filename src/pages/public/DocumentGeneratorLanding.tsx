import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Shield, Clock, IndianRupee, CheckCircle, ArrowRight, Download, Zap, Sparkles, Building2 } from 'lucide-react';

export const DocumentGeneratorLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGenerating = () => {
    navigate('/tools/document-generator/wizard');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white selection:bg-amber-400 selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-28 lg:pb-32 overflow-hidden border-b border-slate-200 dark:border-zinc-800/80">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-mono font-bold tracking-widest uppercase"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Free Enterprise Tool • GST Ready</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight uppercase leading-none text-black dark:text-white"
            >
              Create Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500">Documents</span> in Seconds
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              Generate GST-compliant Invoices, Quotations, and Purchase Orders instantly. Download print-ready PDFs for free, or manage cloud archives seamlessly.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button 
                onClick={handleStartGenerating}
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Generating for Free
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <Link
                to="/services"
                className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-900 dark:text-white rounded-2xl font-bold text-sm uppercase tracking-wider border border-slate-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                Explore Enterprise Services
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-zinc-900/40 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono">Everything Included</span>
            <h2 className="text-3xl lg:text-4xl font-black font-display uppercase tracking-tight text-black dark:text-white">
              Everything You Need to Run Your Business Billing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
              Built specifically for Indian MSMEs, startups, agencies, and growing commercial enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Multiple Formats & Templates",
                desc: "Choose from clean, professional layouts for Tax Invoices, Quotations, and Purchase Orders."
              },
              {
                icon: IndianRupee,
                title: "GST Auto-Calculations",
                desc: "Auto-calculate IGST, CGST, and SGST accurately based on state codes and tax brackets."
              },
              {
                icon: Download,
                title: "Instant PDF Export",
                desc: "Download high-resolution, print-ready PDF documents instantly with custom branding."
              },
              {
                icon: Shield,
                title: "Bank-Grade Cloud Storage",
                desc: "Your billing archives are securely protected with PostgreSQL Row Level Security."
              },
              {
                icon: Clock,
                title: "Quick-Fill Client Directory",
                desc: "Save client and company GSTIN profiles to auto-fill future documents in 1 click."
              },
              {
                icon: Zap,
                title: "Real-Time Live Preview",
                desc: "See your document update live with accurate typography, borders, and itemized calculations."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:border-amber-400/60 dark:hover:border-amber-500/50 transition-all shadow-md group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing / Storage Plans */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono">Simple & Fair</span>
            <h2 className="text-3xl lg:text-4xl font-black font-display uppercase tracking-tight text-black dark:text-white">
              Transparent Document Storage
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
              Generate and download as many documents as you want for free. Upgrade only if you need extended cloud history.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between shadow-lg">
              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-full uppercase">Basic</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 mb-1 font-display">Free Starter Tier</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-black dark:text-white">₹0</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">/ forever</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400">Perfect for quick, one-off invoices and quotations.</p>
                </div>
                <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                  {[
                    "Create GST Invoices, Quotations & POs",
                    "Custom Logo & Company Details",
                    "Print-Ready Instant PDF Downloads",
                    "Real-Time Live Preview Calculation",
                    "7-Day Free Cloud Retention"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={handleStartGenerating}
                className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                Use Free Generator
              </button>
            </div>

            {/* Paid Tier */}
            <div className="bg-gradient-to-b from-amber-500/10 via-slate-50 to-slate-50 dark:from-amber-500/15 dark:via-zinc-900 dark:to-zinc-900 rounded-3xl p-8 border-2 border-amber-500 relative flex flex-col justify-between shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black font-mono px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                MOST POPULAR
              </div>

              <div>
                <div className="mb-6">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full uppercase">Enterprise</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 mb-1 font-display">Pro Cloud Storage</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-black dark:text-white">₹250</span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">/ month</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400">For businesses that require perpetual billing history and multi-brand control.</p>
                </div>

                <ul className="space-y-3 mb-8 text-xs sm:text-sm">
                  {[
                    "Everything in Free Starter Tier",
                    "Unlimited Lifetime Document Storage",
                    "Saved Multi-Company Profiles",
                    "Brand Color Themes & Custom Fonts",
                    "Automated Payment Tracking & CRM Sync",
                    "Priority Technical Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-zinc-300">
                      <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={handleStartGenerating}
                className="w-full py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Create Document & Get Started →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 dark:bg-black border-t border-slate-800 dark:border-zinc-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
            Ready to Streamline Your Invoicing & Proposals?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Experience lightning-fast GST invoice and quotation creation powered by Velametric Global.
          </p>
          <div className="pt-2">
            <button 
              onClick={handleStartGenerating}
              className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-2xl hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              Generate Your First Document Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DocumentGeneratorLanding;
