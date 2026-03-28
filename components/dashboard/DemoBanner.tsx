import { ExternalLink } from "lucide-react";

export default function DemoBanner() {
  return (
    <div className="shrink-0 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-primary-container/20 px-4 py-2 text-xs font-medium text-primary text-center">
      <span>Demo Mode: You&apos;re viewing seeded data. Submit the contact form to see it appear in the admin view.</span>
      <a
        href="https://github.com/byronpantoja/mockup-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity"
      >
        View Source Code
        <ExternalLink size={12} />
      </a>
    </div>
  );
}
