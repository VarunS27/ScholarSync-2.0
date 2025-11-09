import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const loader = (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-gray-300 dark:border-gray-700 border-t-primary rounded-full animate-spin`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
