import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ContentManager from '../components/ContentManager';
import { getStoredAuthToken } from '../services/api';

export default function ContentEditor() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getStoredAuthToken();
    if (!t) {
      router.push('/login');
      return;
    }
    setToken(t);
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>;
  }

  return <ContentManager token={token} />;
}
