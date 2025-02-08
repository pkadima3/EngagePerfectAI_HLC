'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthButton, AuthInput, AuthCard, SocialLogin } from '@/components/auth';

// Define what information we need for login
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Define what our error messages might look like
interface Errors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Add types to our form data and errors
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add your login logic here
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Sign in to your account"
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
          className="text-black placeholder-gray-500"
        />

        <div className="relative">
          <AuthInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={Lock}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setFormData({...formData, password: e.target.value})}
            error={errors.password}
            required
            className="text-black placeholder-gray-500"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.rememberMe}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({...formData, rememberMe: e.target.checked})}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
        </div>

        <AuthButton type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Sign in
        </AuthButton>

        <SocialLogin />

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}