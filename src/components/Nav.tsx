import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "../data/content";

export default function Nav() {
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActive(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(7, 4, 15, 0.85)"
          : "rgba(7, 4, 15, 0.3)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(139, 92, 246, 0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#hero");
          }}
          className="relative z-10"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--color-purple)",
            textShadow: "0 0 20px rgba(139,92,246,0.5)",
            textDecoration: "none",
          }}
        >
          PS
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(link.href);
              }}
              className="relative transition-colors duration-200"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:
                  active === link.href.replace("#", "")
                    ? "var(--color-neon)"
                    : "rgba(255,255,255,0.5)",
                textDecoration: "none",
              }}
            >
              {link.label}
              {active === link.href.replace("#", "") && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px]"
                  style={{
                    background: "var(--color-purple)",
                    boxShadow: "0 0 8px var(--color-purple)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#contact");
          }}
          className="hidden md:block btn-glow"
          style={{ padding: "10px 24px", fontSize: "12px" }}
        >
          Hire / Connect
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative z-10 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-[1.5px] transition-all duration-300"
            style={{
              background: "var(--color-purple)",
              transform: mobileOpen
                ? "rotate(45deg) translate(3px, 3px)"
                : "none",
            }}
          />
          <span
            className="block w-6 h-[1.5px] transition-all duration-300"
            style={{
              background: "var(--color-purple)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-[1.5px] transition-all duration-300"
            style={{
              background: "var(--color-purple)",
              transform: mobileOpen
                ? "rotate(-45deg) translate(3px, -3px)"
                : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 py-6 px-6"
            style={{
              background: "rgba(7, 4, 15, 0.95)",
              backdropFilter: "blur(30px)",
              borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color:
                      active === link.href.replace("#", "")
                        ? "var(--color-neon)"
                        : "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    padding: "8px 0",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#contact");
                }}
                className="btn-glow mt-2 text-center"
                style={{ padding: "12px 24px", fontSize: "13px" }}
              >
                Hire / Connect
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
