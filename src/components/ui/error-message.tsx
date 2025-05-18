import React from 'react';

interface ErrorMessageProps {
  message: string;
  variant?: 'default' | 'subtle' | 'toast';
  className?: string;
  onClose?: () => void;
}

export function ErrorMessage({
  message,
  variant = 'default',
  className = '',
  onClose,
}: ErrorMessageProps) {
  if (!message) return null;

  const variantClasses = {
    default: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative',
    subtle: 'text-red-600 text-sm',
    toast: 'bg-red-600 text-white px-4 py-3 rounded-md shadow-md',
  };

  return (
    <div 
      className={`${variantClasses[variant]} ${className}`}
      role="alert"
      aria-live="assertive"
      data-testid="error-message"
    >
      {variant === 'default' && (
        <div className="flex items-start">
          <svg 
            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>{message}</div>
        </div>
      )}
      
      {variant === 'subtle' && <div>{message}</div>}
      
      {variant === 'toast' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <div>{message}</div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-4 text-white hover:text-gray-100"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
} 