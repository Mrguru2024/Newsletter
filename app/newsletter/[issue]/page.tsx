
import React from 'react';
import { Card } from "../../../components/ui/card";

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="w-[944px] mx-auto">
        <Card className="w-full h-[755px] border-4 border-black bg-white p-6 relative">
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Left column */}
            <div className="space-y-6">
              <div className="w-full h-[416px] border-4 border-[#C61425] bg-[#F4F4F4]" />
              <div className="w-full h-[160px] border-4 border-[#C61425] bg-[#F4F4F4]" />
            </div>
            
            {/* Middle column */}
            <div className="h-full">
              <div className="w-full h-full border-4 border-[#C61425] bg-[#F4F4F4]" />
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              <div className="w-full h-[315px] border-4 border-[#C61425] bg-[#F4F4F4]" />
              <div className="w-full h-[260px] border-4 border-[#C61425] bg-[#F4F4F4]" />
            </div>
          </div>
          
          {/* POW element */}
          <div className="absolute -top-4 -right-4 w-[191px] h-[142px] bg-[#C61425] flex items-center justify-center rotate-12">
            <span className="text-5xl font-bold text-white -rotate-12">POW!</span>
          </div>
          
          {/* Speech bubbles */}
          <div className="absolute left-[211px] top-[441px] w-[188px] h-[140px] bg-white border-4 border-[#C61425] p-4 flex items-center justify-center">
            <div className="absolute -bottom-4 left-8 w-8 h-8 bg-[#C61425] transform rotate-45" />
          </div>
          
          <div className="absolute left-[297px] top-[437px] w-[104px] h-[102px] bg-[#C61425]" />
        </Card>
      </div>
    </div>
  );
}
