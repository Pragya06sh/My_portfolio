import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { achievements, certifications } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, "ACHIEVEMENTS", { duration: 1000 });
  useInView(sectionRef, { threshold: 0.1 }, scramble);

  return (
    <section id="achievements" ref={sectionRef} className="relative py-32">
      <div className="section-container">
        <div className="mono-label mb-4 text-center">{"// 06 — ACHIEVEMENTS"}</div>
        <h2
          ref={titleRef}
          className="text-center neon-text mb-16"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
          }}
        >
          ACHIEVEMENTS
        </h2>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {achievements.map((achievement, i) => (
            <AchievementCard key={achievement} text={achievement} index={i} />
          ))}
        </div>

        {/* Certifications */}
        <div className="max-w-4xl mx-auto">
          <div className="mono-label mb-6 text-center">{"// CERTIFICATIONS"}</div>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <motion.span
                key={cert}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="px-4 py-2 rounded-lg"
                style={{
                  background: "rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-lavender)",
                  letterSpacing: "0.03em",
                }}
              >
                {cert}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementCard({ text, index }: { text: string; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setFlipped(true), index * 200);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateY: 90 }}
      animate={flipped ? { opacity: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card p-6 relative"
      style={{ perspective: "1000px", minHeight: "120px" }}
    >
      {/* Trophy/award icon */}
      <div
        className="mb-3"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: "rgba(139, 92, 246, 0.15)",
          border: "1px solid rgba(139, 92, 246, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}
