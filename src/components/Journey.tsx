import { useRef } from "react";
import { motion } from "framer-motion";
import { journeyTimeline } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, "JOURNEY", { duration: 1000 });
  useInView(sectionRef, { threshold: 0.05 }, scramble);

  return (
    <section id="journey" ref={sectionRef} className="relative py-32">
      <div className="section-container">
        <div className="mono-label mb-4 text-center">
          {"// 05 — JOURNEY & LEADERSHIP"}
        </div>
        <h2
          ref={titleRef}
          className="text-center neon-text mb-16"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
          }}
        >
          JOURNEY
        </h2>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-[1px]"
            style={{
              background:
                "linear-gradient(180deg, var(--color-purple), var(--color-neon), transparent)",
            }}
          />

          {/* Timeline items */}
          {journeyTimeline.map((item, i) => (
            <TimelineItem key={`${item.year}-${item.title}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: { year: string; title: string; description: string; highlight?: boolean };
  index: number;
}) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative flex items-start mb-12 md:mb-16 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Dot on line */}
      <div
        className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10"
        style={{
          background: item.highlight ? "var(--color-neon)" : "var(--color-purple)",
          border: "2px solid var(--color-base)",
          boxShadow: item.highlight
            ? "0 0 15px rgba(168, 85, 247, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)"
            : "0 0 8px rgba(139, 92, 246, 0.3)",
        }}
      />

      {/* Content card */}
      <div
        className={`ml-14 md:ml-0 md:w-5/12 ${
          isLeft ? "md:pr-12 md:text-right" : "md:pl-12"
        }`}
      >
        <div
          className={`glass-card p-5 ${
            item.highlight ? "border-purple-500/40" : ""
          }`}
          style={{
            boxShadow: item.highlight
              ? "0 0 30px rgba(139, 92, 246, 0.15), inset 0 0 20px rgba(139, 92, 246, 0.05)"
              : undefined,
          }}
        >
          {/* Year badge */}
          <div
            className="inline-block px-2 py-0.5 rounded mb-2"
            style={{
              background: item.highlight
                ? "rgba(168, 85, 247, 0.2)"
                : "rgba(139, 92, 246, 0.1)",
              border: `1px solid ${
                item.highlight
                  ? "rgba(168, 85, 247, 0.4)"
                  : "rgba(139, 92, 246, 0.2)"
              }`,
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: item.highlight ? "var(--color-neon)" : "var(--color-lavender)",
              letterSpacing: "0.1em",
            }}
          >
            {item.year}
          </div>

          <h3
            className="mb-1"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              fontWeight: 600,
              color: item.highlight ? "white" : "var(--color-lavender)",
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
            }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
