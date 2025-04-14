import React from 'react';

interface ErrorMessageProps {
  message: string | null;
  onRetry?: () => void; // Optional retry function
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg m-4">
      <p className="font-medium mb-2">Oops! Something went wrong.</p>
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
} 