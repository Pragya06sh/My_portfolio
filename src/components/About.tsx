import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { aboutContent } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, "ABOUT", { duration: 1000 });
  useInView(sectionRef, { threshold: 0.1 }, scramble);

  return (
    <section id="about" ref={sectionRef} className="relative py-32">
      <div className="section-container">
        <div className="mono-label mb-4 text-center">{"// 03 — ABOUT"}</div>
        <h2
          ref={titleRef}
          className="text-center neon-text mb-16"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 700,
          }}
        >
          ABOUT
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <PhotoCard />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.8,
                marginBottom: "24px",
              }}
            >
              {aboutContent.bio}
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              {aboutContent.chips.map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "rgba(139, 92, 246, 0.12)",
                    border: "1px solid rgba(139, 92, 246, 0.25)",
                    color: "var(--color-lavender)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.03em",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhotoCard() {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      className="relative glass-card p-3 inline-block"
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: "transform 0.2s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* HUD brackets */}
      <div className="hud-bracket tl" style={{ top: "-6px", left: "-6px" }} />
      <div className="hud-bracket tr" style={{ top: "-6px", right: "-6px" }} />
      <div className="hud-bracket bl" style={{ bottom: "-6px", left: "-6px" }} />
      <div className="hud-bracket br" style={{ bottom: "-6px", right: "-6px" }} />

      {/* Purple holographic frame */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: "280px",
          height: "350px",
          border: "2px solid rgba(139, 92, 246, 0.3)",
          boxShadow:
            "0 0 30px rgba(139, 92, 246, 0.15), inset 0 0 30px rgba(139, 92, 246, 0.05)",
        }}
      >
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0d0820, #1a0a3e)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "72px",
                fontWeight: 700,
                color: "var(--color-purple)",
                textShadow: "0 0 30px rgba(139,92,246,0.5)",
              }}
            >
              PS
            </span>
          </div>
        ) : (
          <img
            src={aboutContent.photo}
            alt="Pragya Shree"
            className="w-full h-full object-cover"
            style={{
              filter: "grayscale(0.2) contrast(1.1) brightness(0.9)",
            }}
            onError={() => setImgError(true)}
          />
        )}

        {/* Purple overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(139, 92, 246, 0.2) 100%)",
          }}
        />

        {/* HUD label */}
        <div
          className="absolute bottom-3 left-3 hud-label"
          style={{ fontSize: "8px" }}
        >
          SUBJECT: PRAGYA_SHREE
        </div>
      </div>
    </div>
  );
}
