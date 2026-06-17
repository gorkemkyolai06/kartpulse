'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LeftSidebar } from '@/components/left-sidebar';
import { LoadingSpinner } from '@/components/states';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!token) return null;

  return (
    <div className="min-h-screen bg-background">
      <LeftSidebar />
      <main className="ml-64 min-h-screen px-8 py-8">{children}</main>
    </div>
  );
}
