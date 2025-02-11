import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-01-27.acacia', // Updated with correct version format
});

// Plan Configuration
export const PLANS = {
  LITE: {
    MONTHLY: {
      name: 'Lite Monthly',
      priceId: 'price_1QkAQjGCd9fidigr3s8VXipy', // You'll get this from Stripe Dashboard
      price: 9.99,
      interval: 'month',
      requestLimit: 75,
      metadata: {
        type: 'lite',
        interval: 'month',
        requestsPerInterval: 75
      }
    },
    YEARLY: {
      name: 'Lite Yearly',
      priceId: 'price_1QkAQjGCd9fidigrub9ptceZ', // You'll get this from Stripe Dashboard
      price: 59.99,
      interval: 'year',
      requestLimit: 900,
      metadata: {
        type: 'lite',
        interval: 'year',
        requestsPerInterval: 900
      }
    }
  },
  PRO: {
    MONTHLY: {
      name: 'Pro Monthly',
      priceId: 'price_1QkAa8GCd9fidigr2P9E7QRm', // You'll get this from Stripe Dashboard
      price: 29.99,
      interval: 'month',
      requestLimit: 250,
      metadata: {
        type: 'pro',
        interval: 'month',
        requestsPerInterval: 250
      }
    },
    YEARLY: {
      name: 'Pro Yearly',
      priceId: 'price_1QkAa8GCd9fidigr3JZNXSGc', // You'll get this from Stripe Dashboard
      price: 199.99,
      interval: 'year',
      requestLimit: 3000,
      metadata: {
        type: 'pro',
        interval: 'year',
        requestsPerInterval: 3000
      }
    }
  },
  FLEX: {
    name: 'Flex Add-On',
    priceId: 'price_1QkAfKGCd9fidigrhSOcZQrl', // You'll get this from Stripe Dashboard
    price: 1.99,
    type: 'one_time',
    metadata: {
      type: 'flex',
      requestsPerPurchase: 10 // For example, each €1.99 purchase gives 10 additional requests
    }
  }
};

// Types for our subscription plans
export type PlanType = 'lite' | 'pro' | 'flex';
export type PlanInterval = 'month' | 'year';

export interface PlanDetails {
  name: string;
  priceId: string;
  price: number;
  interval?: PlanInterval;
  requestLimit?: number;
  metadata: {
    type: PlanType;
    interval?: PlanInterval;
    requestsPerInterval?: number;
    requestsPerPurchase?: number;
  };
}