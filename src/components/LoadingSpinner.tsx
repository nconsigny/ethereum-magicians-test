import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-10">
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
} 