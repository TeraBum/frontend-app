import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
    </div>
  );
};

export default Loader;
