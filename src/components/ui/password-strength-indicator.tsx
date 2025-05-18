'use client';

import React, { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = 'empty' | 'weak' | 'medium' | 'strong';

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo((): StrengthLevel => {
    if (!password) return 'empty';
    
    // Calculate strength
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Convert score to strength level
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }, [password]);
  
  const strengthConfig = {
    empty: {
      width: '0%',
      color: 'bg-gray-200',
      text: '',
    },
    weak: {
      width: '33%',
      color: 'bg-red-500',
      text: 'Weak',
    },
    medium: {
      width: '66%',
      color: 'bg-yellow-500',
      text: 'Medium',
    },
    strong: {
      width: '100%',
      color: 'bg-green-500',
      text: 'Strong',
    },
  };
  
  if (strength === 'empty') {
    return null;
  }
  
  const config = strengthConfig[strength];
  
  return (
    <div className="mt-1">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${config.color} transition-all duration-300`} 
          style={{ width: config.width }}
        ></div>
      </div>
      <p className={`text-xs mt-1 ${
        strength === 'weak' ? 'text-red-500' : 
        strength === 'medium' ? 'text-yellow-600' : 
        'text-green-600'
      }`}>
        Password strength: {config.text}
      </p>
    </div>
  );
} 