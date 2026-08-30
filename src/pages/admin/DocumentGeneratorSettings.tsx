import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

const DocumentGeneratorSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    subscriptionPrice: 250,
    freeRetentionDays: 7,
    enableStripe: false,
    enableRazorpay: true,
    razorpayKey: 'rzp_test_mockkey'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Document Generator Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Configure public document generator parameters, payment gateways, and storage policies.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-display">
          <Settings className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Pricing & Data Retention
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Extended Storage Price (₹/mo)</label>
            <input 
              type="number" 
              name="subscriptionPrice"
              value={settings.subscriptionPrice}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Free Tier Retention (Days)</label>
            <input 
              type="number" 
              name="freeRetentionDays"
              value={settings.freeRetentionDays}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 font-display">Payment Gateways</h3>
        
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="enableRazorpay"
              name="enableRazorpay"
              checked={settings.enableRazorpay}
              onChange={handleChange}
              className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
            />
            <label htmlFor="enableRazorpay" className="text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer">Enable Razorpay (India INR Payments)</label>
          </div>
          
          {settings.enableRazorpay && (
            <div className="pl-7">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Razorpay Key ID</label>
              <input 
                type="text" 
                name="razorpayKey"
                value={settings.razorpayKey}
                onChange={handleChange}
                className="w-full max-w-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          )}
          
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <input 
              type="checkbox" 
              id="enableStripe"
              name="enableStripe"
              checked={settings.enableStripe}
              onChange={handleChange}
              className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
            />
            <label htmlFor="enableStripe" className="text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer">Enable Stripe (International Multi-Currency)</label>
          </div>
        </div>
      </div>

      <div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
};

export default DocumentGeneratorSettings;

