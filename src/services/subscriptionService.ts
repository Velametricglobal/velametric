import { supabase } from '../lib/supabase';
import { UserSubscription } from '../types/document.types';

// Mock Razorpay Integration for Development
export const SubscriptionService = {
  async getSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription:', error);
      throw error;
    }
    return data;
  },

  async createCheckoutSession(userId: string, planType: string): Promise<string> {
    // In a real application, this would call a Supabase Edge Function to create a Razorpay/Stripe Order
    // and return the Order ID or Checkout URL.
    console.log(`Creating checkout session for user ${userId}, plan: ${planType}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock order ID
    return `order_mock_${Math.random().toString(36).substring(7)}`;
  },

  async verifyPayment(userId: string, orderId: string, paymentId: string, signature: string): Promise<boolean> {
    // In a real application, this would call a Supabase Edge Function to verify the signature
    console.log(`Verifying payment for user ${userId}, order: ${orderId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful verification
    const isSuccess = true;
    
    if (isSuccess) {
      // Update subscription in database
      const nextBillingDate = new Date();
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_type: 'EXTENDED_STORAGE',
          status: 'ACTIVE',
          price_per_month: 250,
          next_billing_date: nextBillingDate.toISOString(),
          payment_provider: 'razorpay_mock',
          payment_subscription_id: `sub_mock_${paymentId}`
        }, { onConflict: 'user_id' });
        
      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }
      
      // Upgrade existing free documents to remove expiry
      await supabase
        .from('generated_documents')
        .update({ is_free_tier: false, expires_at: null })
        .eq('user_id', userId)
        .eq('is_free_tier', true);
        
      return true;
    }
    
    return false;
  },
  
  async cancelSubscription(userId: string): Promise<void> {
    // In a real app, call gateway to cancel
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'CANCELLED' })
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
};
