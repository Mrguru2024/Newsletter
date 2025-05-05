
import React from 'react';

interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="relative w-full h-full p-4">
      <div className="bg-white border-4 border-black rounded-3xl p-4 h-full flex items-center justify-center relative">
        <p className="text-2xl font-comic text-center">{text}</p>
        <div className="absolute -bottom-6 left-1/2 w-8 h-8 bg-white border-r-4 border-b-4 border-black transform rotate-45 -translate-x-1/2" />
      </div>
    </div>
  );
}
