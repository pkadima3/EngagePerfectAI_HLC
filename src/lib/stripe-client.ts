import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe.js with the publishable key
export const getStripe = async () => {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripePublicKey) {
    throw new Error('Stripe publishable key is not defined');
  }
  
  return await loadStripe(stripePublicKey);
};