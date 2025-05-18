import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is called by Supabase Auth when a user completes
 * the email verification process or when they reset their password.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/todos';
  
  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to the next page or todos
    return NextResponse.redirect(new URL(next, request.url));
  }
  
  // If no code provided, redirect to home page
  return NextResponse.redirect(new URL('/', request.url));
} 