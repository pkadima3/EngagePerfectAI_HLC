// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Font Setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Separate viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1e1e' }
  ]
};

// Metadata
export const metadata: Metadata = {
  title: 'EngagePerfect AI Caption Generator',
  description: 'Create engaging captions for your social media with AI assistance',
  openGraph: {
    title: 'EngagePerfect AI Caption Generator',
    description: 'Create engaging captions for your social media with AI assistance',
    url: 'https://engageperfect.com',
    siteName: 'EngagePerfect',
    images: [
      {
        url: 'https://engageperfect.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EngagePerfect AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EngagePerfect AI Caption Generator',
    description: 'Create engaging captions for your social media with AI assistance',
    creator: '@engageperfect',
    images: ['https://engageperfect.com/og-image.jpg'],
  },
  // Additional recommended metadata
  alternates: {
    canonical: 'https://engageperfect.com',
  },
  robots: 'index, follow',
  keywords: 'caption generator, social media, AI assistant, content creation, engagement',
  authors: [{ name: 'EngagePerfect Team', url: 'https://engageperfect.com/about' }],
  category: 'technology',
  manifest: undefined, // Remove reference until you have the file
};

// Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}