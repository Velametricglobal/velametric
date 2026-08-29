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
    alert('Settings saved. (Mock implementation)');
  };

  return (
    <>
      <div className="p-6 max-w-4xl space-y-8">
        
        <div>
          <h2 className="text-2xl font-bold text-text mb-2">Generator Settings</h2>
          <p className="text-muted">Configure the public document generator and premium tiers.</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Pricing & Retention
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Extended Storage Price (₹/mo)</label>
              <input 
                type="number" 
                name="subscriptionPrice"
                value={settings.subscriptionPrice}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Free Tier Retention (Days)</label>
              <input 
                type="number" 
                name="freeRetentionDays"
                value={settings.freeRetentionDays}
                onChange={handleChange}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-text mb-6">Payment Gateways</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input 
                type="checkbox" 
                name="enableRazorpay"
                checked={settings.enableRazorpay}
                onChange={handleChange}
                className="w-5 h-5 accent-primary"
              />
              <label className="text-text font-medium">Enable Razorpay (India)</label>
            </div>
            
            {settings.enableRazorpay && (
              <div className="pl-9">
                <label className="block text-sm font-medium text-muted mb-2">Razorpay Key ID</label>
                <input 
                  type="text" 
                  name="razorpayKey"
                  value={settings.razorpayKey}
                  onChange={handleChange}
                  className="w-full max-w-md bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
            )}
            
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <input 
                type="checkbox" 
                name="enableStripe"
                checked={settings.enableStripe}
                onChange={handleChange}
                className="w-5 h-5 accent-primary"
              />
              <label className="text-text font-medium">Enable Stripe (International)</label>
            </div>
          </div>
        </div>

        <div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-glow transition-all"
          >
            <Save className="w-5 h-5" /> Save Configuration
          </button>
        </div>

      </div>
    </>
  );
};

export default DocumentGeneratorSettings;
