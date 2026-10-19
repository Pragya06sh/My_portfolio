import { useRef, useEffect, useState } from "react";

interface BackgroundVideoProps {
  scrollProgress?: number;
}

export default function BackgroundVideo({
  scrollProgress = 0,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  // Periodic subtle RGB glitch flicker (150ms every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      const timer = setTimeout(() => setGlitchActive(false), 150);
      return () => clearTimeout(timer);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Compute scroll-based darkening and blur
  // At hero (scroll = 0): dark overlay is ~0.55, blur is 0px
  // As user scrolls down: dark overlay reaches ~0.85, blur reaches 12px
  const darkOpacity = Math.min(0.58 + scrollProgress * 0.35, 0.92);
  const blurAmount = Math.min(scrollProgress * 15, 14);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* ── Background Media: Video or Poster Fallback ── */}
      <div
        className="w-full h-full relative"
        style={{
          filter: `blur(${blurAmount}px) ${
            glitchActive ? "hue-rotate(90deg) contrast(1.4)" : ""
          }`,
          transform: glitchActive ? "translate(2px, -1px)" : "none",
          transition: "filter 0.4s ease, transform 0.1s ease",
        }}
      >
        {!videoFailed ? (
          <video
            ref={videoRef}
            src="/assets/bg.mp4"
            poster="/assets/pragya.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover"
            style={{
              filter: "grayscale(1) contrast(1.15) brightness(0.7)",
            }}
          />
        ) : (
          <img
            src="/assets/pragya.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{
              filter: "grayscale(1) contrast(1.15) brightness(0.7)",
            }}
          />
        )}
      </div>

      {/* ── 1. Purple Duotone Gradient (mix-blend-mode: multiply) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #2e1065 0%, #8b5cf6 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── 2. Dark Overlay for Contrast & Readability ── */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: "#07040f",
          opacity: darkOpacity,
        }}
      />

      {/* ── 3. Subtle Digital Grid Lines ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.7,
        }}
      />

      {/* ── 4. Horizontal Scanlines ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 92, 246, 0.035) 2px,
            rgba(139, 92, 246, 0.035) 4px
          )`,
        }}
      />

      {/* ── 5. Moving Scan Beam (Sweeps every 6 seconds) ── */}
      <div className="scan-beam" />

      {/* ── 6. Face-Tracking Style HUD Brackets & Mono Labels ── */}
      <div
        className="absolute hidden md:block"
        style={{
          top: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "280px",
          height: "320px",
          opacity: Math.max(0.8 - scrollProgress * 2.5, 0),
          transition: "opacity 0.4s ease",
        }}
      >
        {/* HUD Corner Brackets */}
        <div
          className="hud-bracket tl"
          style={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
        />
        <div
          className="hud-bracket tr"
          style={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
        />
        <div
          className="hud-bracket bl"
          style={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
        />
        <div
          className="hud-bracket br"
          style={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
        />

        {/* HUD Micro Labels */}
        <div
          className="absolute -top-6 left-0 text-[10px] tracking-wider"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-neon)",
            textShadow: "0 0 8px rgba(168, 85, 247, 0.6)",
          }}
        >
          [TARGET_RECOG: PRAGYA_SHREE]
        </div>

        <div
          className="absolute -bottom-6 left-0 text-[9px] tracking-wider"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-lavender)",
            opacity: 0.8,
          }}
        >
          SIGNAL: ANALYSING · TRUST: 0.982
        </div>

        <div
          className="absolute -bottom-6 right-0 text-[9px] tracking-wider"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          LATENCY: 1.2MS
        </div>
      </div>

      {/* ── 7. Film Grain Noise Texture (4% opacity) ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          opacity: 0.8,
        }}
      />
    </div>
  );
}
