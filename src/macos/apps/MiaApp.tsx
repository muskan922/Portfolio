import { useState, useEffect, useRef } from "react";
import { site, projects } from "../../data/content";
import { sfx } from "../lib/sfx";

interface Message {
  sender: "user" | "mia";
  text: string;
  actions?: { label: string; onClick: () => void }[];
}

interface MiaAppProps {
  actions: {
    openApp: (app: any, payload?: any) => void;
    close: () => void;
  };
}

export function MiaApp({ actions }: MiaAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "mia",
      text: "Hello! I'm MIA, Muskan's personal OS assistant. Ask me anything about her work, skills, experience, or projects.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const addMessage = (sender: "user" | "mia", text: string, msgActions?: { label: string; onClick: () => void }[]) => {
    setMessages((prev) => [...prev, { sender, text, actions: msgActions }]);
  };

  const getSystemResponse = (query: string): { text: string; actions?: { label: string; onClick: () => void }[] } => {
    const q = query.toLowerCase();

    // 1. About Muskan
    if (q.includes("about") || q.includes("who is") || q.includes("summary") || q.includes("muskan") || q.includes("background")) {
      return {
        text: `Muskan Kumari is a Software Engineer and Full-Stack Developer focused on building modern web applications. She has hands-on experience building LLM-powered applications, AI agents, and backend systems.`,
        actions: [{ label: "Open About Me", onClick: () => actions.openApp("about") }],
      };
    }

    // 2. Resume / CV
    if (q.includes("resume") || q.includes("cv") || q.includes("download") || q.includes("education")) {
      return {
        text: `Muskan is currently pursuing her B.Tech in Computer Science Engineering (2024-2028) at YBN University, Ranchi. She has also completed certifications from Google Cloud, IBM, and Walmart.`,
        actions: [
          { label: "Open Resume PDF", onClick: () => actions.openApp("preview") },
          { label: "Open Education Details", onClick: () => actions.openApp("finder", { initialSection: "education" }) },
        ],
      };
    }

    // 3. Projects
    if (q.includes("project") || q.includes("work") || q.includes("portfolio")) {
      return {
        text: `Muskan has worked on several projects, including:\n- Gym Management System: A comprehensive full-stack fitness platform.\n- CivicFix: A civic issue reporting platform.\n- AI-Report-Analyzer: Streamlit app powered by Gemini API to parse reports.\n- WebTech-Lab: Front-end engineering experiments.`,
        actions: [{ label: "Open Projects Explorer", onClick: () => actions.openApp("finder", { initialSection: "projects" }) }],
      };
    }

    // 4. CivicFix Specific
    if (q.includes("civicfix")) {
      const p = projects.find((p) => p.title === "CivicFix");
      return {
        text: p ? `${p.title} (${p.tag}): ${p.description}` : "CivicFix is a full-stack civic issue reporting platform built with React, Node.js, Express, and MongoDB.",
        actions: [
          { label: "Explore CivicFix Files", onClick: () => actions.openApp("finder", { initialSection: "projects" }) },
        ],
      };
    }

    // 5. Gym Management System Specific
    if (q.includes("gym") || q.includes("fitness")) {
      const p = projects.find((p) => p.title.toLowerCase().includes("gym"));
      return {
        text: p ? `${p.title} (${p.tag}): ${p.description}` : "Gym Management System is a full-stack platform built with React, Node.js, Express, MongoDB, and Tailwind CSS.",
        actions: [
          { label: "Explore Gym Management Files", onClick: () => actions.openApp("finder", { initialSection: "projects" }) },
        ],
      };
    }

    // 6. AI-Report-Analyzer Specific
    if (q.includes("analyzer") || q.includes("report")) {
      const p = projects.find((p) => p.title === "AI-Report-Analyzer");
      return {
        text: p ? `${p.title} (${p.tag}): ${p.description}` : "AI-Report-Analyzer is a Streamlit app powered by the Gemini API that generates structured insights from uploaded documents.",
        actions: [
          { label: "Explore Report Analyzer Files", onClick: () => actions.openApp("finder", { initialSection: "projects" }) },
        ],
      };
    }

    // 7. WebTech-Lab Specific
    if (q.includes("webtech") || q.includes("lab")) {
      const p = projects.find((p) => p.title === "WebTech-Lab");
      return {
        text: p ? `${p.title} (${p.tag}): ${p.description}` : "WebTech-Lab is a collection of core web experiments covering front-end design, responsive layout, and interactive features.",
        actions: [
          { label: "Explore WebTech Lab Files", onClick: () => actions.openApp("finder", { initialSection: "projects" }) },
        ],
      };
    }

    // 8. Experience
    if (q.includes("experience") || q.includes("intern") || q.includes("job") || q.includes("work history") || q.includes("eimple")) {
      return {
        text: `Muskan has completed a Web Development Internship at Eimple Lab (Nov 2025 – Jul 2026), where she built full-stack applications with React, Node.js, and PostgreSQL.`,
        actions: [{ label: "Open Experience folder", onClick: () => actions.openApp("finder", { initialSection: "experience" }) }],
      };
    }

    // 9. Skills / Tech
    if (q.includes("skills") || q.includes("tech") || q.includes("languages") || q.includes("backend") || q.includes("frontend") || q.includes("database") || q.includes("figma") || q.includes("ui/ux")) {
      return {
        text: `Muskan's key skills include:\n- AI/ML: LLM API Integration (Gemini, OpenAI), Prompt Engineering, Python\n- Languages: TypeScript, JavaScript, Python, Java, C/C++\n- Backend: Node.js, Express.js, REST API, JWT\n- Frontend: React.js, Next.js, Tailwind CSS\n- Databases: MongoDB, PostgreSQL, SQL\n- Tools & Design: Figma, Git, Postman, Netlify, Render, Vercel`,
        actions: [{ label: "Open Skills Explorer", onClick: () => actions.openApp("finder", { initialSection: "skills" }) }],
      };
    }

    // 10. Contact / Github / Linkedin
    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("github") || q.includes("linkedin")) {
      return {
        text: `You can reach Muskan via:\n- Email: ${site.email}\n- Phone: ${site.phone}\n- GitHub: ${site.github.replace("https://", "")}\n- LinkedIn: ${site.linkedin.replace("https://", "")}`,
        actions: [
          { label: "Open Contact Window", onClick: () => actions.openApp("contact") },
          { label: "Open GitHub Profile", onClick: () => window.open(site.github, "_blank") },
        ],
      };
    }

    // 11. Recruiter Mode Specific Actions
    if (q.includes("why should i consider") || q.includes("consider") || q.includes("why hire")) {
      return {
        text: `Why consider Muskan:\n1. Hands-on AI expertise: Experience building applications with Gemini APIs and LLM orchestration.\n2. Solid engineering foundation: B.Tech in CSE with strong knowledge of DS & Algorithms.\n3. Key achievements: Google Cloud Generative AI Studio and IBM Prompt Engineering credentials.`,
        actions: [
          { label: "Open Resume PDF", onClick: () => actions.openApp("preview") },
          { label: "Open Contact App", onClick: () => actions.openApp("contact") },
        ],
      };
    }

    if (q.includes("quick summary") || q.includes("summary of muskan")) {
      return {
        text: `Summary:\nMuskan Kumari is a CSE B.Tech student and Full-Stack Intern specializing in building LLM-integrated web products. She combines core computer science fundamentals (DSA, OOP) with modern front-end/back-end stacks.`,
        actions: [{ label: "Open About Details", onClick: () => actions.openApp("about") }],
      };
    }

    // Fallback
    return {
      text: "I'm sorry, I didn't quite catch that. I can provide details on Muskan's Skills, Projects, Experience, Resume, and Contact info. Try clicking one of the buttons below or asking a different question.",
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    sfx.click();
    addMessage("user", text);
    setInputValue("");
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      const res = getSystemResponse(text);
      addMessage("mia", res.text, res.actions);
    }, 850);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  return (
    <div className="flex h-full flex-col bg-neutral-950 font-sans text-white select-text">
      {/* Title bar / status */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-neutral-900/60 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-mono tracking-wider font-semibold text-emerald-400">MIA ASSISTANT ONLINE</span>
        </div>
        <button
          onClick={() => {
            sfx.click();
            setRecruiterMode((prev) => !prev);
          }}
          className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
            recruiterMode ? "bg-emerald-500 text-black font-semibold" : "bg-white/10 text-white/70 hover:bg-white/15"
          }`}
        >
          RECRUITER MODE: {recruiterMode ? "ACTIVE" : "OFF"}
        </button>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[10px] text-white/30 font-mono mb-1">
              {msg.sender === "user" ? "USER" : "MIA.SYS"}
            </span>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow ${
                msg.sender === "user"
                  ? "bg-[#2a7de1] text-white rounded-tr-none"
                  : "bg-neutral-900 border border-white/5 text-white/90 rounded-tl-none font-mono"
              }`}
            >
              {msg.text}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((act, actIdx) => (
                    <button
                      key={actIdx}
                      onClick={() => {
                        sfx.click();
                        act.onClick();
                      }}
                      className="px-2.5 py-1 text-xs bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-md hover:bg-emerald-500/20 active:scale-95 transition-all font-mono"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-white/30 font-mono mb-1">MIA.SYS</span>
            <div className="bg-neutral-900 border border-white/5 rounded-xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Quick links & suggestion chips */}
      <div className="shrink-0 border-t border-white/10 bg-neutral-900/30 p-2.5">
        <p className="text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider pl-1">Quick Actions:</p>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {!recruiterMode ? (
            <>
              <button
                onClick={() => handleQuickAction("About Muskan")}
                className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-750 text-white/80 rounded-full border border-white/5 active:scale-95 transition-all"
              >
                About Muskan
              </button>
              <button
                onClick={() => handleQuickAction("What are her skills?")}
                className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-750 text-white/80 rounded-full border border-white/5 active:scale-95 transition-all"
              >
                Skills explorer
              </button>
              <button
                onClick={() => handleQuickAction("Show me her projects")}
                className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-750 text-white/80 rounded-full border border-white/5 active:scale-95 transition-all"
              >
                Projects List
              </button>
              <button
                onClick={() => handleQuickAction("Show resume")}
                className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-750 text-white/80 rounded-full border border-white/5 active:scale-95 transition-all"
              >
                Open Resume
              </button>
              <button
                onClick={() => handleQuickAction("How can I contact her?")}
                className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-750 text-white/80 rounded-full border border-white/5 active:scale-95 transition-all"
              >
                Contact Mail
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleQuickAction("Give me a quick summary.")}
                className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20 active:scale-95 transition-all font-mono"
              >
                Summary info
              </button>
              <button
                onClick={() => handleQuickAction("Why should I consider her?")}
                className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20 active:scale-95 transition-all font-mono"
              >
                Why consider Muskan?
              </button>
              <button
                onClick={() => handleQuickAction("What technologies does she use?")}
                className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20 active:scale-95 transition-all font-mono"
              >
                Tech details
              </button>
              <button
                onClick={() => handleQuickAction("Show resume.")}
                className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20 active:scale-95 transition-all font-mono"
              >
                Check Resume
              </button>
              <button
                onClick={() => handleQuickAction("How can I contact her?")}
                className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20 active:scale-95 transition-all font-mono"
              >
                Reach Muskan
              </button>
            </>
          )}
        </div>
      </div>

      {/* Input prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="shrink-0 flex items-center border-t border-white/10 bg-neutral-900 px-3 py-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything about Muskan..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/35 outline-none border-none pr-2"
          aria-label="Ask MIA anything about Muskan"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="px-3.5 py-1.5 text-xs bg-[#2a7de1] hover:bg-[#3b8af0] text-white font-medium rounded-lg disabled:opacity-40 transition-colors"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
