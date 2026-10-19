// ── All editable text content ────────────────────────────────────────────────
// Edit this file to update any text on the site.

export const siteMetadata = {
  title: "Pragya Shree — Founder of Waryex",
  description:
    "Portfolio of Pragya Shree — founder of Waryex, an AI-driven cybersecurity platform that detects hidden threats by identifying abnormal relationships between multiple signals.",
  ogImage: "/assets/pragya.jpg",
  url: "https://pragyashree.dev",
};

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Waryex", href: "#waryex" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  monoLabel: "// FOUNDER · SECURITY ENGINEER · AI BUILDER",
  headline: "PRAGYA SHREE",
  subtitles: [
    "Founder of Waryex",
    "Cybersecurity + AI",
    "Building things that detect what others miss",
  ],
  ctaPrimary: "Explore Waryex",
  ctaSecondary: "View Projects",
  stats: [
    { value: 45, suffix: "+", label: "teams hosted at Genesis Snap 2026" },
    {
      value: 3,
      prefix: "Top ",
      label: "teams sent to IIT Bombay's Eureka zonal round",
    },
    { value: 5, suffix: "+", label: "security/AI projects" },
  ],
};

export const waryexContent = {
  title: "WARYEX",
  tagline: "Detecting the threats that hide between the signals.",
  description:
    "Waryex is an AI-driven cybersecurity platform that detects hidden cyber threats by identifying abnormal relationships between multiple signals, rather than analyzing each signal in isolation. The vision is to correlate device telemetry, system behavior, timing patterns, and authentication activity to detect sophisticated attacks that traditional security tools may miss. We are exploring a scalable, privacy-conscious approach that could eventually extend to hardware-level security and real-time threat prevention.",
  scrollSteps: [
    {
      id: "isolated",
      title: "Isolated Signals",
      description:
        "Four separate signal streams — Device Telemetry, System Behavior, Timing Patterns, Authentication Activity — each shown as a calm glowing line. Nothing looks wrong when each is viewed alone.",
    },
    {
      id: "correlation",
      title: "Correlation",
      description:
        "The streams connect into a network graph. Lines form between nodes, revealing hidden connections.",
    },
    {
      id: "anomaly",
      title: "Anomaly Detected",
      description:
        "One abnormal relationship lights up — a pulse, an alert ring, and a HUD label: ABNORMAL RELATIONSHIP DETECTED.",
    },
    {
      id: "prevention",
      title: "Prevention",
      description:
        "Toward hardware-level security and real-time threat prevention.",
    },
  ],
  signalTypes: [
    {
      name: "Device Telemetry",
      icon: "cpu",
      desc: "Hardware metrics, firmware states, sensor data",
    },
    {
      name: "System Behavior",
      icon: "activity",
      desc: "Process trees, memory patterns, system calls",
    },
    {
      name: "Timing Patterns",
      icon: "clock",
      desc: "Request cadence, latency anomalies, temporal correlations",
    },
    {
      name: "Authentication Activity",
      icon: "shield",
      desc: "Login attempts, token usage, access patterns",
    },
  ],
  visionTimeline: [
    { step: "Detect", status: "active" },
    { step: "Correlate", status: "active" },
    { step: "Prevent", status: "in-progress" },
    { step: "Hardware-level security", status: "planned" },
  ],
  stageLabel: "Founder-led · early stage · prototype in progress",
  founderTag: "Founded by Pragya Shree",
  cta: "Talk to the founder",
};

export const aboutContent = {
  photo: "/assets/pragya.jpg",
  bio: `B.Tech student in Computer Science Engineering (IoT, Cybersecurity & Blockchain) at the University of Engineering and Management, Kolkata (2024–2028). Founder of Waryex. I like cybersecurity, startups, and building practical solutions that combine innovation with real-world impact. I have led hackathons, run workshops, and organized student startup events.`,
  chips: [
    "Kolkata, India",
    "Cybersecurity",
    "AI & Automation",
    "Blockchain",
    "Startups",
    "Event Leadership",
  ],
};

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  animation?: "terminal" | "detection" | "blockchain" | "shield" | "default";
}

export const projects: Project[] = [
  {
    id: "waryex",
    title: "Waryex",
    description: "AI-driven cybersecurity platform",
    tags: ["AI", "Cybersecurity", "Python"],
    featured: true,
    animation: "shield",
  },
  {
    id: "reconscanner",
    title: "ReconScanner v2",
    description:
      "Python network recon and vulnerability scanner. Wraps Nmap, fingerprints services (banners, HTTP, TLS), maps network topology, looks up CVEs through the NVD API and Shodan, scores risk from 0 to 100, maps findings to MITRE ATT&CK, and shows a live 6-panel terminal dashboard with HTML/JSON reports.",
    tags: ["Python", "Nmap", "Shodan", "NVD API", "MITRE ATT&CK"],
    github: "https://github.com/Pragya06sh/Recon_Scanner",
    animation: "terminal",
  },
  {
    id: "securewatch",
    title: "SecureWatch",
    description:
      "Blockchain-supported integrity framework to monitor unauthorized modifications, with anomaly identification for suspicious activity, plus an Android watch app and a backend.",
    tags: ["Python", "Blockchain", "Android", "Anomaly Detection"],
    github: "https://github.com/Pragya06sh/SECUREWATCH",
    animation: "blockchain",
  },
  {
    id: "blocktrans",
    title: "BlockTrans",
    description:
      "Donation tracking platform using blockchain and AI, with traceable transaction recording for accountability and transparency in financial flow.",
    tags: ["Blockchain", "AI", "Full Stack"],
    animation: "blockchain",
  },
  {
    id: "yolov8",
    title: "YOLOv8 Weapon Detection",
    description:
      "Real-time object recognition using YOLOv8 and OpenCV, trained on labeled surveillance datasets. Co-authored a research paper.",
    tags: ["YOLOv8", "OpenCV", "Python", "ML"],
    github: "https://github.com/Pragya06sh/Yolo_v8",
    animation: "detection",
  },
  {
    id: "phishing",
    title: "Phishing URL Detection System",
    description:
      "A Scikit-learn ML classifier trained on 10,000+ URLs to detect phishing and malicious links.",
    tags: ["Scikit-learn", "ML", "Python"],
    animation: "default",
  },
  {
    id: "piezoelectric",
    title: "Piezoelectric Energy Prototype",
    description:
      "A pressure-based electrical generation prototype, tested for voltage consistency and stability.",
    tags: ["Hardware", "IoT", "Prototype"],
    animation: "default",
  },
  {
    id: "ai-automation",
    title: "AI Automation & Agent Systems",
    description:
      "AI workflows and agent-based systems for task automation and business operations.",
    tags: ["AI", "Automation", "Agents"],
    animation: "default",
  },
];

export const githubProfile = "https://github.com/Pragya06sh";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export const journeyTimeline: TimelineItem[] = [
  {
    year: "Present",
    title: "Founder, Waryex",
    description:
      "Building an AI-driven cybersecurity platform that detects hidden threats through signal correlation.",
    highlight: true,
  },
  {
    year: "2026",
    title: "Lead Organizer, Genesis Snap 2026",
    description:
      "8-hour hackathon and pitching competition under IIC and NEC. 45+ teams, top 20 reached the final round, top 3 qualified for the Eureka zonal round organized by IIT Bombay.",
  },
  {
    year: "2026",
    title: "Campus Ambassador, E-Cell IIT Bombay",
    description:
      "Representing and promoting entrepreneurship initiatives on campus.",
  },
  {
    year: "2026–Present",
    title: "Lead Member, Institution's Innovation Council (IIC)",
    description: "UEM Kolkata — driving innovation and startup culture.",
  },
  {
    year: "2025–2026",
    title: "Google Student Ambassador",
    description:
      "Workshops on cloud computing, AI and cybersecurity.",
  },
  {
    year: "2025–2026",
    title: "National Entrepreneurship Challenge (NEC), IIT Bombay",
    description:
      "Led the college team in 2025, represented the institution again in 2026.",
  },
  {
    year: "2025",
    title: "Lead Organizer, THE MARKER Startup Event",
    description: "Organized and led a student startup event.",
  },
  {
    year: "2025",
    title: "Volunteer, URECKON 2025",
    description: "Contributed to one of the largest techno-management fests.",
  },
];

export const achievements = [
  "1st Runner-up — NIT Durgapur Hackathon",
  "Finalist — HackSnippet Hackathon",
  "First Prize — Technical Quiz Competition",
  "Second Prize — Academic Poster and Project Presentation",
  "Research contribution in an AI-based surveillance model",
];

export const certifications = [
  "Coursera — Software Development Fundamentals",
  "Coursera — Cloud Computing Fundamentals",
  "Coursera — Information Theory",
  "Workshops by IIT Kanpur and NIT Durgapur",
];

export const skillCategories = [
  {
    category: "Programming",
    skills: ["Python", "C", "Java"],
  },
  {
    category: "Cybersecurity",
    skills: [
      "Threat Analysis",
      "OWASP Concepts",
      "Network Observation",
      "Web Protection",
      "Vulnerability Assessment",
    ],
  },
  {
    category: "Machine Learning",
    skills: ["NLP", "Scikit-learn", "PyTorch", "YOLOv8", "OpenCV"],
  },
  {
    category: "Development",
    skills: ["FastAPI", "Streamlit", "REST APIs"],
  },
  {
    category: "Tools",
    skills: [
      "Git",
      "GitHub",
      "Linux",
      "Wireshark",
      "Nmap",
      "Burp Suite",
      "MS Excel",
      "Google Sheets",
      "Canva",
    ],
  },
  {
    category: "Professional",
    skills: [
      "Coordination",
      "Communication",
      "Presentation",
      "Documentation",
      "Event Handling",
    ],
  },
];

export const contactContent = {
  headline: "Let's build something that detects the undetectable.",
  email: "pragya.shree.tech@gmail.com",
  phone: "+91 7992484007",
  linkedin: "https://www.linkedin.com/in/pragya-shree-013271279/",
  github: "https://github.com/Pragya06sh",
  footer: "© 2026 Pragya Shree · Founder, Waryex",
};

export const loaderLines = [
  "> initializing waryex.core ...",
  "> loading signal modules ...",
  "> establishing secure connection ...",
  "> scanning threat vectors ...",
  "> calibrating anomaly detection ...",
  "> loading signals ...",
  "> access granted",
];

export const terminalCommands: Record<string, string> = {
  help: "Available commands: help, whoami, waryex, projects, contact, clear",
  whoami:
    "Pragya Shree — Founder of Waryex, B.Tech CSE student at UEM Kolkata. Security engineer, AI builder, startup enthusiast.",
  waryex:
    "Waryex: AI-driven cybersecurity platform that detects hidden threats by identifying abnormal relationships between multiple signals.",
  projects:
    "Projects: Waryex, ReconScanner v2, SecureWatch, BlockTrans, YOLOv8 Weapon Detection, Phishing URL Detection, Piezoelectric Energy Prototype, AI Automation & Agent Systems",
  contact:
    "Email: pragya.shree.tech@gmail.com | Phone: +91 7992484007 | LinkedIn: linkedin.com/in/pragya-shree-013271279 | GitHub: github.com/Pragya06sh",
};
