/**
 * Validation utilities for form inputs and error handling
 */

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

/**
 * Email validation using a comprehensive regex pattern
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Password strength validation with multiple criteria
 */
export function validatePassword(password: string): { 
  valid: boolean; 
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password should contain at least one uppercase letter');
  }
  
  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password should contain at least one number');
  }
  
  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password should contain at least one special character');
  }
  
  // Determine password strength
  if (password.length >= 8) {
    let strengthScore = 0;
    if (/[A-Z]/.test(password)) strengthScore++;
    if (/[0-9]/.test(password)) strengthScore++;
    if (/[^A-Za-z0-9]/.test(password)) strengthScore++;
    
    if (strengthScore === 3 && password.length >= 10) {
      strength = 'strong';
    } else if (strengthScore >= 2) {
      strength = 'medium';
    }
  }
  
  return {
    valid: errors.length === 0,
    strength,
    errors
  };
}

/**
 * Validates auth-related form fields
 */
export function validateAuthForm(data: Record<string, string>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate email
  if (data.email) {
    if (!validateEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'Please enter a valid email address'
      });
    }
  } else if (data.email === '') {
    errors.push({
      field: 'email',
      message: 'Email is required'
    });
  }
  
  // Validate password
  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors.map(error => ({
        field: 'password',
        message: error
      })));
    }
  } else if (data.password === '') {
    errors.push({
      field: 'password',
      message: 'Password is required'
    });
  }
  
  // Validate password confirmation
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match'
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Formats validation errors for server responses
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return '';
  }
  
  if (errors.length === 1) {
    return errors[0].message;
  }
  
  return `Please fix the following errors:\n${errors.map(e => `- ${e.message}`).join('\n')}`;
}

/**
 * Sanitizes server error messages for user display
 */
export function sanitizeErrorMessage(message: string): string {
  // Map known technical error messages to user-friendly ones
  const errorMap: Record<string, string> = {
    'User already registered': 'An account with this email already exists',
    'Invalid login credentials': 'Incorrect email or password',
    'Email not confirmed': 'Please verify your email before logging in',
    'JWT expired': 'Your session has expired, please login again',
  };
  
  // Check if we have a mapped message
  if (message in errorMap) {
    return errorMap[message];
  }
  
  // For security, don't expose detailed database or internal errors
  if (message.includes('database') || message.includes('SQL') || message.includes('constraint')) {
    return 'An unexpected error occurred. Please try again later.';
  }
  
  // Return the original message if it seems safe
  return message;
} 