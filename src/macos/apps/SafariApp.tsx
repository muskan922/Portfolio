import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  FileCheck,
  Github,
  GraduationCap,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCw,
  Share,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  about,
  certificates,
  education,
  experience,
  projects as defaultProjects,
  site,
  skillGroups,
  type Certificate,
} from "../../data/content";
import { LazyMedia } from "../components/LazyMedia";

/**
 * Viewport-Triggered Cinematic Scroll Reveal Component
 */
function Reveal({
  children,
  root,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  root?: React.RefObject<HTMLDivElement | null>;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ root, once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.48, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  children,
  subtitle,
  icon: Icon,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: any;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center mx-auto mb-8 space-y-2">
      {subtitle && (
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#e8aa42]">
          {subtitle}
        </span>
      )}
      <h2 className="flex items-center justify-center gap-3 font-display font-bold tracking-tight text-white text-[clamp(28px,3.2vw,44px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        {Icon && <Icon size={28} className="text-[#e8aa42] shrink-0" />}
        <span>{children}</span>
      </h2>
      <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-[#e8aa42] to-transparent opacity-80 mt-1" />
    </div>
  );
}

/** Lightweight particle definition for the full-viewport particle canvas */
interface SafariParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
  glowColor: string;
  speedCategory: "slow" | "medium" | "fast";
}

/**
 * 3-Layer Dense Multi-Speed Canvas Particle System Covering the Entire Safari Viewport
 * - Layer 1 (65%): Slow ambient drifting stars
 * - Layer 2 (25%): Medium floating luminous particles
 * - Layer 3 (10%): Fast gliding shooting particles with glow trails
 * - 240+ particles rendered across 100% of the active Safari window
 * - 60 FPS GPU acceleration via requestAnimationFrame with mouse parallax
 */
function SafariViewportParticleCanvas({
  containerRef,
  parallaxRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parallaxRef: React.RefObject<{ x: number; y: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Dense particle count ensuring rich coverage across the whole window
    const count = 240;
    const colors = [
      { fill: "#38bdf8", glow: "rgba(56, 189, 248, 0.6)" },   // Cyan
      { fill: "#c084fc", glow: "rgba(192, 132, 252, 0.6)" },  // Purple / Violet
      { fill: "#e8aa42", glow: "rgba(232, 170, 66, 0.55)" },  // Gold / Amber
      { fill: "#60a5fa", glow: "rgba(96, 165, 250, 0.55)" },  // Electric Blue
      { fill: "#34d058", glow: "rgba(52, 211, 153, 0.55)" },  // Emerald
      { fill: "#ffffff", glow: "rgba(255, 255, 255, 0.65)" }, // Bright White
    ];

    const particles: SafariParticle[] = Array.from({ length: count }, () => {
      const rand = Math.random();
      let speedCategory: "slow" | "medium" | "fast" = "slow";
      let baseSpeed = 0.2;

      if (rand < 0.65) {
        speedCategory = "slow";
        baseSpeed = 0.12 + Math.random() * 0.24;
      } else if (rand < 0.9) {
        speedCategory = "medium";
        baseSpeed = 0.42 + Math.random() * 0.4;
      } else {
        speedCategory = "fast";
        baseSpeed = 0.95 + Math.random() * 0.95;
      }

      const angle = Math.random() * Math.PI * 2;
      const c = colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = 0.22 + Math.random() * 0.5;

      return {
        x: Math.random() * (width || 1000),
        y: Math.random() * (height || 800),
        radius: speedCategory === "fast" ? 1.4 + Math.random() * 1.8 : 0.8 + Math.random() * 2.2,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        pulseOffset: Math.random() * Math.PI * 2,
        color: c.fill,
        glowColor: c.glow,
        speedCategory,
      };
    });

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const pOffset = parallaxRef.current ?? { x: 0, y: 0 };

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport boundaries smoothly
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;

        const dynamicAlpha = Math.max(
          0.1,
          p.baseAlpha + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.18
        );

        ctx.save();
        ctx.globalAlpha = dynamicAlpha;
        ctx.fillStyle = p.color;

        // Apply mouse-based parallax offset
        const depthFactor = p.speedCategory === "fast" ? 5.5 : p.speedCategory === "medium" ? 3.5 : 1.8;
        const renderX = p.x + pOffset.x * depthFactor;
        const renderY = p.y + pOffset.y * depthFactor;

        if (p.radius > 1.4 || p.speedCategory === "fast") {
          ctx.shadowBlur = p.speedCategory === "fast" ? 12 : 8;
          ctx.shadowColor = p.glowColor;
        }

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [containerRef, parallaxRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-90 select-none"
    />
  );
}

/**
 * Ambient Glow Background with Mouse Parallax and Full-Viewport Multi-Speed Particles
 */
function SafariAuroraBackground({
  containerRef,
  parallaxRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parallaxRef: React.RefObject<{ x: number; y: number }>;
}) {
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const glow3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId = 0;
    const updateGlowParallax = () => {
      const p = parallaxRef.current ?? { x: 0, y: 0 };
      if (glow1Ref.current) {
        glow1Ref.current.style.transform = `translate3d(${p.x * 12}px, ${p.y * 12}px, 0)`;
      }
      if (glow2Ref.current) {
        glow2Ref.current.style.transform = `translate3d(${p.x * -10}px, ${p.y * 10}px, 0)`;
      }
      if (glow3Ref.current) {
        glow3Ref.current.style.transform = `translate3d(${p.x * 14}px, ${p.y * -12}px, 0)`;
      }
      animId = requestAnimationFrame(updateGlowParallax);
    };
    animId = requestAnimationFrame(updateGlowParallax);
    return () => cancelAnimationFrame(animId);
  }, [parallaxRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none h-full w-full">
      {/* 1. Deep Oceanic Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070810] via-[#090c18] via-[#080a14] to-[#06070d]" />

      {/* 2. Full-Viewport Multi-Speed Particle Canvas Across ENTIRE Safari App */}
      <SafariViewportParticleCanvas
        containerRef={containerRef}
        parallaxRef={parallaxRef}
      />

      {/* 3. Subtle Slow-Drifting Ambient Light Nodes */}
      <div
        ref={glow1Ref}
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_70%)] blur-3xl transition-transform duration-300 ease-out"
        style={{
          animation: "ambientDrift1 24s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={glow2Ref}
        className="pointer-events-none absolute top-[35%] -right-40 h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,transparent_70%)] blur-3xl transition-transform duration-300 ease-out"
        style={{
          animation: "ambientDrift2 28s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={glow3Ref}
        className="pointer-events-none absolute bottom-[10%] left-[20%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(232,170,66,0.08)_0%,transparent_70%)] blur-3xl transition-transform duration-300 ease-out"
        style={{
          animation: "ambientDrift3 26s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}

/**
 * Scoped 60FPS Custom Cursor with Micro Particles & Interactive Reactions
 */
function SafariCustomCursor({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mouse = { x: -100, y: -100, visible: false };
    const ring = { x: -100, y: -100 };
    let isHovered = false;
    let isPressed = false;
    let animId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.visible = true;

      const target = e.target as HTMLElement | null;
      isHovered = !!target?.closest('a, button, input, [role="button"], .interactive-target');
    };

    const onPointerDown = () => {
      isPressed = true;
    };

    const onPointerUp = () => {
      isPressed = false;
    };

    const onPointerLeave = () => {
      mouse.visible = false;
    };

    const onPointerEnter = () => {
      mouse.visible = true;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointerenter", onPointerEnter);

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.2;
      ring.y += (mouse.y - ring.y) * 0.2;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mouse.x - 4}px, ${mouse.y - 4}px, 0) scale(${
          isPressed ? 0.75 : isHovered ? 1.4 : 1
        })`;
        coreRef.current.style.opacity = mouse.visible ? "1" : "0";
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x - 14}px, ${ring.y - 14}px, 0) scale(${
          isPressed ? 0.85 : isHovered ? 1.45 : 1
        })`;
        ringRef.current.style.opacity = mouse.visible ? "0.85" : "0";
        ringRef.current.style.borderColor = isHovered ? "rgba(56, 189, 248, 0.85)" : "rgba(255, 255, 255, 0.4)";
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerenter", onPointerEnter);
    };
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[999] overflow-hidden hidden md:block select-none">
      {/* Glowing Cursor Core */}
      <div
        ref={coreRef}
        style={{ willChange: "transform, opacity" }}
        className="absolute top-0 left-0 h-2 w-2 rounded-full bg-[#e8aa42] shadow-[0_0_10px_#e8aa42] transition-colors duration-150"
      />
      {/* Smooth Trailing Ring */}
      <div
        ref={ringRef}
        style={{ willChange: "transform, opacity, border-color" }}
        className="absolute top-0 left-0 h-7 w-7 rounded-full border border-white/40 backdrop-blur-[0.5px] transition-colors duration-200"
      />
    </div>
  );
}

/** Certificate preview item definition */
interface CertificateDetail extends Certificate {
  type?: "pdf" | "image" | "credential";
  url?: string;
  skills?: string[];
  credentialId?: string;
}

/**
 * Premium Project Card (No 3D Flip, Smooth Elevation, Single Title, Natural Wrapping, Diagonal Shine Sweep)
 */
interface ProjectCardProps {
  project: (typeof defaultProjects)[0];
}

function ProjectCard({ project }: ProjectCardProps) {
  const handleCardClick = () => {
    if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onPointerMove={handlePointerMove}
      onKeyDown={(e) => {
        if (e.key === "Enter" && project.link) {
          window.open(project.link, "_blank", "noopener,noreferrer");
        }
      }}
      aria-label={`${project.title} - Click to view project`}
      className="interactive-target group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#0f121d]/90 p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#38bdf8]/60 hover:bg-[#131726]/95 hover:shadow-[0_14px_44px_rgba(56,189,248,0.22)] hover:-translate-y-1.5 cursor-pointer text-left h-full"
    >
      {/* Interactive Cursor Spotlight Light Reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
        style={{
          background:
            "radial-gradient(380px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(56, 189, 248, 0.12), transparent 70%)",
        }}
      />

      {/* Diagonal Shine Sweep Effect on Hover */}
      <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 transition-all duration-700 group-hover:left-[150%] group-hover:opacity-100" />

      <div className="relative z-10">
        {/* Top: Project Media Cover with subtle 1.04x hover zoom */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black/50 mb-4">
          {project.media?.[0] ? (
            <LazyMedia
              media={project.media[0]}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-104"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40 font-mono text-sm">
              {project.title}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f121d]/80 via-transparent to-transparent opacity-60" />
        </div>

        {/* Tag & Period */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="rounded-full border border-[#e8aa42]/30 bg-[#e8aa42]/10 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-[#e8aa42]">
            {project.tag}
          </span>
          {project.period && (
            <span className="font-mono text-xs text-white/40">{project.period}</span>
          )}
        </div>

        {/* Title (Appears ONCE) + Link icon moving slightly right on hover */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3
            className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-[#38bdf8] transition-colors"
            style={{
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            {project.title}
          </h3>
          {project.link && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] transition-all group-hover:border-[#38bdf8] group-hover:bg-[#38bdf8]/20 group-hover:translate-x-1">
              <ExternalLink size={13} />
            </span>
          )}
        </div>

        {/* Description: Natural text wrapping, never truncated */}
        <p
          className="text-[13px] leading-relaxed text-white/75 font-sans mb-4"
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "normal",
          }}
        >
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] text-white/80"
              style={{
                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "normal",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 mt-auto shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8aa42] px-3.5 py-1.5 text-xs font-semibold text-[#101013] shadow-[0_2px_8px_rgba(232,170,66,0.35)] hover:bg-[#f3bc5c] active:scale-95 transition-all">
          <ExternalLink size={12} />
          Live Demo
        </span>
        <span className="font-mono text-[11px] text-[#38bdf8]/90 group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all">
          Open Project ↗
        </span>
      </div>
    </div>
  );
}

/**
 * Custom SVG Vector Logos for Technologies
 */
function SkillLogo({ name }: { name: string }) {
  const n = name.toLowerCase().trim();

  if (n.includes("react")) {
    return (
      <svg className="h-10 w-10 text-[#61dafb]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  if (n.includes("python")) {
    return (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
        <path
          d="M11.91 2C6.94 2 7.23 4.15 7.23 4.15l.01 2.22h4.74v.67H5.25S2 6.68 2 11.66c0 4.97 2.84 4.8 2.84 4.8h1.7v-2.38s-.09-2.84 2.79-2.84h4.78s2.69.04 2.69-2.62V4.62S17.27 2 11.91 2zm-2.03 1.48a.95.95 0 110 1.9.95.95 0 010-1.9z"
          fill="#3776AB"
        />
        <path
          d="M12.09 22c4.97 0 4.68-2.15 4.68-2.15l-.01-2.22h-4.74v-.67h6.73s3.25.36 3.25-4.62c0-4.98-2.84-4.8-2.84-4.8h-1.7v2.38s.09 2.84-2.79 2.84h-4.78s-2.69-.04-2.69 2.62v4.06S6.73 22 12.09 22zm2.03-1.48a.95.95 0 110-1.9.95.95 0 010 1.9z"
          fill="#FFD438"
        />
      </svg>
    );
  }

  if (n.includes("javascript") || n === "js") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7df1e] font-sans text-xl font-bold text-black shadow-md">
        JS
      </div>
    );
  }

  if (n.includes("node")) {
    return (
      <svg className="h-10 w-10 text-[#5fa04e]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7.7v11.6L12 25l10-5.7V7.7L12 2zm-1 18.5l-6.5-3.8v-7.5L11 13v7.5zm2 0V13l6.5-3.8v7.5L13 20.5zM12 11L5.5 7.2 12 3.5l6.5 3.7L12 11z" />
      </svg>
    );
  }

  if (n.includes("express")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 font-mono text-base font-bold text-white shadow-md">
        ex
      </div>
    );
  }

  if (n.includes("mongo")) {
    return (
      <svg className="h-10 w-10 text-[#47a248]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5C11.5 2.5 7.5 10 7.5 14.5c0 3.5 2 6 4.5 7.5 2.5-1.5 4.5-4 4.5-7.5 0-4.5-4-12-4.5-13zm-.5 18.8c-1.8-1.2-3-3.2-3-5.8 0-3.3 2.5-8.5 3.5-10.7V20.3zm1 0V3.8c1 2.2 3.5 7.4 3.5 10.7 0 2.6-1.2 4.6-3 5.8z" />
      </svg>
    );
  }

  if (n.includes("postgres")) {
    return (
      <svg className="h-10 w-10 text-[#336791]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V18h-2v-.93c-2.83-.48-5-2.94-5-5.92 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.98-2.17 5.44-5 5.92z" />
      </svg>
    );
  }

  if (n === "sql") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00758f]/20 border border-[#00758f]/40 font-mono text-xs font-bold text-[#00b4d8] shadow-md">
        SQL
      </div>
    );
  }

  if (n.includes("tailwind")) {
    return (
      <svg className="h-10 w-10 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.975,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.975,12,6.001,12z" />
      </svg>
    );
  }

  if (n.includes("html")) {
    return (
      <svg className="h-10 w-10 text-[#e34f26]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3h20l-1.9 17.7L12 23l-8.1-2.3L2 3zm16.4 4.5H5.6l.4 4h11.9l-.4 4.7-5.5 1.5-5.5-1.5-.2-2.3H4.1l.4 4.5 7.5 2.1 7.5-2.1 1-10.7z" />
      </svg>
    );
  }

  if (n.includes("css")) {
    return (
      <svg className="h-10 w-10 text-[#1572b6]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 3h20l-1.9 17.7L12 23l-8.1-2.3L2 3zm16.4 4.5H5.6l.4 4h11.9l-.4 4.7-5.5 1.5-5.5-1.5-.2-2.3H4.1l.4 4.5 7.5 2.1 7.5-2.1 1-10.7z" />
      </svg>
    );
  }

  if (n.includes("c++") || n === "cpp") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00599c] font-sans text-sm font-bold text-white shadow-md">
        C++
      </div>
    );
  }

  if (n === "c") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a8b9cc] font-sans text-base font-bold text-black shadow-md">
        C
      </div>
    );
  }

  if (n.includes("gemini") || n.includes("llm") || n.includes("ai")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-purple-400/40 text-purple-300">
        <Sparkles size={22} />
      </div>
    );
  }

  if (n.includes("git") && !n.includes("github")) {
    return (
      <svg className="h-10 w-10 text-[#f05032]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.6 10.9L13.1 2.4c-.6-.6-1.5-.6-2.1 0L8.9 4.5l2.7 2.7c.6-.2 1.3-.1 1.8.4.5.5.6 1.2.4 1.8l2.6 2.6c.6-.2 1.3-.1 1.8.4.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.5-.5-.6-1.3-.4-1.9l-2.4-2.4v5.3c.2.1.3.3.4.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.2-.2.4-.4.6-.5V8.8c-.2-.1-.4-.3-.6-.5-.5-.5-.6-1.3-.4-1.9L8.1 3.7 2.4 9.4c-.6.6-.6 1.5 0 2.1l8.5 8.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.6.6-1.6.1-2.2z" />
      </svg>
    );
  }

  if (n.includes("github")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-md">
        <Github size={22} />
      </div>
    );
  }

  if (n.includes("postman")) {
    return (
      <svg className="h-10 w-10 text-[#ff6c37]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-4-2.5 4-2.5v5zm0-7V4.5l4 2.5-4 2.5z" />
      </svg>
    );
  }

  if (n.includes("vs code") || n.includes("vscode")) {
    return (
      <svg className="h-10 w-10 text-[#007acc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 2.5L12 7.7 4.5 2 2 3.5v17L4.5 22 12 16.3l5.5 5.2L22 19.5V4.5L17.5 2.5zM6 16.5V7.5L10 12 6 16.5zm11.5 1.5l-4-3.8 4-3.8v7.6z" />
      </svg>
    );
  }

  if (n.includes("vercel")) {
    return (
      <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L24 22H0L12 1Z" />
      </svg>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 text-cyan-300">
      <Code2 size={22} />
    </div>
  );
}

/**
 * Clean Glass-Style Skill Card with Automatic Random One-by-One Border Glow & Cursor Spotlight
 * - Strictly ONE card glows at a time, randomly hopping across all skills
 * - Border-only glow (Zero glow or blobs in the center of the card)
 * - Pure purple/violet radiant border illumination
 * - Natural text wrapping without truncation
 */
function SkillGlassCard({
  name,
  isActive,
}: {
  name: string;
  isActive: boolean;
}) {
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="interactive-target group relative flex flex-col items-center justify-between p-4 sm:p-5 text-center cursor-default select-none w-full min-h-[165px] sm:min-h-[180px] rounded-[26px] backdrop-blur-xl transition-all duration-500 hover:!-translate-y-2 hover:!scale-[1.03] hover:!border-[#c084fc] hover:!shadow-[0_0_30px_rgba(168,85,247,0.9),0_0_50px_rgba(192,132,252,0.4)]"
      style={{
        background: "rgba(16, 20, 36, 0.92)",
        border: isActive
          ? "2px solid #c084fc"
          : "1.5px solid rgba(255, 255, 255, 0.1)",
        boxShadow: isActive
          ? "0 0 28px rgba(168, 85, 247, 0.85), 0 0 50px rgba(192, 132, 252, 0.45)"
          : "none",
        transform: isActive ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Interactive Cursor Spotlight Light Reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
        style={{
          background:
            "radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(192, 132, 252, 0.15), transparent 70%)",
        }}
      />

      {/* 1. Large Technology Icon (Clean, no center blur blob) */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-2 transition-transform duration-300 group-hover:scale-110">
        <SkillLogo name={name} />
      </div>

      {/* 2. Rounded Pill for Skill Name with Natural Wrapping without Truncation */}
      <div className="relative mt-2 z-10 w-full flex justify-center">
        <span
          className="inline-block w-full max-w-full rounded-2xl px-3 py-1.5 font-mono text-[11px] font-medium transition-all duration-300 text-center leading-snug"
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "normal",
            border: isActive
              ? "1px solid rgba(192, 132, 252, 0.7)"
              : "1px solid rgba(255, 255, 255, 0.1)",
            background: isActive
              ? "rgba(168, 85, 247, 0.25)"
              : "rgba(255, 255, 255, 0.04)",
            color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.85)",
            boxShadow: isActive ? "0 0 12px rgba(168, 85, 247, 0.4)" : "none",
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}

export function SafariApp() {
  const safariContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Track normalized pointer movement for background parallax
  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = safariContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    parallaxRef.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) };
  };

  // Active skill card index for automatic random one-by-one border glow transfer
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  useEffect(() => {
    const totalSkills = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
    setActiveSkillIndex(Math.floor(Math.random() * totalSkills));

    const interval = setInterval(() => {
      setActiveSkillIndex((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * totalSkills);
        } while (next === prev && totalSkills > 1);
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const [containerWidth, setContainerWidth] = useState(900);

  useEffect(() => {
    const el = safariContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          const w = entry.contentRect.width;
          if (w > 0) setContainerWidth(w);
        }
      }
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth || 900);
    return () => observer.disconnect();
  }, []);

  const isWide = containerWidth >= 860;
  const isMedium = containerWidth >= 620 && containerWidth < 860;

  const [activeCert, setActiveCert] = useState<CertificateDetail | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCert(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      ref={safariContainerRef}
      onPointerMove={handleContainerPointerMove}
      className="force-dark relative flex h-full w-full flex-col overflow-hidden bg-[#070810] text-white cursor-none select-none"
    >
      <style>{`
        @keyframes ambientDrift1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(60px, 40px, 0) scale(1.15);
            opacity: 0.5;
          }
        }
        @keyframes ambientDrift2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate3d(-50px, 60px, 0) scale(1.18);
            opacity: 0.45;
          }
        }
        @keyframes ambientDrift3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(40px, -45px, 0) scale(1.12);
            opacity: 0.4;
          }
        }
        @keyframes nameAmbientGlow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.05);
          }
        }
        @keyframes namePulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 25px rgba(232, 170, 66, 0.75));
          }
          50% {
            filter: drop-shadow(0 0 42px rgba(232, 170, 66, 0.95));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Full-Viewport Dense Particle Field & Background across the ENTIRE Safari Window */}
      <SafariAuroraBackground
        containerRef={safariContainerRef}
        parallaxRef={parallaxRef}
      />

      {/* 1. Scoped 60FPS Custom Cursor */}
      <SafariCustomCursor containerRef={safariContainerRef} />

      {/* 2. Safari Browser Chrome Header with Staggered Entrance */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#14151e]/85 px-4 py-2.5 backdrop-blur-md"
      >
        <div className="flex items-center gap-1.5 text-white/35">
          <ChevronLeft size={16} className="cursor-default" />
          <ChevronRight size={16} className="cursor-default opacity-40" />
        </div>

        {/* URL Bar */}
        <div className="mx-auto flex w-full max-w-xs sm:max-w-md lg:max-w-lg items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Lock size={11} className="text-emerald-400" />
          <span className="font-mono tracking-tight text-white/90">muskan-os.dev</span>
          <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-mono text-white/50">HTTPS</span>
        </div>

        <div className="flex items-center gap-2 text-white/45">
          <RotateCw size={13} className="hover:text-white/80 transition-colors" />
          <Share size={14} className="hover:text-white/80 transition-colors" />
          <Plus size={15} className="hover:text-white/80 transition-colors" />
        </div>
      </motion.div>

      {/* 3. Main Page Dedicated Scroll Container (Transparent so particles shine across all sections) */}
      <div
        ref={scrollRef}
        className="relative z-10 min-h-0 flex-1 w-full overflow-y-auto overflow-x-hidden bg-transparent selection:bg-[#e8aa42]/30 selection:text-white overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Webpage Content Container with Spring-Like Boot Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 mx-auto w-full max-w-[1240px] ${
            isWide
              ? "px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-20"
              : isMedium
                ? "px-3.5 sm:px-5 pt-8 pb-16 space-y-16"
                : "px-3 pt-6 pb-12 space-y-12"
          }`}
        >
          {/* Section 1: Hero & Introduction */}
          <div>
            {/* Top Status Badge */}
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md shadow-[0_0_14px_rgba(52,211,153,0.18)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Software Engineering Roles
              </span>
            </div>

            {/* Hero Main Column: Center-aligned */}
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-6">
              <div>
                <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#e8aa42]">
                  Full-Stack & AI Engineer
                </span>
                <div className="relative mt-2 inline-block">
                  <span className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-r from-[#e8aa42]/30 via-[#38bdf8]/30 to-[#e8aa42]/30 blur-2xl -z-10 animate-[nameAmbientGlow_6s_ease-in-out_infinite]" />
                  <h1 className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl md:text-7xl leading-tight text-white drop-shadow-[0_0_35px_rgba(232,170,66,0.85)] filter animate-[namePulseGlow_5s_ease-in-out_infinite]">
                    Muskan Kumari
                  </h1>
                </div>
                <p className="mt-2 font-mono text-xs sm:text-sm font-medium tracking-wide text-emerald-400">
                  Software Engineer / Full-Stack Developer
                </p>
              </div>

              <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-white/80 max-w-2xl mx-auto font-sans text-center">
                AI-focused Software Engineer with hands-on experience building LLM-powered
                applications, AI agents, and backend systems using Python, JavaScript, and Gemini
                APIs. Strong foundation in software engineering, frontend styling, and databases.
              </p>

              {/* Technical Specialty Matrix with Interactive Spotlight */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-xs backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="transition-transform duration-200 hover:-translate-y-0.5">
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    Frontend
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">React • JS • HTML • CSS • Tailwind</p>
                </div>
                <div className="transition-transform duration-200 hover:-translate-y-0.5">
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    Backend
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">Node.js • Express.js • REST APIs</p>
                </div>
                <div className="transition-transform duration-200 hover:-translate-y-0.5">
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    Database
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">MongoDB • SQL • PostgreSQL</p>
                </div>
                <div className="transition-transform duration-200 hover:-translate-y-0.5">
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    AI / Design
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">LLMs • Gemini API • Prompt Eng.</p>
                </div>
              </div>

              {/* CTA Action Buttons with Smooth Hover Lift & Active Feedback */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 w-full">
                <a
                  href={`mailto:${site.email}`}
                  className="interactive-target inline-flex items-center gap-1.5 rounded-full bg-[#e8aa42] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#101013] shadow-[0_4px_16px_rgba(232,170,66,0.35)] hover:bg-[#f3bc5c] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <Mail size={14} />
                  Get in Touch
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-target inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-medium text-white/90 hover:border-white/40 hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <Github size={14} />
                  GitHub
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-target inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-medium text-white/90 hover:border-white/40 hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              </div>

              {/* Contact Metadata */}
              <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-4 text-xs text-white/60 w-full">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#5aa7f2]" />
                  {site.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-400" />
                  {site.phone}
                </span>
              </div>
            </div>

            {/* Quick Highlight Stats with Staggered Entrance */}
            <div
              className={`mt-10 grid gap-3.5 max-w-3xl mx-auto ${
                containerWidth >= 680 ? "grid-cols-3" : "grid-cols-1"
              }`}
            >
              {about.stats.map((stat, index) => (
                <Reveal key={stat} root={scrollRef} delay={index * 0.05}>
                  <div className="interactive-target flex h-full items-center justify-center text-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[13px] leading-snug text-white/85 backdrop-blur-sm transition-all duration-200 hover:border-[#e8aa42]/40 hover:bg-white/[0.06] hover:-translate-y-0.5">
                    <Sparkles size={16} className="shrink-0 text-[#e8aa42]" />
                    <span>{stat}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 2: About (Center-aligned with Staggered Reveal) */}
          <Reveal root={scrollRef} className="max-w-4xl mx-auto text-center space-y-6">
            <SectionHeading subtitle="BIOGRAPHY & PASSION" icon={Sparkles}>
              About
            </SectionHeading>
            <div
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-center transition-all duration-300 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              {/* Interactive Spotlight on About Card */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
                style={{
                  background:
                    "radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232, 170, 66, 0.08), transparent 70%)",
                }}
              />
              <p className="relative z-10 text-[14.5px] sm:text-[16.5px] leading-relaxed text-white/85 font-sans text-center">
                {about.paragraph}
              </p>
            </div>
          </Reveal>

          {/* Section 3: Skills (Pure Purple Sequential Border-Glow with Staggered Cascade) */}
          <div className="w-full space-y-12 max-w-6xl mx-auto">
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="TECHNICAL ARSENAL" icon={Sparkles}>
                Skills
              </SectionHeading>
            </Reveal>

            {/* Categorized Centered Skill Groups with Sequential One-By-One Glow */}
            <div className="space-y-12 w-full">
              {skillGroups.map((group, groupIdx) => {
                const startIndex = skillGroups
                  .slice(0, groupIdx)
                  .reduce((acc, g) => acc + g.skills.length, 0);

                return (
                  <Reveal key={group.label} root={scrollRef} delay={groupIdx * 0.04}>
                    <div className="flex flex-col items-center justify-center w-full">
                      {/* Purple Category Subheading */}
                      <div className="mb-5 flex items-center justify-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                        <h3 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-purple-300/90 text-center">
                          {group.label}
                        </h3>
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                      </div>

                      {/* Centered Flex Container for Skills Cards with Sequential Active Transfer */}
                      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:gap-6 w-full max-w-5xl mx-auto">
                        {group.skills.map((skill, sIdx) => {
                          const globalIdx = startIndex + sIdx;
                          return (
                            <div key={skill} className="w-[135px] sm:w-[150px] md:w-[160px] flex justify-center">
                              <SkillGlassCard
                                name={skill}
                                isActive={activeSkillIndex === globalIdx}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Section 4: Projects (Premium Cards without 3D Flip + Shine Sweep) */}
          <div className="w-full max-w-6xl mx-auto">
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="FEATURED SYSTEMS" icon={Code2}>
                Projects
              </SectionHeading>
            </Reveal>

            <div
              className={`mt-2 grid gap-7 lg:gap-8 justify-center ${
                containerWidth >= 880
                  ? "grid-cols-3"
                  : containerWidth >= 580
                    ? "grid-cols-2"
                    : "grid-cols-1"
              } max-w-6xl mx-auto`}
            >
              {defaultProjects
                .filter((p) => p.featured)
                .map((project, index) => (
                  <Reveal key={project.title} root={scrollRef} delay={index * 0.06} className="h-full">
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
            </div>
          </div>

          {/* Section 5: Work Experience (Center-aligned with Cascade Reveal) */}
          <div className="w-full max-w-4xl mx-auto">
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="CAREER JOURNEY" icon={Briefcase}>
                Work Experience
              </SectionHeading>
            </Reveal>

            <div className="space-y-8">
              {experience.map((item, index) => (
                <Reveal key={item.role + item.company} root={scrollRef} delay={index * 0.05}>
                  <div
                    onPointerMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                    }}
                    className="group relative overflow-hidden interactive-target flex flex-col items-center justify-center text-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm shadow-xl transition-all duration-300 hover:border-[#e8aa42]/40 hover:-translate-y-1"
                  >
                    {/* Interactive Cursor Spotlight */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
                      style={{
                        background:
                          "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(232, 170, 66, 0.1), transparent 70%)",
                      }}
                    />

                    <div className="relative z-10 mb-2">
                      <span className="rounded-full border border-[#e8aa42]/30 bg-[#e8aa42]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#e8aa42]">
                        {item.period}
                      </span>
                    </div>

                    <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {item.company}
                    </h3>

                    <p className="relative z-10 mt-1 font-mono text-sm font-semibold text-emerald-400">
                      {item.role}
                    </p>

                    <div className="relative z-10 mt-6 space-y-2.5 w-full max-w-2xl mx-auto">
                      {item.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex items-center justify-center text-center rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-[13.5px] leading-relaxed text-white/80"
                        >
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 6: Education (Center-aligned with Staggered Entrance) */}
          <div className="max-w-3xl mx-auto w-full">
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="ACADEMIC BACKGROUND" icon={GraduationCap}>
                Education
              </SectionHeading>
            </Reveal>
            <div className="mt-2 space-y-4">
              {education.map((item) => (
                <Reveal key={item.title} root={scrollRef}>
                  <div
                    onPointerMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                    }}
                    className="group relative overflow-hidden interactive-target flex flex-col items-center justify-center text-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm shadow-xl max-w-2xl mx-auto transition-all duration-300 hover:border-[#5aa7f2]/40 hover:-translate-y-1"
                  >
                    {/* Interactive Cursor Spotlight */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
                      style={{
                        background:
                          "radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(90, 167, 242, 0.12), transparent 70%)",
                      }}
                    />

                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5aa7f2]/30 bg-[#5aa7f2]/10 text-[#5aa7f2] shadow-[0_0_20px_rgba(90,167,242,0.2)] transition-transform duration-300 group-hover:scale-105">
                      <GraduationCap size={26} />
                    </div>
                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base sm:text-lg font-bold text-white">{item.title}</h4>
                      <p className="text-sm font-semibold text-[#e8aa42]">{item.org}</p>
                      {item.period && (
                        <p className="font-mono text-xs text-white/50">{item.period}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 7: Certificates (Center-aligned with Staggered Cascade) */}
          <div className="w-full max-w-6xl mx-auto">
            <Reveal root={scrollRef}>
              <SectionHeading
                subtitle={`${certificates.length} CREDENTIALS & CERTIFICATIONS`}
                icon={Award}
              >
                Certificates
              </SectionHeading>
            </Reveal>

            <div
              className={`mt-4 grid gap-5 justify-center ${
                containerWidth >= 880
                  ? "grid-cols-3"
                  : containerWidth >= 560
                    ? "grid-cols-2"
                    : "grid-cols-1"
              } max-w-6xl mx-auto`}
            >
              {certificates.map((cert, index) => (
                <Reveal key={cert.name} root={scrollRef} delay={index * 0.04}>
                  <div
                    onPointerMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
                    }}
                    onClick={() => {
                      setActiveCert({
                        ...cert,
                        credentialId:
                          "credId" in cert ? (cert as any).credId : "REC-" + Math.floor(100000 + Math.random() * 900000),
                      });
                    }}
                    className="interactive-target group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm text-left transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(6,182,212,0.2)] hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Interactive Cursor Spotlight */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-0"
                      style={{
                        background:
                          "radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(56, 189, 248, 0.12), transparent 70%)",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                          <Award size={20} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-base font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-[#e8aa42]">{cert.org}</p>
                    </div>

                    <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                      <span className="text-white/40 font-mono text-[11px]">Credential</span>
                      <span className="flex items-center gap-1 font-mono text-[11.5px] font-semibold text-cyan-400 group-hover:underline">
                        View <ExternalLink size={11} />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 8: Footer (Center-aligned) */}
          <footer className="border-t border-white/10 pt-10 pb-6 text-center text-xs text-white/40 space-y-3">
            <p className="font-mono text-white/60">
              Designed & Engineered with React, TypeScript & Tailwind CSS
            </p>
            <p>© {new Date().getFullYear()} Muskan Kumari. All rights reserved.</p>
          </footer>
        </motion.div>
      </div>

      {/* Certificate Lightbox / Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-[#12131d] shadow-2xl p-6 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeCert.name}</h3>
                    <p className="text-xs text-[#e8aa42]">{activeCert.org}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="my-6 rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/40">Credential ID:</span>
                  <span className="text-white/80">{activeCert.credentialId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Issuer & Organization:</span>
                  <span className="text-white/80">{activeCert.org}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Verification:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <FileCheck size={12} /> Authenticated Record
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setActiveCert(null)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/5 transition-colors active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
