// components/SkeletonCard.tsx
import React from "react";

interface SkeletonCardProps {
  count?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center mb-4 animate-pulse">
          <div className="h-[60px] w-[60px] rounded bg-gray-200 mr-4"></div>
          <div className="flex flex-col space-y-2">
            <div className="h-[12px] w-[200px] bg-gray-200 rounded"></div>
            <div className="h-[10px] w-[160px] bg-gray-100 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
