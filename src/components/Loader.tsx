import { useState, useEffect, useRef } from "react";
import { loaderLines } from "../data/content";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const isCancelled = useRef(false);

  useEffect(() => {
    isCancelled.current = false;
    let lineIndex = 0;
    const totalLines = loaderLines.length;
    let timer: ReturnType<typeof setTimeout>;

    const showNextLine = () => {
      if (isCancelled.current) return;

      if (lineIndex < totalLines) {
        const nextLine = loaderLines[lineIndex];
        if (nextLine) {
          setVisibleLines((prev) => [...prev, nextLine]);
        }
        lineIndex++;
        setProgress(Math.round((lineIndex / totalLines) * 100));
        timer = setTimeout(showNextLine, 220 + Math.random() * 150);
      } else {
        // Complete
        timer = setTimeout(() => {
          if (isCancelled.current) return;
          setExiting(true);
          setTimeout(() => {
            if (!isCancelled.current) onComplete();
          }, 500);
        }, 300);
      }
    };

    timer = setTimeout(showNextLine, 200);

    // Hard fallback timeout: never hang forever
    const hardFallback = setTimeout(() => {
      if (!isCancelled.current) {
        setExiting(true);
        setTimeout(onComplete, 400);
      }
    }, 4000);

    return () => {
      isCancelled.current = true;
      clearTimeout(timer);
      clearTimeout(hardFallback);
    };
  }, [onComplete]);

  const handleSkip = () => {
    isCancelled.current = true;
    setExiting(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div
      className="loader-screen cursor-pointer"
      onClick={handleSkip}
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.4s ease, filter 0.4s ease",
        filter: exiting ? "brightness(2) blur(8px)" : "none",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div className="max-w-md w-full px-6">
        {/* Logo */}
        <div
          className="text-center mb-8"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "36px",
            fontWeight: 700,
            color: "var(--color-purple)",
            textShadow: "0 0 30px rgba(139,92,246,0.6)",
          }}
        >
          PS
        </div>

        {/* Terminal lines */}
        <div className="space-y-2 mb-6" style={{ minHeight: "180px" }}>
          {visibleLines.map((line, i) => {
            const isGranted = Boolean(line && line.includes("access granted"));
            return (
              <div
                key={i}
                className="loader-line"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: isGranted ? "#ffffff" : "var(--color-lavender)",
                  fontWeight: isGranted ? 600 : 400,
                  textShadow: isGranted ? "0 0 10px #a855f7" : "none",
                }}
              >
                {line || ""}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="loader-progress">
          <div
            className="loader-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage & Skip Prompt */}
        <div
          className="flex justify-between items-center mt-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "rgba(139,92,246,0.6)",
            letterSpacing: "0.08em",
          }}
        >
          <span>INITIALIZING: {progress}%</span>
          <span className="text-[9px] text-white/40 hover:text-white/80">
            [CLICK TO SKIP]
          </span>
        </div>
      </div>
    </div>
  );
}
