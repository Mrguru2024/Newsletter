import React from 'react';
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { Card } from "../../../components/ui/card";
import Boom from "../../../components/panels/Boom";
import SpeechBubble from "../../../components/panels/SpeechBubble";

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <section className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-comic mb-8 text-center">Newsletter #{params.issue}</h1>
        <Card className="relative border-4 border-yellow-400 bg-gray-100 p-2 rounded-lg">
          <div className="grid grid-cols-3 grid-rows-2 gap-4 relative">
            <div className="relative border-2 border-red-500 bg-white p-4">
              <SpeechBubble text="POW!" />
            </div>
            <div className="border-2 border-red-500 bg-white p-4" />
            <div className="border-2 border-red-500 bg-white p-4" />
            <div className="border-2 border-red-500 bg-white p-4">
              <SpeechBubble text="Stay tuned!" />
            </div>
            <div className="border-2 border-red-500 bg-white p-4" />
            <div className="border-2 border-red-500 bg-white p-4">
              <Boom />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}