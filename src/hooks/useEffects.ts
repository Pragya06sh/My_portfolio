import { useEffect, useCallback, useRef } from "react";

/**
 * Text scramble effect — resolves random chars into the real text.
 */
export function useTextScramble(
  ref: React.RefObject<HTMLElement | null>,
  text: string,
  options: { duration?: number; chars?: string } = {}
) {
  const {
    duration = 1200,
    chars = "!<>-_\\/[]{}—=+*^?#_01",
  } = options;
  const frameRef = useRef(0);

  const scramble = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const length = text.length;
    const totalFrames = Math.ceil(duration / 30);
    let frame = 0;

    const update = () => {
      let output = "";
      const progress = frame / totalFrames;
      for (let i = 0; i < length; i++) {
        if (i < length * progress) {
          output += text[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = output;
      frame++;
      if (frame <= totalFrames) {
        frameRef.current = requestAnimationFrame(update);
      }
    };
    cancelAnimationFrame(frameRef.current);
    update();
  }, [text, duration, chars, ref]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return scramble;
}

/**
 * Intersection Observer hook for triggering animations.
 */
export function useInView(
  ref: React.RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {},
  callback?: () => void
) {
  const hasTriggered = useRef(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const threshold = options.threshold ?? 0.2;
  const rootMargin = options.rootMargin;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          callbackRef.current?.();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);
}

/**
 * Mouse position tracker (normalized -1 to 1).
 */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      pos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return pos;
}

/**
 * Detect touch device.
 */
export function useIsTouchDevice() {
  const isTouch = useRef(false);
  useEffect(() => {
    isTouch.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);
  return isTouch;
}

/**
 * Konami code detection.
 */
export function useKonamiCode(callback: () => void) {
  const sequence = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  const inputRef = useRef<string[]>([]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      inputRef.current.push(e.key);
      inputRef.current = inputRef.current.slice(-sequence.length);
      if (inputRef.current.join(",") === sequence.join(",")) {
        callback();
        inputRef.current = [];
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [callback]);
}

/**
 * Prefers reduced motion.
 */
export function usePrefersReducedMotion() {
  const prefersReduced = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReduced.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}
