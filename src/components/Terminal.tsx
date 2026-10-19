import { useState, useRef, useEffect, useCallback } from "react";
import { terminalCommands } from "../data/content";

interface TerminalProps {
  visible: boolean;
  onClose: () => void;
}

export default function Terminal({ visible, onClose }: TerminalProps) {
  const [history, setHistory] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: "Waryex Terminal v1.0 — type 'help' for commands" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim().toLowerCase();
      if (!cmd) return;

      const newHistory = [...history, { type: "input" as const, text: `> ${input}` }];

      if (cmd === "clear") {
        setHistory([{ type: "output", text: "Terminal cleared." }]);
      } else if (cmd === "exit") {
        onClose();
      } else if (terminalCommands[cmd]) {
        newHistory.push({ type: "output", text: terminalCommands[cmd] });
        setHistory(newHistory);
      } else {
        newHistory.push({
          type: "output",
          text: `Command not found: ${cmd}. Type 'help' for available commands.`,
        });
        setHistory(newHistory);
      }

      setInput("");
    },
    [input, history, onClose]
  );

  if (!visible) return null;

  return (
    <div className="terminal-overlay" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: "var(--color-purple)", fontSize: "11px", letterSpacing: "0.1em" }}>
          WARYEX TERMINAL
        </span>
        <button
          onClick={onClose}
          className="text-xs"
          style={{ color: "rgba(139,92,246,0.5)", fontFamily: "var(--font-mono)" }}
        >
          [ESC to close]
        </button>
      </div>

      <div ref={containerRef} className="overflow-y-auto" style={{ maxHeight: "220px" }}>
        {history.map((item, i) => (
          <div
            key={i}
            className="mb-1"
            style={{
              color: item.type === "input" ? "var(--color-neon)" : "var(--color-lavender)",
              opacity: item.type === "output" ? 0.8 : 1,
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center mt-2">
        <span style={{ color: "var(--color-purple)", marginRight: "8px" }}>{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="terminal-input"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
}
