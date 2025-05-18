'use client';

import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook to handle redirects after authentication events
 */
export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectTo = () => {
    // Check if we have a redirectTo parameter
    const redirectPath = searchParams.get('redirectTo');
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      // Default redirect path after authentication
      router.push('/todos');
    }
  };
  
  return { redirectTo };
}

/**
 * Helper to create a redirect URL with a return path
 */
export function createRedirectURL(returnTo: string) {
  if (typeof window === 'undefined') return '';
  
  const baseUrl = window.location.origin;
  const encodedReturnPath = encodeURIComponent(returnTo);
  return `${baseUrl}/signin?redirectTo=${encodedReturnPath}`;
} 