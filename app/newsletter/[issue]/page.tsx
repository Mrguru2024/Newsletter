import React from 'react';
import ComicLayout from "@/components/ComicLayout";
import ComicPanel from "@/components/ComicPanel";
import Pow from "@/components/panels/Pow";

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto">
        <h1 className="text-4xl font-comic mb-8 text-center">Newsletter #{params.issue}</h1>
        <ComicLayout>
          <ComicPanel type="panel" title="Featured Story" className="h-[416px] border-4 border-[#C61425] bg-[#F4F4F4] p-4"/>
          <ComicPanel type="panel" title="Quick Update" className="h-[160px] border-4 border-[#C61425] bg-[#F4F4F4] p-4"/>
          <ComicPanel type="panel" title="Main Story" className="h-full border-4 border-[#C61425] bg-[#F4F4F4] p-4"/>
          <ComicPanel type="panel" title="Highlights" className="h-[315px] border-4 border-[#C61425] bg-[#F4F4F4] p-4"/>
          <ComicPanel type="panel" title="News Flash" className="h-[260px] border-4 border-[#C61425] bg-[#F4F4F4] p-4"/>
          <Pow />
          <ComicPanel type="speech-bubble" text="Stay tuned!" />
        </ComicLayout>
      </div>
    </div>
  );
}