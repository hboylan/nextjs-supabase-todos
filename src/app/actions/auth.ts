'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export type AuthError = {
  error: string;
};

export type AuthSuccess = {
  success: boolean;
};

export type AuthResult = AuthError | AuthSuccess;

/**
 * Creates a new user with email and password
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Basic validation
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  // Password strength validation
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }
  
  // Attempt to sign up the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` 
    }
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

/**
 * Signs in a user with email and password
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rememberMe = formData.get('rememberMe') === 'true';
  const redirectTo = formData.get('redirectTo') as string || '/todos';
  
  // Basic validation
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  // Session persistence doesn't seem to be configurable directly in signInWithPassword
  // We'll need to implement it another way if needed
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  // If rememberMe is true, we can potentially set a longer cookie expiry
  // This would likely need to be implemented at the Supabase server configuration level
  
  redirect(redirectTo);
}

/**
 * Signs out the current user
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

/**
 * Sends a password reset email
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  
  if (!email) {
    return { error: 'Email is required' };
  }
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

/**
 * Updates a user's password
 */
export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();
  const password = formData.get('password') as string;
  
  if (!password || password.length < 8) {
    return { error: 'New password must be at least 8 characters long' };
  }
  
  const { error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

/**
 * Checks if a user is authenticated and returns their session
 */
export async function checkAuthStatus() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return { 
    isAuthenticated: !!session,
    session
  };
} 