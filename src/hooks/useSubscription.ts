import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { auth } from '@/lib/firebase';
import { PlanType, PlanInterval } from '@/lib/stripe';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscription = async (
    planType: PlanType,
    interval?: PlanInterval
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user's ID token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const idToken = await user.getIdToken();

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          planType,
          interval,
          returnUrl: window.location.origin + '/dashboard',
        }),
      });

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubscription,
    loading,
    error,
  };
};