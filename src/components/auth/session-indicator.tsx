'use client';

import { Button } from '@/components/ui/button';
import { signOut } from '@/app/actions/auth';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function SessionIndicator() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setEmail(session.user.email || null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Also listen for auth state changes (login/logout)
  useEffect(() => {
    const supabase = createClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setEmail(session.user.email || null);
        } else if (event === 'SIGNED_OUT') {
          setEmail(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="animate-pulse h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/signin">
          <Button variant="ghost" size="sm">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-900">{email}</span>
      </div>
      <form action={signOut}>
        <Button variant="outline" size="sm" type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  );
} 