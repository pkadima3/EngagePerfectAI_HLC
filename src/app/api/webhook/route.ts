import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface StripeMetadata {
  userId: string;
  userEmail: string;
  planType: 'flex' | 'pro' | 'basic';
  interval?: 'month' | 'year';
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers(); // Add await here
    const signature = headersList.get('stripe-signature')!;

    // Verify the webhook signature
    if (!stripe) {
      throw new Error('Stripe is not initialized');
    }
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.Event;

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Fix the metadata type casting
        if (!session.metadata) {
          throw new Error('No metadata found in session');
        }
        const metadata = session.metadata as unknown as StripeMetadata;
        const { userId, planType, interval } = metadata;

        // Update user's subscription in Firestore
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          let subscriptionData;
          
          if (planType === 'flex') {
            // For Flex plan, increment available requests
            const currentRequests = userDoc.data().availableFlexRequests || 0;
            subscriptionData = {
              availableFlexRequests: currentRequests + 10, // Assuming 10 requests per purchase
              lastFlexPurchase: new Date(),
            };
          } else {
            // For subscription plans
            subscriptionData = {
              subscriptionStatus: 'active',
              subscriptionPlan: planType,
              subscriptionInterval: interval,
              subscriptionStart: new Date(),
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            };
          }

          await setDoc(userRef, subscriptionData, { merge: true });
        }
        break;
      }

     case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        // Ensure subscription.metadata exists and has userId
        if (subscription.metadata && subscription.metadata.userId) {
          const userRef = doc(db, 'users', subscription.metadata.userId);
          
          await setDoc(userRef, {
            subscriptionStatus: subscription.status,
            subscriptionEnd: subscription.status === 'canceled' ? new Date() : null,
          }, { merge: true });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
