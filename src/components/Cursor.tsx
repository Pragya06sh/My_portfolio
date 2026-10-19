import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Don't show on touch devices
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    document.body.classList.add("custom-cursor");

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    // Animation loop
    let raf: number;
    const trailPositions = Array.from({ length: 5 }, () => ({ x: -100, y: -100 }));

    const animate = () => {
      // Smooth follow for dot
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.5;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.5;

      // Slower follow for ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      // Trail particles
      for (let i = trailPositions.length - 1; i > 0; i--) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.3;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.3;
      }
      trailPositions[0].x = dotPos.current.x;
      trailPositions[0].y = dotPos.current.y;

      trailRefs.current.forEach((el, i) => {
        if (el) {
          el.style.transform = `translate(${trailPositions[i].x - 2}px, ${trailPositions[i].y - 2}px)`;
          el.style.opacity = `${0.3 - i * 0.06}`;
        }
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Trail particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 pointer-events-none z-[10001] rounded-full"
          style={{
            width: "4px",
            height: "4px",
            background: "var(--color-purple)",
            opacity: 0,
          }}
        />
      ))}

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10002] rounded-full"
        style={{
          width: "8px",
          height: "8px",
          background: "white",
          boxShadow: "0 0 6px rgba(255,255,255,0.5)",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] rounded-full transition-all duration-300"
        style={{
          width: isHovering ? "50px" : "40px",
          height: isHovering ? "50px" : "40px",
          border: `1.5px solid ${isHovering ? "var(--color-neon)" : "var(--color-purple)"}`,
          boxShadow: isHovering
            ? "0 0 15px rgba(139,92,246,0.3)"
            : "none",
          marginLeft: isHovering ? "-5px" : "0",
          marginTop: isHovering ? "-5px" : "0",
        }}
      />
    </>
  );
}
