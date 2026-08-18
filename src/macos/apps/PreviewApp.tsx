import { useState } from "react";
import { Download, ExternalLink, Share2 } from "lucide-react";
import { PdfGlyph } from "../components/AppIcons";

const CV_URL = "/resume/Muskan_Kumari_Resume.pdf";

export function PreviewApp() {
  const [shareText, setShareText] = useState("Send Resume");

  const handleSendResume = async () => {
    const resumeUrl = window.location.origin + CV_URL;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Muskan Kumari Resume",
          text: "Check out Muskan Kumari's resume (Software Engineer / Full-Stack Developer).",
          url: resumeUrl,
        });
        setShareText("Shared!");
        setTimeout(() => setShareText("Send Resume"), 2000);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(resumeUrl);
        setShareText("Link Copied!");
        setTimeout(() => setShareText("Send Resume"), 2000);
      } catch (err) {
        window.open(CV_URL, "_blank");
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <PdfGlyph className="h-5 w-4 shrink-0" />
          <span className="truncate text-[13px] text-white/80">
            Muskan_Kumari_Resume.pdf
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={handleSendResume}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2.5 py-1 text-xs text-white/85 hover:border-white/40 transition-colors"
          >
            <Share2 size={12} />
            {shareText}
          </button>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/85 hover:bg-white/20"
          >
            <ExternalLink size={12} />
            Open in Tab
          </a>
          <a
            href={CV_URL}
            download="Muskan_Kumari_Resume.pdf"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#2a7de1] px-2.5 py-1 text-xs font-medium text-[#fff] hover:bg-[#3b8af0]"
          >
            <Download size={12} />
            Download
          </a>
        </div>
      </div>

      {/* Page sits on a Preview-style gray board with a paper shadow */}
      <div className="min-h-0 flex-1 bg-[#323237] p-4">
        <div className="mx-auto h-full max-w-3xl overflow-hidden rounded-md bg-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <iframe
            src={`${CV_URL}#view=FitH&toolbar=0&navpanes=0`}
            title="Muskan Kumari CV"
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
