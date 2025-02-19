import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { PlanType, PlanInterval } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth'; // Add this import
import { useRouter } from 'next/navigation'; // Add this import

interface Feature {
  text: string;
  highlight?: boolean;
}

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  interval?: PlanInterval;
  features: Feature[];
  buttonText: string;
  planType: 'lite' | 'pro' | 'flex';
  saveAmount?: number;
  savePercentage?: number;
  isPopular?: boolean;
  footnote?: string;
}

const PricingCard = ({
  title,
  description,
  price,
  interval,
  features,
  buttonText,
  planType,
  saveAmount,
  savePercentage,
  isPopular,
  footnote,
}: PricingCardProps) => {
  const { handleSubscription } = useSubscription();
  const { user } = useAuth(); // Get user information
  const router = useRouter(); // Get router for navigation
  const [loading, setLoading] = React.useState(false);
  
  // New function to handle subscription with login check
  /*const handleSubscriptionClick = () => {
    if (!user) {
      // If user is not logged in, redirect to login page
      router.push('/login');
    } else {
      // If user is logged in, proceed with subscription
      handleSubscription(planType, interval);
    }
  };*/
// In your PricingCard.tsx file, update the handleSubscriptionClick function
const handleSubscriptionClick = async () => {
  if (!user) {
    // Save the selected plan to localStorage or URL params so user can be directed back after login
    localStorage.setItem('selectedPlan', planType);
    localStorage.setItem('selectedInterval', interval || '');
    
    // Redirect to login with return URL
    router.push(`/login?returnTo=${encodeURIComponent('/pricing')}`);
  } else {
    try {
      // Show loading state
      setLoading(true);
      
      // Call your existing subscription function
      await handleSubscription(planType, interval);
      
      // You could add a success toast notification here
    } catch (error) {
      console.error('Subscription error:', error);
      // You could add an error toast notification here
    } finally {
      setLoading(false);
    }
  }
};
  return (
    <div className="relative flex flex-col p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {isPopular && (
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
        Most Popular
        </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">£{price}</span>
          {interval && (
            <span className="ml-1 text-gray-500">/{interval}</span>
          )}
        </div>
        {saveAmount && savePercentage && (
          <p className="mt-1 text-sm text-green-600 font-medium">
            Save €{saveAmount}/year (~{savePercentage}%)
          </p>
        )}
      </div>

      <ul className="mb-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="h-5 w-5 text-purple-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className={`ml-3 text-sm ${feature.highlight ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          onClick={handleSubscriptionClick} // Changed to our new function
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors duration-200 
            ${isPopular 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-gray-800 hover:bg-gray-900'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : buttonText}
        </button>
        {footnote && (
          <p className="mt-3 text-xs text-center text-gray-500">{footnote}</p>
        )}
      </div>
    </div>
  );
};

export default PricingCard;