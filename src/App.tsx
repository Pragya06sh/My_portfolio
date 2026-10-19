import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Loader from "./components/Loader";
import Nav from "./components/Nav";
import BackgroundVideo from "./components/BackgroundVideo";
import Scene from "./three/Scene";
import Hero from "./components/Hero";
import Waryex from "./components/Waryex";
import About from "./components/About";
import Projects from "./components/Projects";
import Journey from "./components/Journey";
import Achievements from "./components/Achievements";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import CustomCursor from "./components/Cursor";
import Terminal from "./components/Terminal";
import ErrorBoundary from "./components/ErrorBoundary";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);

  // ── Lenis Smooth Scrolling & Scroll Progress ──
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", (e: { progress: number }) => {
      setScrollProgress(e.progress);
      ScrollTrigger.update();
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // ── Hotkeys: ~ for Terminal, Konami Code Easter Egg ──
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal on `~` or backtick
      if (e.key === "~" || e.key === "`") {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }

      // Check Konami Code
      if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          setMatrixActive(true);
          setTimeout(() => setMatrixActive(false), 5000);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#07040f] text-white selection:bg-purple-500 selection:text-white">
      {/* ── Loader Screen ── */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* ── Top Scroll Progress Bar ── */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* ── Custom Cursor (hidden on touch devices) ── */}
      <CustomCursor />

      {/* ── Background Video & Tech Overlays ── */}
      <BackgroundVideo scrollProgress={scrollProgress} />

      {/* ── 3D WebGL Canvas Scene (Chip, Particles, Postprocessing) ── */}
      <ErrorBoundary fallback={null}>
        <Scene scrollProgress={scrollProgress} />
      </ErrorBoundary>

      {/* ── Main Layout & Sections ── */}
      <div
        className="relative z-10 transition-opacity duration-1000"
        style={{
          opacity: loaded ? 1 : 0,
        }}
      >
        <Nav />

        <main>
          <Hero />
          <Waryex />
          <About />
          <Projects />
          <Journey />
          <Achievements />
          <Skills />
          <Contact />
        </main>
      </div>

      {/* ── Terminal Overlay (~ toggle) ── */}
      <Terminal
        visible={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* ── Konami Easter Egg: Fullscreen Purple Matrix Rain ── */}
      {matrixActive && <PurpleMatrixRain />}
    </div>
  );
}

// ── Fullscreen Purple Matrix Digital Rain Easter Egg ──
function PurpleMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "WARYEX01CYBERSECURITYAI01011001PROTECT";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let raf: number;

    const draw = () => {
      ctx.fillStyle = "rgba(7, 4, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#c4b5fd";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Front character is bright white, trails in purple
        if (Math.random() > 0.85) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = "#a855f7";
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        background: "rgba(7, 4, 15, 0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border border-purple-500/50"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--color-neon)",
          background: "rgba(13, 8, 32, 0.9)",
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
        }}
      >
        // PROTOCOL OVERRIDE: MATRIX STREAM ACTIVE [5.0S]
      </div>
    </div>
  );
}
