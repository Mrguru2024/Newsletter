import React from 'react';
import { Card } from "../../../components/ui/card";
import StandardPanel from "../../../components/panels/StandardPanel";
import Pow from "../../../components/panels/Pow";
import SpeechBubble from "../../../components/panels/SpeechBubble";

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-[944px]">
        <h1 className="text-4xl font-comic mb-8 text-center">Newsletter #{params.issue}</h1>
        <Card className="h-[755px] border-4 border-black bg-white p-6 grid grid-cols-3 gap-6">
          <div className="space-y-6">
            <StandardPanel>
              <h2 className="text-2xl font-comic">Featured Story</h2>
            </StandardPanel>
            <StandardPanel>
              <h3 className="text-xl font-comic">Quick Update</h3>
            </StandardPanel>
          </div>
          
          <div className="h-full">
            <StandardPanel>
              <h2 className="text-2xl font-comic">Main Story</h2>
            </StandardPanel>
          </div>
          
          <div className="space-y-6">
            <StandardPanel>
              <h2 className="text-2xl font-comic">Highlights</h2>
            </StandardPanel>
            <StandardPanel>
              <h3 className="text-xl font-comic">News Flash</h3>
            </StandardPanel>
          </div>
          
          <div className="absolute -top-4 -right-4">
            <Pow />
          </div>
          
          <div className="absolute left-[211px] top-[441px]">
            <SpeechBubble text="Stay tuned!" />
          </div>
        </Card>
      </div>
    </div>
  );
}