
import ComicLayout from "@/components/ComicLayout";

const mockPanels = [
  { type: "explosion", text: "POW!", color: "teal" },
  { type: "panel" },
  { type: "speech-bubble" },
  { type: "speech-bubble" },
  { type: "panel" },
  { type: "explosion", text: "BOOM!", color: "pink" },
] as const;

export default function NewsletterPage({ params }: { params: { issue: string } }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-yellow-100">
      <ComicLayout panels={mockPanels} />
    </main>
  );
}
