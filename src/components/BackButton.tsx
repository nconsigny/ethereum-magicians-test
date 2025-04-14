'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react'; // Using lucide icon for visual cue

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  text?: string; // Optional text
}

/**
 * A clearly styled button for navigating back within the app.
 */
export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  className = '', 
  text = 'Back' // Default text
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors 
                  bg-sol-blue text-sol-base03 hover:bg-sol-cyan 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sol-cyan focus:ring-offset-sol-base03 
                  ${className}`}
    >
      <ArrowLeft size={16} />
      <span>{text}</span>
    </button>
  );
}; 