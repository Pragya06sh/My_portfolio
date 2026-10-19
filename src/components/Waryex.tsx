import { useRef, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { waryexContent } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";
import { Canvas } from "@react-three/fiber";
import SignalNetwork from "../three/SignalNetwork";
import ErrorBoundary from "./ErrorBoundary";

export default function Waryex() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, waryexContent.title, { duration: 1200 });
  useInView(sectionRef, { threshold: 0.05 }, scramble);

  return (
    <section id="waryex" ref={sectionRef} className="relative py-32 md:py-40">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="mono-label mb-4">{"// 02 — WARYEX"}</div>
          <h2
            ref={titleRef}
            className="neon-text-strong mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {waryexContent.title}
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(14px, 1.5vw, 18px)",
              color: "var(--color-lavender)",
              lineHeight: 1.6,
            }}
          >
            {waryexContent.tagline}
          </p>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto mb-20"
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 1.8,
            }}
          >
            {waryexContent.description}
          </p>
        </motion.div>

        {/* 3D Neural Signal Network Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mb-20 rounded-2xl overflow-hidden glass-card p-3 relative"
          style={{ height: "340px" }}
        >
          <div className="absolute top-4 left-6 z-10 pointer-events-none">
            <div className="mono-label" style={{ fontSize: "11px" }}>
              WARYEX CORE // MULTI-SIGNAL CORRELATION SIMULATOR
            </div>
            <div className="text-[11px] text-white/50 font-mono mt-1">
              Cross-referencing telemetry, timing patterns & auth anomalies in real-time
            </div>
          </div>

          <ErrorBoundary fallback={<div className="h-full flex items-center justify-center font-mono text-xs text-purple-400">SIGNAL SIMULATION RUNNING</div>}>
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[4, 5, 3]} intensity={1.5} color="#ffffff" />
              <directionalLight position={[-4, -3, -2]} intensity={2} color="#8b5cf6" />
              <SignalNetwork nodeCount={50} highlightAnomaly={true} />
            </Canvas>
          </ErrorBoundary>

          <div className="absolute bottom-4 right-6 z-10 pointer-events-none flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"
              style={{ boxShadow: "0 0 10px #ffffff, 0 0 20px #a855f7" }}
            />
            <span
              className="text-[11px] font-mono text-white font-medium tracking-wider"
              style={{ textShadow: "0 0 8px rgba(255,255,255,0.6)" }}
            >
              ABNORMAL RELATIONSHIP DETECTED [PULSING WHITE]
            </span>
          </div>
        </motion.div>

        {/* Scroll Story Steps */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="mono-label mb-8 text-center">{"// SIGNAL ANALYSIS PIPELINE"}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waryexContent.scrollSteps.map((step, i) => (
              <ScrollStep key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Signal Correlation Lab */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="mono-label mb-4 text-center">
            {"// SIGNAL CORRELATION LAB — Conceptual visualization"}
          </div>
          <SignalCorrelationLab />
        </motion.div>

        {/* Signal Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {waryexContent.signalTypes.map((signal, i) => (
            <motion.div
              key={signal.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card p-6 text-center"
            >
              <SignalIcon type={signal.icon} />
              <h3
                className="mt-4 mb-2"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--color-neon)",
                }}
              >
                {signal.name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.5,
                }}
              >
                {signal.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Vision Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="mono-label mb-8 text-center">{"// VISION"}</div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {waryexContent.visionTimeline.map((item, i) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background:
                        item.status === "active"
                          ? "var(--color-purple)"
                          : item.status === "in-progress"
                          ? "rgba(139,92,246,0.3)"
                          : "rgba(139,92,246,0.1)",
                      border: "1px solid var(--color-purple)",
                      fontFamily: "var(--font-mono)",
                      color: "white",
                      boxShadow:
                        item.status === "active"
                          ? "0 0 15px rgba(139,92,246,0.4)"
                          : "none",
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="mt-2 text-center"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color:
                        item.status === "active"
                          ? "var(--color-neon)"
                          : "rgba(255,255,255,0.4)",
                      maxWidth: "100px",
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                {i < waryexContent.visionTimeline.length - 1 && (
                  <div
                    className="hidden md:block"
                    style={{
                      width: "60px",
                      height: "1px",
                      background:
                        item.status === "active"
                          ? "var(--color-purple)"
                          : "rgba(139,92,246,0.2)",
                      marginTop: "-20px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <p
            className="text-center mt-6"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "rgba(139,92,246,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {waryexContent.stageLabel}
          </p>
        </motion.div>

        {/* Founder tag + CTA */}
        <div className="text-center">
          <p
            className="mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--color-lavender)",
            }}
          >
            {waryexContent.founderTag}
          </p>
          <a href="#contact" className="btn-glow">
            {waryexContent.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Scroll Step Card ─────────────────────────── */
function ScrollStep({
  step,
  index,
}: {
  step: { id: string; title: string; description: string };
  index: number;
}) {
  const colors = [
    "rgba(139, 92, 246, 0.6)",
    "rgba(168, 85, 247, 0.6)",
    "rgba(255, 255, 255, 0.8)",
    "rgba(139, 92, 246, 0.8)",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Step number */}
      <div
        className="absolute top-4 right-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "48px",
          fontWeight: 700,
          color: "rgba(139,92,246,0.08)",
          lineHeight: 1,
        }}
      >
        0{index + 1}
      </div>

      {/* Animated line */}
      <div className="mb-4" style={{ height: "3px", width: "60px", position: "relative", overflow: "hidden" }}>
        <motion.div
          animate={{
            x: ["0%", "100%", "0%"],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            height: "100%",
            width: "100%",
            background: `linear-gradient(90deg, transparent, ${colors[index]}, transparent)`,
          }}
        />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "20px",
          fontWeight: 600,
          color: index === 2 ? "white" : "var(--color-neon)",
          marginBottom: "8px",
        }}
      >
        {step.title}
        {step.id === "anomaly" && (
          <span
            className="ml-2 inline-block"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              background: "rgba(255,255,255,0.15)",
              padding: "2px 6px",
              borderRadius: "3px",
              verticalAlign: "middle",
              color: "white",
            }}
          >
            ALERT
          </span>
        )}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.6,
        }}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

/* ─── Signal Correlation Lab (Interactive Canvas) ── */
function SignalCorrelationLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; label: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const labels = [
      "Device Telemetry",
      "System Behavior",
      "Timing Patterns",
      "Auth Activity",
      "Network Flow",
      "Process Tree",
      "Memory Usage",
      "DNS Queries",
    ];

    const w = canvas.width / 2;
    const h = canvas.height / 2;

    nodesRef.current = labels.map((label) => ({
      x: Math.random() * (w - 40) + 20,
      y: Math.random() * (h - 40) + 20,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      label,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let raf: number;
    const animate = () => {
      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, w, h);

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 20 || node.x > w - 20) node.vx *= -1;
        if (node.y < 20 || node.y > h - 20) node.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const distToMouse = Math.sqrt((mx - midX) ** 2 + (my - midY) ** 2);

            const isHighlighted = distToMouse < 80;
            ctx.strokeStyle = isHighlighted
              ? "rgba(255, 255, 255, 0.6)"
              : `rgba(139, 92, 246, ${0.15 * (1 - dist / 200)})`;
            ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            if (isHighlighted) {
              // Pulse on the line
              const pulsePos = (Date.now() % 2000) / 2000;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * pulsePos;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * pulsePos;
              ctx.fillStyle = "rgba(255,255,255,0.8)";
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < 50;

        // Glow
        if (isHovered) {
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0, node.x, node.y, 30
          );
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.3)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node dot
        ctx.fillStyle = isHovered ? "#fff" : "rgba(139, 92, 246, 0.8)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (isHovered) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = "rgba(196, 181, 253, 0.9)";
          ctx.fillText(node.label, node.x + 10, node.y - 10);
        }
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="glass-card overflow-hidden max-w-4xl mx-auto">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "350px",
          display: "block",
        }}
      />
    </div>
  );
}

/* ─── Signal Icon ──────────────────────────────── */
function SignalIcon({ type }: { type: string }) {
  const iconStyle = {
    width: "40px",
    height: "40px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
  };

  const svgProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#a855f7",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<string, ReactNode> = {
    cpu: (
      <svg {...svgProps}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
      </svg>
    ),
    activity: (
      <svg {...svgProps}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    clock: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    shield: (
      <svg {...svgProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  };

  return <div style={iconStyle}>{icons[type] || icons.shield}</div>;
}
