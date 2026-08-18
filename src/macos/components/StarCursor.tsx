import { useEffect, useRef, useState } from "react";
import { useSettings } from "../lib/settings";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  decay: number;
  isSparkle: boolean;
}

/** Draws a curved 4-point star path on a 2D canvas context. */
function drawCurvedStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx, cy, cx + size, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + size);
  ctx.quadraticCurveTo(cx, cy, cx - size, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - size);
  ctx.closePath();
}

export default function StarCursor() {
  const settings = useSettings();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // References to keep animation loop fast & avoid re-renders
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const lastTrailPos = useRef({ x: 0, y: 0 });
  const lastTrailTime = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const isVisible = useRef(false);
  const hasMoved = useRef(false);
  const isHoveringRef = useRef(false);

  // Determine actual theme mode
  const isLight =
    settings.appearance === "light" ||
    (settings.appearance === "system" &&
      window.matchMedia("(prefers-color-scheme: light)").matches);

  // 1. Detect if touch device or screen size is below 767px (mobile)
  useEffect(() => {
    const checkEnabled = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isMobileScreen = window.innerWidth < 767;
      setIsEnabled(!isTouch && !isMobileScreen);
    };

    checkEnabled();
    window.addEventListener("resize", checkEnabled);
    return () => window.removeEventListener("resize", checkEnabled);
  }, []);

  // 2. Toggle the custom-cursor-active body class dynamically
  useEffect(() => {
    if (isEnabled) {
      document.body.classList.add("custom-cursor-active");
      return () => {
        document.body.classList.remove("custom-cursor-active");
      };
    }
  }, [isEnabled]);

  // 3. Handle window resizing for Canvas dimensions
  useEffect(() => {
    if (!isEnabled) return;

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isEnabled]);

  // 4. Delegated Hover detection on interactive elements
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], .interactive, .dock-item, .desktop-icon, .window-control, [data-hover]'
      );

      if (interactive) {
        setIsHovering(true);
        isHoveringRef.current = true;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], .interactive, .dock-item, .desktop-icon, .window-control, [data-hover]'
      );

      if (interactive) {
        setIsHovering(false);
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isEnabled]);

  // 5. Mouse movement, click, entry/exit, and the main animation loop
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseEnter = () => {
      isVisible.current = true;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      isVisible.current = true;
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!hasMoved.current) {
        hasMoved.current = true;
        cursorPos.current.x = e.clientX;
        cursorPos.current.y = e.clientY;
        lastTrailPos.current.x = e.clientX;
        lastTrailPos.current.y = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isVisible.current) return;

      // On click, generate a clean cinematic burst of sparkles expanding outward
      const numParticles = 8 + Math.floor(Math.random() * 4);
      for (let i = 0; i < numParticles; i++) {
        const angle = (i / numParticles) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 1.5 + 1.2;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 2.5, // 2.5px to 5.5px
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.02, // lasts ~25-50 frames
          isSparkle: true,
        });
      }
    };

    const loop = () => {
      // (a) Easing / Lag calculation
      if (hasMoved.current) {
        const dx = mousePos.current.x - cursorPos.current.x;
        const dy = mousePos.current.y - cursorPos.current.y;
        const easing = isHoveringRef.current ? 0.09 : 0.15; // slightly stickier on hover
        cursorPos.current.x += dx * easing;
        cursorPos.current.y += dy * easing;
      }

      // (b) Update the DOM node style
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
        cursorRef.current.style.opacity = isVisible.current ? "1" : "0";
      }

      // (c) Canvas updates
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;

          if (p.isSparkle) {
            // Glow color for click burst sparkles
            ctx.fillStyle = isLight ? "#e8aa42" : "#ffffff";
            ctx.shadowColor = "#e8aa42";
            ctx.shadowBlur = p.size * 1.2;
          } else {
            // Glow color for trail sparkles
            ctx.fillStyle = isLight ? "#e8aa42" : "#ffffff";
            ctx.shadowColor = isLight ? "rgba(232, 170, 66, 0.4)" : "rgba(255, 255, 255, 0.8)";
            ctx.shadowBlur = p.size * 0.8;
          }

          drawCurvedStar(ctx, 0, 0, p.size);
          ctx.fill();
          ctx.restore();
        }
      }

      // (d) Add sparkling trail star on mouse movement
      if (isVisible.current && hasMoved.current) {
        const dist = Math.hypot(
          mousePos.current.x - lastTrailPos.current.x,
          mousePos.current.y - lastTrailPos.current.y
        );
        const now = performance.now();

        // Throttle trail particle creation so it is elegant and light
        if (dist > 8 && now - lastTrailTime.current > 40) {
          particlesRef.current.push({
            x: cursorPos.current.x + (Math.random() - 0.5) * 4,
            y: cursorPos.current.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3 + 0.05, // slight downward drift
            size: Math.random() * 2 + 1.8, // 1.8px to 3.8px
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            alpha: 0.75,
            decay: Math.random() * 0.015 + 0.015, // fades out in ~0.5s - 1s
            isSparkle: false,
          });

          lastTrailPos.current = { x: mousePos.current.x, y: mousePos.current.y };
          lastTrailTime.current = now;
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isEnabled, isLight]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Viewport canvas for drawing trail and click sparkles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ mixBlendMode: isLight ? "normal" : "screen" }}
      />

      {/* Main cursor element */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Glow Aura */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-300 ease-out"
          style={{
            background: isLight
              ? "radial-gradient(circle, rgba(232, 170, 66, 0.22) 0%, rgba(232, 170, 66, 0) 70%)"
              : "radial-gradient(circle, rgba(232, 170, 66, 0.32) 0%, rgba(232, 170, 66, 0) 70%)",
            transform: isHovering ? "scale(1.7)" : "scale(1.0)",
            opacity: isHovering ? 1.0 : 0.65,
            filter: isHovering ? "blur(1px)" : "none",
          }}
        />

        {/* 4-point Star SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="transition-all duration-300 ease-out"
          style={{
            transform: isHovering ? "scale(1.35) rotate(45deg)" : "scale(1.0) rotate(0deg)",
            filter: isHovering
              ? `drop-shadow(0 0 4px ${isLight ? "rgba(232, 170, 66, 0.55)" : "rgba(232, 170, 66, 0.85)"})`
              : `drop-shadow(0 0 2px ${isLight ? "rgba(232, 170, 66, 0.25)" : "rgba(232, 170, 66, 0.55)"})`,
          }}
        >
          <path
            d="M12 3 Q12 12, 3 12 Q12 12, 12 21 Q12 12, 21 12 Q12 12, 12 3"
            fill={isLight ? "#e8aa42" : "#ffffff"}
            stroke={isLight ? "#b77c1d" : "#e8aa42"}
            strokeWidth="0.75"
          />
        </svg>
      </div>
    </>
  );
}
