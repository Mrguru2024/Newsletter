import React from "react";
import ComicPanelLayout from "../../../components/ComicPanelLayout";

export default function NewsletterPage({
  params,
}: {
  params: { issue: string };
}) {
  return (
    <section className="min-h-screen w-full bg-background p-0">
      <h1 className="text-4xl font-comic mb-8 text-center pt-8">
        Newsletter #{params.issue}
      </h1>
      <ComicPanelLayout variant="variant1" />
    </section>
  );
}
