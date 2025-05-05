
import React from 'react';
import ComicLayout from "../../../components/ComicLayout";
import Pow from "../../../components/panels/Pow";
import Boom from "../../../components/panels/Boom";
import SpeechBubble from "../../../components/panels/SpeechBubble";
import StandardPanel from "../../../components/panels/StandardPanel";

const panels = [
  <Pow key={0} />,
  <StandardPanel key={1}>
    <img src="/hero.png" alt="Hero" className="w-full h-full object-cover" />
  </StandardPanel>,
  <SpeechBubble key={2} text="Welcome to our comic newsletter!" />,
  <SpeechBubble key={3} text="Stay tuned for more adventures!" />,
  <StandardPanel key={4}>
    <img src="/sidekick.png" alt="Sidekick" className="w-full h-full object-cover" />
  </StandardPanel>,
  <Boom key={5} />,
];

interface PageProps {
  params: { issue: string }
}

const NewsletterPage: React.FC<PageProps> = ({ params }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-comic text-center mb-8">Newsletter #{params.issue}</h1>
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <ComicLayout>{panels}</ComicLayout>
        </div>
      </div>
    </main>
  );
}

export default NewsletterPage;
