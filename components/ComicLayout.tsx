
import React from 'react';
import ComicPanel from "./ComicPanel";

interface ComicLayoutProps {
  children: React.ReactNode;
}

export default function ComicLayout({ children }: ComicLayoutProps) {
  return (
    <div className="w-[944px] h-[755px] border-4 border-black m-auto bg-white grid grid-cols-3 grid-rows-2 gap-6 p-6">
      {children}
    </div>
  );
}
