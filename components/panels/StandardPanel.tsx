
import React from 'react';

interface StandardPanelProps {
  children?: React.ReactNode;
}

export default function StandardPanel({ children }: StandardPanelProps) {
  return (
    <div className="w-full h-full bg-white border-4 border-black p-4 flex items-center justify-center">
      {children}
    </div>
  );
}
