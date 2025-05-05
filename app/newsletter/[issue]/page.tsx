
import React from 'react';
import { Card } from "../../../components/ui/card";
import InputDesign from "../../../components/ui/InputDesign";

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="w-[944px] mx-auto">
        <h1 className="text-4xl font-comic mb-8 text-center">Newsletter #{params.issue}</h1>
        <Card className="w-full h-[755px] border-4 border-black bg-white p-6 relative">
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Left column */}
            <div className="space-y-6">
              <div className="w-full h-[416px] border-4 border-[#C61425] bg-[#F4F4F4] p-4">
                <h2 className="text-2xl font-comic">Featured Story</h2>
              </div>
              <div className="w-full h-[160px] border-4 border-[#C61425] bg-[#F4F4F4] p-4">
                <h3 className="text-xl font-comic">Quick Update</h3>
              </div>
            </div>
            
            {/* Middle column */}
            <div className="h-full">
              <div className="w-full h-full border-4 border-[#C61425] bg-[#F4F4F4] p-4">
                <h2 className="text-2xl font-comic">Main Story</h2>
              </div>
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              <div className="w-full h-[315px] border-4 border-[#C61425] bg-[#F4F4F4] p-4">
                <h2 className="text-2xl font-comic">Highlights</h2>
              </div>
              <div className="w-full h-[260px] border-4 border-[#C61425] bg-[#F4F4F4] p-4">
                <h3 className="text-xl font-comic">News Flash</h3>
              </div>
            </div>
          </div>
          
          {/* POW element */}
          <div className="absolute -top-4 -right-4 w-[191px] h-[142px] bg-[#C61425] flex items-center justify-center rotate-12">
            <span className="text-5xl font-bold text-white -rotate-12 font-comic">POW!</span>
          </div>
          
          {/* Speech bubble */}
          <div className="absolute left-[211px] top-[441px] w-[188px] h-[140px] bg-white border-4 border-[#C61425] p-4 flex items-center justify-center">
            <p className="text-xl font-comic">Stay tuned!</p>
            <div className="absolute -bottom-4 left-8 w-8 h-8 bg-white border-b-4 border-r-4 border-[#C61425] transform rotate-45" />
          </div>
        </Card>
      </div>
    </div>
  );
}
