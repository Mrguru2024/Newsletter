
import React from 'react';

export default function Boom() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-44 h-44 bg-boom animate-pulse rounded-[50%] -rotate-12 flex items-center justify-center">
        <span className="text-5xl font-bold text-white drop-shadow-lg transform rotate-12">
          BOOM!
        </span>
      </div>
    </div>
  );
}
