'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/app/actions/auth';
import { useState } from 'react';
import Link from 'next/link';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // Create form data for the server action
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    try {
      const result = await signUp(formData);
      
      if ('error' in result) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Check Your Email</h2>
        <p className="mb-4 text-center">
          We&apos;ve sent you an email with a confirmation link. Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-sm text-gray-600 text-center">
          Remember to check your spam folder if you don&apos;t see it in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          minLength={8}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          required
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••"
        />
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
        >
          Sign Up
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <p>
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
} 