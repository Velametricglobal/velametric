import React, { useState } from 'react';
import { Palette, Type, Layout, CreditCard, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { DocumentCustomization, PaymentInformation } from '../../types/document.types';

interface CustomizationSidebarProps {
  customization: DocumentCustomization;
  paymentDetails: PaymentInformation;
  onChangeCustomization: (field: keyof DocumentCustomization, value: any) => void;
  onChangePayment: (field: keyof PaymentInformation, value: any) => void;
  onSavePreset: () => void;
}

const FONTS = [
  'Inter', 'Roboto', 'Poppins', 'Montserrat', 
  'Open Sans', 'Lato', 'Nunito', 'Raleway', 
  'Playfair Display', 'Merriweather'
];

const PRESETS = [
  { name: 'Professional', colors: { primary: '#0A2A66', secondary: '#333333', accent: '#F3F4F6' }, font: 'Inter' },
  { name: 'Modern', colors: { primary: '#4F6BF6', secondary: '#111827', accent: '#EEF2FF' }, font: 'Poppins' },
  { name: 'Minimal', colors: { primary: '#000000', secondary: '#6B7280', accent: '#F9FAFB' }, font: 'Roboto' },
  { name: 'Corporate', colors: { primary: '#047857', secondary: '#1F2937', accent: '#ECFDF5' }, font: 'Montserrat' },
];

export const CustomizationSidebar: React.FC<CustomizationSidebarProps> = ({ 
  customization, paymentDetails, onChangeCustomization, onChangePayment, onSavePreset 
}) => {
  const [activeSection, setActiveSection] = useState<string>('colors');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [customPresets, setCustomPresets] = useState<Array<{ name: string; colors: { primary: string; secondary: string; accent: string }; font: string }>>(() => {
    try {
      const stored = localStorage.getItem('vela_custom_branding_presets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? '' : section);
  };

  const applyPreset = (preset: { name?: string; colors: { primary: string; secondary: string; accent: string }; font: string }) => {
    onChangeCustomization('primary_color', preset.colors.primary);
    onChangeCustomization('secondary_color', preset.colors.secondary);
    onChangeCustomization('accent_color', preset.colors.accent);
    onChangeCustomization('font_family', preset.font);
  };

  const handleSaveCurrentPreset = () => {
    const newPreset = {
      name: `Custom (${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`,
      colors: {
        primary: customization.primary_color || '#0A2A66',
        secondary: customization.secondary_color || '#333333',
        accent: customization.accent_color || '#F3F4F6'
      },
      font: customization.font_family || 'Inter'
    };

    const updated = [newPreset, ...customPresets.slice(0, 5)];
    setCustomPresets(updated);
    try {
      localStorage.setItem('vela_custom_branding_presets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSaveSuccessMessage('Preset saved to your browser!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
    onSavePreset();
  };

  const deleteCustomPreset = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter((_, i) => i !== index);
    setCustomPresets(updated);
    try {
      localStorage.setItem('vela_custom_branding_presets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const allPresets = [...customPresets, ...PRESETS];

  return (
    <div className="w-full h-full bg-zinc-900 border border-border rounded-xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-background">
        <h3 className="font-bold text-lg text-white">Customize Document</h3>
        <p className="text-xs text-muted">Real-time style changes</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        
        {/* PRESETS */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {allPresets.map((p, idx) => (
              <div 
                key={`${p.name}-${idx}`}
                onClick={() => applyPreset(p)}
                className="text-xs py-2 px-3 rounded border border-border bg-background hover:border-primary text-white transition-colors flex items-center justify-between cursor-pointer group"
              >
                <span className="truncate max-w-[90px]">{p.name}</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.colors.primary }}></span>
                  {idx < customPresets.length && (
                    <button 
                      onClick={(e) => deleteCustomPreset(idx, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-1 text-xs"
                      title="Delete Preset"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLORS */}
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          <button 
            className="w-full flex items-center justify-between p-3 text-sm font-bold text-white hover:bg-zinc-900 transition-colors"
            onClick={() => toggleSection('colors')}
          >
            <div className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Brand Colors</div>
            {activeSection === 'colors' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === 'colors' && (
            <div className="p-3 border-t border-border space-y-3">
              {[
                { label: 'Primary Color', key: 'primary_color' as keyof DocumentCustomization },
                { label: 'Secondary Color', key: 'secondary_color' as keyof DocumentCustomization },
                { label: 'Accent / Background', key: 'accent_color' as keyof DocumentCustomization }
              ].map(colorField => (
                <div key={colorField.key} className="flex flex-col gap-1 mb-2">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">{colorField.label}</label>
                  <div className="flex items-center gap-2 bg-zinc-900 border border-border rounded-lg p-1">
                    <div className="relative w-8 h-8 rounded overflow-hidden border border-border shrink-0">
                      <input 
                        type="color" 
                        value={customization[colorField.key] as string}
                        onChange={(e) => onChangeCustomization(colorField.key, e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 flex items-center bg-background rounded px-2 py-1.5 border border-border">
                      <span className="text-muted text-xs mr-1">#</span>
                      <input 
                        type="text"
                        value={(customization[colorField.key] as string || '').replace('#', '')}
                        onChange={(e) => {
                          const val = e.target.value.replace('#', '');
                          if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                            onChangeCustomization(colorField.key, `#${val}`);
                          }
                        }}
                        maxLength={6}
                        className="w-full text-xs bg-transparent uppercase text-white focus:outline-none font-mono"
                        placeholder="000000"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TYPOGRAPHY */}
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          <button 
            className="w-full flex items-center justify-between p-3 text-sm font-bold text-white hover:bg-zinc-900 transition-colors"
            onClick={() => toggleSection('typography')}
          >
            <div className="flex items-center gap-2"><Type className="w-4 h-4 text-primary" /> Typography (Google Fonts)</div>
            {activeSection === 'typography' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === 'typography' && (
            <div className="p-3 border-t border-border space-y-3">
              <label className="block text-xs font-medium text-muted">Select Font Family</label>
              <select 
                className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                value={customization.font_family}
                onChange={(e) => onChangeCustomization('font_family', e.target.value)}
              >
                {FONTS.map(font => (
                  <option key={font} value={font} className="bg-zinc-900 text-white py-1">{font}</option>
                ))}
              </select>
              
              <div className="mt-4 p-3 bg-zinc-900 rounded-lg text-center border border-border">
                <span className="text-lg text-white" style={{ fontFamily: customization.font_family }}>
                  Preview: 1234567890 ₹
                </span>
              </div>
            </div>
          )}
        </div>

        {/* LAYOUT */}
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          <button 
            className="w-full flex items-center justify-between p-3 text-sm font-bold text-white hover:bg-zinc-900 transition-colors"
            onClick={() => toggleSection('layout')}
          >
            <div className="flex items-center gap-2"><Layout className="w-4 h-4 text-primary" /> Header Layout</div>
            {activeSection === 'layout' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === 'layout' && (
            <div className="p-3 border-t border-border space-y-3">
              <label className="block text-xs font-medium text-muted">Alignment</label>
              <select 
                className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary mb-3"
                value={customization.header_layout}
                onChange={(e) => onChangeCustomization('header_layout', e.target.value)}
              >
                <option value="logo-left" className="bg-zinc-900 text-white py-1">Logo Left, Details Right</option>
                <option value="logo-center" className="bg-zinc-900 text-white py-1">Centered Stack</option>
                <option value="logo-right" className="bg-zinc-900 text-white py-1">Logo Right, Details Left</option>
              </select>

              <label className="block text-xs font-medium text-muted mt-2">Logo Size</label>
              <select 
                className="w-full bg-zinc-900 border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                value={customization.logo_size}
                onChange={(e) => onChangeCustomization('logo_size', e.target.value)}
              >
                <option value="small" className="bg-zinc-900 text-white py-1">Small</option>
                <option value="medium" className="bg-zinc-900 text-white py-1">Medium</option>
                <option value="large" className="bg-zinc-900 text-white py-1">Large</option>
              </select>
            </div>
          )}
        </div>

        {/* PAYMENT DETAILS */}
        <div className="border border-border rounded-lg bg-background overflow-hidden">
          <button 
            className="w-full flex items-center justify-between p-3 text-sm font-bold text-white hover:bg-zinc-900 transition-colors"
            onClick={() => toggleSection('payment')}
          >
            <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Payment Details</div>
            {activeSection === 'payment' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {activeSection === 'payment' && (
            <div className="p-3 border-t border-border space-y-3">
              <input type="text" placeholder="Bank Name" value={paymentDetails.bank_name || ''} onChange={(e) => onChangePayment('bank_name', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-400 mb-2 focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Account Name" value={paymentDetails.account_name || ''} onChange={(e) => onChangePayment('account_name', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-400 mb-2 focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Account Number" value={paymentDetails.account_number || ''} onChange={(e) => onChangePayment('account_number', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-400 mb-2 focus:outline-none focus:border-primary" />
              <input type="text" placeholder="IFSC Code" value={paymentDetails.ifsc_code || ''} onChange={(e) => onChangePayment('ifsc_code', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-400 mb-2 focus:outline-none focus:border-primary" />
              
              <div className="pt-2 border-t border-border">
                <input type="text" placeholder="UPI ID (e.g. name@bank)" value={paymentDetails.upi_id || ''} onChange={(e) => onChangePayment('upi_id', e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-400 mb-2 focus:outline-none focus:border-primary" />
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer mt-2">
                  <input type="checkbox" checked={customization.show_qr} onChange={(e) => onChangeCustomization('show_qr', e.target.checked)} className="rounded text-primary focus:ring-primary bg-zinc-800 border-zinc-700" />
                  Generate UPI QR Code
                </label>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="p-4 border-t border-border bg-background">
        {saveSuccessMessage && (
          <div className="mb-2 p-2 bg-green-500/20 border border-green-500/40 rounded text-center text-xs text-green-400 font-bold">
            ✓ {saveSuccessMessage}
          </div>
        )}
        <button 
          onClick={handleSaveCurrentPreset}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-800 border border-primary/40 text-primary font-bold hover:bg-primary hover:text-black transition-all shadow-sm"
        >
          <Palette className="w-4 h-4" /> Save Current Branding Preset
        </button>
        <p className="text-center text-[10px] text-muted mt-2">Saves your colors & font to Quick Presets</p>
      </div>
    </div>
  );
};
