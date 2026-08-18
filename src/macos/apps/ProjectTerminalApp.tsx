import { useEffect, useRef, useState } from "react";
import { projects } from "../../data/content";
import { sfx } from "../lib/sfx";

interface Line {
  id: number;
  text: React.ReactNode;
}

interface ProjectTerminalAppProps {
  projectTitle: string;
}

export function ProjectTerminalApp({ projectTitle }: ProjectTerminalAppProps) {
  const project = projects.find(
    (p) => p.title.toLowerCase() === projectTitle.toLowerCase()
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<Line[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [lineCounter, setLineCounter] = useState(0);

  // Command handlers
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    sfx.click();
    const cmdLower = trimmed.toLowerCase();
    let response: React.ReactNode = "";

    switch (cmdLower) {
      case "help":
        response = (
          <div>
            <p className="text-white/60">Available commands:</p>
            <div className="mt-1 grid grid-cols-2 gap-x-4 max-w-xs text-white/95">
              <div>
                <button onClick={() => executeCommand("info")} className="text-emerald-400 hover:underline text-left block w-full">info</button>
                <button onClick={() => executeCommand("tech")} className="text-emerald-400 hover:underline text-left block w-full">tech</button>
                <button onClick={() => executeCommand("features")} className="text-emerald-400 hover:underline text-left block w-full">features</button>
              </div>
              <div>
                <button onClick={() => executeCommand("github")} className="text-emerald-400 hover:underline text-left block w-full">github</button>
                <button onClick={() => executeCommand("live")} className="text-emerald-400 hover:underline text-left block w-full">live</button>
                <button onClick={() => executeCommand("clear")} className="text-emerald-400 hover:underline text-left block w-full">clear</button>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-white/40">(Or click any command to run it)</p>
          </div>
        );
        break;

      case "info":
        if (project) {
          response = (
            <div className="space-y-1.5">
              <p><span className="text-amber-400 font-semibold">PROJECT:</span> {project.title}</p>
              <p><span className="text-amber-400 font-semibold">TAGLINE:</span> {project.tag}</p>
              <p className="text-white/80 leading-relaxed max-w-xl"><span className="text-amber-400 font-semibold">DESCRIPTION:</span> {project.description}</p>
            </div>
          );
        } else {
          response = <span className="text-red-400">Project data not found.</span>;
        }
        break;

      case "tech":
        if (project) {
          response = (
            <div>
              <p className="text-white/60 mb-1">Technologies used in {project.title}:</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-white/10 text-emerald-400 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        } else {
          response = <span className="text-red-400">Project data not found.</span>;
        }
        break;

      case "features":
        if (project) {
          response = (
            <div className="max-w-xl text-white/80 leading-relaxed">
              <p className="text-amber-400 font-semibold mb-1">Key Details / Features:</p>
              {project.description.split(". ").map((sentence, idx) => {
                const trimmedSentence = sentence.trim();
                if (!trimmedSentence) return null;
                return (
                  <p key={idx} className="flex gap-2 text-sm pl-2">
                    <span className="text-emerald-400">»</span>
                    <span>{trimmedSentence.endsWith(".") ? trimmedSentence : `${trimmedSentence}.`}</span>
                  </p>
                );
              })}
            </div>
          );
        } else {
          response = <span className="text-red-400">Project data not found.</span>;
        }
        break;

      case "github":
        if (project?.link) {
          response = (
            <div>
              <p className="text-emerald-400">Opening Github URL...</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-xs block truncate max-w-md">
                {project.link}
              </a>
            </div>
          );
          window.open(project.link, "_blank");
        } else {
          response = <span className="text-white/50">Github link not available for this project.</span>;
        }
        break;

      case "live":
        response = <span className="text-white/50">Live URL deployment is private or unavailable for this offline project.</span>;
        break;

      case "clear":
        setHistory([]);
        setInputValue("");
        return;

      default:
        response = (
          <span className="text-red-400">
            Command not found: "{trimmed}". Type <button onClick={() => executeCommand("help")} className="underline font-semibold text-emerald-400">help</button> for available commands.
          </span>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: lineCounter,
        text: (
          <div className="font-mono text-[13px] leading-relaxed text-white/90">
            <span className="text-blue-400">C:\MUSKAN.OS\Projects\{project?.title || "Unknown"}&gt;</span> {trimmed}
          </div>
        ),
      },
      {
        id: lineCounter + 1,
        text: <div className="pl-2 mt-1 mb-2 font-mono text-[13px]">{response}</div>,
      },
    ]);
    setLineCounter((c) => c + 2);
    setInputValue("");
  };

  // Initial load message
  useEffect(() => {
    if (!project) return;
    const initialLines: Line[] = [
      {
        id: 0,
        text: <div className="text-white/40 font-mono text-[11px]">MUSKAN.OS TERMINAL [Version 1.0.0]</div>,
      },
      {
        id: 1,
        text: (
          <div className="font-mono text-[13px] text-white/95">
            <span className="text-blue-400">C:\MUSKAN.OS\Projects\{project.title}&gt;</span> npm run info
          </div>
        ),
      },
      {
        id: 2,
        text: (
          <div className="font-mono text-[13px] pl-2 mt-1 mb-2 text-emerald-400">
            <p>&gt; Project loaded successfully.</p>
            <div className="mt-2 text-white">
              <p><span className="text-amber-400 font-semibold">PROJECT:</span> {project.title}</p>
              <p><span className="text-amber-400 font-semibold">STACK:</span> {project.tech.join(" / ")}</p>
            </div>
            <div className="mt-3 text-white/60">
              <p>Available commands: <button onClick={() => executeCommand("help")} className="text-emerald-400 hover:underline">help</button>, <button onClick={() => executeCommand("info")} className="text-emerald-400 hover:underline">info</button>, <button onClick={() => executeCommand("tech")} className="text-emerald-400 hover:underline">tech</button>, <button onClick={() => executeCommand("features")} className="text-emerald-400 hover:underline">features</button>, <button onClick={() => executeCommand("github")} className="text-emerald-400 hover:underline">github</button>, <button onClick={() => executeCommand("live")} className="text-emerald-400 hover:underline">live</button>, <button onClick={() => executeCommand("clear")} className="text-emerald-400 hover:underline">clear</button></p>
            </div>
          </div>
        ),
      },
    ];
    setHistory(initialLines);
    setLineCounter(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectTitle]);

  // Autoscroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={containerRef}
      className="force-dark flex h-full flex-col bg-[#0b0c10]/95 p-4 font-mono text-[13px] leading-relaxed text-white/90 overflow-y-auto selection:bg-emerald-500/30"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 space-y-1">
        {history.map((line) => (
          <div key={line.id}>{line.text}</div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeCommand(inputValue);
        }}
        className="mt-4 flex items-center"
      >
        <span className="text-blue-400 shrink-0 select-none">
          C:\MUSKAN.OS\Projects\{project?.title || "Unknown"}&gt;
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="ml-2 flex-1 bg-transparent text-white outline-none border-none caret-emerald-400"
          autoFocus
          aria-label="Terminal input"
        />
      </form>
    </div>
  );
}
