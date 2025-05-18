import React from 'react';

interface PasswordStrengthIndicatorProps {
  strength: 'weak' | 'medium' | 'strong';
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  // Define the colors and text for each strength level
  const strengthInfo = {
    weak: {
      color: 'bg-red-500',
      text: 'Weak',
      width: 'w-1/3',
      textColor: 'text-red-700',
    },
    medium: {
      color: 'bg-yellow-500',
      text: 'Medium',
      width: 'w-2/3',
      textColor: 'text-yellow-700',
    },
    strong: {
      color: 'bg-green-500',
      text: 'Strong',
      width: 'w-full',
      textColor: 'text-green-700',
    },
  };

  const { color, text, width, textColor } = strengthInfo[strength];

  return (
    <div className="mt-1 mb-2">
      <div className="flex items-center justify-between mb-1">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
            className={`h-full ${color} rounded-full ${width} transition-all duration-300`}
          ></div>
        </div>
      </div>
      <p className={`text-xs ${textColor} text-right`}>{text}</p>
    </div>
  );
} 