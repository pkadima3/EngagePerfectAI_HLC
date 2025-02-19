'use client';

import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import PricingCard from '@/components/pricing/PricingCard';
import { PLANS, PlanInterval } from '@/lib/stripe';

// Add PricingFAQ component definition
const PricingFAQ = () => {
  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            What's included in the free trial?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            All plans come with a 5-day free trial that includes 5 free requests. You can test all features available in 
            your chosen plan during this period.
          </p>
        </div>
        
        {/* ... other FAQ items ... */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Can I change plans later?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            How does the Flex Add-On work?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            The Flex Add-On allows you to purchase additional requests when you need them. Each purchase gives you 10 extra requests that never expire.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            How is billing handled?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            For monthly and yearly plans, you'll be billed automatically at the start of each billing cycle. You can cancel anytime before your next billing date.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Do you offer refunds?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We offer a 14-day money-back guarantee if you're not satisfied with your subscription. Contact our support team to process your refund.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function PricingPage() {
  // No need for user, loading, router, or redirect logic here anymore
  // We moved that logic to the PricingCard component
  
  const [isYearly, setIsYearly] = useState(true);

  const litePlan = isYearly ? PLANS.LITE.YEARLY : PLANS.LITE.MONTHLY;
  const proPlan = isYearly ? PLANS.PRO.YEARLY : PLANS.PRO.MONTHLY;

  // Make sure interval is explicitly typed as PlanInterval
  const interval: PlanInterval = litePlan.interval as PlanInterval;
  const proInterval: PlanInterval = proPlan.interval as PlanInterval;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Choose the plan that's right for you
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
        
        {/* Add PricingFAQ component here */}
        <PricingFAQ />
      </div>
    </div>
  );
}