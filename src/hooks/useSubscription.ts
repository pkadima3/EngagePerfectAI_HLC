import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStripe } from '@/lib/stripe-client';
import { PlanType, PlanInterval } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth(); // Get the current user

  const handleSubscription = async (planType: PlanType, interval?: PlanInterval) => {
    try {
      setLoading(true);
      
      // Get the ID token
      const token = await user?.getIdToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planType,
          interval,
          returnUrl: window.location.origin,
        }),
      });

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        router.push(url);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubscription, loading };
};