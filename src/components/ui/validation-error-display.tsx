import React from 'react';
import { ValidationError } from '@/utils/validation';

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
  field?: string;
  className?: string;
}

/**
 * Component for displaying validation errors related to a specific form field
 * If no field is provided, all errors are displayed
 */
export function ValidationErrorDisplay({
  errors,
  field,
  className = '',
}: ValidationErrorDisplayProps) {
  // If no errors, don't render anything
  if (!errors || errors.length === 0) {
    return null;
  }
  
  // Filter errors by field if specified
  const relevantErrors = field 
    ? errors.filter(error => error.field === field) 
    : errors;
    
  if (relevantErrors.length === 0) {
    return null;
  }
  
  return (
    <div
      className={`text-sm text-red-600 mt-1 ${className}`}
      data-testid={field ? `${field}-errors` : 'validation-errors'}
      role="alert"
    >
      {relevantErrors.length === 1 ? (
        // Single error display
        <p>{relevantErrors[0].message}</p>
      ) : (
        // Multiple errors display as a list
        <ul className="list-disc pl-5 space-y-1">
          {relevantErrors.map((error, index) => (
            <li key={`${error.field}-${index}`}>
              {error.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 