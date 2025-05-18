import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Server component to protect routes
 * Redirects to login if not authenticated
 */
export default async function ProtectedRoute({ children }: ProtectedRouteProps) {
  const supabase = await createClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    // Get the current URL if possible from referer or default to /todos
    const headersList = await headers();
    const referer = headersList.get('referer') || '';
    const currentPath = referer 
      ? new URL(referer).pathname 
      : '/todos';
      
    redirect(`/signin?redirectTo=${encodeURIComponent(currentPath)}`);
  }
  
  return <>{children}</>;
} 