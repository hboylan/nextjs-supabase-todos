'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { resetPassword } from '@/app/actions/auth';
import { validateEmail, ValidationError } from '@/utils/validation';
import { ValidationErrorDisplay } from '@/components/ui/validation-error-display';
import { ErrorMessage } from '@/components/ui/error-message';
import { FormErrorBoundary, useFormErrorReset } from '@/components/ui/form-error-boundary';
import AuthLayout from '@/components/auth/AuthLayout';
import { useToast } from '@/components/ui/toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const resetKey = useFormErrorReset([email]);
  const { showToast } = useToast();

  // Client-side validation function
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];
    
    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
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
    
    const formData = new FormData();
    formData.append('email', email);
    
    try {
      const result = await resetPassword(formData);
      
      if ('error' in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        showToast('Password reset email sent. Check your inbox.', 'success');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Footer for auth layout
  const footer = (
    <p>
      Remember your password?{' '}
      <Link href="/signin" className="text-blue-600 hover:underline">
        Sign In
      </Link>
    </p>
  );

  if (success) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        description="We've sent you an email with password reset instructions."
        footer={footer}
      >
        <div className="text-center mb-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4">
            <p>
              Please check your inbox for instructions to reset your password.
            </p>
            <p className="text-sm mt-2 text-blue-600">
              Remember to check your spam folder if you don&apos;t see it in your inbox.
            </p>
          </div>
          <Link href="/signin" className="mt-4 inline-block px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Your Password?"
      description="Enter your email address and we'll send you a password reset link."
      footer={footer}
    >
      {error && !validationErrors.length && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
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
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Send Reset Link
          </Button>
        </form>
      </FormErrorBoundary>
    </AuthLayout>
  );
} 