import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Building2, User, ListPlus, Calculator, 
  Settings, Eye, ArrowRight, ArrowLeft, Check, Download,
  Plus, Trash2, Printer, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DocumentDataPayload, DocumentItem, DocumentTypeCode, DocumentCustomization, PaymentInformation } from '../../types/document.types';
import { DocumentService } from '../../services/documentService';
import LivePreview from '../../components/documents/LivePreview';
import { CustomizationSidebar } from '../../components/documents/CustomizationSidebar';

// Helper to handle file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Helper to generate empty payload
const defaultPayload: DocumentDataPayload = {
  company_details: {
    company_name: '',
    email: '',
    phone: '',
    address: '',
    gstin: ''
  },
  client_details: {
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: ''
  },
  items: [{ id: '1', description: '', quantity: 1, unit_price: 0, total: 0 }],
  subtotal: 0,
  total_tax: 0,
  total_discount: 0,
  grand_total: 0,
  advance_paid: 0,
  balance_due: 0,
  issue_date: new Date().toISOString().split('T')[0],
  notes: '',
  terms: '1. Payment is due within 15 days.\n2. Goods once sold will not be taken back.',
  customization: {
    font_family: 'Inter',
    font_weight: 'normal',
    primary_color: '#4F6BF6', // primary from tailwind config
    secondary_color: '#1a1a1a',
    accent_color: '#F4F5F7',
    text_color: '#111827',
    header_layout: 'logo-left',
    logo_size: 'medium',
    show_qr: false,
  },
  payment_details: {}
};

const steps = [
  { id: 'type', title: 'Document Type', icon: FileText },
  { id: 'company', title: 'Your Details', icon: Building2 },
  { id: 'client', title: 'Client Details', icon: User },
  { id: 'items', title: 'Items', icon: ListPlus },
  { id: 'taxes', title: 'Taxes & Discounts', icon: Calculator },
  { id: 'terms', title: 'Notes & Terms', icon: Settings },
  { id: 'preview', title: 'Preview & Generate', icon: Eye }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export const DocumentWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [documentType, setDocumentType] = useState<DocumentTypeCode>('INVOICE');
  const [payload, setPayload] = useState<DocumentDataPayload>(defaultPayload);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Recalculate totals whenever items or advance payment change
  useEffect(() => {
    const updated = DocumentService.calculateDocumentTotals(payload);
    if (updated.grand_total !== payload.grand_total || updated.balance_due !== payload.balance_due) {
      setPayload(updated);
    }
  }, [payload.items, payload.advance_paid]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleGenerate = async () => {
    if (generationStatus === 'generating') return;
    setGenerationStatus('generating');
    setIsGenerating(true);
    try {
      // Ensure React has flushed all state updates
      await new Promise(resolve => setTimeout(resolve, 500));
      window.print();
      setGenerationStatus('success');
      setTimeout(() => setGenerationStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setGenerationStatus('error');
      setTimeout(() => setGenerationStatus('idle'), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCompany = (field: string, value: string) => {
    setPayload(p => ({ ...p, company_details: { ...p.company_details, [field]: value } }));
  };

  const updateClient = (field: string, value: string) => {
    setPayload(p => ({ ...p, client_details: { ...p.client_details, [field]: value } }));
  };

  const updateItem = (index: number, field: keyof DocumentItem, value: any) => {
    const newItems = [...payload.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setPayload(p => ({ ...p, items: newItems }));
  };

  const addItem = () => {
    setPayload(p => ({
      ...p,
      items: [...p.items, { id: Math.random().toString(), description: '', quantity: 1, unit_price: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = payload.items.filter((_, i) => i !== index);
    setPayload(p => ({ ...p, items: newItems }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validation
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a valid PNG, JPG, JPEG or WEBP image under 5 MB.");
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid PNG, JPG, JPEG or WEBP image.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      updateCompany('logo_url', base64);
    } catch (err) {
      console.error(err);
      alert("Error processing image.");
    }
  };

  const updateCustomization = (field: keyof DocumentCustomization, value: any) => {
    setPayload(p => ({ ...p, customization: { ...p.customization, [field]: value } }));
  };

  const updatePayment = (field: keyof PaymentInformation, value: any) => {
    setPayload(p => ({ ...p, payment_details: { ...p.payment_details, [field]: value } }));
  };

  const handleSavePreset = () => {
    setShowPremiumModal(true);
  };

  // ----------------------------------------------------------------------
  // STEP RENDERERS
  // ----------------------------------------------------------------------
  
  const renderTypeStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-white">What do you want to create?</h3>
          <p className="text-sm text-zinc-400">Select a document format to get started.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'INVOICE', label: 'Tax Invoice', desc: 'Request payment for goods/services' },
          { id: 'QUOTATION', label: 'Quotation / Estimate', desc: 'Provide a price quote to a client' },
          { id: 'PO', label: 'Purchase Order', desc: 'Order goods/services from a vendor' },
          { id: 'RECEIPT', label: 'Payment Receipt', desc: 'Acknowledge received payment' }
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => { setDocumentType(type.id as DocumentTypeCode); handleNext(); }}
            className={`p-6 rounded-2xl border text-left transition-all group cursor-pointer ${
              documentType === type.id 
                ? 'bg-amber-400/10 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.15)]' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{type.label}</h4>
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${documentType === type.id ? 'border-amber-400 bg-amber-400 text-black' : 'border-zinc-600'}`}>
                {documentType === type.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCompanyStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-white">Company Branding</h3>
          <p className="text-sm text-zinc-400">Add your logo and business details.</p>
        </div>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all cursor-pointer"
        >
          Next Step <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
        </button>
      </div>
      
      <div className="bg-zinc-900 border border-dashed border-zinc-700 rounded-xl p-6 text-center">
        {payload.company_details.logo_url ? (
          <div className="flex flex-col items-center">
            <img src={payload.company_details.logo_url} alt="Logo Preview" className="h-24 mb-4 object-contain" />
            <div className="flex gap-2">
              <label className="cursor-pointer text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors shadow">
                Change Logo
                <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={handleLogoUpload} />
              </label>
              <button 
                onClick={() => updateCompany('logo_url', '')}
                className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="cursor-pointer flex flex-col items-center justify-center p-6 transition-all hover:bg-zinc-800/60 rounded-lg">
              <div className="w-12 h-12 bg-amber-400/10 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-bold text-white mb-1">Upload Company Logo</span>
              <span className="text-xs text-zinc-400 mb-4">Drag & Drop or Browse (Max 5MB)</span>
              <span className="text-[10px] text-zinc-500">Recommended: PNG with transparent background</span>
              <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Company Name *</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
            value={payload.company_details.company_name || ''}
            onChange={(e) => updateCompany('company_name', e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">GSTIN</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
            value={payload.company_details.gstin || ''}
            onChange={(e) => updateCompany('gstin', e.target.value)}
            placeholder="e.g. 27AAAAA0000A1Z5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
            value={payload.company_details.email || ''}
            onChange={(e) => updateCompany('email', e.target.value)}
            placeholder="contact@company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Phone Number</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
            value={payload.company_details.phone || ''}
            onChange={(e) => updateCompany('phone', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Business Address</label>
          <textarea 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400 min-h-[100px]"
            value={payload.company_details.address || ''}
            onChange={(e) => updateCompany('address', e.target.value)}
            placeholder="Street address, City, State, PIN"
          />
        </div>
      </div>
    </div>
  );

  const renderClientStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-white">Billed To (Client Details)</h3>
          <p className="text-sm text-zinc-400">Enter client name, tax ID, and address.</p>
        </div>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all cursor-pointer"
        >
          Next Step <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Client / Company Name *</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
            value={payload.client_details.name}
            onChange={(e) => updateClient('name', e.target.value)}
            placeholder="Client Name or Business"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Client GSTIN</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
            value={payload.client_details.gstin || ''}
            onChange={(e) => updateClient('gstin', e.target.value)}
            placeholder="e.g. 27BBBBB0000B1Z6"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Billing Address</label>
          <textarea 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400 min-h-[100px]"
            value={payload.client_details.address || ''}
            onChange={(e) => updateClient('address', e.target.value)}
            placeholder="Client's billing address"
          />
        </div>
      </div>
    </div>
  );

  const renderItemsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-white">Line Items</h3>
          <p className="text-sm text-zinc-400">Add services, products, hours, or deliverables.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={addItem} 
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" /> Add Item
          </button>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-zinc-800 border-2 border-zinc-600 hover:bg-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Next Step <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {payload.items.map((item, index) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Description *</label>
              <input 
                type="text" 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                placeholder="e.g. Website Design & Development"
              />
            </div>
            <div className="w-full md:w-24">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Qty</label>
              <input 
                type="number" 
                min="1"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="w-full md:w-36">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Rate (₹)</label>
              <input 
                type="number" 
                min="0"
                step="any"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400"
                value={item.unit_price}
                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div className="w-full md:w-36 pt-2 md:pt-0">
              <label className="block text-xs font-semibold text-zinc-300 mb-1 hidden md:block">Total</label>
              <div className="px-3 py-2.5 text-amber-400 font-bold text-sm bg-zinc-800 rounded-lg border border-zinc-700 flex items-center h-[42px]">
                {formatCurrency(item.quantity * item.unit_price)}
              </div>
            </div>
            {payload.items.length > 1 && (
              <button 
                onClick={() => removeItem(index)}
                className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-2 md:mt-0 border border-transparent hover:border-red-500/20"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTaxesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-white">Taxes & Discounts</h3>
          <p className="text-sm text-zinc-400">Apply GST rates or item-level discounts.</p>
        </div>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all cursor-pointer"
        >
          Next Step <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
        </button>
      </div>
      
      <div className="space-y-4">
        {payload.items.map((item, index) => (
          <div key={`tax-${item.id}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 font-semibold text-white truncate max-w-[240px]">
              {item.description || `Item ${index + 1}`}
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Tax (%)</label>
                <select 
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary w-28"
                  value={item.tax_percentage || 0}
                  onChange={(e) => updateItem(index, 'tax_percentage', parseFloat(e.target.value))}
                >
                  <option value="0" className="bg-zinc-900 text-white">None (0%)</option>
                  <option value="5" className="bg-zinc-900 text-white">5% GST</option>
                  <option value="12" className="bg-zinc-900 text-white">12% GST</option>
                  <option value="18" className="bg-zinc-900 text-white">18% GST</option>
                  <option value="28" className="bg-zinc-900 text-white">28% GST</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Disc (%)</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary w-24 placeholder-zinc-400"
                  value={item.discount_percentage || 0}
                  onChange={(e) => updateItem(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advance Payment Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6">
        <div className="flex items-center gap-2.5 mb-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-bold text-white">Advance Payment / Deposit Received</h4>
        </div>
        <p className="text-xs text-zinc-400 mb-6">If the client made a deposit or partial advance payment, enter it below to calculate the remaining Balance Due on the invoice.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Advance Amount Paid (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</span>
              <input 
                type="number"
                min="0"
                step="any"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-8 pr-4 py-3 text-white text-base focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-500 font-bold"
                value={payload.advance_paid === 0 ? '' : (payload.advance_paid || '')}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setPayload(p => {
                    const updated = { ...p, advance_paid: val };
                    return DocumentService.calculateDocumentTotals(updated);
                  });
                }}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-zinc-800/90 border border-zinc-700 rounded-xl p-4 flex justify-between items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">Remaining Balance Due</span>
              <span className="text-xl font-black text-amber-400">
                {formatCurrency(Math.max(0, (payload.grand_total || 0) - (payload.advance_paid || 0)))}
              </span>
            </div>
            {payload.advance_paid && payload.advance_paid > 0 ? (
              <span className="text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-full border border-emerald-500/30">
                Advance Deducted
              </span>
            ) : (
              <span className="text-xs px-3 py-1.5 bg-zinc-700/60 text-zinc-300 font-bold rounded-full">
                Full Amount Due
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-2xl font-bold text-white">Notes & Terms</h3>
          <p className="text-sm text-zinc-400">Set payment timeline, validity, and footer terms.</p>
        </div>
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all cursor-pointer"
        >
          Preview & Customize <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
        </button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Issue Date</label>
            <input 
              type="date" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900"
              value={payload.issue_date}
              onChange={(e) => setPayload(p => ({ ...p, issue_date: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Due Date / Valid Until</label>
            <input 
              type="date" 
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900"
              value={payload.due_date || ''}
              onChange={(e) => setPayload(p => ({ ...p, due_date: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Additional Notes (Optional)</label>
          <textarea 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400 min-h-[80px]"
            value={payload.notes || ''}
            onChange={(e) => setPayload(p => ({ ...p, notes: e.target.value }))}
            placeholder="Thank you for your business!"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Terms & Conditions</label>
          <textarea 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:bg-zinc-900 placeholder-zinc-400 min-h-[100px]"
            value={payload.terms || ''}
            onChange={(e) => setPayload(p => ({ ...p, terms: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-zinc-900 p-4 rounded-xl border border-zinc-800 print:hidden">
        <div>
          <h3 className="text-2xl font-bold text-white">Preview & Customize</h3>
          <p className="text-zinc-400 text-sm">Review, style, and download your {documentType.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-zinc-500 bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all text-sm cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Print
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || generationStatus === 'success'}
            className={`flex items-center gap-2 px-6 py-2.5 font-black rounded-xl text-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)] disabled:opacity-50 ${
              generationStatus === 'success' ? 'bg-green-500 text-white' :
              generationStatus === 'error' ? 'bg-red-600 text-white' :
              'bg-amber-400 hover:bg-amber-300 text-black hover:scale-105'
            }`}
          >
            {generationStatus === 'generating' ? 'Generating PDF...' : 
             generationStatus === 'success' ? 'PDF Ready ✓' : 
             'Download PDF'}
            {generationStatus !== 'generating' && generationStatus !== 'success' && <Download className="w-4 h-4 text-black stroke-[3]" />}
            {generationStatus === 'success' && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-2 flex-1 min-h-0">
        {/* Customization Sidebar (Left) - Hidden when printing */}
        <div className="w-full md:w-72 lg:w-80 shrink-0 max-h-[500px] md:h-[600px] overflow-y-auto custom-scrollbar print:hidden">
          <CustomizationSidebar 
            customization={payload.customization}
            paymentDetails={payload.payment_details}
            onChangeCustomization={updateCustomization}
            onChangePayment={updatePayment}
            onSavePreset={handleSavePreset}
          />
        </div>

        {/* Live Preview (Right) */}
        <div className="flex-1 bg-white rounded-xl shadow-xl overflow-x-auto overflow-y-auto border border-border print:shadow-none print:border-none print:m-0 print:p-0 print:h-auto print:w-full print:overflow-visible print:bg-white min-h-[450px] md:h-[600px] custom-scrollbar p-1 sm:p-4">
          <div className="min-w-[600px] md:min-w-0">
            <LivePreview payload={payload} typeCode={documentType} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderTypeStep();
      case 1: return renderCompanyStep();
      case 2: return renderClientStep();
      case 3: return renderItemsStep();
      case 4: return renderTaxesStep();
      case 5: return renderTermsStep();
      case 6: return renderPreviewStep();
      default: return renderTypeStep();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background pt-24 pb-12 print:p-0 print:m-0 print:bg-white print:min-h-0">
        <div className="container-custom print:max-w-none print:p-0 print:m-0 print:w-full">
          
          {/* Header & Stepper (Hidden when printing) */}
          <div className="mb-8 print:hidden">
            <h1 className="text-3xl font-heading font-bold text-white mb-6">Document Generator</h1>
            
            {/* Stepper */}
            <div className="flex items-center justify-between overflow-x-auto custom-scrollbar pb-4 gap-2">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center min-w-[80px] opacity-100">
                  <button 
                    onClick={() => setCurrentStep(idx)}
                    disabled={idx > currentStep + 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      currentStep === idx 
                        ? 'bg-amber-400 text-black font-bold shadow-glow scale-110' 
                        : currentStep > idx 
                          ? 'bg-amber-400/20 text-amber-400 hover:bg-amber-400/30'
                          : 'bg-zinc-900 border border-border text-muted cursor-not-allowed'
                    }`}
                  >
                    {currentStep > idx ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                  </button>
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${currentStep === idx ? 'text-amber-400 font-extrabold' : 'text-muted'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-zinc-900 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="h-full bg-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Main Wizard Area */}
          <div className="bg-background md:bg-zinc-900 rounded-none md:rounded-2xl p-0 md:p-8 md:border border-border min-h-[500px] print:border-none print:bg-white print:p-0 print:m-0 print:w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="print:opacity-100 print:x-0"
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer (Hidden when printing) */}
          <div className="mt-8 flex justify-between items-center print:hidden">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-zinc-700"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2.5 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.6)] hover:scale-105 transition-all cursor-pointer"
              >
                Next Step <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl border-2 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all text-sm cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4 text-amber-400" /> Print
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || generationStatus === 'success'}
                  className={`flex items-center gap-2.5 px-8 py-3.5 font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all cursor-pointer ${
                    generationStatus === 'success' ? 'bg-green-500 text-white' :
                    generationStatus === 'error' ? 'bg-red-600 text-white' :
                    'bg-amber-400 hover:bg-amber-300 text-black hover:scale-105'
                  }`}
                >
                  {generationStatus === 'generating' ? 'Generating PDF...' : 
                   generationStatus === 'success' ? 'PDF Ready ✓' : 
                   'Download PDF'}
                  <Download className="w-5 h-5 text-black stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPremiumModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-border rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Extended Storage & Customization</h3>
              <p className="text-muted mb-6">Advanced customization and saving branding presets are available with our premium plan for just <strong>₹250/month</strong>.</p>
              <ul className="space-y-3 mb-8">
                {['Extended document storage', 'Saved branding presets', 'Logo library', 'Multiple font choices'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-border text-white font-bold hover:bg-background transition-colors"
                >
                  Maybe Later
                </button>
                <button 
                  onClick={() => { navigate('/upgrade'); setShowPremiumModal(false); }}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-glow"
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DocumentWizard;
