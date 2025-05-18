'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/app/actions/auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import AuthLayout from '@/components/auth/AuthLayout';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Capture redirectTo parameter on component mount
  useEffect(() => {
    const redirectTo = searchParams.get('redirectTo');
    if (redirectTo) {
      setRedirectPath(redirectTo);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
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
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
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
      
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
      <SocialLoginButtons 
        redirectTo={redirectPath || undefined} 
        onError={setError} 
      />
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input
          label="Email Address"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        
        <Input
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••"
        />
        
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
    </AuthLayout>
  );
} 