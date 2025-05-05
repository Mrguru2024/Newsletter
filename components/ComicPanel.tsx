
import React from 'react';

interface ComicPanelProps {
  type: 'explosion' | 'speech-bubble' | 'panel';
  text?: string;
  color?: string;
}

export default function ComicPanel({ type, text, color }: ComicPanelProps) {
  switch (type) {
    case "explosion":
      return (
        <div className={`w-full h-full relative`}>
          <div className={`w-32 h-32 bg-${color}-500 rounded-full flex items-center justify-center transform rotate-12`}>
            <span className="text-4xl font-bold text-yellow-300 drop-shadow" style={{ fontFamily: 'Comic Sans MS' }}>
              {text}
            </span>
          </div>
        </div>
      );
    case "speech-bubble":
      return (
        <div className="relative bg-white border-2 border-red-600 rounded-2xl w-full h-full p-4">
          <div className="absolute -bottom-4 left-6 w-6 h-6 bg-white border-b-2 border-r-2 border-red-600 transform rotate-45" />
        </div>
      );
    case "panel":
    default:
      return <div className="w-full h-full bg-white border-2 border-red-600" />;
  }
}
