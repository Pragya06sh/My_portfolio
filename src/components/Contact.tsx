import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { contactContent } from "../data/content";
import { useTextScramble, useInView } from "../hooks/useEffects";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scramble = useTextScramble(titleRef, contactContent.headline, {
    duration: 1200,
  });
  useInView(sectionRef, { threshold: 0.1 }, scramble);

  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const copyEmail = () => {
    navigator.clipboard.writeText(contactContent.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${contactContent.email}?subject=Contact from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-32">
      <div className="section-container">
        <div className="mono-label mb-4 text-center">{"// 08 — CONTACT"}</div>
        <h2
          ref={titleRef}
          className="text-center neon-text mb-16 max-w-3xl mx-auto"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(24px, 4vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {contactContent.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <h3
              className="mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--color-neon)",
              }}
            >
              Get in Touch
            </h3>

            <div className="space-y-5">
              {/* Email */}
              <div>
                <div className="mono-label mb-1" style={{ fontSize: "9px" }}>
                  EMAIL
                </div>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-2 group transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.8)",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {contactContent.email}
                  <span
                    className="text-xs px-2 py-0.5 rounded transition-all"
                    style={{
                      background: copied
                        ? "rgba(139, 92, 246, 0.3)"
                        : "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      color: copied ? "var(--color-neon)" : "var(--color-lavender)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                    }}
                  >
                    {copied ? "COPIED!" : "COPY"}
                  </span>
                </button>
              </div>

              {/* Phone */}
              <div>
                <div className="mono-label mb-1" style={{ fontSize: "9px" }}>
                  PHONE
                </div>
                <a
                  href={`tel:${contactContent.phone}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                  }}
                >
                  {contactContent.phone}
                </a>
              </div>

              {/* LinkedIn */}
              <div>
                <div className="mono-label mb-1" style={{ fontSize: "9px" }}>
                  LINKEDIN
                </div>
                <a
                  href={contactContent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                  }}
                >
                  linkedin.com/in/pragya-shree
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>

              {/* GitHub */}
              <div>
                <div className="mono-label mb-1" style={{ fontSize: "9px" }}>
                  GITHUB
                </div>
                <a
                  href={contactContent.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                  }}
                >
                  github.com/Pragya06sh
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <h3
              className="mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--color-neon)",
              }}
            >
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="mono-label block mb-1"
                  style={{ fontSize: "9px" }}
                  htmlFor="contact-name"
                >
                  NAME
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none"
                  style={{
                    background: "rgba(139, 92, 246, 0.06)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  className="mono-label block mb-1"
                  style={{ fontSize: "9px" }}
                  htmlFor="contact-email"
                >
                  EMAIL
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none"
                  style={{
                    background: "rgba(139, 92, 246, 0.06)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  className="mono-label block mb-1"
                  style={{ fontSize: "9px" }}
                  htmlFor="contact-message"
                >
                  MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none resize-none"
                  style={{
                    background: "rgba(139, 92, 246, 0.06)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    color: "white",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                  }}
                  placeholder="Tell me about your project..."
                />
              </div>

              <button type="submit" className="btn-glow w-full">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-purple-900/30 text-center">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {contactContent.footer}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-4 inline-flex items-center gap-2 transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-purple)",
              background: "none",
              border: "none",
              letterSpacing: "0.1em",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            BACK TO TOP
          </button>
        </footer>
      </div>
    </section>
  );
}
