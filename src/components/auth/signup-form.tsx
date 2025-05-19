'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/app/actions/auth';
import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { FormErrorBoundary, useFormErrorReset } from '@/components/ui/form-error-boundary';
import { ValidationErrorDisplay } from '@/components/ui/validation-error-display';
import { ErrorMessage } from '@/components/ui/error-message';
import { validateEmail, validatePassword, ValidationError } from '@/utils/validation';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { useToast } from '@/components/ui/toast';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Get password strength info
  const passwordCheck = password ? validatePassword(password) : { strength: 'weak' as const, valid: false, errors: [] };
  
  const resetKey = useFormErrorReset([email, password, confirmPassword]);
  const { showToast } = useToast();

  // Client-side validation function
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];
    
    // Validate email
    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    // Validate password
    if (!password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
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
    formData.append('confirmPassword', confirmPassword);
    
    try {
      const result = await signUp(formData);
      
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
            else if (errorMsg.toLowerCase().includes('password')) {
              if (errorMsg.toLowerCase().includes('match')) field = 'confirmPassword';
              else field = 'password';
            }
            return { field, message: errorMsg };
          });
          setValidationErrors(errorsArray);
        }
      } else {
        setSuccess(true);
        showToast('Account created successfully! Please check your email for verification.', 'success');
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
      Already have an account?{' '}
      <Link href="/signin" className="text-blue-600 hover:underline">
        Sign In
      </Link>
    </p>
  );

  if (success) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        description="We've sent you an email with a confirmation link."
        footer={footer}
      >
        <div className="text-center mb-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-4">
            <p>
              Please check your inbox and click the link to verify your account.
        </p>
            <p className="text-sm mt-2 text-blue-600">
          Remember to check your spam folder if you don&apos;t see it in your inbox.
        </p>
      </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create an Account" 
      description="Sign up to get started with Todo App"
      footer={footer}
    >
      {error && !validationErrors.length && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
      <SocialLoginButtons onError={setError} />
      
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-300 absolute w-full"></div>
        <span className="bg-white px-2 text-gray-500 text-sm relative">or continue with email</span>
      </div>
      
      <FormErrorBoundary resetOnChange={resetKey}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            {password && <PasswordStrengthIndicator strength={passwordCheck.strength} />}
            <ValidationErrorDisplay errors={validationErrors} field="password" />
          </div>
        
          <div>
        <Input
          label="Confirm Password"
          type="password"
          required
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••••"
              error={validationErrors.some(e => e.field === 'confirmPassword')}
        />
            <ValidationErrorDisplay errors={validationErrors} field="confirmPassword" />
          </div>
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
        >
            Create Account
        </Button>
      </form>
      </FormErrorBoundary>
    </AuthLayout>
  );
} 