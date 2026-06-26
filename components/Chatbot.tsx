"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Send,
  Home,
  MessageSquarePlus,
  History,
  Trash2,
  Copy,
  Check,
  Menu,
  X,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Sliders,
  Cpu,
  CornerDownLeft,
  ArrowUpRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  metadata?: {
    mode: "karmina" | "klasik";
    theme?: string;
    confidence: number;
    latency: number;
    pantunLines?: string[];
  };
}

interface HistoryItem {
  id: string;
  theme: string;
  mode: "karmina" | "klasik";
  pantunLines: string[];
  timestamp: Date;
  messages: Message[];
}

interface ChatbotProps {
  onBackToHome: () => void;
}

interface SerializedMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  metadata?: Message["metadata"];
}

interface SerializedHistoryItem {
  id: string;
  theme: string;
  mode: "karmina" | "klasik";
  pantunLines: string[];
  timestamp: string;
  messages: SerializedMessage[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TEMAS = ["Nasihat", "Jenaka", "Kisah Kasih", "Teka-teki", "Budi Pekerti"];

const SUGGESTIONS = [
  {
    theme: "Nasihat",
    title: "Pantun Nasihat",
    desc: "Bait luhur budi pekerti tentang pentingnya ilmu dan adab.",
    prompt: "Ilmu",
    mode: "klasik" as const,
    label: "Klasik · 4 baris",
  },
  {
    theme: "Kisah Kasih",
    title: "Karmina Cinta",
    desc: "Dua baris romantis penuh makna tentang bayang kerinduan.",
    prompt: "Rindu",
    mode: "karmina" as const,
    label: "Karmina · 2 baris",
  },
  {
    theme: "Jenaka",
    title: "Pantun Jenaka",
    desc: "Bait gurauan jenaka tentang kehidupan sehari-hari.",
    prompt: "Kucing",
    mode: "klasik" as const,
    label: "Klasik · 4 baris",
  },
  {
    theme: "Budi Pekerti",
    title: "Budi Pekerti",
    desc: "Bait klasik tentang tanda memiliki kerendahan hati.",
    prompt: "Bicara",
    mode: "klasik" as const,
    label: "Klasik · 4 baris",
  },
];

// ─── Pantun Database ──────────────────────────────────────────────────────────
const pantunDatabase: Record<string, { karmina: string[][]; klasik: string[][] }> = {
  Nasihat: {
    karmina: [
      ["Kayu lurus dalam rimba,", "Sudah lurus jangan dibelah."],
      ["Sebab pulut santan binasa,", "Sebab mulut badan binasa."],
    ],
    klasik: [
      [
        "Kemumu di dalam semak,",
        "Jatuh melayang selarasnya;",
        "Meski ilmu setinggi tegak,",
        "Tidak sembahyang apa gunanya.",
      ],
      [
        "Kayu cempaka di dalam kebun,",
        "Tumbuh dekat pohon kelapa;",
        "Walau belajar sampai berembun,",
        "Jasa ibu jangan dilupa.",
      ],
    ],
  },
  Jenaka: {
    karmina: [
      ["Pinggan retak nasi tak dingin,", "Tuan tak hendak kami tak ingin."],
      ["Gelatik melompat di atas duri,", "Cantik bersolek memikat hati."],
    ],
    klasik: [
      [
        "Limau purut di luar pagar,",
        "Rindang daunnya berbuah lebat;",
        "Kucing kurus mandi di pasar,",
        "Tikus melihat tertawa terpingkal.",
      ],
      [
        "Pohon durian tumbuh di lereng,",
        "Jatuh buahnya menimpa batu;",
        "Bagai melihat monyet bercermin,",
        "Melihat adik memakai sepatu.",
      ],
    ],
  },
  "Kisah Kasih": {
    karmina: [
      ["Layang-layang terbang tinggi,", "Wajah membayang dalam mimpi."],
      ["Dua tiga kucing berlari,", "Mana sama si jantung hati."],
    ],
    klasik: [
      [
        "Dari mana datangnya lintah,",
        "Dari sawah turun ke kali;",
        "Dari mana datangnya cinta,",
        "Dari mata turun ke hati.",
      ],
      [
        "Kembang melati berbau harum,",
        "Dipetik dara di kala pagi;",
        "Tiap kuingat wajahmu tersenyum,",
        "Rindu di dada membara lagi.",
      ],
    ],
  },
  "Teka-teki": {
    karmina: [
      ["Ada ubi ada talas,", "Ada budi ada balas."],
      ["Satu lidi ikat sepuluh,", "Apa benda berkaki tujuh?"],
    ],
    klasik: [
      [
        "Tebang buluh buat mainan,",
        "Buluh diikat di atas papan;",
        "Bentuk bulat seperti bulan,",
        "Bila dimakan rasanya manis, apakah itu?",
      ],
    ],
  },
  "Budi Pekerti": {
    karmina: [
      ["Gendang gendut tali kecapi,", "Kenyang perut senanglah hati."],
      ["Selasih mekar di atas bukit,", "Terima kasih budi sedikit."],
    ],
    klasik: [
      [
        "Pisang emas dibawa berlayar,",
        "Masak sebiji di atas peti;",
        "Hutang emas boleh dibayar,",
        "Hutang budi dibawa mati.",
      ],
      [
        "Tumbuh merumpun pohon buluh,",
        "Tempat bermain burung merpati;",
        "Bila berbicara biarlah teduh,",
        "Tanda memiliki kerendahan hati.",
      ],
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateMockPantun = (
  theme: string,
  mode: "karmina" | "klasik"
): { lines: string[]; confidence: number; latency: number } => {
  const defaultTheme = theme && pantunDatabase[theme] ? theme : "Nasihat";
  const selections =
    mode === "klasik"
      ? pantunDatabase[defaultTheme].klasik
      : pantunDatabase[defaultTheme].karmina;
  const lines = selections[Math.floor(Math.random() * selections.length)];
  return {
    lines,
    latency: Math.floor(Math.random() * 200) + 150,
    confidence: parseFloat((94 + Math.random() * 5.8).toFixed(2)),
  };
};

const createMsgObj = (
  sender: "user" | "bot",
  text: string,
  metadata?: Message["metadata"]
): Message => ({
  id: `${sender}-${Math.random().toString(36).substring(2, 11)}`,
  sender,
  text,
  timestamp: new Date(),
  metadata,
});

const createHistoryItem = (
  theme: string,
  mode: "karmina" | "klasik",
  pantunLines: string[],
  messages: Message[]
): HistoryItem => ({
  id: `history-${Math.random().toString(36).substring(2, 11)}`,
  theme,
  mode,
  pantunLines,
  timestamp: new Date(),
  messages,
});

const createInitialMessages = (): Message[] => [
  {
    id: "init",
    sender: "bot",
    text: "Halo! Saya siap membantu Anda membuat pantun. Masukkan kata kunci, pilih tema, dan biarkan saya merangkai bait sastra berima yang indah untuk Anda.",
    timestamp: new Date(),
  },
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

// ─── Interactive Magnetic Letter ─────────────────────────────────────────────
function MagneticLetter({ char }: { char: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const glow = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 130, damping: 14, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 130, damping: 14, mass: 0.3 });
  const ss = useSpring(scale, { stiffness: 130, damping: 14, mass: 0.3 });
  const sg = useSpring(glow, { stiffness: 130, damping: 14, mass: 0.3 });

  // White glow on hover
  const textShadow = useTransform(
    sg,
    (v) =>
      `0 0 ${v * 18}px rgba(255,255,255,${v * 0.7}), 0 0 ${v * 36}px rgba(200,200,200,${v * 0.25})`
  );
  const color = useTransform(sg, [0, 1], ["rgba(255,255,255,0.85)", "rgba(255,255,255,1)"]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const threshold = 110;

      if (dist < threshold) {
        const factor = (threshold - dist) / threshold;
        x.set(-dx * factor * 0.38);
        y.set(-dy * factor * 0.38);
        scale.set(1 + factor * 0.28);
        glow.set(factor);
      } else {
        x.set(0);
        y.set(0);
        scale.set(1);
        glow.set(0);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y, scale, glow]);

  if (char === " ") return <span className="inline-block w-3" />;

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, scale: ss, textShadow, color, display: "inline-block" }}
      className="select-none cursor-default font-bold"
    >
      {char}
    </motion.span>
  );
}

function InteractiveTitle({ text }: { text: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4">
      {text.split(" ").map((word, wi) => (
        <div key={wi} className="flex">
          {word.split("").map((ch, ci) => (
            <MagneticLetter key={`${wi}-${ci}`} char={ch} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-500"
          animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Chatbot({ onBackToHome }: ChatbotProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "history">("chat");

  const [messages, setMessages] = useState<Message[]>(() => createInitialMessages());
  const [inputText, setInputText] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("Nasihat");
  const [mode, setMode] = useState<"karmina" | "klasik">("klasik");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [themeDropdown, setThemeDropdown] = useState(false);

  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Load history on mount to prevent Next.js hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pantun-history");
      if (raw) {
        const parsed = JSON.parse(raw) as SerializedHistoryItem[];
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setChatHistory(
          parsed.map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp),
            messages: item.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
          }))
        );
      }
    } catch {
      // Fail silently
    }
    setIsHistoryLoaded(true);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(160, textareaRef.current.scrollHeight)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (!isHistoryLoaded) return;
    if (chatHistory.length > 0) {
      localStorage.setItem("pantun-history", JSON.stringify(chatHistory));
    } else {
      localStorage.removeItem("pantun-history");
    }
  }, [chatHistory, isHistoryLoaded]);

  const handleNewChat = useCallback(() => {
    setMessages(createInitialMessages());
    setInputText("");
    setActiveView("chat");
    setMobileSidebar(false);
  }, []);

  const handleLoadHistory = useCallback((item: HistoryItem) => {
    setMessages(item.messages);
    setMode(item.mode);
    setSelectedTheme(item.theme);
    setActiveView("chat");
    setMobileSidebar(false);
  }, []);

  const handleSend = useCallback(
    (overrideText?: string, overrideTheme?: string, overrideMode?: "karmina" | "klasik") => {
      const text = overrideText || inputText;
      if (!text.trim() || isGenerating) return;

      const targetTheme = overrideTheme || selectedTheme;
      const targetMode = overrideMode || mode;

      const userMsg = createMsgObj(
        "user",
        `Buat pantun bertema ${targetTheme} tentang "${text}"`
      );

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsGenerating(true);
      setLogs([]);

      const logsSeq = [
        "Menginisialisasi pipeline model...",
        `Memproses kata kunci: "${text}"`,
        "Menghitung penyelarasan rima...",
        "Validasi asonansi suku kata...",
        "Stanza berhasil dirangkai.",
      ];

      logsSeq.forEach((log, i) => {
        setTimeout(() => setLogs((prev) => [...prev, log]), i * 240);
      });

      setTimeout(() => {
        const { lines, confidence, latency } = generateMockPantun(targetTheme, targetMode);
        const botMsg = createMsgObj("bot", lines.join("\n"), {
          mode: targetMode,
          theme: targetTheme,
          confidence,
          latency,
          pantunLines: lines,
        });

        setMessages((prev) => {
          const next = [...prev, botMsg];
          const histItem = createHistoryItem(targetTheme, targetMode, lines, next);
          setChatHistory((h) => {
            const filtered = h.filter((x) => x.pantunLines.join("\n") !== lines.join("\n"));
            return [histItem, ...filtered].slice(0, 50);
          });
          return next;
        });

        setIsGenerating(false);
      }, 1700);
    },
    [inputText, isGenerating, selectedTheme, mode]
  );

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  }, []);

  const hasConversation = messages.length > 1;

  // ─── Sidebar ─────────────────────────────────────────────────────────────
  const renderSidebarContent = (mobile = false) => (
    <div className="flex flex-col h-full select-none">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-white/70" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white tracking-tight leading-none">
              Lentera
            </p>
            <p className="text-[10px] text-neutral-600 mt-0.5 font-mono tracking-wider">
              PANTUN AI
            </p>
          </div>
        </div>
        {mobile && (
          <button
            onClick={() => setMobileSidebar(false)}
            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 border-b border-white/[0.06]">
        <SideNavItem
          icon={<Home className="w-[15px] h-[15px]" />}
          label="Beranda"
          onClick={() => {
            onBackToHome();
            if (mobile) setMobileSidebar(false);
          }}
        />
        <SideNavItem
          icon={<MessageSquarePlus className="w-[15px] h-[15px]" />}
          label="Chat Baru"
          onClick={handleNewChat}
          highlight
        />
        <SideNavItem
          icon={<History className="w-[15px] h-[15px]" />}
          label="Riwayat Chat"
          onClick={() => {
            setActiveView(activeView === "history" ? "chat" : "history");
            if (mobile) setMobileSidebar(false);
          }}
          active={activeView === "history"}
        />
      </nav>

      {/* Recent history */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-4">
        <p className="text-[9px] font-mono tracking-[0.18em] text-neutral-700 uppercase mb-3 px-2 font-semibold">
          Terbaru
        </p>
        <div className="flex flex-col gap-0.5">
          {chatHistory.length === 0 ? (
            <p className="text-[11px] text-neutral-700 text-center py-8 font-mono">
              Belum ada riwayat
            </p>
          ) : (
            chatHistory.slice(0, 8).map((item) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => handleLoadHistory(item)}
                  className="w-full text-left px-2.5 py-2.5 rounded-lg transition-all duration-150 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
                >
                  <p className="text-[9px] font-mono tracking-wider text-neutral-600 uppercase mb-1">
                    {item.theme} · {item.mode === "karmina" ? "2 baris" : "4 baris"}
                  </p>
                  <p className="text-[11px] font-serif italic truncate text-neutral-500 leading-snug">
                    &ldquo;{item.pantunLines[0]}&rdquo;
                  </p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatHistory((prev) => prev.filter((h) => h.id !== item.id));
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-neutral-300 hover:bg-white/5 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Status footer */}
      <div className="px-5 py-3.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neutral-400" />
          </span>
          <span className="text-[10px] font-mono text-neutral-700 tracking-wider">Model aktif</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden chatbot-root">
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div className="chatbot-bg" />

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 236 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col flex-shrink-0 border-r border-white/[0.06] bg-black/60 backdrop-blur-xl overflow-hidden relative z-10"
      >
        {renderSidebarContent(false)}
      </motion.aside>

      {/* ── Mobile Sidebar ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-60 bg-[#0c0c0c] border-r border-white/[0.06] md:hidden"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-5 h-14 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebar(true)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all md:hidden"
            >
              <Menu className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/5 transition-all hidden md:flex"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="h-3.5 w-px bg-white/8 hidden md:block" />

            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-neutral-600" />
              <span className="text-[11px] font-mono text-neutral-600 tracking-wider">
                {mode === "klasik" ? "Klasik · 4 Baris" : "Karmina · 2 Baris"} &nbsp;·&nbsp; {selectedTheme}
              </span>
            </div>
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                showSettings
                  ? "bg-white/8 border-white/15 text-neutral-200"
                  : "bg-transparent border-white/[0.07] text-neutral-500 hover:text-neutral-300 hover:bg-white/4 hover:border-white/10"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium tracking-wide text-[11px]">Parameter</span>
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[#0e0e0e] border border-white/[0.09] rounded-xl p-4 shadow-2xl z-30 flex flex-col gap-4"
                >
                  {/* Format */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[9px] font-mono tracking-[0.18em] text-neutral-600 uppercase font-semibold">
                      Format Pantun
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["klasik", "karmina"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          className={`py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                            mode === m
                              ? "bg-white/10 border-white/15 text-white"
                              : "bg-transparent border-white/[0.07] text-neutral-500 hover:text-neutral-300 hover:bg-white/4"
                          }`}
                        >
                          {m === "klasik" ? "Klasik (4)" : "Karmina (2)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[9px] font-mono tracking-[0.18em] text-neutral-600 uppercase font-semibold">
                      Tema
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {TEMAS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTheme(t)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${
                            selectedTheme === t
                              ? "bg-white/8 text-white font-medium"
                              : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] font-mono tracking-[0.18em] text-neutral-600 uppercase font-semibold">
                        Kreativitas
                      </p>
                      <span className="text-[10px] font-mono text-neutral-400">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1.1"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-[3px] rounded-full cursor-pointer accent-white"
                      style={{ background: `linear-gradient(to right, #fff ${((temperature - 0.3) / 0.8) * 100}%, #333 0%)` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* ── Views ─────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeView === "history" ? (
            /* ── History View ──────────────────────────────────────────── */
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto px-4 md:px-8 py-8"
            >
              <div className="max-w-xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Riwayat Chat</h2>
                    <p className="text-xs text-neutral-600 mt-1 font-mono">
                      {chatHistory.length} sesi tersimpan
                    </p>
                  </div>
                  {chatHistory.length > 0 && (
                    <button
                      onClick={() => setChatHistory([])}
                      className="text-[11px] font-mono text-neutral-700 hover:text-neutral-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/4 border border-transparent hover:border-white/[0.07]"
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus semua
                    </button>
                  )}
                </div>

                {chatHistory.length === 0 ? (
                  <div className="text-center py-20">
                    <History className="w-8 h-8 mx-auto mb-3 text-neutral-800" />
                    <p className="text-sm text-neutral-700 font-mono">Belum ada riwayat percakapan</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {chatHistory.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group relative bg-white/[0.025] border border-white/[0.07] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer"
                        onClick={() => handleLoadHistory(item)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono tracking-[0.15em] text-neutral-400 uppercase font-semibold">
                              {item.theme}
                            </span>
                            <span className="text-neutral-800 text-[9px]">·</span>
                            <span className="text-[9px] font-mono text-neutral-700">
                              {item.mode === "klasik" ? "4 Baris" : "2 Baris"}
                            </span>
                          </div>
                          <span suppressHydrationWarning className="text-[9px] font-mono text-neutral-700">
                            {item.timestamp.toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div className="pl-3 border-l border-white/[0.08] flex flex-col gap-1.5">
                          {item.pantunLines.map((line, i) => (
                            <p key={i} className="text-[13px] font-serif italic text-neutral-500 leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-neutral-600 flex items-center gap-1">
                            Buka <ArrowUpRight className="w-2.5 h-2.5" />
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatHistory((prev) => prev.filter((h) => h.id !== item.id));
                            }}
                            className="p-1 rounded text-neutral-700 hover:text-neutral-300 hover:bg-white/6 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ── Chat View ──────────────────────────────────────────────── */
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              {/* Messages scroll area */}
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scroll-smooth">
                <div className="max-w-[640px] mx-auto flex flex-col gap-7 w-full">

                  {/* ── Welcome ──────────────────────────────────────── */}
                  {!hasConversation && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center text-center pt-10 md:pt-16 pb-8 select-none"
                    >
                      {/* Orb */}
                      <div className="relative mb-10">
                        <motion.div
                          animate={{ scale: [1, 1.06, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.04)]"
                        >
                          <Sparkles className="w-7 h-7 text-white/40" />
                        </motion.div>
                        {/* Subtle rings */}
                        <motion.div
                          animate={{ scale: [1, 1.6], opacity: [0.12, 0] }}
                          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
                          className="absolute inset-0 rounded-2xl border border-white/15"
                        />
                      </div>

                      {/* Magnetic title */}
                      <div className="text-3xl md:text-[44px] font-bold tracking-tight leading-none mb-5">
                        <InteractiveTitle text="Lentera Pantun" />
                      </div>
                      <p className="text-[11px] font-mono text-neutral-600 tracking-wider mb-1">
                        GERAKKAN KURSOR KE ATAS TEKS
                      </p>
                      <p className="text-sm text-neutral-600 max-w-xs leading-relaxed mt-3">
                        Generator pantun berbasis AI. Pilih tema dan masukkan kata kunci untuk memulai.
                      </p>

                      {/* Suggestion cards */}
                      <div className="w-full mt-10">
                        <p className="text-[9px] font-mono tracking-[0.2em] text-neutral-700 uppercase mb-4 text-left font-semibold">
                          Mulai dari sini
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {SUGGESTIONS.map((sug, i) => (
                            <motion.button
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.07 }}
                              onClick={() => handleSend(sug.prompt, sug.theme, sug.mode)}
                              className="flex flex-col items-start p-4 rounded-xl bg-white/[0.025] border border-white/[0.07] text-left hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 group"
                            >
                              <div className="flex items-center justify-between w-full mb-2.5">
                                <span className="text-[9px] font-mono tracking-[0.15em] text-neutral-500 uppercase font-semibold">
                                  {sug.theme}
                                </span>
                                <span className="text-[9px] font-mono text-neutral-700">
                                  {sug.label}
                                </span>
                              </div>
                              <p className="text-[13px] font-semibold text-neutral-300 group-hover:text-white transition-colors leading-snug mb-1.5">
                                {sug.title}
                              </p>
                              <p className="text-[11px] text-neutral-600 leading-relaxed">
                                {sug.desc}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Messages ─────────────────────────────────────── */}
                  {messages.map((msg) => {
                    // System init message — only show after conversation starts
                    if (msg.id === "init") {
                      return hasConversation ? (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3"
                        >
                          <BotAvatar />
                          <div className="flex-1 min-w-0">
                            <div className="inline-block bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                              <p className="text-sm text-neutral-400 leading-relaxed">{msg.text}</p>
                            </div>
                            <Timestamp date={msg.timestamp} />
                          </div>
                        </motion.div>
                      ) : null;
                    }

                    // User message
                    if (msg.sender === "user") {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3 flex-row-reverse"
                        >
                          <UserAvatar />
                          <div className="flex flex-col items-end min-w-0">
                            <div className="bg-white/[0.07] border border-white/[0.1] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[82%]">
                              <p className="text-sm text-neutral-200 leading-relaxed">{msg.text}</p>
                            </div>
                            <Timestamp date={msg.timestamp} align="right" />
                          </div>
                        </motion.div>
                      );
                    }

                    // Bot pantun card
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                      >
                        <BotAvatar />
                        <div className="flex-1 min-w-0">
                          <div className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl rounded-tl-sm p-5 max-w-[92%] hover:border-white/[0.13] transition-all duration-300">
                            {/* Copy */}
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="absolute top-3.5 right-3.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-neutral-300 hover:bg-white/[0.06] transition-all"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-neutral-300" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Label */}
                            <p className="text-[9px] font-mono tracking-[0.18em] text-neutral-700 uppercase mb-4 font-semibold">
                              {msg.metadata?.theme} &nbsp;·&nbsp; {msg.metadata?.mode}
                            </p>

                            {/* Pantun lines */}
                            {msg.metadata?.pantunLines && (
                              <div className="flex flex-col gap-2 pl-3.5 border-l border-white/[0.1]">
                                {msg.metadata.pantunLines.map((line, i) => (
                                  <p
                                    key={i}
                                    className="font-serif italic text-[15px] md:text-base text-neutral-300 leading-relaxed"
                                  >
                                    {line}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Metrics */}
                            {msg.metadata && (
                              <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center gap-4">
                                <MetricBadge label="latency" value={`${msg.metadata.latency}ms`} />
                                <span className="w-px h-3 bg-white/[0.06]" />
                                <MetricBadge label="conf" value={`${msg.metadata.confidence}%`} />
                                <span className="w-px h-3 bg-white/[0.06]" />
                                <MetricBadge label="rima" value="✓ sesuai" />
                              </div>
                            )}
                          </div>
                          <Timestamp date={msg.timestamp} />
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Generating state */}
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3"
                    >
                      <BotAvatar spinning />
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl rounded-tl-sm overflow-hidden">
                        <TypingDots />
                        {logs.length > 0 && (
                          <div className="px-4 pb-4 flex flex-col gap-1">
                            {logs.map((log, i) => (
                              <motion.p
                                key={i}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-[10px] font-mono flex items-start gap-2 leading-relaxed ${
                                  i === logs.length - 1 ? "text-neutral-500" : "text-neutral-700"
                                }`}
                              >
                                <span className="text-neutral-700 mt-px flex-shrink-0">▸</span>
                                {log}
                              </motion.p>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* ── Input Area ────────────────────────────────────────── */}
              <div className="flex-shrink-0 border-t border-white/[0.06] bg-black/50 backdrop-blur-xl px-4 md:px-6 py-4">
                <div className="max-w-[640px] mx-auto flex flex-col gap-3">

                  {/* Config row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Theme dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setThemeDropdown(!themeDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-white/[0.08] text-[11px] font-mono text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                      >
                        <span className="text-neutral-600">Tema:</span>
                        <span className="text-neutral-300">{selectedTheme}</span>
                        <ChevronDown className="w-3 h-3 text-neutral-700" />
                      </button>
                      <AnimatePresence>
                        {themeDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute bottom-full mb-1.5 left-0 bg-[#0e0e0e] border border-white/[0.09] rounded-xl p-1.5 min-w-[140px] shadow-2xl z-20"
                          >
                            {TEMAS.map((t) => (
                              <button
                                key={t}
                                onClick={() => { setSelectedTheme(t); setThemeDropdown(false); }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                                  selectedTheme === t
                                    ? "bg-white/8 text-white font-semibold"
                                    : "text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.04]"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Mode toggle */}
                    <button
                      onClick={() => setMode(mode === "klasik" ? "karmina" : "klasik")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-white/[0.08] text-[11px] font-mono text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                    >
                      <span className="text-neutral-600">Format:</span>
                      <span className="text-neutral-300">{mode === "klasik" ? "Klasik" : "Karmina"}</span>
                    </button>

                    {/* Quick tags */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      {["Rindu", "Alam", "Budi", "Pagi"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setInputText(tag)}
                          disabled={isGenerating}
                          className="px-2 py-1 rounded-md bg-transparent border border-white/[0.06] text-[10px] font-mono text-neutral-700 hover:text-neutral-400 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all disabled:opacity-30"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textarea + send button */}
                  <div className="flex items-end gap-2.5">
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        disabled={isGenerating}
                        placeholder="Masukkan kata kunci pantun..."
                        className="w-full bg-white/[0.03] border border-white/[0.09] rounded-xl px-4 py-3 text-[13px] text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all resize-none min-h-[46px] max-h-[160px] font-mono leading-relaxed tracking-wide"
                      />
                    </div>

                    <button
                      onClick={() => handleSend()}
                      disabled={isGenerating || !inputText.trim()}
                      className="flex-shrink-0 w-[46px] h-[46px] rounded-xl bg-white hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center text-black shadow-[0_4px_20px_rgba(255,255,255,0.08)] disabled:opacity-20 disabled:hover:bg-white disabled:shadow-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hint */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-800">
                      <CornerDownLeft className="w-2.5 h-2.5" />
                      <span>Enter kirim &nbsp;·&nbsp; Shift+Enter baris baru</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-800">
                      Lentera AI v2.0
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Small reusable sub-components ───────────────────────────────────────────

function SideNavItem({
  icon,
  label,
  onClick,
  active = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150 border
        ${
          highlight
            ? "bg-white/6 border-white/10 text-neutral-200 hover:bg-white/10 hover:text-white"
            : active
            ? "bg-white/5 border-white/8 text-white"
            : "bg-transparent border-transparent text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.04]"
        }
      `}
    >
      <span
        className={`flex-shrink-0 transition-colors ${
          highlight ? "text-neutral-400" : active ? "text-neutral-300" : "text-neutral-700 group-hover:text-neutral-400"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium truncate tracking-tight">{label}</span>
      {active && <span className="ml-auto w-1 h-1 rounded-full bg-neutral-400 flex-shrink-0" />}
    </button>
  );
}

function BotAvatar({ spinning = false }: { spinning?: boolean }) {
  return (
    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      {spinning ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
        </motion.div>
      ) : (
        <Bot className="w-3.5 h-3.5 text-neutral-500" />
      )}
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0 mt-0.5">
      <User className="w-3.5 h-3.5 text-neutral-400" />
    </div>
  );
}

function Timestamp({ date, align = "left" }: { date: Date; align?: "left" | "right" }) {
  return (
    <p suppressHydrationWarning className={`text-[9px] font-mono text-neutral-800 mt-1.5 tracking-wider ${align === "right" ? "text-right mr-1" : "ml-1"}`}>
      {formatTime(date)}
    </p>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[9px] font-mono text-neutral-700 tracking-wider">
      {label} <span className="text-neutral-500">{value}</span>
    </span>
  );
}
