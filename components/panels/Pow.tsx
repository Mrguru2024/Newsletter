
import React from 'react';

export default function Pow() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-40 h-40 bg-pow animate-pulse rounded-[50%] rotate-12 flex items-center justify-center">
        <span className="text-5xl font-bold text-white drop-shadow-lg transform -rotate-12">
          POW!
        </span>
      </div>
    </div>
  );
}
