import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Shield, Clock, IndianRupee, CheckCircle, ArrowRight, Download, Zap } from 'lucide-react';


const DocumentGeneratorLanding: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGenerating = () => {
    navigate('/tools/document-generator/wizard');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-secondary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wider">FREE TOOL FOR BUSINESSES</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-heading font-bold text-text leading-tight mb-6"
            >
              Create Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Documents</span> in Minutes
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted mb-10 max-w-2xl mx-auto"
            >
              Generate GST-compliant Invoices, Quotations, and Purchase Orders instantly. Download as PDF for free, or upgrade for unlimited cloud storage.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={handleStartGenerating}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all duration-300 shadow-glow flex items-center justify-center gap-2"
              >
                Start Generating for Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-4">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-lg text-muted">
              Built specifically for Indian MSMEs, freelancers, and growing enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Multiple Templates",
                desc: "Choose from beautiful, professional templates for Invoices, POs, and Quotes."
              },
              {
                icon: IndianRupee,
                title: "GST Compliant",
                desc: "Auto-calculate IGST, CGST, and SGST accurately based on your state."
              },
              {
                icon: Download,
                title: "Instant PDF Export",
                desc: "Download print-ready PDFs instantly without any watermarks."
              },
              {
                icon: Shield,
                title: "Secure Storage",
                desc: "Your data is encrypted and securely stored on our enterprise cloud."
              },
              {
                icon: Clock,
                title: "Save Time",
                desc: "Save client and company details to auto-fill future documents in seconds."
              },
              {
                icon: Zap,
                title: "Live Preview",
                desc: "See exactly what your document looks like as you type."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Storage Plans */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-text mb-4">
              Simple, Transparent Storage
            </h2>
            <p className="text-lg text-muted">
              Generate as many documents as you want for free. Upgrade only if you need permanent cloud history.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-background rounded-3xl p-8 border border-border flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-text mb-2">Free Tier</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black text-text">₹0</span>
                  <span className="text-muted">/ forever</span>
                </div>
                <p className="text-muted">Perfect for quick, one-off documents.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Create Documents (Invoice, PO, etc.)",
                  "Upload Company Logo",
                  "Professional Templates",
                  "Generate & Download PDFs",
                  "7-Day Cloud Storage Retention"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-text">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleStartGenerating}
                className="w-full py-4 rounded-xl font-bold text-text bg-surface border border-border hover:bg-border transition-colors"
              >
                Use Free Tool
              </button>
            </div>

            {/* Paid Tier */}
            <div className="bg-gradient-to-b from-primary/20 to-surface rounded-3xl p-8 border border-primary relative flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                RECOMMENDED
              </div>
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold text-text mb-2">Extended Storage & Customization</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black text-text">₹250</span>
                  <span className="text-muted">/ month</span>
                </div>
                <p className="text-muted">For professionals who need complete history and brand control.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                {[
                  "Everything in Free Tier",
                  "Extended Document Storage",
                  "Saved Branding Presets",
                  "Logo Library",
                  "Brand Colors & Custom Styling",
                  "Google Fonts Integration",
                  "Complete Document History"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-text">{item}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-glow transition-all relative z-10"
              >
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-text mb-6">
            Ready to look more professional?
          </h2>
          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
            Join thousands of Indian businesses using Vela Metric to manage their billing and quotations.
          </p>
          <button 
            onClick={handleStartGenerating}
            className="px-10 py-5 bg-text text-background rounded-xl font-bold hover:bg-white transition-all text-lg inline-flex items-center gap-2"
          >
            Create Your First Document Now
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </>
  );
};

export default DocumentGeneratorLanding;
