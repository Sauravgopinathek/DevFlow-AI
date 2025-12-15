import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`animate-spin rounded-full border-b-4 border-primary-600 ${sizeClasses[size]}`}></div>
      <p className="text-gray-600 animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;