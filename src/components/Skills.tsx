import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { skillCategories } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, "SKILLS", { duration: 1000 });
  useInView(sectionRef, { threshold: 0.1 }, scramble);

  const allSkills = useMemo(
    () => skillCategories.flatMap((c) => c.skills),
    []
  );

  return (
    <section id="skills" ref={sectionRef} className="relative py-32">
      <div className="section-container">
        <div className="mono-label mb-4 text-center">{"// 07 — SKILLS"}</div>
        <h2
          ref={titleRef}
          className="text-center neon-text mb-16"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
          }}
        >
          SKILLS
        </h2>

        {/* Interactive skill cloud */}
        <div className="max-w-4xl mx-auto mb-16">
          <SkillCloud skills={allSkills} />
        </div>

        {/* Grouped list for accessibility & mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-6"
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--color-neon)",
                  letterSpacing: "0.05em",
                }}
              >
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full transition-all duration-200 hover:border-purple-400/50"
                    style={{
                      background: "rgba(139, 92, 246, 0.08)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--color-lavender)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Interactive Skill Cloud ──────────────────── */
function SkillCloud({ skills }: { skills: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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

    const w = () => canvas.width / 2;
    const h = () => canvas.height / 2;

    // Position skills in orbiting rings
    const points = skills.map((skill, i) => {
      const ring = Math.floor(i / 8);
      const angle = (i / 8) * Math.PI * 2 + ring * 0.5;
      const radius = 80 + ring * 60;
      return {
        label: skill,
        baseAngle: angle,
        radius,
        speed: 0.0003 + Math.random() * 0.0003,
        x: 0,
        y: 0,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);

    let raf: number;
    const animate = () => {
      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      const now = Date.now();
      let closestSkill: string | null = null;
      let closestDist = 40;

      // Draw orbit rings
      const rings = Math.ceil(skills.length / 8);
      for (let r = 0; r < rings; r++) {
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 - r * 0.01})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 80 + r * 60, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update and draw skills
      points.forEach((point) => {
        const angle = point.baseAngle + now * point.speed;
        point.x = cx + Math.cos(angle) * point.radius;
        point.y = cy + Math.sin(angle) * point.radius * 0.6; // Slight perspective

        const dx = mouseRef.current.x - point.x;
        const dy = mouseRef.current.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < closestDist) {
          closestDist = dist;
          closestSkill = point.label;
        }

        const isHovered = dist < 40;

        // Draw dot
        ctx.fillStyle = isHovered
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(139, 92, 246, 0.6)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, isHovered ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw label
        ctx.font = isHovered
          ? 'bold 12px "Space Grotesk", sans-serif'
          : '11px "JetBrains Mono", monospace';
        ctx.fillStyle = isHovered
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(196, 181, 253, 0.5)";
        ctx.textAlign = "center";
        ctx.fillText(point.label, point.x, point.y - 10);

        if (isHovered) {
          // Glow
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0, point.x, point.y, 25
          );
          gradient.addColorStop(0, "rgba(139, 92, 246, 0.2)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 25, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      setHoveredSkill(closestSkill);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [skills]);

  return (
    <div className="glass-card overflow-hidden relative">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "400px", display: "block" }}
      />
      {hoveredSkill && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-neon)",
            letterSpacing: "0.1em",
          }}
        >
          {hoveredSkill.toUpperCase()}
        </div>
      )}
    </div>
  );
}
