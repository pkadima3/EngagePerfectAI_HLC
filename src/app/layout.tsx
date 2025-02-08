// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// -- 1) Font Setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// -- 2) Metadata
export const metadata: Metadata = {
  title: "EngagePerfect AI",
  description: "AI-powered engagement platform",
};

// -- 3) Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Global Navbar */}
        <nav className="flex gap-4 p-4 bg-gray-200">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link href="/signup" className="hover:text-blue-600">
            Sign Up
          </Link>
        </nav>

        {/* Render all other pages */}
        {children}
      </body>
    </html>
  );
}