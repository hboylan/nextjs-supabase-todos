'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/app/actions/auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ErrorMessage } from '@/components/ui/error-message';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import AuthLayout from '@/components/auth/AuthLayout';
import { FormErrorBoundary, useFormErrorReset } from '@/components/ui/form-error-boundary';
import { ValidationErrorDisplay } from '@/components/ui/validation-error-display';
import { validateEmail, ValidationError } from '@/utils/validation';
import { useToast } from '@/components/ui/toast';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const resetKey = useFormErrorReset([email, password]);
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  // Capture redirectTo parameter on component mount
  useEffect(() => {
    const redirectTo = searchParams.get('redirectTo');
    if (redirectTo) {
      setRedirectPath(redirectTo);
    }
  }, [searchParams]);

  // Client-side validation function
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];
    
    // Validate email
    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    // Validate password (simple presence check)
    if (!password) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors([]);
    
    // Run client-side validation
    const isValid = validateForm();
    
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    
    // Create form data for the server action
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('rememberMe', rememberMe.toString());
    
    // Add redirect path if available
    if (redirectPath) {
      formData.append('redirectTo', redirectPath);
    }
    
    try {
      const result = await signIn(formData);
      
      // If we get here, there was an error (successful login would redirect)
      if ('error' in result) {
        setError(result.error);
        
        // If the error appears to have multiple lines, it might be a validation error list
        if (result.error.includes('\n')) {
          const errorLines = result.error.split('\n').filter(line => line.trim().startsWith('-'));
          const errorsArray: ValidationError[] = errorLines.map(line => {
            const errorMsg = line.replace(/^-\s*/, '').trim();
            // Try to determine which field this error belongs to
            let field = 'general';
            if (errorMsg.toLowerCase().includes('email')) field = 'email';
            else if (errorMsg.toLowerCase().includes('password')) field = 'password';
            
            return { field, message: errorMsg };
          });
          setValidationErrors(errorsArray);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
      showToast('Failed to sign in. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Footer content for the auth layout
  const footer = (
    <p>
      Don&apos;t have an account?{' '}
      <Link href="/signup" className="text-blue-600 hover:underline">
        Sign Up
      </Link>
    </p>
  );

  return (
    <AuthLayout 
      title="Sign In" 
      description="Sign in to access your todos"
      footer={footer}
    >
      {redirectPath && (
        <div className="mb-6">
          <ErrorMessage 
            message="You need to sign in to access this page" 
            variant="subtle" 
            className="text-blue-600 bg-blue-50 p-2 rounded border border-blue-100" 
          />
        </div>
      )}
      
      {error && !validationErrors.length && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
      <SocialLoginButtons 
        redirectTo={redirectPath || undefined} 
        onError={setError} 
      />
      
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-300 absolute w-full"></div>
        <span className="bg-white px-2 text-gray-500 text-sm relative">or continue with email</span>
      </div>
      
      <FormErrorBoundary resetOnChange={resetKey}>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Input
              label="Email Address"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={validationErrors.some(e => e.field === 'email')}
            />
            <ValidationErrorDisplay errors={validationErrors} field="email" />
          </div>
          
          <div>
            <Input
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              error={validationErrors.some(e => e.field === 'password')}
            />
            <ValidationErrorDisplay errors={validationErrors} field="password" />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>
            
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </FormErrorBoundary>
    </AuthLayout>
  );
} 