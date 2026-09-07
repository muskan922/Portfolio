import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  GraduationCap,
  Mail,
  Monitor,
  Search,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import {
  certificates,
  education,
  experience,
  projects,
  skillGroups,
} from "../../data/content";
import { FolderGlyph, PdfGlyph, TextFileGlyph } from "../components/AppIcons";
import { fs, type FsNode, useFs } from "../lib/fs";
import { sfx } from "../lib/sfx";
import { AboutApp } from "./AboutApp";
import { ContactApp } from "./ContactApp";
import { PreviewApp } from "./PreviewApp";

export type FinderSection =
  | "my-portfolio"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "certificates-achievements"
  | "resume"
  | "contact";

interface SidebarItem {
  id: FinderSection;
  label: string;
  icon: any;
}

const SIDEBAR: SidebarItem[] = [
  { id: "my-portfolio", label: "MY PORTFOLIO", icon: FolderOpen },
  { id: "about", label: "ABOUT", icon: User },
  { id: "experience", label: "EXPERIENCE", icon: Briefcase },
  { id: "skills", label: "SKILLS", icon: Wrench },
  { id: "projects", label: "PROJECTS", icon: FolderOpen },
  { id: "education", label: "EDUCATION", icon: GraduationCap },
  { id: "certificates-achievements", label: "CERTIFICATE & ACHIEVEMENT", icon: Award },
  { id: "resume", label: "RESUME", icon: FileText },
  { id: "contact", label: "CONTACT", icon: Mail },
];

// --- 1. My Portfolio Directory View ---
function MyPortfolioPane({
  onNavigate,
}: {
  onNavigate: (section: FinderSection) => void;
  onOpenApp?: (app: any, payload?: any) => void;
}) {
  const items: { name: string; type: "folder" | "pdf" | "app"; action: () => void }[] = [
    { name: "ABOUT", type: "folder", action: () => onNavigate("about") },
    { name: "EXPERIENCE", type: "folder", action: () => onNavigate("experience") },
    { name: "SKILLS", type: "folder", action: () => onNavigate("skills") },
    { name: "PROJECTS", type: "folder", action: () => onNavigate("projects") },
    { name: "EDUCATION", type: "folder", action: () => onNavigate("education") },
    { name: "CERTIFICATE & ACHIEVEMENT", type: "folder", action: () => onNavigate("certificates-achievements") },
    { name: "RESUME", type: "pdf", action: () => onNavigate("resume") },
    { name: "CONTACT", type: "app", action: () => onNavigate("contact") },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-6">
        {items.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all ${
              selected === item.name ? "bg-white/15" : "hover:bg-white/10"
            }`}
            onClick={() => setSelected(item.name)}
            onDoubleClick={() => {
              sfx.open();
              item.action();
            }}
          >
            {item.type === "folder" ? (
              <FolderGlyph className="h-12 w-14" />
            ) : item.type === "pdf" ? (
              <PdfGlyph className="h-12 w-10" />
            ) : (
              <FolderGlyph className="h-12 w-14 brightness-90 saturate-50" />
            )}
            <span className="line-clamp-2 text-center text-xs font-semibold leading-tight text-white/85">
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-8 text-xs text-white/40 italic">
        Double-click folders or files to open them in their respective applications.
      </p>
    </div>
  );
}

// --- 2. Projects Pane (OS style directories) ---
function ProjectsPane({ onOpenApp }: { onOpenApp?: (app: any, payload?: any) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(102px,1fr))] gap-6">
        {projects.map((entry) => (
          <button
            key={entry.title}
            type="button"
            className={`group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all ${
              selected === entry.title ? "bg-white/15" : "hover:bg-white/10"
            }`}
            onClick={() => setSelected(entry.title)}
            onDoubleClick={() => {
              sfx.open();
              onOpenApp?.("project-terminal", { fileId: entry.title });
            }}
          >
            <FolderGlyph className="h-12 w-14" />
            <span className="line-clamp-2 text-center text-xs font-semibold leading-tight text-white/85">
              {entry.title}
            </span>
            {entry.featured && (
              <span className="rounded bg-emerald-500/20 px-1 py-0.5 text-[9px] text-emerald-400 font-mono scale-90">
                FEATURED
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="mt-10 text-xs text-white/45 font-mono">
        &gt; Double-click a project directory to launch its interactive OS terminal.
      </p>
    </div>
  );
}

// --- 3. Skills Explorer Pane ---
function SkillsPane() {
  const [selectedGroup, setSelectedGroup] = useState<string>(skillGroups[0]?.label || "");
  const activeGroup = skillGroups.find((g) => g.label === selectedGroup);

  return (
    <div className="flex h-full min-h-[300px]">
      {/* Sidebar: skill groups as directories */}
      <div className="w-48 shrink-0 border-r border-white/10 bg-white/5 p-2 space-y-1">
        <p className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-white/40">Categories</p>
        {skillGroups.map((group) => (
          <button
            key={group.label}
            onClick={() => setSelectedGroup(group.label)}
            className={`w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-all ${
              selectedGroup === group.label ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
            }`}
          >
            <FolderGlyph className="h-4 w-5 shrink-0" />
            <span className="truncate">{group.label}</span>
          </button>
        ))}
      </div>

      {/* Main pane: skill files inside directory */}
      <div className="flex-1 p-4 bg-neutral-900/30 overflow-y-auto">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">
          /skills/{selectedGroup.toLowerCase().replace(/[^a-z0-9]/g, "-")}
        </p>

        {activeGroup && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-4">
            {activeGroup.skills.map((skill) => (
              <div
                key={skill}
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all text-center select-none"
              >
                <TextFileGlyph className="h-10 w-8" />
                <span className="text-[11px] font-medium text-white/80 leading-snug break-words max-w-[80px]">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 4. Certificate & Achievement (Certifications & Achievements) ---
function CertificateAndAchievementPane() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const activeCert = certificates.find((c) => c.name === selectedCert);

  return (
    <div className="p-5 overflow-y-auto h-full">
      <h3 className="mb-4 text-xs font-mono uppercase tracking-widest text-white/40">Certifications & Achievements</h3>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-6">
        {certificates.map((cert) => (
          <button
            key={cert.name}
            type="button"
            onClick={() => setSelectedCert(cert.name)}
            onDoubleClick={() => {
              sfx.open();
              window.open(cert.image, "_blank");
            }}
            className={`group flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all text-center ${
              selectedCert === cert.name ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            <PdfGlyph className="h-12 w-10 text-rose-500" />
            <span className="line-clamp-3 text-center text-xs font-semibold leading-tight text-white/85">
              {cert.name}
            </span>
            <span className="text-[10px] text-white/40 block mt-0.5 truncate max-w-[90px]">
              {cert.org}
            </span>
          </button>
        ))}
      </div>

      {activeCert && (
        <div className="mt-8 border border-emerald-500/30 rounded-xl bg-emerald-500/5 p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div>
            <p className="text-emerald-400 font-semibold uppercase tracking-wider mb-1">✓ Certificate Selected</p>
            <p className="text-white/85 font-sans font-medium">{activeCert.name}</p>
            <p className="text-white/50 text-[11px] mt-0.5">{activeCert.org} • Credential ID: {activeCert.credentialId}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.open();
                window.open(activeCert.image, "_blank");
              }}
              className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-1.5"
            >
              <span>Open PDF / Document</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="text-white/40 hover:text-white px-2 py-1.5 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <p className="mt-8 text-xs text-white/40 italic">
        Double-click any certificate icon to open its PDF document in a new tab.
      </p>
    </div>
  );
}

// --- 5. Experience Timeline Pane ---
function ExperiencePane() {
  return (
    <div className="p-5">
      <div className="relative border-l border-white/15 pl-6">
        {experience.map((item, index) => {
          const current = /present/i.test(item.period);
          return (
            <div key={item.company} className={index === experience.length - 1 ? "" : "pb-7"}>
              <span
                className={`absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full ${
                  current
                    ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                    : "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                }`}
              />
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-emerald-500/30">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{item.company}</h3>
                  {current && (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-emerald-400 uppercase">
                      Current
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] tabular-nums text-white/60">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 text-[13px] font-medium text-emerald-400">{item.role}</p>
                <ul className="mt-3 space-y-1.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-[13px] leading-relaxed text-white/70">
                      <span className="mt-[9px] h-px w-2.5 shrink-0 bg-emerald-400/60" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- 6. Education Pane ---
function EducationPane() {
  return (
    <div className="space-y-6 p-5">
      <div>
        <h3 className="mb-2.5 text-xs font-mono uppercase tracking-widest text-white/40">Education</h3>
        <div className="space-y-2">
          {education.map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-0.5 text-xs text-white/50">
                {item.org}
                {item.period ? ` · ${item.period}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 7. Local File System Node Browser Pane ---
interface FsPaneProps {
  folderId: string | null;
  onNavigate: (folderId: string | null) => void;
  onOpenFile?: (fileId: string) => void;
}

function FsPane({ folderId, onNavigate, onOpenFile }: FsPaneProps) {
  useFs();
  const children = fs.childrenOf(folderId);
  const crumbs: { id: string | null; name: string }[] = [{ id: null, name: "Desktop" }];
  
  {
    const chain: FsNode[] = [];
    let cursor = folderId ? fs.get(folderId) : undefined;
    while (cursor) {
      chain.unshift(cursor);
      cursor = cursor.parentId ? fs.get(cursor.parentId) : undefined;
    }
    chain.forEach((node) => crumbs.push({ id: node.id, name: node.name }));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-white/10 px-4 py-2 text-[13px]">
        {crumbs.map((crumb, index) => (
          <span key={crumb.id ?? "root"} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={12} className="text-white/30" />}
            <button
              type="button"
              className={`rounded px-1.5 py-0.5 ${
                index === crumbs.length - 1 ? "font-semibold text-white" : "text-white/60 hover:bg-white/10"
              }`}
              onClick={() => onNavigate(crumb.id)}
            >
              {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {children.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <FolderGlyph className="h-16 w-20 opacity-40" />
          <p className="text-sm text-white/60">This folder is empty</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {children.map((node) => (
            <div
              key={node.id}
              className="group flex items-center gap-2.5 rounded-lg px-3 py-1.5 hover:bg-white/10"
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                onDoubleClick={() => {
                  sfx.open();
                  if (node.type === "folder") onNavigate(node.id);
                  else onOpenFile?.(node.id);
                }}
              >
                {node.type === "folder" ? (
                  <FolderGlyph className="h-7 w-9 shrink-0" />
                ) : (
                  <TextFileGlyph className="h-7 w-6 shrink-0" />
                )}
                <span className="truncate text-[13px] text-white/85">{node.name}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN FINDER APP ---
interface FinderAppProps {
  initialSection?: FinderSection;
  fsFolderId?: string | null;
  onOpenFile?: (fileId: string) => void;
  onOpenApp?: (app: any, payload?: any) => void;
}

export function FinderApp({
  initialSection = "my-portfolio",
  fsFolderId,
  onOpenFile,
  onOpenApp,
}: FinderAppProps) {
  const [view, setView] = useState<FinderSection | "fs">(
    fsFolderId !== undefined ? "fs" : initialSection
  );
  const [folderId, setFolderId] = useState<string | null>(fsFolderId ?? null);
  const section = view === "fs" ? null : view;
  const title = view === "fs" ? (folderId ? (fs.get(folderId)?.name ?? "Desktop") : "Desktop") : view;

  const openFs = (target: string | null) => {
    setView("fs");
    setFolderId(target);
  };

  const handleSidebarClick = (item: SidebarItem) => {
    sfx.click();
    setView(item.id);
  };

  return (
    <div className="flex h-full select-none">
      {/* Sidebar favorited folders */}
      <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-white/10 bg-white/5 p-2 sm:flex">
        <p className="px-2 pb-1 pt-2 text-[10px] font-mono tracking-wider text-white/40">Favorites</p>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] transition-colors ${
            view === "fs" ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10"
          }`}
          onClick={() => openFs(null)}
        >
          <Monitor size={14} className="text-[#5aa7f2]" />
          Desktop
        </button>

        <p className="px-2 pb-1 pt-3 text-[10px] font-mono tracking-wider text-white/40">Directories</p>
        {SIDEBAR.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] font-medium transition-all ${
              view === item.id ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10"
            }`}
            onClick={() => handleSidebarClick(item)}
          >
            <item.icon size={13} className="text-sky-400 shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Finder header bar */}
        <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-2">
          <ChevronLeft size={16} className="text-white/35" />
          <ChevronRight size={16} className="text-white/25" />
          <span className="text-xs font-mono uppercase tracking-widest text-white/80">{title}</span>
          <div className="ml-auto flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-[11px] text-white/40">
            <Search size={11} />
            Search
          </div>
        </div>

        {/* Mobile section navigation tabs */}
        <div className="min-h-0 flex-1 overflow-y-auto sm:hidden">
          <div className="flex gap-1 border-b border-white/10 p-2 overflow-x-auto">
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs ${
                view === "fs" ? "bg-white/20 text-white" : "text-white/60"
              }`}
              onClick={() => openFs(null)}
            >
              Desktop
            </button>
            {SIDEBAR.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap ${
                  view === item.id ? "bg-white/20 text-white" : "text-white/60"
                }`}
                onClick={() => handleSidebarClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
          {view === "fs" && (
            <FsPane folderId={folderId} onNavigate={setFolderId} onOpenFile={onOpenFile} />
          )}
          {section === "my-portfolio" && <MyPortfolioPane onNavigate={setView} onOpenApp={onOpenApp} />}
          {section === "about" && <AboutApp />}
          {section === "experience" && <ExperiencePane />}
          {section === "skills" && <SkillsPane />}
          {section === "projects" && <ProjectsPane onOpenApp={onOpenApp} />}
          {section === "education" && <EducationPane />}
          {section === "certificates-achievements" && <CertificateAndAchievementPane />}
          {section === "resume" && <PreviewApp />}
          {section === "contact" && <ContactApp />}
        </div>

        {/* Desktop pane render */}
        <div className="hidden min-h-0 flex-1 sm:block h-full">
          {view === "fs" ? (
            <FsPane folderId={folderId} onNavigate={setFolderId} onOpenFile={onOpenFile} />
          ) : (
            <div className="h-full">
              {section === "my-portfolio" && <MyPortfolioPane onNavigate={setView} onOpenApp={onOpenApp} />}
              {section === "about" && <AboutApp />}
              {section === "experience" && <ExperiencePane />}
              {section === "skills" && <SkillsPane />}
              {section === "projects" && <ProjectsPane onOpenApp={onOpenApp} />}
              {section === "education" && <EducationPane />}
              {section === "certificates-achievements" && <CertificateAndAchievementPane />}
              {section === "resume" && <PreviewApp />}
              {section === "contact" && <ContactApp />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
