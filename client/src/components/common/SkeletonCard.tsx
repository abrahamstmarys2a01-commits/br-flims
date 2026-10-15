import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border-subtle shadow-card animate-pulse">
      <div className="aspect-[2/3] w-full bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
