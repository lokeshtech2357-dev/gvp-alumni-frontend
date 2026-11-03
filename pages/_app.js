import '../styles/globals.css';
import AppLayout from '../components/AppLayout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '../context/AuthContext';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isStandaloneAuthPage = [
    '/login',
    '/login-selection',
    '/user-login',
    '/admin-login',
    '/forgot-password',
    '/reset-password',
  ].includes(router.pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const nomotion = params.get('nomotion');
      if (nomotion === '1' || nomotion === 'true') {
        document.documentElement.classList.add('no-motion');
      } else {
        document.documentElement.classList.remove('no-motion');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <AuthProvider>
      {isStandaloneAuthPage ? (
        <Component {...pageProps} />
      ) : (
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      )}
    </AuthProvider>
  );
}
