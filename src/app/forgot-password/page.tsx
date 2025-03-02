// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { AuthButton, AuthInput, AuthCard } from '@/components/auth';

interface FormData {
  email: string;
}

interface Errors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add your password reset logic here
    // For now, we'll just simulate an API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 1500);
  };

  if (isEmailSent) {
    return (
      <AuthCard 
        title="Check your email" 
        subtitle="We have sent you a password reset link to your email"
      >
        <div className="space-y-6">
          <p className="text-center text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <AuthButton
            variant="primary"
            fullWidth
            onClick={() => setIsEmailSent(false)}
          >
            Try again
          </AuthButton>
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Back to login
            </Link>
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Forgot password?" 
      subtitle="Don&apos;t worry if you&apos;ve forgotten..."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email address"
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setFormData({...formData, email: e.target.value})}
          error={errors.email}
          required
        />

        <AuthButton type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Send reset instructions
        </AuthButton>

        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}