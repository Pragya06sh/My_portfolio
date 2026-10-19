import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { heroContent } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(headlineRef, heroContent.headline, {
    duration: 1500,
  });

  // Typing subtitle
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useInView(sectionRef, { threshold: 0.1 }, scramble);

  useEffect(() => {
    const current = heroContent.subtitles[subtitleIndex] || "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayedText(current.slice(0, displayedText.length + 1));
        }, 60);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 30);
      } else {
        setIsDeleting(false);
        setSubtitleIndex((prev) => (prev + 1) % heroContent.subtitles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, subtitleIndex]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center"
      style={{ paddingTop: "80px" }}
    >
      <div className="section-container relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mono label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mono-label mb-6"
          >
            {heroContent.monoLabel}
          </motion.div>

          {/* Headline */}
          <motion.h1
            ref={headlineRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="neon-text-strong mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(48px, 10vw, 120px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {heroContent.headline}
          </motion.h1>

          {/* Typing subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-10"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(14px, 2vw, 20px)",
              color: "var(--color-lavender)",
              minHeight: "30px",
            }}
          >
            {displayedText}
            <span className="typed-cursor" />
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-16"
          >
            <a href="#waryex" className="btn-glow">
              {heroContent.ctaPrimary}
            </a>
            <a href="#projects" className="btn-outline">
              {heroContent.ctaSecondary}
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {heroContent.stats.map((stat, i) => (
              <StatCounter key={i} stat={stat} delay={1.4 + i * 0.2} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span
          className="mono-label"
          style={{ fontSize: "9px", letterSpacing: "0.2em" }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "1px",
            height: "40px",
            background:
              "linear-gradient(180deg, var(--color-purple), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

function StatCounter({
  stat,
  delay,
}: {
  stat: { value: number; suffix?: string; prefix?: string; label: string };
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Animate count up
          const duration = 1500;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * stat.value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          setTimeout(() => requestAnimationFrame(animate), delay * 1000 - 1000);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value, delay]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="neon-text"
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "32px",
          fontWeight: 700,
          color: "var(--color-neon)",
        }}
      >
        {stat.prefix || ""}
        {count}
        {stat.suffix || ""}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.05em",
          maxWidth: "140px",
          marginTop: "4px",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}
