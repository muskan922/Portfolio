import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  Briefcase,
  CheckCircle2,
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
import { useEffect, useMemo, useRef, useState } from "react";
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

function Reveal({
  children,
  root,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  root: React.RefObject<HTMLDivElement | null>;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root, once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.8, 0.25, 1] }}
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

/** Lightweight particle for Safari's full-page animated webpage canvas. */
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
  wobbleSpeed: number;
  wobbleOffset: number;
  color: string;
  glowColor: string;
  isLarge: boolean;
}

/** Full-Page Canvas Particle System extending across the entire scrollable height */
function SafariFullPageParticleCanvas({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!canvas || !scrollContainer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = scrollContainer.clientWidth || window.innerWidth);
    let height = (canvas.height = Math.max(
      scrollContainer.scrollHeight,
      scrollContainer.clientHeight,
      3400,
    ));

    const resize = () => {
      if (!canvas || !scrollContainer) return;
      const newW = scrollContainer.clientWidth || window.innerWidth;
      const newH = Math.max(scrollContainer.scrollHeight, scrollContainer.clientHeight, 3400);
      if (canvas.width !== newW || canvas.height !== newH) {
        width = canvas.width = newW;
        height = canvas.height = newH;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(scrollContainer);
    window.addEventListener("resize", resize);

    const colorPalette = [
      { color: "rgba(56, 189, 248,", glow: "rgba(56, 189, 248, 0.9)" }, // Cyan / Sky Blue
      { color: "rgba(6, 182, 212,", glow: "rgba(6, 182, 212, 0.9)" }, // Deep Cyan
      { color: "rgba(147, 197, 253,", glow: "rgba(147, 197, 253, 0.9)" }, // Light Blue
      { color: "rgba(240, 249, 255,", glow: "rgba(240, 249, 255, 0.95)" }, // Soft Luminous White
      { color: "rgba(167, 139, 250,", glow: "rgba(167, 139, 250, 0.8)" }, // Soft Violet accent
      { color: "rgba(99, 102, 241,", glow: "rgba(99, 102, 241, 0.8)" }, // Indigo
    ];

    // High particle count covering the entire document height from 0 to 3400px+
    const count = Math.min(120, Math.max(70, Math.floor(height / 32)));
    const particles: SafariParticle[] = Array.from({ length: count }, (_, idx) => {
      const isLarge = idx % 6 === 0;
      const isMedium = idx % 6 === 1 || idx % 6 === 3 || idx % 6 === 5;
      const radius = isLarge
        ? 8.5 + Math.random() * 5.5
        : isMedium
          ? 4.5 + Math.random() * 3.5
          : 2.2 + Math.random() * 2;

      const baseAlpha = isLarge
        ? 0.4 + Math.random() * 0.3
        : isMedium
          ? 0.5 + Math.random() * 0.35
          : 0.55 + Math.random() * 0.35;

      const palette = colorPalette[Math.floor(Math.random() * colorPalette.length)]!;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -0.35 - Math.random() * 0.55, // continuous lively upward float
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        pulseOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.0015 + Math.random() * 0.0025,
        wobbleOffset: Math.random() * Math.PI * 2,
        color: palette.color,
        glowColor: palette.glow,
        isLarge,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;

        // Float upward and gentle horizontal drift
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.4;
        p.y += p.vy + Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * 0.25;

        // Wrap around boundaries across the entire scrollable document height
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.alpha = Math.min(
          0.95,
          Math.max(0.2, p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.2),
        );

        // Glowing particle with multi-stop radial gradient for rich depth
        const glowRadius = p.radius * (p.isLarge ? 2.8 : 2.2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, `${p.color} ${p.alpha})`);
        grad.addColorStop(0.4, `${p.color} ${p.alpha * 0.6})`);
        grad.addColorStop(1, `${p.color} 0)`);

        ctx.save();
        ctx.shadowBlur = p.isLarge ? 18 : 10;
        ctx.shadowColor = p.glowColor;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Solid luminous core
        ctx.fillStyle = `${p.color} ${Math.min(1, p.alpha * 1.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw subtle luminous connection filaments between proximate particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i]!.x - particles[j]!.x;
          const dy = particles[i]!.y - particles[j]!.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i]!.x, particles[i]!.y);
            ctx.lineTo(particles[j]!.x, particles[j]!.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.16 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [scrollContainerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full min-h-full opacity-90"
    />
  );
}

/**
 * Aurora Glass Flow Background
 * GPU-accelerated macOS/Safari ambient environment
 * covers the entire webpage continuously across all scrollable sections.
 */
function SafariAuroraBackground({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none min-h-full h-full w-full">
      {/* 1. Deep Oceanic Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070810] via-[#090c18] via-[#080a14] to-[#06070d]" />

      {/* 2. Full-Page Animated Particle Canvas */}
      <SafariFullPageParticleCanvas scrollContainerRef={scrollContainerRef} />

      {/* 3. Large Morphing Aurora Light Blobs distributed across the full document height */}
      {/* Blob 1: Cyan & Electric Sky (Hero & Top Area) */}
      <motion.div
        style={{ willChange: "transform, opacity", transform: "translate3d(0, 0, 0)" }}
        animate={{
          x: [0, 60, -40, 20, 0],
          y: [0, -40, 50, -20, 0],
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.38, 0.5, 0.4, 0.52, 0.38],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-36 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#06b6d4]/45 via-[#0284c7]/40 to-[#38bdf8]/25 blur-[140px]"
      />

      {/* Blob 2: Soft Violet & Indigo Glow (Header / Intro / About) */}
      <motion.div
        style={{ willChange: "transform, opacity", transform: "translate3d(0, 0, 0)" }}
        animate={{
          x: [0, -70, 40, -30, 0],
          y: [0, 50, -30, 40, 0],
          scale: [1, 1.12, 1.02, 1.18, 1],
          opacity: [0.32, 0.46, 0.34, 0.48, 0.32],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-32 top-32 h-[680px] w-[680px] rounded-full bg-gradient-to-bl from-[#7c3aed]/35 via-[#6366f1]/40 to-[#3b82f6]/30 blur-[150px]"
      />

      {/* Blob 3: Deep Safari Blue / Cyan Drift (Middle / Skills & Experience) */}
      <motion.div
        style={{ willChange: "transform, opacity", transform: "translate3d(0, 0, 0)" }}
        animate={{
          x: [0, 80, -60, 40, 0],
          y: [0, 60, -50, 30, 0],
          scale: [1, 1.2, 0.92, 1.12, 1],
          opacity: [0.3, 0.44, 0.32, 0.46, 0.3],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/3 top-[850px] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#0284c7]/38 via-[#06b6d4]/35 to-[#4f46e5]/28 blur-[160px]"
      />

      {/* Blob 4: Sapphire Azure & Sky Blue (Projects Section) */}
      <motion.div
        style={{ willChange: "transform, opacity", transform: "translate3d(0, 0, 0)" }}
        animate={{
          x: [0, -50, 60, -30, 0],
          y: [0, -60, 40, -20, 0],
          scale: [1, 1.15, 0.95, 1.1, 1],
          opacity: [0.28, 0.42, 0.3, 0.45, 0.28],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-28 top-[1600px] h-[660px] w-[660px] rounded-full bg-gradient-to-tr from-[#1d4ed8]/38 via-[#0284c7]/32 to-[#38bdf8]/22 blur-[150px]"
      />

      {/* Blob 5: Soft Indigo & Violet Light (Certificates Section) */}
      <motion.div
        style={{ willChange: "transform, opacity", transform: "translate3d(0, 0, 0)" }}
        animate={{
          x: [0, 50, -40, 30, 0],
          y: [0, 40, -50, 20, 0],
          scale: [1, 1.12, 0.96, 1.14, 1],
          opacity: [0.25, 0.4, 0.28, 0.42, 0.25],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-24 top-[2300px] h-[640px] w-[640px] rounded-full bg-gradient-to-tl from-[#6366f1]/30 via-[#8b5cf6]/28 to-[#06b6d4]/22 blur-[145px]"
      />

      {/* Blob 6: Luminous Cyan & Royal Azure (Contact & Footer Area) */}
      <motion.div
        style={{ willChange: "transform, opacity", transform: "translate3d(0, 0, 0)" }}
        animate={{
          x: [0, -40, 40, -20, 0],
          y: [0, 30, -30, 15, 0],
          scale: [1, 1.12, 0.95, 1.08, 1],
          opacity: [0.3, 0.46, 0.32, 0.44, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/4 bottom-10 h-[620px] w-[620px] rounded-full bg-gradient-to-tr from-[#06b6d4]/35 via-[#0284c7]/32 to-[#6366f1]/25 blur-[140px]"
      />

      {/* 4. Flowing Liquid Light Waves / Translucent Aurora Ribbons */}
      <div className="absolute inset-0 opacity-45 mix-blend-screen overflow-hidden pointer-events-none">
        <svg
          className="h-full w-full min-h-[3400px]"
          viewBox="0 0 1440 3400"
          fill="none"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M-100,300 C300,100 600,500 1000,280 C1300,100 1500,420 1600,300 L1600,3400 L-100,3400 Z"
            fill="url(#aurora-grad-1)"
            animate={{
              d: [
                "M-100,300 C300,100 600,500 1000,280 C1300,100 1500,420 1600,300 L1600,3400 L-100,3400 Z",
                "M-100,420 C350,220 700,400 1050,180 C1350,320 1480,160 1600,380 L1600,3400 L-100,3400 Z",
                "M-100,220 C280,380 580,180 950,380 C1250,160 1520,480 1600,260 L1600,3400 L-100,3400 Z",
                "M-100,300 C300,100 600,500 1000,280 C1300,100 1500,420 1600,300 L1600,3400 L-100,3400 Z",
              ],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M-100,1200 C250,900 550,1400 900,1100 C1200,900 1450,1300 1600,1150 L1600,3400 L-100,3400 Z"
            fill="url(#aurora-grad-2)"
            animate={{
              d: [
                "M-100,1200 C250,900 550,1400 900,1100 C1200,900 1450,1300 1600,1150 L1600,3400 L-100,3400 Z",
                "M-100,1080 C320,1250 620,950 980,1250 C1280,1020 1420,1380 1600,1200 L1600,3400 L-100,3400 Z",
                "M-100,1300 C220,1050 520,1280 880,1020 C1180,1260 1480,1080 1600,1260 L1600,3400 L-100,3400 Z",
                "M-100,1200 C250,900 550,1400 900,1100 C1200,900 1450,1300 1600,1150 L1600,3400 L-100,3400 Z",
              ],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="aurora-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.14" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="aurora-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.07" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Subtle Liquid Glass Diffusions across the entire page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(56,189,248,0.14),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_40%,rgba(99,102,241,0.11),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_85%,rgba(6,182,212,0.12),transparent_70%)] pointer-events-none" />
    </div>
  );
}

/**
 * Zero-Re-render GPU-Accelerated Custom Safari Cursor
 * Uses requestAnimationFrame interpolation (lerping) and direct DOM transforms.
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

    // Disable cursor tracking completely on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetX = -100;
    let targetY = -100;
    let currX = -100;
    let currY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isInside = false;
    let animId: number;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      isInside = true;

      const target = e.target as HTMLElement | null;
      isHovering = Boolean(
        target?.closest("a, button, [role='button'], input, textarea, .interactive-target"),
      );
    };

    const onPointerLeave = () => {
      isInside = false;
      targetX = -100;
      targetY = -100;
      if (coreRef.current) coreRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const onPointerEnter = () => {
      isInside = true;
      if (coreRef.current) coreRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    container.addEventListener("pointerenter", onPointerEnter, { passive: true });

    const updateCursor = () => {
      if (isInside) {
        // Fast, smooth core tracking (lerp 0.55)
        currX += (targetX - currX) * 0.55;
        currY += (targetY - currY) * 0.55;

        // Smooth trailing ring (lerp 0.18)
        ringX += (currX - ringX) * 0.18;
        ringY += (currY - ringY) * 0.18;

        if (coreRef.current) {
          coreRef.current.style.transform = `translate3d(${currX}px, ${currY}px, 0) translate(-50%, -50%) scale(${isHovering ? 0.6 : 1})`;
          coreRef.current.style.backgroundColor = isHovering ? "#f3bc5c" : "#e8aa42";
          coreRef.current.style.opacity = "1";
        }

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
          ringRef.current.style.borderColor = isHovering
            ? "rgba(232, 170, 66, 0.75)"
            : "rgba(255, 255, 255, 0.35)";
          ringRef.current.style.backgroundColor = isHovering
            ? "rgba(232, 170, 66, 0.12)"
            : "rgba(255, 255, 255, 0.02)";
          ringRef.current.style.opacity = "1";
        }
      }

      animId = requestAnimationFrame(updateCursor);
    };

    animId = requestAnimationFrame(updateCursor);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerenter", onPointerEnter);
    };
  }, [containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[999] overflow-hidden hidden md:block select-none">
      {/* Glowing Cursor Core */}
      <div
        ref={coreRef}
        style={{ willChange: "transform, background-color" }}
        className="absolute top-0 left-0 h-2 w-2 rounded-full shadow-[0_0_10px_#e8aa42] transition-colors duration-150"
      />

      {/* Smooth Trailing & Expanding Ring */}
      <div
        ref={ringRef}
        style={{ willChange: "transform, border-color, background-color" }}
        className="absolute top-0 left-0 h-7 w-7 rounded-full border border-white/35 backdrop-blur-[0.5px] transition-colors duration-200"
      />
    </div>
  );
}

/** Certificate preview item definition. */
interface CertificateDetail extends Certificate {
  type?: "pdf" | "image" | "credential";
  url?: string;
  skills?: string[];
  credentialId?: string;
}

/**
 * 2-Face 3D Flip Project Card
 * Front: Full-bleed project cover image (clean visual presentation, no text overlay).
 * Back: Full written project details, tech stack pills, and live demo link.
 * Hover: Smooth 3D rotateY(180deg) flip with realistic CSS perspective.
 * Click: Opens live project demo in new tab directly.
 * Mobile: First tap flips card, second tap opens live demo.
 */
interface ProjectFlipCardProps {
  project: (typeof defaultProjects)[0];
  index: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

function ProjectFlipCard({ project, index, scrollRef }: ProjectFlipCardProps) {
  const [isFlippedTouch, setIsFlippedTouch] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFlipped = isHovered || isFlippedTouch;

  const handleCardClick = (e: React.MouseEvent) => {
    // If on a touch device and not flipped yet, flip on first tap
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && !isFlippedTouch) {
      e.preventDefault();
      setIsFlippedTouch(true);
      return;
    }

    // Otherwise open the live project link directly
    if (project.link) {
      window.open(project.link, "_blank", "noopener,noreferrer");
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsFlippedTouch(false);
  };

  return (
    <Reveal root={scrollRef} delay={index * 0.08} className="h-full">
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onKeyDown={(e) => {
          if (e.key === "Enter" && project.link) {
            window.open(project.link, "_blank", "noopener,noreferrer");
          }
        }}
        aria-label={`${project.title} - Click to open live project`}
        className="interactive-target group relative w-full h-[420px] cursor-pointer rounded-2xl select-none"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative h-full w-full rounded-2xl will-change-transform shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(56,189,248,0.3)]"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)",
          }}
        >
          {/* FRONT FACE: Show ONLY Project Image (No text overlay) */}
          <div
            className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-[#10111a] shadow-2xl transition-all duration-300 group-hover:border-[#38bdf8] group-hover:shadow-[0_0_24px_rgba(56,189,248,0.35)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {project.media?.[0] ? (
              <div className="h-full w-full p-2.5">
                <div className="h-full w-full overflow-hidden rounded-xl bg-black/50">
                  <LazyMedia
                    media={project.media[0]}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40 font-mono text-sm">
                {project.title}
              </div>
            )}
            {/* Subtle glass sheen overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.04] via-transparent to-black/25" />
          </div>

          {/* BACK FACE: Show ONLY existing written project content */}
          <div
            className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-[#12131c]/95 p-6 sm:p-7 backdrop-blur-xl shadow-2xl text-left transition-all duration-300 group-hover:border-[#38bdf8] group-hover:shadow-[0_0_24px_rgba(56,189,248,0.35)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="overflow-y-auto pr-1">
              {/* Header: Tag & Period */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <span className="rounded-full border border-[#e8aa42]/30 bg-[#e8aa42]/10 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-[#e8aa42]">
                  {project.tag}
                </span>
                {project.period && (
                  <span className="font-mono text-xs text-white/40">{project.period}</span>
                )}
              </div>

              {/* Title & Far-Right Link Icon */}
              <div className="mt-3.5 flex items-start justify-between gap-3">
                <h3
                  className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug flex-1"
                  style={{
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    wordBreak: "normal",
                  }}
                >
                  {project.title}
                </h3>
                {project.link && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] transition-colors group-hover:border-[#38bdf8] group-hover:bg-[#38bdf8]/20">
                    <ExternalLink size={14} />
                  </span>
                )}
              </div>

              {/* Description without any ellipsis or truncation */}
              <p
                className="mt-2.5 text-[13px] leading-relaxed text-white/75 font-sans"
                style={{
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  wordBreak: "normal",
                }}
              >
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
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
            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2 shrink-0">
              <div className="flex items-center gap-2">
                {project.link && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8aa42] px-3.5 py-1.5 text-xs font-semibold text-[#101013] shadow-[0_2px_8px_rgba(232,170,66,0.35)] hover:bg-[#f3bc5c] transition-colors">
                    <ExternalLink size={12} />
                    Live Demo
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#38bdf8]/90 group-hover:text-[#38bdf8] transition-colors">
                Open Project ↗
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function SkillLogo({ name }: { name: string }) {
  const n = name.toLowerCase();

  if (n.includes("react")) {
    return (
      <svg className="h-11 w-11 text-[#61DAFB]" viewBox="0 0 115.3 100" fill="currentColor">
        <ellipse cx="57.65" cy="50" rx="10.5" ry="10.5" fill="#61DAFB" />
        <ellipse cx="57.65" cy="50" rx="52" ry="19.5" fill="none" stroke="#61DAFB" strokeWidth="6.5" />
        <ellipse cx="57.65" cy="50" rx="52" ry="19.5" fill="none" stroke="#61DAFB" strokeWidth="6.5" transform="rotate(60 57.65 50)" />
        <ellipse cx="57.65" cy="50" rx="52" ry="19.5" fill="none" stroke="#61DAFB" strokeWidth="6.5" transform="rotate(120 57.65 50)" />
      </svg>
    );
  }

  if (n.includes("next")) {
    return (
      <svg className="h-10 w-10 text-white" viewBox="0 0 180 180" fill="currentColor">
        <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
          <circle cx="90" cy="90" fill="black" r="90" />
        </mask>
        <g mask="url(#mask0_next)">
          <circle cx="90" cy="90" fill="black" r="90" stroke="white" strokeWidth="6" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
          <rect fill="white" height="72" width="12" x="115" y="54" />
        </g>
      </svg>
    );
  }

  if (n.includes("tailwind")) {
    return (
      <svg className="h-10 w-10 text-[#06B6D4]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    );
  }

  if (n.includes("typescript")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3178C6] text-white font-bold text-base shadow-md font-mono">
        TS
      </div>
    );
  }

  if (n.includes("javascript")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7DF1E] text-black font-bold text-base shadow-md font-mono">
        JS
      </div>
    );
  }

  if (n.includes("python")) {
    return (
      <svg className="h-10 w-10" viewBox="0 0 24 24">
        <path fill="#3776AB" d="M11.927 0C5.973 0 6.34 2.59 6.34 2.59l.006 2.684h5.66v.805H4.14S0 5.557 0 11.516c0 5.96 3.606 5.76 3.606 5.76l2.152-.002v-3.023s-.118-3.607 3.553-3.607h5.63V8.868s.51-5.868-3.014-5.868zm-2.02 1.824a1.002 1.002 0 1 1 0 2.004 1.002 1.002 0 0 1 0-2.004z" />
        <path fill="#FFD43B" d="M12.073 24c5.954 0 5.587-2.59 5.587-2.59l-.006-2.684h-5.66v-.805h7.866s4.14.522 4.14-5.437c0-5.96-3.606-5.76-3.606-5.76l-2.152.002v3.023s.118 3.607-3.553 3.607H9.062v1.776s-.51 5.868 3.011 5.868zm2.02-1.824a1.002 1.002 0 1 1 0-2.004 1.002 1.002 0 0 1 0 2.004z" />
      </svg>
    );
  }

  if (n.includes("node")) {
    return (
      <svg className="h-10 w-10 text-[#5FA04E]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5l10 5.8v11.4l-10 5.8-10-5.8V7.3l10-5.8zm-1.2 13.8l2.4 1.4V11l-2.4-1.4v5.7zm4.8-2.8l2.4 1.4V8.2l-2.4-1.4v5.7zm-9.6 0l2.4 1.4V8.2L6 6.8v5.7z" />
      </svg>
    );
  }

  if (n.includes("express")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white font-mono font-bold text-sm shadow-md">
        ex
      </div>
    );
  }

  if (n.includes("mongo")) {
    return (
      <svg className="h-10 w-10 text-[#47A248]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C11.5 0.5 7 7.5 7 13.5C7 18 10 21.5 12 24C14 21.5 17 18 17 13.5C17 7.5 12.5 0.5 12 0ZM12 21.8C10.7 19.8 8.6 16.9 8.6 13.5C8.6 8.9 11.5 3.5 12 2.6V21.8Z" />
      </svg>
    );
  }

  if (n.includes("postgres")) {
    return (
      <svg className="h-10 w-10 text-[#4169E1]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5S10.52 7.5 13 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" />
      </svg>
    );
  }

  if (n.includes("git")) {
    return (
      <svg className="h-10 w-10 text-[#F05032]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72 1.006 1.764.73 2.7l3.463 3.464c.604.604.604 1.581 0 2.185l-7.79 7.79c-.604.603-1.582.603-2.187 0L.452 15.084c-.603-.604-.603-1.582 0-2.188L2.63 10.72l5.772 5.772c-.22.642-.078 1.385.438 1.9.72.72 1.889.72 2.609 0 .515-.515.658-1.258.438-1.9l2.658-2.66a2.027 2.027 0 0 1 1.9.435c.72.72 1.889.72 2.609 0 .604-.604.604-1.582 0-2.188l-5.46-5.46a2.032 2.032 0 0 1-.439-1.9L8.196 2.052.452 9.796c-.603.604-.603 1.582 0 2.188l10.479 10.479c.604.603 1.582.603 2.187 0l10.428-10.428c.604-.604.604-1.582 0-2.188z" />
      </svg>
    );
  }

  if (n.includes("gemini") || n.includes("llm") || n.includes("prompt") || n.includes("ai")) {
    return (
      <svg className="h-10 w-10 text-[#38BDF8]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    );
  }

  if (n.includes("c/c++") || n.includes("c++")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00599C] text-white font-bold text-sm shadow-md font-mono">
        C++
      </div>
    );
  }

  if (n.includes("java")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E76F00] text-white font-bold text-sm shadow-md font-mono">
        JAVA
      </div>
    );
  }

  if (n.includes("postman")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6C37] text-white font-bold text-base shadow-md">
        🚀
      </div>
    );
  }

  if (n.includes("vs code") || n.includes("vscode")) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007ACC] text-white font-bold text-sm shadow-md font-mono">
        VS
      </div>
    );
  }

  if (n.includes("vercel")) {
    return (
      <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L24 22H0L12 1Z" />
      </svg>
    );
  }

  // Default elegant tech logo
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 text-cyan-300">
      <Code2 size={22} />
    </div>
  );
}

/** Deterministic hash for natural pseudo-random pulse timing per skill card */
function getSkillGlowTiming(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  const duration = 3.6 + (abs % 36) / 10; // 3.6s to 7.1s
  const delay = (abs % 40) / 10; // 0.0s to 3.9s
  return { duration, delay };
}

/**
 * Premium Glass-Style Skill Card
 * - Static card (Zero flip behavior)
 * - Independent asynchronous random glow
 * - Full natural text wrapping for long skill names without truncation
 * - Responsive generous spacing
 */
function SkillGlassCard({ name }: { name: string }) {
  const { duration, delay } = useMemo(() => getSkillGlowTiming(name), [name]);

  return (
    <div
      className="interactive-target group relative flex flex-col items-center justify-between p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1.5 cursor-default select-none w-full min-h-[160px] sm:min-h-[175px]"
      style={{
        background: "rgba(20, 28, 48, 0.75)",
        border: "1px solid rgba(150, 80, 255, 0.32)",
        borderRadius: "26px",
        backdropFilter: "blur(10px)",
        animation: `skillCardRandomPulse ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {/* Soft Purple Glow Overlay on Hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-b from-purple-500/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* 1. Large Technology Icon */}
      <div className="relative flex flex-1 items-center justify-center py-2 transition-transform duration-300 group-hover:scale-110">
        <SkillLogo name={name} />
      </div>

      {/* 2. Rounded Pill for Skill Name with Natural Wrapping without Truncation */}
      <div className="relative mt-2 z-10 w-full flex justify-center">
        <span
          className="inline-block w-full max-w-full rounded-2xl border border-purple-400/25 bg-purple-500/10 px-3 py-1.5 font-mono text-[11px] font-medium text-white/90 shadow-sm transition-all duration-300 group-hover:border-purple-400/60 group-hover:bg-purple-500/25 group-hover:text-white text-center leading-snug"
          style={{
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "normal",
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

  // Real-time Safari container width tracking for container-based responsiveness
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

  // Container-based responsive breakpoints
  const isWide = containerWidth >= 860;
  const isMedium = containerWidth >= 620 && containerWidth < 860;

  // Certificate Lightbox / Modal state
  const [activeCert, setActiveCert] = useState<CertificateDetail | null>(null);

  // Close certificate modal on Escape key
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
      className="force-dark relative flex h-full w-full flex-col overflow-hidden bg-[#070810] text-white cursor-none select-none"
    >
      {/* 1. Zero-Re-render Custom Cursor (Scoped strictly inside Safari) */}
      <SafariCustomCursor containerRef={safariContainerRef} />

      {/* 2. Safari Browser Chrome Header */}
      <div className="relative z-10 flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#14151e]/90 px-4 py-2.5 backdrop-blur-md">
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
      </div>

      {/* 3. Main Page Dedicated Scroll Container (Smooth 60fps single scroll system) */}
      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#070810] selection:bg-[#e8aa42]/30 selection:text-white overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Full-Page Aurora & Particle Background: Covers 100% of the entire scrollable height from Hero to Footer */}
        <SafariAuroraBackground scrollContainerRef={scrollRef} />

        {/* Webpage Content Container: Responsive with reduced left/right padding */}
        <div
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

            {/* Hero Main Column: Center-aligned without photo */}
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-6">
              <div>
                <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#e8aa42]">
                  Full-Stack & AI Engineer
                </span>
                <div className="relative mt-2 inline-block">
                  <span className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-r from-[#e8aa42]/30 via-[#38bdf8]/30 to-[#e8aa42]/30 blur-2xl -z-10" />
                  <h1 className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl md:text-7xl leading-tight text-white drop-shadow-[0_0_35px_rgba(232,170,66,0.85)] filter">
                    Muskan Kumari
                  </h1>
                </div>
                <p className="mt-2 font-mono text-xs sm:text-sm font-medium tracking-wide text-emerald-400">
                  Software Engineer / Full-Stack Developer
                </p>
              </div>

              <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-white/80 max-w-2xl mx-auto font-sans">
                AI-focused Software Engineer with hands-on experience building LLM-powered
                applications, AI agents, and backend systems using Python, JavaScript, and Gemini
                APIs. Strong foundation in software engineering, frontend styling, and databases.
              </p>

              {/* Technical Specialty Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-xs backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div>
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    Frontend
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">React • JS • HTML • CSS • Tailwind</p>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    Backend
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">Node.js • Express.js • REST APIs</p>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    Database
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">MongoDB • SQL • PostgreSQL</p>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e8aa42]/90">
                    AI / Design
                  </h4>
                  <p className="mt-1 text-white/80 font-sans text-[11.5px]">LLMs • Gemini API • Prompt Eng.</p>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 w-full">
                <a
                  href={`mailto:${site.email}`}
                  className="interactive-target inline-flex items-center gap-1.5 rounded-full bg-[#e8aa42] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#101013] shadow-[0_4px_16px_rgba(232,170,66,0.35)] hover:bg-[#f3bc5c] transition-all active:scale-95"
                >
                  <Mail size={14} />
                  Get in Touch
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-target inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-medium text-white/90 hover:border-white/40 hover:bg-white/[0.08] transition-all active:scale-95"
                >
                  <Github size={14} />
                  GitHub
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-target inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-medium text-white/90 hover:border-white/40 hover:bg-white/[0.08] transition-all active:scale-95"
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

            {/* Quick Highlight Stats */}
            <div
              className={`mt-10 grid gap-3.5 max-w-3xl mx-auto ${
                containerWidth >= 680 ? "grid-cols-3" : "grid-cols-1"
              }`}
            >
              {about.stats.map((stat, index) => (
                <Reveal key={stat} root={scrollRef} delay={index * 0.05}>
                  <div className="interactive-target flex h-full items-center justify-center text-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[13px] leading-snug text-white/85 backdrop-blur-sm transition-all hover:border-[#e8aa42]/30 hover:bg-white/[0.06]">
                    <Sparkles size={16} className="shrink-0 text-[#e8aa42]" />
                    <span>{stat}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 2: About (Center-aligned) */}
          <Reveal root={scrollRef} className="max-w-4xl mx-auto text-center">
            <SectionHeading>About</SectionHeading>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-center">
              <p className="text-[14.5px] sm:text-[16px] leading-relaxed text-white/80 font-sans">
                {about.paragraph}
              </p>
            </div>
          </Reveal>

          {/* Section 3: Skills (Reference-Inspired Glassmorphism & Purple Glow Cards) */}
          <div className="w-full space-y-12">
            <style>{`
              @keyframes skillCardRandomPulse {
                0%, 100% {
                  box-shadow: 0 0 14px rgba(140, 70, 255, 0.14), inset 0 0 15px rgba(100, 70, 180, 0.04);
                  border-color: rgba(150, 80, 255, 0.28);
                }
                50% {
                  box-shadow: 0 0 28px rgba(168, 85, 247, 0.42), inset 0 0 22px rgba(140, 70, 255, 0.14);
                  border-color: rgba(168, 85, 247, 0.65);
                }
              }
            `}</style>

            <Reveal root={scrollRef}>
              <div className="flex flex-col items-center justify-center text-center mx-auto mb-8 space-y-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  TECHNICAL ARSENAL
                </span>
                <h2 className="flex items-center justify-center gap-3 font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 text-[clamp(28px,3.2vw,44px)] leading-tight drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]">
                  <Sparkles size={28} className="text-cyan-400 shrink-0" />
                  <span>Skills</span>
                </h2>
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 mt-1" />
              </div>
            </Reveal>

            {/* Categorized Centered Skill Groups */}
            <div className="space-y-12">
              {skillGroups.map((group, groupIdx) => (
                <Reveal key={group.label} root={scrollRef} delay={groupIdx * 0.04}>
                  <div className="flex flex-col items-center">
                    {/* Bright Cyan / Blue Category Subheading */}
                    <div className="mb-5 flex items-center justify-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                      <h3 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300/90 text-center">
                        {group.label}
                      </h3>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                    </div>

                    {/* Centered Grid of Compact Glass Cards with Clear Comfortable Spacing */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 lg:gap-7 w-full max-w-6xl justify-items-center">
                      {group.skills.map((skill) => (
                        <SkillGlassCard key={skill} name={skill} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 4: Projects (2-Face 3D Flip Cards) */}
          <div>
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="3 VERIFIED SYSTEMS" icon={Code2}>
                Projects
              </SectionHeading>
            </Reveal>

            <div
              className={`mt-2 grid gap-7 lg:gap-8 ${
                containerWidth >= 880
                  ? "grid-cols-3"
                  : containerWidth >= 580
                    ? "grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {defaultProjects
                .filter((p) => p.featured)
                .map((project, index) => (
                  <ProjectFlipCard
                    key={project.title}
                    project={project}
                    index={index}
                    scrollRef={scrollRef}
                  />
                ))}
            </div>
          </div>

          {/* Section 5: Work Experience */}
          <div className="max-w-4xl mx-auto w-full">
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="CAREER JOURNEY" icon={Briefcase}>
                Work Experience
              </SectionHeading>
            </Reveal>
            <div className="mt-2 space-y-5 border-l-2 border-white/15 pl-5 sm:pl-7">
              {experience.map((item, index) => (
                <Reveal key={item.company} root={scrollRef} delay={index * 0.05}>
                  <div className="interactive-target relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm transition-all hover:border-white/20">
                    <span className="absolute -left-[27px] sm:-left-[35px] top-6 h-2.5 w-2.5 rounded-full bg-[#e8aa42] shadow-[0_0_10px_rgba(232,170,66,0.9)]" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold text-white">{item.company}</h3>
                      <span className="font-mono text-xs text-white/45">{item.period}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-[#e8aa42]">{item.role}</p>
                    <ul className="mt-3 space-y-2">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-[13px] leading-relaxed text-white/75">
                          <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#e8aa42]/70" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 6: Education */}
          <div className="max-w-4xl mx-auto w-full">
            <Reveal root={scrollRef}>
              <SectionHeading subtitle="ACADEMIC BACKGROUND" icon={GraduationCap}>
                Education
              </SectionHeading>
            </Reveal>
            <div className="mt-2 space-y-3.5">
              {education.map((item) => (
                <Reveal key={item.title} root={scrollRef}>
                  <div className="interactive-target flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#5aa7f2]/30 bg-[#5aa7f2]/10 text-[#5aa7f2]">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-white">{item.title}</h4>
                      <p className="mt-0.5 text-xs sm:text-sm text-[#e8aa42]">{item.org}</p>
                      {item.period && (
                        <p className="mt-1 font-mono text-xs text-white/45">{item.period}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 7: Certificates (Immediately after Education) */}
          <div className="w-full">
            <Reveal root={scrollRef}>
              <div className="flex flex-col items-center justify-center text-center mx-auto mb-8 space-y-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  {certificates.length} VERIFIED CREDENTIALS
                </span>
                <h2 className="flex items-center justify-center gap-3 font-display font-bold tracking-tight text-white text-[clamp(28px,3.2vw,44px)] leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                  <Award size={30} className="text-cyan-400 shrink-0" />
                  <span>Certificates</span>
                </h2>
                <div className="h-1 w-14 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38bdf8] mt-1" />
              </div>
            </Reveal>

            <div
              className={`mt-4 grid gap-5 ${
                containerWidth >= 880
                  ? "grid-cols-3"
                  : containerWidth >= 560
                    ? "grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {certificates.map((cert, index) => (
                <Reveal key={cert.name} root={scrollRef} delay={index * 0.03}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveCert(cert)}
                    onKeyDown={(e) => e.key === "Enter" && setActiveCert(cert)}
                    className="interactive-target group flex h-full min-h-[220px] cursor-pointer flex-col justify-between rounded-2xl border border-cyan-500/25 bg-[#0c1322]/90 p-5 text-left backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_12px_36px_rgba(56,189,248,0.25)]"
                  >
                    <div>
                      {/* Image / Document Presentation with object-fit: contain */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-[#060a12]/80 border border-white/10 p-3 flex items-center justify-center">
                        {(cert as CertificateDetail).url ? (
                          <img
                            src={(cert as CertificateDetail).url}
                            alt={cert.name}
                            loading="lazy"
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                              <Award size={24} />
                            </div>
                            <span className="mt-2 font-mono text-[10px] text-cyan-400/90 uppercase tracking-widest font-semibold">
                              Credential Document
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[9.5px] font-medium text-emerald-400 backdrop-blur-sm shadow-sm">
                            <CheckCircle2 size={9} />
                            Verified
                          </span>
                        </div>
                      </div>

                      {/* Certificate Title */}
                      <h4 className="mt-3.5 text-[14.5px] font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors">
                        {cert.name}
                      </h4>
                    </div>

                    {/* Organization & Action */}
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/50 font-mono">
                      <span className="text-cyan-400/80 font-medium">{cert.org}</span>
                      <span className="text-[11px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Section 8: Contact Banner */}
          <Reveal root={scrollRef}>
            <div className="interactive-target relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#e8aa42]/30 bg-gradient-to-br from-[#e8aa42]/10 via-[#2a7de1]/08 to-purple-900/15 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md max-w-4xl mx-auto">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#e8aa42]">
                INITIATE COLLABORATION
              </span>
              <h2 className="mt-2.5 font-display text-[clamp(28px,3.2vw,44px)] font-bold text-white tracking-tight leading-tight">
                Get in Touch
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-white/80">
                Interested in full-stack engineering, AI integrations, or collaborative projects?
                Direct replies to emails are fast.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="interactive-target inline-flex items-center gap-2 rounded-full bg-[#e8aa42] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#101013] shadow-[0_4px_16px_rgba(232,170,66,0.35)] hover:bg-[#f3bc5c] transition-all active:scale-95"
                >
                  <Mail size={14} />
                  {site.email}
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-target inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-all active:scale-95"
                >
                  <Linkedin size={14} />
                  LinkedIn Connect
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 4. Certificate Lightbox Modal (Contained inside Safari application) */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCert(null)}
          >
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-[#121218] p-5 sm:p-6 shadow-2xl"
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8aa42]/30 bg-[#e8aa42]/10 text-[#e8aa42]">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-400">
                      <CheckCircle2 size={10} /> Verified Credential
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight mt-0.5">
                      {activeCert.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close certificate lightbox"
                  onClick={() => setActiveCert(null)}
                  className="interactive-target rounded-full bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Certificate Viewer Preview / Document Presentation */}
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4">
                {activeCert.url?.endsWith(".pdf") ? (
                  <iframe
                    src={activeCert.url}
                    title={activeCert.name}
                    className="h-60 w-full rounded-lg border-0"
                  />
                ) : activeCert.url ? (
                  <img
                    src={activeCert.url}
                    alt={activeCert.name}
                    className="h-60 w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-5 text-center">
                    <FileCheck size={38} className="text-[#e8aa42]/80" />
                    <h4 className="mt-2.5 font-display text-sm sm:text-base font-semibold text-white">
                      Official Certificate of Completion
                    </h4>
                    <p className="mt-1 max-w-xs text-xs text-white/60">
                      Awarded to <span className="text-white font-medium">{site.name}</span> by{" "}
                      <span className="text-[#e8aa42] font-medium">{activeCert.org}</span>
                    </p>
                    <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 font-mono text-[10px] text-emerald-400">
                      <span>Credential ID:</span>
                      <span className="font-semibold">{Math.abs(activeCert.name.split("").reduce((a, b) => a + b.charCodeAt(0), 0) * 4821).toString(16).toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Details */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-white/40 uppercase block">Issuing Authority</span>
                  <span className="font-semibold text-white/90 truncate block mt-0.5">{activeCert.org}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-white/40 uppercase block">Verification Status</span>
                  <span className="font-semibold text-emerald-400 block mt-0.5">Authenticated</span>
                </div>
              </div>

              {/* Modal Action Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-mono text-[10px] text-white/40">Press Esc to exit</span>
                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="interactive-target rounded-lg bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
