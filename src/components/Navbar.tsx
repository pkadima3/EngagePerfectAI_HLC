// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Laptop } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { auth } from '@/lib/firebase';

// Navigation items
const MENU_ITEMS = [
  {
    href: '/pricing',
    label: 'Pricing'
  },
  {
    href: '/caption-generator',
    label: 'Caption Generator'
  },
  {
    href: '/features',
    label: 'Features'
  },
  {
    href: '/blog',
    label: 'Blog'
  }
];

export default function Navbar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
            >
              <img 
                src="/EngPerfect.png" 
                alt="EngagePerfect Icon" 
                className="w-8 h-8" 
              />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">EngagePerfect AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {/* Theme Switcher */}
            <div className="flex items-center space-x-2 px-3 border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-lg ${theme === 'system' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Laptop className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Navigation Items */}
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Buttons */}
            {user ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Profile
                </Link>
                <button onClick={handleLogout} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
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
        <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg">
          {/* Theme Switcher for Mobile */}
          <div className="flex items-center justify-center space-x-2 px-4 py-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-2 rounded-lg ${theme === 'system' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <Laptop className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Mobile Navigation Items */}
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Auth Items */}
          {user ? (
            <>
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

