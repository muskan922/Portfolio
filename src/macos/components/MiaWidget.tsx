import { useEffect, useState } from "react";
import { sfx } from "../lib/sfx";

const GREETINGS = [
  "Ask me anything about Muskan",
  "Hello, I'm MIA",
  "Need to know something about Muskan?",
  "Explore Muskan's work with me.",
  "Type to explore Muskan's profile.",
];

interface MiaWidgetProps {
  onOpen: () => void;
}

export function MiaWidget({ onOpen }: MiaWidgetProps) {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
        setFade(true);
      }, 500); // duration of fade-out before changing greeting
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    sfx.open();
    onOpen();
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-[88px] right-6 z-[400] flex w-72 cursor-pointer flex-col rounded-xl border border-white/10 bg-neutral-900/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] group"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] font-mono tracking-wider text-white/50">
        <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          ● MIA ONLINE
        </span>
        <span className="text-white/35">SYS.ASSIST</span>
      </div>

      <div className="mt-3 flex flex-col gap-1 min-h-[38px]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400/80">
          Muskan.OS Assistant
        </p>
        <p
          className={`font-sans text-xs leading-relaxed text-white/80 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {GREETINGS[greetingIndex]}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-end text-[10px] font-mono text-emerald-400/60 group-hover:text-emerald-400">
        <span>Click to initialize &gt;&gt;</span>
      </div>
    </div>
  );
}
