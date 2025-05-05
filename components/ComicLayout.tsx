
import React from 'react';
import ComicPanel from "./ComicPanel";

interface Panel {
  type: 'explosion' | 'speech-bubble' | 'panel';
  text?: string;
  color?: string;
}

interface ComicLayoutProps {
  panels: Panel[];
}

export default function ComicLayout({ panels }: ComicLayoutProps) {
  return (
    <div className="w-[944px] h-[755px] border-4 border-red-600 m-auto bg-white grid grid-cols-3 grid-rows-2 gap-4 p-4 relative">
      {panels.map((panel, index) => (
        <ComicPanel key={index} type={panel.type} text={panel.text} color={panel.color} />
      ))}
    </div>
  );
}
