import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';
//import '../app/globals.css'; // Changed from '@/styles/globals.css' to '../app/globals.css'
import '@/app/globals.css'; // Changed from '@/styles/globals.css' to '@/app/globals.css'
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <MainLayout>
        <>
          <Head>
            {/* Basic Open Graph meta tags */}
            <meta property="og:title" content="EngagePerfect AI Caption Generator" />
            <meta property="og:description" content="Create engaging captions for your social media with AI assistance" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://engageperfect.com" />
            <meta property="og:image" content="https://engageperfect.com/og-image.jpg" />
            <meta property="og:site_name" content="EngagePerfect" />
            
            {/* LinkedIn specific */}
            <meta property="linkedin:card" content="summary_large_image" />
            <meta property="linkedin:title" content="EngagePerfect AI Caption Generator" />
            <meta property="linkedin:description" content="Create engaging captions for your social media with AI assistance" />
            <meta property="linkedin:image" content="https://engageperfect.com/og-image.jpg" />
            
            {/* Twitter/X Card (also helps with LinkedIn) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="EngagePerfect AI Caption Generator" />
            <meta name="twitter:description" content="Create engaging captions for your social media with AI assistance" />
            <meta name="twitter:image" content="https://engageperfect.com/og-image.jpg" />
            
            {/* Additional meta tags for better SEO */}
            <meta name="author" content="EngagePerfect" />
            <meta name="description" content="Create engaging captions for your social media with AI assistance" />
          </Head>
          <Component {...pageProps} />
        </>
      </MainLayout>
    </AuthProvider>
  );
}

export default MyApp;