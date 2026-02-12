'use client';

import { useTokenAuth } from '@/lib/contexts/TokenAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Game from '@/components/Game';

export default function Home() {
  const { isAuthenticated, loading } = useTokenAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Game />;
}
