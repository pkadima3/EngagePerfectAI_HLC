import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 relative">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4F46E5' }} />
              <stop offset="100%" style={{ stopColor: '#7C3AED' }} />
            </linearGradient>
          </defs>
          <path
            fill="url(#logoGradient)"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9c0-.55.45-1 1-1s1 .45 1 1v9c0 .55-.45 1-1 1s-1-.45-1-1zm3.5-3.5c-.28 0-.5-.22-.5-.5V11c0-.28.22-.5.5-.5s.5.22.5.5v1.5c0 .28-.22.5-.5.5z"
          />
        </svg>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
        EngagePerfect AI
      </span>
    </div>
  );
};