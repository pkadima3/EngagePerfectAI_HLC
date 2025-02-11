'use client';

import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import PricingCard from '@/components/pricing/PricingCard';
import { PLANS, PlanInterval } from '@/lib/stripe';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  const litePlan = isYearly ? PLANS.LITE.YEARLY : PLANS.LITE.MONTHLY;
  const proPlan = isYearly ? PLANS.PRO.YEARLY : PLANS.PRO.MONTHLY;

  // Make sure interval is explicitly typed as PlanInterval
  const interval: PlanInterval = litePlan.interval as PlanInterval;
  const proInterval: PlanInterval = proPlan.interval as PlanInterval;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include a 5-day free trial.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <Toggle
            leftLabel="Monthly"
            rightLabel="Yearly"
            isToggled={isYearly}
            onToggle={setIsYearly}
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Lite Plan */}
          <PricingCard
            title="Lite Plan"
            description="Perfect for casual users managing a single social media platform."
            price={litePlan.price}
            interval={interval}
            planType="lite"
            saveAmount={isYearly ? 59.99 : undefined}
            savePercentage={isYearly ? 50 : undefined}
            buttonText="Start Free Trial"
            features={[
              { text: "5 free requests during trial", highlight: true },
              { text: `${litePlan.metadata.requestsPerInterval} requests/${litePlan.interval}` },
              { text: "Single platform support" },
              { text: "Post ideas and captions (Image only support)" },
              { text: "Basic analytics" }
            ]}
            footnote="Start your 5-day trial with 5 free requests. Cancel anytime during the trial to avoid charges."
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro Plan"
            description="Ideal for small businesses managing multiple platforms."
            price={proPlan.price}
            interval={proInterval}
            planType="pro"
            isPopular={true}
            saveAmount={isYearly ? 159.99 : undefined}
            savePercentage={isYearly ? 44 : undefined}
            buttonText="Choose Pro"
            features={[
              { text: `${proPlan.metadata.requestsPerInterval} requests/${proPlan.interval}`, highlight: true },
              { text: "Multi-platform support" },
              { text: "Advanced Post ideas and captions" },
              { text: "Multi media support (Image/video)" },
              { text: "Priority support" },
              { text: "Advanced analytics" },
              { text: "Custom templates" }
            ]}
          />

          {/* Flex Add-On */}
          <PricingCard
            title="Flex Add-On"
            description="Pay-as-you-go option for additional content generations."
            price={PLANS.FLEX.price}
            planType="flex"
            buttonText="Add Flex"
            features={[
              { text: "No monthly commitment", highlight: true },
              { text: "Works with Lite or Pro plan" },
              { text: "Same features as your base plan" },
              { text: "Usage analytics included" }
            ]}
          />
        </div>
      </div>
    </div>
  );
}