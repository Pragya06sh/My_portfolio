import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, githubProfile, type Project } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";
import { Canvas } from "@react-three/fiber";
import BlockChain from "../three/BlockChain";
import ErrorBoundary from "./ErrorBoundary";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, "PROJECTS", { duration: 1000 });
  useInView(sectionRef, { threshold: 0.05 }, scramble);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" ref={sectionRef} className="relative py-32">
      <div className="section-container">
        <div className="mono-label mb-4 text-center">{"// 04 — PROJECTS"}</div>
        <h2
          ref={titleRef}
          className="text-center neon-text mb-16"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
          }}
        >
          PROJECTS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* GitHub link */}
        <div className="text-center mt-12">
          <a
            href={githubProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
            style={{ padding: "12px 28px", fontSize: "13px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View all on GitHub
          </a>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setTilt({
      x: ((x / rect.width) - 0.5) * 10,
      y: ((y / rect.height) - 0.5) * -10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={`glass-card p-6 relative overflow-hidden cursor-pointer group ${
        project.featured ? "md:col-span-2 lg:col-span-2" : ""
      }`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: "transform 0.2s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glow that follows cursor */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          width: "200px",
          height: "200px",
          left: mousePos.x - 100,
          top: mousePos.y - 100,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Featured badge */}
      {project.featured && (
        <div
          className="absolute top-4 right-4 px-2 py-1 rounded"
          style={{
            background: "rgba(139, 92, 246, 0.2)",
            border: "1px solid var(--color-purple)",
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            color: "var(--color-neon)",
            letterSpacing: "0.1em",
          }}
        >
          FEATURED
        </div>
      )}

      {/* Animation preview */}
      {project.animation === "terminal" && <TerminalAnimation />}
      {project.animation === "detection" && <DetectionAnimation />}
      {project.animation === "blockchain" && <BlockchainAnimation />}


      <h3
        className="relative z-10 mb-2"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: project.featured ? "24px" : "18px",
          fontWeight: 600,
          color: "white",
        }}
      >
        {project.title}
      </h3>
      <p
        className="relative z-10 mb-4"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.6,
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded text-xs"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              color: "var(--color-lavender)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="relative z-10 flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{
              color: "var(--color-lavender)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Terminal Animation inside ReconScanner card ── */
function TerminalAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const terminalLines = useMemo(
    () => [
      "$ python reconscanner.py --target 192.168.1.0/24",
      "[*] Starting Nmap scan...",
      "[*] Host: 192.168.1.1 (router.local)",
      "[+] Port 22/tcp open SSH-2.0-OpenSSH_8.9",
      "[+] Port 80/tcp open nginx/1.22.1",
      "[*] Fingerprinting services...",
      "[!] CVE-2023-38408 found (CVSS: 9.8)",
      "[*] MITRE ATT&CK: T1190 - Exploit Public-Facing Application",
      "[*] Risk Score: 78/100",
      "[+] Report generated: scan_report.html",
    ],
    []
  );

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < terminalLines.length) {
        const next = terminalLines[i];
        if (next) {
          setLines((prev) => [...prev.slice(-4), next]);
        }
        i++;
      } else {
        i = 0;
        setLines([terminalLines[0]]);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [terminalLines]);

  return (
    <div
      className="mb-4 rounded-lg p-3 overflow-hidden"
      style={{
        background: "rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(139, 92, 246, 0.15)",
        maxHeight: "120px",
      }}
    >
      {lines.filter(Boolean).map((line, idx) => {
        const isAlert = Boolean(line && line.startsWith("[!"));
        const isSuccess = Boolean(line && line.startsWith("[+]"));
        return (
          <div
            key={`${line}-${idx}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: isAlert
                ? "#ff6b6b"
                : isSuccess
                ? "var(--color-neon)"
                : "var(--color-lavender)",
              opacity: 0.85,
              lineHeight: 1.6,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Project Modal ────────────────────────────── */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(7, 4, 15, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="glass-card p-8 md:p-12 max-w-2xl w-full relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          [ESC]
        </button>

        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--color-neon)",
          }}
        >
          {project.title}
        </h3>

        <p
          className="mb-6"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.8,
          }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full"
              style={{
                background: "rgba(139, 92, 246, 0.12)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                color: "var(--color-lavender)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ padding: "10px 24px", fontSize: "13px" }}
            >
              View on GitHub
            </a>
          )}
          {project.featured && (
            <a href="#waryex" onClick={onClose} className="btn-glow" style={{ padding: "10px 24px", fontSize: "13px" }}>
              Learn More
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── YOLOv8 Animated Bounding-box Detection Canvas ── */
function DetectionAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "rgba(7, 4, 15, 0.95)";
      ctx.fillRect(0, 0, w, h);

      // Radar scan grid
      ctx.strokeStyle = "rgba(139, 92, 246, 0.12)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Moving bounding box
      const bx = 45 + Math.sin(frame * 0.03) * 25;
      const by = 20 + Math.cos(frame * 0.02) * 12;
      const bw = 90;
      const bh = 55;

      // Draw bounding box
      ctx.strokeStyle = "rgba(168, 85, 247, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, bw, bh);

      // Corner brackets
      const cl = 6;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      // TL
      ctx.beginPath(); ctx.moveTo(bx, by + cl); ctx.lineTo(bx, by); ctx.lineTo(bx + cl, by); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(bx + bw - cl, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cl); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(bx, by + bh - cl); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cl, by + bh); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(bx + bw - cl, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cl); ctx.stroke();

      // Detection label tag
      ctx.fillStyle = "rgba(139, 92, 246, 0.9)";
      ctx.fillRect(bx, by - 16, bw, 16);
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("OBJECT: 96.4%", bx + 4, by - 4);

      // Crosshair center
      const cx = bx + bw / 2;
      const cy = by + bh / 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5);
      ctx.stroke();

      // Cam HUD label
      ctx.fillStyle = "rgba(196, 181, 253, 0.7)";
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("CAM_02 [LIVE] · YOLOv8 REALTIME", 8, h - 8);

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="mb-4 rounded-lg overflow-hidden relative"
      style={{
        border: "1px solid rgba(139, 92, 246, 0.2)",
        height: "110px",
      }}
    >
      <canvas
        ref={canvasRef}
        width={240}
        height={110}
        className="w-full h-full block"
      />
    </div>
  );
}

/* ─── Blockchain 3D Preview Canvas ─────────────── */
function BlockchainAnimation() {
  return (
    <div
      className="mb-4 rounded-lg overflow-hidden relative"
      style={{
        border: "1px solid rgba(139, 92, 246, 0.2)",
        height: "110px",
        background: "rgba(7, 4, 15, 0.6)",
      }}
    >
      <ErrorBoundary fallback={<div className="h-full flex items-center justify-center font-mono text-xs text-purple-400">BLOCKCHAIN SECURE ENGINE</div>}>
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 2]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-3, -2, -1]} intensity={1.8} color="#8b5cf6" />
          <BlockChain count={4} />
        </Canvas>
      </ErrorBoundary>
      <div
        className="absolute bottom-2 left-2 text-[8px] pointer-events-none"
        style={{
          fontFamily: "var(--font-mono)",
          color: "rgba(196, 181, 253, 0.6)",
          letterSpacing: "0.08em",
        }}
      >
        BLOCKCHAIN INTEGRITY ENGINE
      </div>
    </div>
  );
}
