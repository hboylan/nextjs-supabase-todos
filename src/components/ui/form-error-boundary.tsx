'use client';

import React from 'react';
import { ErrorMessage } from '@/components/ui/error-message';
import { useEffect } from 'react';

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  resetOnChange?: unknown;
}

interface FormErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically for handling form submission errors
 * Catches runtime errors and displays a user-friendly error message
 */
export class FormErrorBoundary extends React.Component<FormErrorBoundaryProps, FormErrorBoundaryState> {
  constructor(props: FormErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): FormErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Form submission error:', error, errorInfo);
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  componentDidUpdate(prevProps: FormErrorBoundaryProps) {
    // If resetOnChange prop value changes, reset the error state
    if (this.props.resetOnChange !== prevProps.resetOnChange && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise show default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="my-4">
          <ErrorMessage
            message="Something went wrong while processing your request. Please try again."
            variant="default"
          />
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based wrapper for FormErrorBoundary with improved reset functionality
 */
export function useFormErrorReset(deps: React.DependencyList = []) {
  const [resetKey, setResetKey] = React.useState(0);
  
  useEffect(() => {
    setResetKey(prev => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return resetKey;
} 