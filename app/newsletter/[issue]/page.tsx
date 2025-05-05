
import React from 'react';
import { AspectRatio } from "../../../components/ui/aspect-ratio";
import { Card } from "../../../components/ui/card";

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <section className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-comic mb-8 text-center">Newsletter #{params.issue}</h1>
        <Card className="relative border-4 border-yellow-400 bg-gray-100 p-2 rounded-lg">
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-b from-yellow-400 to-orange-500 opacity-80" style={{
            backgroundImage: "radial-gradient(circle, #ff0000 2px, transparent 2px)",
            backgroundSize: "10px 10px",
          }}></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-80" style={{
            backgroundImage: "radial-gradient(circle, #ff0000 2px, transparent 2px)",
            backgroundSize: "10px 10px",
          }}></div>

          <div className="grid grid-cols-3 grid-rows-2 gap-4 relative">
            <div className="relative border-2 border-red-500 bg-white min-h-[200px]">
              <div className="absolute -top-10 -left-10 z-10 w-40 h-40">
                <AspectRatio ratio={1}>
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-teal-300 rounded-full opacity-80" style={{
                      clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                    }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-yellow-400 transform rotate-12 drop-shadow-md" style={{
                        textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                      }}>POW!</span>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </div>

            <div className="border-2 border-red-500 bg-white min-h-[200px]"></div>
            <div className="border-2 border-red-500 bg-white min-h-[200px]"></div>
            
            <div className="relative border-2 border-red-500 bg-white min-h-[200px]">
              <div className="absolute top-1/2 left-1/4 w-32 h-24">
                <div className="relative w-full h-full border-2 border-red-500 rounded-2xl bg-white p-4">
                  <span className="font-comic text-lg">Stay tuned!</span>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white border-2 border-red-500 transform rotate-45"></div>
                </div>
              </div>
            </div>

            <div className="border-2 border-red-500 bg-white min-h-[200px]"></div>
            
            <div className="relative border-2 border-red-500 bg-white min-h-[200px]">
              <div className="absolute bottom-1/4 right-1/4 z-10">
                <div className="relative">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500 rounded-full opacity-80"></div>
                  <div className="relative z-10">
                    <span className="text-4xl font-bold text-yellow-400 transform -rotate-12 drop-shadow-md" style={{
                      textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000"
                    }}>BOOM!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
