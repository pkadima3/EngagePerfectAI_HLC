// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="public\EngPerfect.png" 
              className="flex items-center space-x-2"
            >
              {/*<span className="text-blue-600 text-2xl">✦</span>*/}
              <img 
                src="/EngPerfect.png" 
                alt="EngagePerfect Icon" 
                className="w-8 h-8" 
                />
              <span className="text-xl font-semibold text-black">EngagePerfect AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <Link
            href="/login"
            className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

