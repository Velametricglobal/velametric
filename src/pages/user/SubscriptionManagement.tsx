import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Zap, CreditCard, AlertCircle } from 'lucide-react';

import { SubscriptionService } from '../../services/subscriptionService';
import { UserSubscription } from '../../types/document.types';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadSubscription(user.id);
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loadSubscription = async (uid: string) => {
    try {
      setLoading(true);
      const sub = await SubscriptionService.getSubscription(uid);
      setSubscription(sub);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!userId) return navigate('/auth/login');
    
    try {
      setIsProcessing(true);
      // 1. Create Checkout Session (Mock)
      const orderId = await SubscriptionService.createCheckoutSession(userId, 'EXTENDED_STORAGE');
      
      // 2. Simulate User Paying & Razorpay returning success
      // In a real flow, this would open the Razorpay popup.
      alert('Mock Payment Flow: Simulating successful payment...');
      const paymentId = `pay_${Math.random().toString(36).substring(7)}`;
      
      // 3. Verify Payment
      const success = await SubscriptionService.verifyPayment(userId, orderId, paymentId, 'mock_signature');
      
      if (success) {
        alert('Payment successful! Your account is upgraded.');
        loadSubscription(userId);
      }
    } catch (error) {
      alert('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPro = subscription?.plan_type === 'EXTENDED_STORAGE' && subscription?.status === 'ACTIVE';

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text mb-2">Storage Plan</h1>
          <p className="text-muted">Manage your document retention and subscription settings.</p>
        </div>

        {loading ? (
          <div className="animate-pulse flex gap-8">
            <div className="flex-1 h-64 bg-surface rounded-xl"></div>
            <div className="flex-1 h-64 bg-surface rounded-xl"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Current Plan Card */}
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-bold text-text mb-1">Current Plan</h3>
              <div className="flex items-center gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${isPro ? 'bg-primary/20 text-primary' : 'bg-border text-muted'}`}>
                  {isPro ? 'EXTENDED STORAGE' : 'FREE TIER'}
                </span>
                {isPro && <Shield className="w-4 h-4 text-primary" />}
              </div>
              
              <div className="mb-8">
                <h4 className="text-4xl font-black text-text mb-2">
                  {isPro ? '₹250' : '₹0'}
                </h4>
                <p className="text-muted text-sm">
                  {isPro ? `Billed monthly. Next billing date: ${new Date(subscription.next_billing_date!).toLocaleDateString()}` : 'Forever free.'}
                </p>
              </div>
              
              {!isPro && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mt-auto">
                  <div className="flex items-center gap-2 text-amber-500 font-bold mb-1">
                    <AlertCircle className="w-4 h-4" /> 7-Day Limit Active
                  </div>
                  <p className="text-sm text-amber-500/80">
                    Documents are automatically deleted 7 days after creation on the Free Tier.
                  </p>
                </div>
              )}
            </div>

            {/* Upgrade/Feature Card */}
            <div className={`bg-background border rounded-2xl p-6 flex flex-col relative overflow-hidden ${isPro ? 'border-primary' : 'border-border'}`}>
              {isPro && (
                <div className="absolute top-0 right-0 bg-primary/10 w-32 h-32 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              )}
              
              <h3 className="text-lg font-bold text-text mb-6">
                {isPro ? 'Your Plan Includes' : 'Upgrade to Extended Storage'}
              </h3>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  { text: 'Permanent Cloud Storage', proOnly: true },
                  { text: 'No 7-day auto-deletion', proOnly: true },
                  { text: 'Unlimited Document Generation', proOnly: false },
                  { text: 'Save Client & Company Details', proOnly: true },
                  { text: 'Document Duplication (1-Click Renewal)', proOnly: true }
                ].map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 ${!isPro && feature.proOnly ? 'opacity-50' : ''}`}>
                    <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${!isPro && feature.proOnly ? 'text-muted' : 'text-primary'}`} />
                    <span className="text-text text-sm">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {!isPro ? (
                <button 
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : (
                    <>
                      <Zap className="w-5 h-5" /> Upgrade for ₹250/mo
                    </>
                  )}
                </button>
              ) : (
                <button className="w-full py-3 bg-surface border border-border hover:bg-border text-text font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" /> Manage Payment Method
                </button>
              )}
            </div>
            
          </div>
        )}
      </div>
    </>
  );
};

export default SubscriptionManagement;
