import React, { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Receipt, Loader } from 'lucide-react';

import { DocumentService } from '../../services/documentService';
import { UserCompanyProfile } from '../../types/document.types';
import { supabase } from '../../lib/supabase';

const CompanyProfile: React.FC = () => {
  const [profile, setProfile] = useState<Partial<UserCompanyProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        try {
          const data = await DocumentService.getCompanyProfile(user.id);
          if (data) setProfile(data);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchUserAndProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    try {
      setSaving(true);
      const updated = await DocumentService.upsertCompanyProfile({ ...profile, user_id: userId });
      setProfile(updated);
      alert('Profile saved successfully. Future documents will auto-fill with these details.');
    } catch (error) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 animate-spin text-primary" /></div>
      </>
    );
  }

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Company Profile</h1>
          <p className="text-muted">Save your business details to automatically populate invoices and quotations.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Basic Info */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-2">Company / Business Name *</label>
                <input 
                  required
                  type="text" 
                  name="company_name"
                  value={profile.company_name || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={profile.email || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Website</label>
                <input 
                  type="url" 
                  name="website"
                  value={profile.website || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Location & Tax */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text">Location & Tax Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted mb-2">Business Address</label>
                <textarea 
                  name="address"
                  value={profile.address || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">GSTIN</label>
                <input 
                  type="text" 
                  name="gstin"
                  value={profile.gstin || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary uppercase"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">PAN</label>
                <input 
                  type="text" 
                  name="pan"
                  value={profile.pan || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary uppercase"
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text">Bank Details (For Invoices)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Bank Name</label>
                <input 
                  type="text" 
                  name="bank_name"
                  value={profile.bank_name || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Account Number</label>
                <input 
                  type="text" 
                  name="account_number"
                  value={profile.account_number || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">IFSC Code</label>
                <input 
                  type="text" 
                  name="ifsc_code"
                  value={profile.ifsc_code || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">UPI ID</label>
                <input 
                  type="text" 
                  name="upi_id"
                  value={profile.upi_id || ''}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-glow transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
              <Save className="w-5 h-5" />
            </button>
          </div>
        </form>

      </div>
    </>
  );
};

export default CompanyProfile;
