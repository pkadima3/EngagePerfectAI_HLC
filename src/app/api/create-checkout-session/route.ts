import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { PLANS, PlanType, PlanInterval } from '@/lib/stripe';
//import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Get the request body
    const body = await request.json();
    const { planType, interval, returnUrl } = body as {
      planType: PlanType;
      interval?: PlanInterval;
      returnUrl: string;
    };

    // Get the current user
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the correct plan based on type and interval
    let plan;
    if (planType === 'flex') {
      plan = PLANS.FLEX;
    } else {
      plan = planType === 'lite' 
        ? (interval === 'year' ? PLANS.LITE.YEARLY : PLANS.LITE.MONTHLY)
        : (interval === 'year' ? PLANS.PRO.YEARLY : PLANS.PRO.MONTHLY);
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      mode: ('type' in plan && plan.type === 'one_time') ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        userEmail,
        planType: plan.metadata.type,
        interval: 'interval' in plan.metadata ? plan.metadata.interval : null,
      } satisfies Stripe.MetadataParam, // Use satisfies instead of type assertion
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      customer_email: userEmail,
    } satisfies Stripe.Checkout.SessionCreateParams); // Use satisfies instead of type assertion

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 400 }
    );
  }
}