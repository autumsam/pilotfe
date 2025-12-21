
import React from "react";

interface PlaceholderImageProps {
  className?: string;
  alt?: string;
}

const PlaceholderImage = ({ className, alt = "Placeholder image" }: PlaceholderImageProps) => {
  return (
    <div 
      className={`bg-gradient-to-br from-postpulse-blue to-blue-400 rounded-lg overflow-hidden shadow-lg ${className}`}
    >
      <div className="p-6 h-full w-full flex flex-col">
        <div className="bg-white/10 h-8 w-full rounded mb-4"></div>
        
        <div className="flex gap-4 mb-6">
          <div className="bg-white/10 h-32 w-1/3 rounded"></div>
          <div className="bg-white/10 h-32 w-2/3 rounded"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 h-24 rounded"></div>
          <div className="bg-white/10 h-24 rounded"></div>
          <div className="bg-white/10 h-24 rounded"></div>
        </div>
        
        <div className="bg-white/10 h-40 w-full rounded mb-4"></div>
        
        <div className="mt-auto flex justify-between">
          <div className="bg-white/10 h-8 w-24 rounded"></div>
          <div className="bg-white/10 h-8 w-24 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderImage;
