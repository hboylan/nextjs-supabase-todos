'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { 
  validateAuthForm, 
  validateEmail, 
  validatePassword,
  formatValidationErrors 
} from '@/utils/validation';
import { 
  AppError, 
  ErrorType, 
  formatErrorResponse, 
  logAuthError 
} from '@/utils/error-handler';

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
  try {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validate form inputs
    const validationResult = validateAuthForm({
      email,
      password,
      confirmPassword
    });
    
    if (!validationResult.valid) {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: formatValidationErrors(validationResult.errors)
      });
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
      // Log the error with context
      logAuthError(error, { action: 'signUp', email });
      
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: error.message,
        originalError: error
      });
    }
    
    return { success: true };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * Signs in a user with email and password
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // Not currently used but keeping for future implementation
    // const rememberMe = formData.get('rememberMe') === 'true';
    const redirectTo = formData.get('redirectTo') as string || '/todos';
    
    // Validate form inputs
    const validationResult = validateAuthForm({
      email,
      password
    });
    
    if (!validationResult.valid) {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: formatValidationErrors(validationResult.errors)
      });
    }
    
    // Session persistence doesn't seem to be configurable directly in signInWithPassword
    // We'll need to implement it another way if needed
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Log the error with context
      logAuthError(error, { action: 'signIn', email });
      
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: error.message,
        originalError: error
      });
    }
    
    // If rememberMe is true, we can potentially set a longer cookie expiry
    // This would likely need to be implemented at the Supabase server configuration level
    
    redirect(redirectTo);
  } catch (error) {
    // Only return formatted error if we're not redirecting
    // If the sign-in was successful, the redirect would have happened
    return formatErrorResponse(error);
  }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logAuthError(error, { action: 'signOut' });
      console.error('Error signing out:', error.message);
    }
    
    redirect('/');
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    redirect('/');
  }
}

/**
 * Sends a password reset email
 */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    
    // Validate email
    if (!email || !validateEmail(email)) {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: 'Please enter a valid email address'
      });
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    
    if (error) {
      // Log the error with context
      logAuthError(error, { action: 'resetPassword', email });
      
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: error.message,
        originalError: error
      });
    }
    
    return { success: true };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * Updates a user's password
 */
export async function updatePassword(formData: FormData): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validate passwords
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: passwordValidation.errors[0]
      });
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      throw new AppError({
        type: ErrorType.VALIDATION,
        message: 'Passwords do not match'
      });
    }
    
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      // Log the error with context
      logAuthError(error, { action: 'updatePassword' });
      
      throw new AppError({
        type: ErrorType.AUTHENTICATION,
        message: error.message,
        originalError: error
      });
    }
    
    return { success: true };
  } catch (error) {
    return formatErrorResponse(error);
  }
}

/**
 * Checks if a user is authenticated and returns their session
 */
export async function checkAuthStatus() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logAuthError(error, { action: 'checkAuthStatus' });
    }
    
    return { 
      isAuthenticated: !!session,
      session
    };
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return { 
      isAuthenticated: false,
      session: null
    };
  }
} 