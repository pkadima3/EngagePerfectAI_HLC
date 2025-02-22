import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}: LoadingSpinnerProps) => {
  
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500'
  };
  
  return (
    <div className="relative">
      <div className={`
        ${sizeClasses[size]} 
        ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}
        rounded-full border-t-2 border-r-2 animate-spin
        ${className}
      `}></div>
      
      {/* Inner spinner for effect */}
      <div className={`
        absolute inset-0 m-auto
        ${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-10 w-10'}
        ${color === 'white' ? 'border-blue-500' : 'border-white'}
        rounded-full border-t-2 border-l-2 animate-spin
      `} style={{ animationDirection: 'reverse', animationDuration: '0.6s' }}></div>
    </div>
  );
};