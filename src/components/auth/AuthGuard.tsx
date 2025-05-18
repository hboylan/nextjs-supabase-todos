'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRedirectURL } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/client';

type AuthGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Client-side auth guard component
 * Use this for client components that need protection
 */
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No session found, redirect to login
          const currentPath = window.location.pathname;
          router.push(createRedirectURL(currentPath));
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Show nothing while checking authentication
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }
  
  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
} 