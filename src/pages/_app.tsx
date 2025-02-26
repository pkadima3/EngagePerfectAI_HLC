import { MainLayout } from '@/components/layouts/MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import '../app/globals.css'; // Changed from '@/styles/globals.css' to '../app/globals.css'
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthProvider>
  );
}