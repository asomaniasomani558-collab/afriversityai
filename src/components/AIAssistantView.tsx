import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Atom,
  FlaskConical,
  Calculator,
  Cpu,
  Globe2,
  Compass,
  Download,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Layers,
  Zap,
  Terminal,
  FileCode,
  Sliders,
  Share2,
  HelpCircle,
  Clock,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  ThumbsUp,
  ThumbsDown,
  MessageSquareHeart,
  AlertCircle,
  X,
  GraduationCap,
  Briefcase,
  Award,
  Lightbulb,
  CheckCircle2,
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Brain,
  Network,
  Database,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AIMessage, GroundingChunk } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { saveUserNote } from "../lib/firebase";
import { CodeBlock } from "./CodeBlock";
import { GroundingSourcesView } from "./GroundingSourcesView";
import { CareerPathwaysModal } from "./CareerPathwaysModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  COMPREHENSIVE_CAREER_DATABASE,
  CareerPathwayItem,
} from "../data/careerPathwaysDatabase";
import { LanguageCode, SUPPORTED_LANGUAGES } from "../context/LanguageContext";
import {
  compileDatabaseContext,
  formatDatabaseContextForPrompt,
} from "../services/databaseContextService";
import { checkWakeWord, playActivationChime } from "../services/wakeWordService";
import { useVoiceActivation } from "../context/VoiceActivationContext";


type STEMDiscipline = "all" | "physics" | "chemistry" | "mathematics" | "engineering" | "african-innovation" | "career-pathways";

interface FormulaItem {
  name: string;
  discipline: STEMDiscipline;
  formula: string;
  description: string;
  prompt: string;
}

// Clean LaTeX / raw notation into normal, universally understood readable math
export function formatMathToNormalReadable(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Convert block math $$ ... $$ to clean indented blockquote or bold equation
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, equation) => {
    const clean = cleanLatexSnippet(equation.trim());
    return `\n\n> **${clean}**\n\n`;
  });

  // 2. Convert inline math $ ... $ to clean inline math
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, snippet) => {
    return cleanLatexSnippet(snippet.trim());
  });

  // 3. Clean any stray LaTeX commands in general text
  text = cleanLatexSnippet(text);

  return text;
}

function cleanLatexSnippet(snippet: string): string {
  let s = snippet;

  // Multi-pass fraction cleaner: \frac{a}{b} or \dfrac{a}{b} -> (a / b)
  for (let i = 0; i < 5; i++) {
    const prev = s;
    s = s.replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1 / $2)");
    if (s === prev) break;
  }

  // Roots: \sqrt[n]{x} -> n√(x), \sqrt{x} -> √(x)
  s = s.replace(/\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g, "$1√($2)");
  s = s.replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");

  // Common operators and symbols
  s = s.replace(/\\neq|\\ne/g, " ≠ (not equal to) ");
  s = s.replace(/\\approx/g, " ≈ ");
  s = s.replace(/\\pm/g, " ± ");
  s = s.replace(/\\mp/g, " ∓ ");
  s = s.replace(/\\times/g, " × ");
  s = s.replace(/\\cdot/g, " · ");
  s = s.replace(/\\Delta/g, "Δ");
  s = s.replace(/\\pi/g, "π");
  s = s.replace(/\\theta/g, "θ");
  s = s.replace(/\\lambda/g, "λ");
  s = s.replace(/\\omega/g, "ω");
  s = s.replace(/\\Omega/g, "Ω");
  s = s.replace(/\\alpha/g, "α");
  s = s.replace(/\\beta/g, "β");
  s = s.replace(/\\gamma/g, "γ");
  s = s.replace(/\\hbar/g, "ħ");
  s = s.replace(/\\partial/g, "∂");
  s = s.replace(/\\nabla/g, "∇");
  s = s.replace(/\\mu_0/g, "μ₀");
  s = s.replace(/\\mu/g, "μ");
  s = s.replace(/\\varepsilon_0/g, "ε₀");
  s = s.replace(/\\varepsilon|\\epsilon/g, "ε");
  s = s.replace(/\\rho/g, "ρ");
  s = s.replace(/\\sigma/g, "σ");
  s = s.replace(/\\tau/g, "τ");
  s = s.replace(/\\phi/g, "ϕ");
  s = s.replace(/\\Psi/g, "Ψ");
  s = s.replace(/\\psi/g, "ψ");
  s = s.replace(/\\infty/g, "∞");
  s = s.replace(/\\leq|\\le/g, " ≤ ");
  s = s.replace(/\\geq|\\ge/g, " ≥ ");
  s = s.replace(/\\ll/g, " ≪ ");
  s = s.replace(/\\gg/g, " ≫ ");
  s = s.replace(/\\circ/g, "°");
  s = s.replace(/\\degrees/g, "°");
  s = s.replace(/\\implies/g, " → ");
  s = s.replace(/\\iff/g, " ↔ ");
  s = s.replace(/\\quad|\\qquad/g, "   ");
  s = s.replace(/\\[,;:!]/g, " ");

  // Integrals & Calculus notation
  s = s.replace(/\\oint_{\\partial S}|\\oint/g, "Contour Integral");
  s = s.replace(/\\iint_S|\\iint/g, "Surface Integral");
  s = s.replace(/\\iiint_V|\\iiint/g, "Volume Integral");
  s = s.replace(/\\int/g, "Integral");

  // Functions & Styles
  s = s.replace(/\\mathbf\{([^{}]+)\}/g, "$1");
  s = s.replace(/\\mathbf\s+([a-zA-Z0-9])/g, "$1");
  s = s.replace(/\\text\{([^{}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\{([^{}]+)\}/g, "$1");
  s = s.replace(/\\hat\{([^{}]+)\}/g, "$1");
  s = s.replace(/\\vec\{([^{}]+)\}/g, "$1");
  s = s.replace(/\\left\(/g, "(");
  s = s.replace(/\\right\)/g, ")");
  s = s.replace(/\\left\[/g, "[");
  s = s.replace(/\\right\]/g, "]");
  s = s.replace(/\\left\\\{/g, "{");
  s = s.replace(/\\right\\\}/g, "}");

  // Standard superscripts and math replacements
  s = s.replace(/\^2\b/g, "²");
  s = s.replace(/\^3\b/g, "³");
  s = s.replace(/\^4\b/g, "⁴");
  s = s.replace(/\^T\b/g, "ᵀ");
  s = s.replace(/\\exp/g, "exp");
  s = s.replace(/\\ln/g, "ln");
  s = s.replace(/\\log/g, "log");
  s = s.replace(/\\sin/g, "sin");
  s = s.replace(/\\cos/g, "cos");
  s = s.replace(/\\tan/g, "tan");

  return s;
}

const STEM_FORMULAS: FormulaItem[] = [
  // Mathematics & Algebra
  {
    name: "Quadratic Formula & Standard Form",
    discipline: "mathematics",
    formula: "a·x² + b·x + c = 0  →  x = (-b ± √(b² - 4ac)) / (2a)",
    description: "Standard quadratic equation (where a ≠ 0) and universal root formula",
    prompt: "Explain how to solve quadratic equations using the standard formula x = (-b ± √(b² - 4ac)) / (2a) with step-by-step examples."
  },
  {
    name: "Singular Value Decomposition (SVD)",
    discipline: "mathematics",
    formula: "A = U · Σ · Vᵀ",
    description: "Matrix factorization for dimensionality reduction & pseudoinverse",
    prompt: "Explain how Singular Value Decomposition (SVD) works and how to compute the pseudoinverse of a rectangular matrix."
  },
  {
    name: "Stokes' Theorem",
    discipline: "mathematics",
    formula: "Contour Integral of (F · dr) = Surface Integral of ((∇ × F) · dS)",
    description: "Relates circulation along a closed boundary loop to surface curl",
    prompt: "Explain Stokes' Theorem with intuitive physical analogies and solve a sample closed line integral."
  },
  {
    name: "Laplace Transform of Differential Equations",
    discipline: "mathematics",
    formula: "L{y''(t)} = s²·Y(s) - s·y(0) - y'(0)",
    description: "Transform domain solution of linear ODEs with initial conditions",
    prompt: "Solve the second-order ODE y'' + 4y' + 13y = e^(-2t) with y(0)=1, y'(0)=0 using Laplace transforms."
  },
  // Physics
  {
    name: "Schrödinger Wave Equation",
    discipline: "physics",
    formula: "i·ħ · (∂Ψ / ∂t) = H · Ψ",
    description: "Quantum state evolution in non-relativistic systems",
    prompt: "Derive and explain the 1D time-independent Schrödinger equation for a particle in an infinite potential well."
  },
  {
    name: "Maxwell's Unified Equations",
    discipline: "physics",
    formula: "∇ × E = -∂B/∂t,   ∇ × B = μ₀·J + μ₀·ε₀·(∂E/∂t)",
    description: "Classical electrodynamics and electromagnetic wave propagation (c = 1/√(μ₀ε₀))",
    prompt: "Show how Maxwell's equations predict electromagnetic wave propagation in vacuum with speed c = 1/√(μ₀ε₀)."
  },
  {
    name: "Euler-Lagrange Equation",
    discipline: "physics",
    formula: "(d/dt)(∂L / ∂q̇) - (∂L / ∂q) = 0   (where L = T - V)",
    description: "Principle of stationary action in Lagrangian analytical mechanics",
    prompt: "Derive the equations of motion for a double pendulum using the Euler-Lagrange equations."
  },
  // Chemistry
  {
    name: "Nernst Electrochemical Potential",
    discipline: "chemistry",
    formula: "E_cell = E°_cell - (RT / nF) · ln(Q)   [or E° - (0.0592/n)·log(Q) at 25°C]",
    description: "Electrode cell potential under non-standard concentrations and temperatures",
    prompt: "Calculate the equilibrium cell voltage for a copper-zinc galvanic cell at 298K with 0.01M Zn²⁺ and 0.5M Cu²⁺."
  },
  {
    name: "Arrhenius Reaction Kinetics",
    discipline: "chemistry",
    formula: "k = A · e^(-Ea / RT)",
    description: "Temperature dependence of chemical reaction rate constants",
    prompt: "Explain transition state theory and how catalyst surface energy lowers the activation barrier Ea."
  },
  {
    name: "Gibbs Free Energy & Spontaneity",
    discipline: "chemistry",
    formula: "ΔG° = ΔH° - T·ΔS° = -RT · ln(K_eq)",
    description: "Thermodynamic spontaneity (spontaneous when ΔG < 0) and equilibrium",
    prompt: "Explain how temperature dictates spontaneity in endothermic vs exothermic reactions with positive vs negative entropy."
  },
  // Engineering
  {
    name: "Solar PV MPPT Incremental Conductance",
    discipline: "engineering",
    formula: "dI / dV = -(I / V)  →  dP / dV = 0",
    description: "Maximum Power Point Tracking algorithm for solar microgrid inverters",
    prompt: "Implement an Incremental Conductance MPPT algorithm in C++ / Verilog for an off-grid solar microgrid inverter."
  },
  {
    name: "RLC Circuit Resonance & Transient",
    discipline: "engineering",
    formula: "L·(d²i/dt²) + R·(di/dt) + (1/C)·i = 0,   f₀ = 1 / (2π√(LC))",
    description: "Second-order transient response, damping factor α, and quality factor Q",
    prompt: "Derive the underdamped, critically damped, and overdamped conditions for a series RLC circuit with step input."
  },
  {
    name: "Navier-Stokes Fluid Dynamics",
    discipline: "engineering",
    formula: "ρ · (∂u/∂t + u·∇u) = -∇p + μ·∇²u + f",
    description: "Conservation of momentum for viscous incompressible fluid flow",
    prompt: "Derive the Hagen-Poiseuille equation for laminar flow in a cylindrical pipe from the Navier-Stokes equations."
  },
  // Career Pathways
  {
    name: "AI & Machine Learning Engineering Roadmap",
    discipline: "career-pathways",
    formula: "Linear Algebra + Calculus → PyTorch/NLP → Masakhane/Open-Source → Indaba/AIMS/Startups",
    description: "4-stage pipeline to become a top-tier machine learning engineer in Africa & globally",
    prompt: "Help me build my career path in Artificial Intelligence and Machine Learning in Africa."
  },
  {
    name: "Renewable Energy & Microgrid Architect Roadmap",
    discipline: "career-pathways",
    formula: "Electrodynamics + Thermodynamics → PV MPPT / Storage → Microgrid Field Deployments → Energy Fellowships",
    description: "Systematic trajectory for solar PV, battery energy storage, and off-grid power engineering",
    prompt: "Help me build my career path in Renewable Energy, Solar Microgrids, and Clean Power Systems."
  },
  {
    name: "Full-Stack Distributed Cloud Engineer Roadmap",
    discipline: "career-pathways",
    formula: "Algorithms + OS Systems → Cloud (Docker/K8s/Go/Rust) → Fintech/USSD Solutions → Global Remote Engineering",
    description: "Complete blueprint for software architecture, cloud platforms, and distributed systems",
    prompt: "Help me build my career path in Full-Stack Software Engineering and Distributed Cloud Architecture."
  },
  {
    name: "Global STEM Scholarships & Postgraduate Fellowships",
    discipline: "career-pathways",
    formula: "Academic Rigor + Research Papers → Statement of Purpose → Mastercard Foundation / Rhodes / Chevening",
    description: "Masterplan for winning top fully-funded Masters & PhD fellowships worldwide",
    prompt: "Guide me on applying for top global STEM scholarships and postgraduate fellowships from Africa."
  }
];

interface AIAssistantViewProps {
  onBack?: () => void;
  setActiveTab?: (tab: any) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({ onBack, setActiveTab }) => {
  const { t, language, setLanguage, currentOption } = useLanguage();
  const { currentUser, userData, openAuthModal } = useAuth();
  const { openLiveConversation } = useVoiceActivation();
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 1024);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Career Pathways Comprehensive Database Modal state
  const [isCareerDatabaseOpen, setIsCareerDatabaseOpen] = useState(false);

  // Multi-Turn Chatbot Role and Model Tier states
  const [selectedRole, setSelectedRole] = useState<"mentor" | "guide" | "researcher" | "engineer">("mentor");
  const [selectedModelTier, setSelectedModelTier] = useState<"default" | "pro" | "flash" | "lite">("default");

  // Google Grounding Toggles (gemini-3.8-flash)
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [useMapsGrounding, setUseMapsGrounding] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Saved note state
  const [noteSavedToast, setNoteSavedToast] = useState<string | null>(null);
  const [attachmentToast, setAttachmentToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentToast(`Attached "${file.name}" for AI Academic Review`);
      setTimeout(() => setAttachmentToast(null), 4000);
      setInputValue((prev) =>
        prev
          ? `${prev}\n[Attached document: ${file.name}]`
          : `Please review my attached document "${file.name}" and summarize the key engineering concepts:`
      );
    }
  };

  // Geolocation for Google Maps grounding
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Default to Accra, Ghana coordinates for Pan-African hub context
          setUserLocation({ latitude: 5.6037, longitude: -0.187 });
        }
      );
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m-init-1",
      sender: "ai",
      text: "Hello! Welcome to AfriVersty. I'm your AI Academic, Campus & Career Companion, and I am directly connected to your platform database and Firestore profile in real time.\n\nI can help you review your enrolled courses, explore fully-funded scholarships, discover African universities, prepare for hackathons, or check your saved notes and study circles.\n\nWhat are you working on today?",
      timestamp: "10:42 AM",
      model: "gemini-3.8-flash",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDiscipline, setActiveDiscipline] = useState<STEMDiscipline>("all");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Swahili" | "Yoruba" | "Twi" | "Amharic" | "Zulu" | "Hausa">("English");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isSpeakingTutor, setIsSpeakingTutor] = useState(false);

  // Live Continuous Voice Conversation Mode State
  const [isLiveVoiceDialogue, setIsLiveVoiceDialogue] = useState(false);
  const [liveVoiceStatus, setLiveVoiceStatus] = useState<"idle" | "listening" | "analyzing" | "speaking">("idle");
  const isLiveVoiceDialogueRef = useRef(false);
  const liveVoiceStatusRef = useRef<"idle" | "listening" | "analyzing" | "speaking">("idle");
  const liveRecognitionRef = useRef<any>(null);

  // Keep refs in sync with state
  useEffect(() => {
    isLiveVoiceDialogueRef.current = isLiveVoiceDialogue;
  }, [isLiveVoiceDialogue]);

  useEffect(() => {
    liveVoiceStatusRef.current = liveVoiceStatus;
  }, [liveVoiceStatus]);

  // Speech recognition language mapper
  const getSpeechLangCode = (code: LanguageCode): string => {
    switch (code) {
      case "sw": return "sw-KE";
      case "yo": return "yo-NG";
      case "ha": return "ha-NG";
      case "am": return "am-ET";
      case "zu": return "zu-ZA";
      case "fr": return "fr-FR";
      case "pt": return "pt-PT";
      case "ar": return "ar-EG";
      default: return "en-US";
    }
  };

  const handleSelectCareerPathway = (pathway: CareerPathwayItem) => {
    const prompt = `I want to pursue a career as a **${pathway.title}** (${pathway.category} - ${pathway.discipline}).
My target compensation goal is ${pathway.salaryRange.globalRemoteUSD} (${pathway.salaryRange.africanHubs} in African Tech Hubs).
Please map out a concrete step-by-step career pathway and roadmap for me, starting by asking any remaining diagnostic questions about my current skills/education level, and then generating the Short-Term (0-6 mo), Mid-Term (1-3 yr), and Long-Term (3-5+ yr) milestones with certifications (${pathway.shortTermMilestones.certifications.join(", ")}), target portfolio projects (${pathway.shortTermMilestones.portfolioProject}), and key tech stack (${pathway.keyToolsAndTech.join(", ")}).`;
    setInputValue(prompt);
    setTimeout(() => {
      handleSendMessage(prompt);
    }, 50);
  };


  // Vertical Discipline Tab List Dropdown State
  const [isDisciplineMenuOpen, setIsDisciplineMenuOpen] = useState(false);
  const disciplineDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close vertical discipline list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        disciplineDropdownRef.current &&
        !disciplineDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDisciplineMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Thumbs Up / Down Reaction & Feedback State
  const [feedbackToast, setFeedbackToast] = useState<{ id: string; type: "positive" | "negative"; text: string } | null>(null);
  const [activeDislikeMenuId, setActiveDislikeMenuId] = useState<string | null>(null);

  // Load reactions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("afriversty_ai_reactions_cache");
      if (saved) {
        const reactionsMap: Record<string, { reaction: "thumbs-up" | "thumbs-down"; feedbackReason?: string }> = JSON.parse(saved);
        setMessages((prev) =>
          prev.map((msg) => {
            if (reactionsMap[msg.id]) {
              return {
                ...msg,
                reaction: reactionsMap[msg.id].reaction,
                feedbackReason: reactionsMap[msg.id].feedbackReason,
              };
            }
            return msg;
          })
        );
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const saveReactionToStorage = (messageId: string, reaction: "thumbs-up" | "thumbs-down" | null, feedbackReason?: string) => {
    try {
      const saved = localStorage.getItem("afriversty_ai_reactions_cache");
      const map = saved ? JSON.parse(saved) : {};
      if (reaction) {
        map[messageId] = { reaction, feedbackReason };
      } else {
        delete map[messageId];
      }
      localStorage.setItem("afriversty_ai_reactions_cache", JSON.stringify(map));
    } catch {
      // Ignore
    }
  };

  const handleReaction = (messageId: string, reactionType: "thumbs-up" | "thumbs-down") => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const newReaction = msg.reaction === reactionType ? null : reactionType;
          saveReactionToStorage(messageId, newReaction, newReaction ? msg.feedbackReason : undefined);
          return { ...msg, reaction: newReaction };
        }
        return msg;
      })
    );

    if (reactionType === "thumbs-up") {
      setActiveDislikeMenuId(null);
      setFeedbackToast({
        id: messageId,
        type: "positive",
        text: "Thank you! Positive rating recorded to help refine AfriVersty AI accuracy.",
      });
      setTimeout(() => setFeedbackToast((current) => (current?.id === messageId ? null : current)), 3500);
    } else {
      setActiveDislikeMenuId((prev) => (prev === messageId ? null : messageId));
      setFeedbackToast({
        id: messageId,
        type: "negative",
        text: "Feedback noted. Let us know how this response can be improved below.",
      });
      setTimeout(() => setFeedbackToast((current) => (current?.id === messageId ? null : current)), 3500);
    }
  };

  const handleFeedbackReasonSelect = (messageId: string, reason: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          saveReactionToStorage(messageId, "thumbs-down", reason);
          return { ...msg, feedbackReason: reason };
        }
        return msg;
      })
    );
    setActiveDislikeMenuId(null);
    setFeedbackToast({
      id: messageId,
      type: "negative",
      text: `Feedback saved ("${reason}"). Our STEM reasoning will be refined.`,
    });
    setTimeout(() => setFeedbackToast((current) => (current?.id === messageId ? null : current)), 3500);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startLiveListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    try {
      if (liveRecognitionRef.current) {
        try {
          liveRecognitionRef.current.stop();
        } catch {}
      }
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLangCode(language);
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setLiveVoiceStatus("listening");
        setIsVoiceListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsVoiceListening(false);
        setLiveVoiceStatus("analyzing");
        if (transcript && transcript.trim()) {
          handleSendMessage(transcript.trim());
        } else if (isLiveVoiceDialogueRef.current) {
          // Keep listening if empty
          setTimeout(() => {
            if (isLiveVoiceDialogueRef.current) startLiveListening();
          }, 600);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Live voice recognition event:", err);
        setIsVoiceListening(false);
        if (isLiveVoiceDialogueRef.current && liveVoiceStatusRef.current !== "speaking") {
          setTimeout(() => {
            if (isLiveVoiceDialogueRef.current) startLiveListening();
          }, 1200);
        }
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
        if (isLiveVoiceDialogueRef.current && liveVoiceStatusRef.current === "listening") {
          setTimeout(() => {
            if (isLiveVoiceDialogueRef.current) startLiveListening();
          }, 800);
        }
      };

      liveRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Could not start live speech recognition:", e);
      setIsVoiceListening(false);
    }
  };

  const stopLiveListening = () => {
    if (liveRecognitionRef.current) {
      try {
        liveRecognitionRef.current.stop();
      } catch {}
      liveRecognitionRef.current = null;
    }
    setIsVoiceListening(false);
  };

  const toggleLiveVoiceDialogue = (forceState?: boolean) => {
    const nextState = typeof forceState === "boolean" ? forceState : !isLiveVoiceDialogue;
    if (nextState) {
      if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        alert("Live continuous voice dialogue requires a browser with Web Speech Recognition (Google Chrome, Microsoft Edge, Safari 14.1+).");
        return;
      }
      setIsLiveVoiceDialogue(true);
      isLiveVoiceDialogueRef.current = true;
      setLiveVoiceStatus("listening");
      setActiveDiscipline("career-pathways");

      // Speak initial friendly mentor voice greeting if no messages yet
      if (messages.length <= 1) {
        speakResponse(
          "Hello there, scholar! Warm greetings and welcome to AfriVersty! I am your Academic and Campus AI Companion. I am here to help you explore community study circles, universities, degree programs, fully funded scholarships, competitions, high-demand skills, campus events, and cutting-edge research across Africa. What would you like to explore today?",
          true,
          () => {
            if (isLiveVoiceDialogueRef.current) {
              startLiveListening();
            }
          }
        );
      } else {
        startLiveListening();
      }
    } else {
      setIsLiveVoiceDialogue(false);
      isLiveVoiceDialogueRef.current = false;
      setLiveVoiceStatus("idle");
      stopLiveListening();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingTutor(false);
    }
  };

  const toggleVoiceListening = () => {
    if (isLiveVoiceDialogue) {
      toggleLiveVoiceDialogue(false);
      return;
    }
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is supported in modern Chrome and Edge browsers.");
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLangCode(language);
      recognition.interimResults = false;

      if (!isVoiceListening) {
        setIsVoiceListening(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsVoiceListening(false);
        };
        recognition.onerror = () => setIsVoiceListening(false);
        recognition.onend = () => setIsVoiceListening(false);
      } else {
        setIsVoiceListening(false);
        recognition.stop();
      }
    } catch {
      setIsVoiceListening(false);
    }
  };

  // Voice selector matching the clear, articulate British/English female advisor voice from the reference video
  const getAdvisorVoice = (): SpeechSynthesisVoice | null => {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. High-priority exact matches for articulate UK / British English female voices matching the video
    const preferredUkFemalePatterns = [
      /google uk english female/i,
      /libby/i, // Microsoft Libby Online (Natural) - English (United Kingdom)
      /sonia/i, // Microsoft Sonia Online (Natural) - English (United Kingdom)
      /hazel/i, // Microsoft Hazel - English (Great Britain)
      /serena/i,
      /victoria/i,
      /amy/i,
      /stephanie/i,
      /emily/i,
      /en[-_]gb.*female/i,
      /en[-_]gb.*natural/i,
      /en[-_]gb/i,
      /british/i,
      /united kingdom/i,
    ];

    for (const pattern of preferredUkFemalePatterns) {
      const found = voices.find((v) => pattern.test(v.name) || (pattern.test(v.lang) && !v.name.toLowerCase().includes("male") && !v.name.toLowerCase().includes("david") && !v.name.toLowerCase().includes("george")));
      if (found) return found;
    }

    // 2. High-quality natural English female voices
    const preferredNaturalFemalePatterns = [
      /natural.*female/i,
      /google us english female/i,
      /samantha/i,
      /karen/i,
      /zira/i,
      /jenny/i,
      /aria/i,
      /female/i,
    ];

    for (const pattern of preferredNaturalFemalePatterns) {
      const found = voices.find((v) => pattern.test(v.name) && v.lang.startsWith("en"));
      if (found) return found;
    }

    // 3. Fallback to any English voice
    const englishVoice = voices.find((v) => v.lang.startsWith("en"));
    return englishVoice || voices[0] || null;
  };

  const speakResponse = (text: string, isLiveDialogueMode?: boolean, onFinished?: () => void) => {
    if (!("speechSynthesis" in window)) {
      if (onFinished) onFinished();
      return;
    }
    window.speechSynthesis.cancel();
    if (isSpeakingTutor && !isLiveDialogueMode) {
      setIsSpeakingTutor(false);
      setLiveVoiceStatus("idle");
      return;
    }
    // Clean markdown symbols for natural speech
    const cleanText = text
      .replace(/#+/g, "")
      .replace(/[*_`]/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/\\\(|\\\)|\\\[|\\\]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 600));
    
    // Select the British / English female voice matching the uploaded reference audio
    const advisorVoice = getAdvisorVoice();
    if (advisorVoice) {
      utterance.voice = advisorVoice;
      utterance.lang = advisorVoice.lang || "en-GB";
    } else {
      utterance.lang = "en-GB";
    }
    
    // Calm, articulate, professional pacing matching the video reference
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setIsSpeakingTutor(true);
      setLiveVoiceStatus("speaking");
    };

    utterance.onend = () => {
      setIsSpeakingTutor(false);
      if (isLiveVoiceDialogueRef.current) {
        setLiveVoiceStatus("listening");
        if (onFinished) {
          onFinished();
        } else {
          startLiveListening();
        }
      } else {
        setLiveVoiceStatus("idle");
        if (onFinished) onFinished();
      }
    };

    utterance.onerror = () => {
      setIsSpeakingTutor(false);
      if (isLiveVoiceDialogueRef.current) {
        setLiveVoiceStatus("listening");
        startLiveListening();
      } else {
        setLiveVoiceStatus("idle");
      }
    };

    setIsSpeakingTutor(true);
    window.speechSynthesis.speak(utterance);
  };

  const disciplineTabs: { id: STEMDiscipline; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "all", label: "All STEM", icon: <Layers size={14} />, desc: "Interdisciplinary Physics, Chemistry, Math & Engineering" },
    { id: "career-pathways", label: "🧭 Career Pathways", icon: <Compass size={14} />, desc: "Live career consultation, diagnostic discovery & tailored roadmaps" },
    { id: "physics", label: "Physics", icon: <Atom size={14} />, desc: "Quantum mechanics, electrodynamics, Lagrangian dynamics & PV" },
    { id: "chemistry", label: "Chemistry", icon: <FlaskConical size={14} />, desc: "Arrhenius kinetics, Nernst electrochemistry & synthesis" },
    { id: "mathematics", label: "Mathematics", icon: <Calculator size={14} />, desc: "SVD, differential equations, Stokes' theorem & algebra" },
    { id: "engineering", label: "Engineering", icon: <Cpu size={14} />, desc: "Solar microgrids, RLC transient circuits, VLSI & robotics" },
    { id: "african-innovation", label: "Pan-African STEM", icon: <Globe2 size={14} />, desc: "Renewable microgrids, rural telecom & materials" },
  ];

  const quickPromptsByDiscipline: Record<STEMDiscipline, string[]> = {
    all: [
      "🌟 What fully-funded scholarships are available for African students?",
      "🏛️ Which top African universities have the strongest faculties & programs?",
      "🎓 Guide me through selecting the best degree program and curriculum",
      "🏆 What upcoming hackathons and Pan-African competitions can I join?",
      "💡 What are the most in-demand technical skills to master this year?",
      "🤝 How can I join Pan-African student study circles and campus societies?",
      "🔬 What breakthrough projects are on the Pan-African Research Radar?",
      "📅 What academic conferences and campus events are taking place soon?",
    ],
    "career-pathways": [
      "🧭 Help me build my career path (Start Live Diagnostic)",
      "🤖 AI & Machine Learning Career Roadmap in Africa",
      "⚡ Renewable Energy & Microgrid Engineering Career",
      "🌍 Global Scholarships & Postgrad Research Pathways",
      "💻 Full-Stack Software & Cloud Architecture Career",
    ],
    physics: [
      "Derive Maxwell's electromagnetic wave equation",
      "Calculate quantum tunneling probability through a rectangular barrier",
      "Lagrangian formulation for a double pendulum",
      "Semiconductor bandgap analysis in Silicon vs GaAs photovoltaics",
    ],
    chemistry: [
      "Explain SN1 vs SN2 reaction mechanisms with stereochemistry",
      "Nernst equation calculation for Lithium iron phosphate battery",
      "Arrhenius activation energy derivation from rate constant data",
      "Predict 1H-NMR and FT-IR peaks for an unknown ester",
    ],
    mathematics: [
      "Evaluate closed line integral using Stokes' Theorem",
      "Solve second order non-homogeneous ODE via Laplace transform",
      "Singular Value Decomposition (SVD) step-by-step example",
      "Dijkstra vs A* algorithm time complexity proofs",
    ],
    engineering: [
      "Design Verilog HDL 4-bit synchronous up/down counter",
      "Solve series RLC circuit underdamped transient response",
      "Derive Navier-Stokes Hagen-Poiseuille laminar pipe flow",
      "Continuous PID controller tuning via Ziegler-Nichols method",
    ],
    "african-innovation": [
      "Solar PV microgrid design for rural Sahel electrification",
      "Low-bandwidth USSD payment routing protocol optimization",
      "Desalination thermodynamic efficiency in coastal Africa",
      "Laterite brick thermal conductivity & civil engineering",
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputValue]);

  const handleSaveNoteToFirestore = async (msg: AIMessage) => {
    if (!currentUser) {
      openAuthModal("signin");
      return;
    }

    try {
      const title = msg.text.slice(0, 60).replace(/[#*`_]/g, "").trim() || "AfriVersty AI Research Note";
      await saveUserNote(currentUser.uid, {
        title: `AI Note: ${title}`,
        content: msg.text,
        discipline: activeDiscipline !== "all" ? activeDiscipline : "General STEM",
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, savedToNotes: true } : m))
      );

      setNoteSavedToast("Research note saved to your secure Firestore notebook!");
      setTimeout(() => setNoteSavedToast(null), 3000);
    } catch (err) {
      console.error("Failed to save note to Firestore:", err);
      setNoteSavedToast("Could not save note. Please check your connection.");
      setTimeout(() => setNoteSavedToast(null), 3000);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    // Check activation word (hey, hello, hi, afriversity) - launch Live Voice Chatbot page for interaction
    const wakeCheck = checkWakeWord(text);
    if (wakeCheck.isMatch) {
      playActivationChime();
      const promptToSend = wakeCheck.remainderQuery || text;
      openLiveConversation(promptToSend, activeDiscipline !== "all" ? activeDiscipline : "Pan-African STEM Research");
      if (!textToSend) setInputValue("");
      return;
    }

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setIsLoading(true);
    setStreamingText("");

    const aiMessageId = `ai-${Date.now()}`;
    let accumulatedText = "";
    let accumulatedGrounding: GroundingChunk[] = [];
    let accumulatedQueries: string[] = [];
    let usedModel = "gemini-3.8-flash";

    try {
      // Compile real-time webapp database context (user profile, enrolled courses, saved scholarships, notes & catalogue)
      let databaseContext = "";
      try {
        const dbSnapshot = await compileDatabaseContext(userData, currentUser?.uid);
        databaseContext = formatDatabaseContextForPrompt(dbSnapshot);
      } catch (dbErr) {
        console.warn("Could not compile database context:", dbErr);
      }

      // Use streaming endpoint for instantaneous token delivery with grounding & model routing
      const response = await fetch("/api/gemini/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          discipline: activeDiscipline !== "all" ? activeDiscipline : undefined,
          role: selectedRole,
          modelTier: selectedModelTier,
          useSearch: useSearchGrounding,
          useMaps: useMapsGrounding,
          location: userLocation,
          language: currentOption.name,
          databaseContext,
          context: `Scholar: ${userData?.displayName || currentUser?.displayName || "Scholar"}, Higher Education & STEM. Active Discipline: ${activeDiscipline}. Role: ${selectedRole}. Language: ${currentOption.name} (${currentOption.nativeName}). Focus: Community, Universities, Programs, Scholarships, Competitions, Skills, Events, and Research. Mode: Human-like, empathetic academic mentoring dialogue with real-time webapp database access.`,
          history: messages.slice(-8).map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream response error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let doneReading = false;
      let buffer = "";

      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") {
                doneReading = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  setStreamingText(accumulatedText);
                }
                if (parsed.model) {
                  usedModel = parsed.model;
                }
                if (parsed.grounding && Array.isArray(parsed.grounding)) {
                  accumulatedGrounding = parsed.grounding;
                }
                if (parsed.webSearchQueries && Array.isArray(parsed.webSearchQueries)) {
                  accumulatedQueries = parsed.webSearchQueries;
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }

      // Finalize the message with grounding metadata
      const finalMsg: AIMessage = {
        id: aiMessageId,
        sender: "ai",
        text: accumulatedText || "I am ready to assist with your academic STEM inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        model: usedModel,
        role: selectedRole,
        groundingChunks: accumulatedGrounding.length > 0 ? accumulatedGrounding : undefined,
        webSearchQueries: accumulatedQueries.length > 0 ? accumulatedQueries : undefined,
      };
      setMessages((prev) => [...prev, finalMsg]);
      setStreamingText("");

      // If in Live Voice Dialogue mode, automatically speak the AI response and then resume listening
      if (isLiveVoiceDialogueRef.current) {
        speakResponse(accumulatedText || finalMsg.text, true);
      }
    } catch (err) {
      console.warn("Stream interrupted or unavailable, falling back to chat endpoint:", err);
      if (accumulatedText.trim().length > 0) {
        // We already received a meaningful stream chunk, finalize it
        const finalMsg: AIMessage = {
          id: aiMessageId,
          sender: "ai",
          text: accumulatedText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          model: usedModel,
          role: selectedRole,
          groundingChunks: accumulatedGrounding.length > 0 ? accumulatedGrounding : undefined,
          webSearchQueries: accumulatedQueries.length > 0 ? accumulatedQueries : undefined,
        };
        setMessages((prev) => [...prev, finalMsg]);
        setStreamingText("");
        if (isLiveVoiceDialogueRef.current) {
          speakResponse(accumulatedText, true);
        }
      } else {
        try {
          let databaseContext = "";
          try {
            const dbSnapshot = await compileDatabaseContext(userData, currentUser?.uid);
            databaseContext = formatDatabaseContextForPrompt(dbSnapshot);
          } catch (dbErr) {
            console.warn("Could not compile database context:", dbErr);
          }

          const fallbackRes = await fetch("/api/gemini/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text,
              discipline: activeDiscipline !== "all" ? activeDiscipline : undefined,
              role: selectedRole,
              modelTier: selectedModelTier,
              useSearch: useSearchGrounding,
              useMaps: useMapsGrounding,
              location: userLocation,
              language: currentOption.name,
              databaseContext,
              context: `Scholar: ${userData?.displayName || currentUser?.displayName || "Scholar"}, Higher Education & STEM. Active Discipline: ${activeDiscipline}. Role: ${selectedRole}. Language: ${currentOption.name} (${currentOption.nativeName}). Focus: Community, Universities, Programs, Scholarships, Competitions, Skills, Events, and Research. Mode: Human-like, empathetic academic mentoring dialogue with real-time webapp database access.`,
              history: messages.slice(-6).map((m) => ({
                role: m.sender === "user" ? "user" : "model",
                text: m.text,
              })),
            }),
          });
          const data = await fallbackRes.json();
          const aiMessage: AIMessage = {
            id: aiMessageId,
            sender: "ai",
            text: data.response || "Here is the STEM analysis for your query.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            model: data.model || "gemini-3.8-flash",
            role: selectedRole,
            groundingChunks: data.groundingChunks || undefined,
            webSearchQueries: data.webSearchQueries || undefined,
          };
          setMessages((prev) => [...prev, aiMessage]);
          if (isLiveVoiceDialogueRef.current) {
            speakResponse(aiMessage.text, true);
          }
        } catch (fallbackErr) {
          const errMessage: AIMessage = {
            id: aiMessageId,
            sender: "ai",
            text: `### 🧭 AfriVersty STEM Knowledge Engine\n\nI have synthesized the academic fundamentals for **${text}**.\n\n- **Fundamental Principles**: Review core governing equations, boundary conditions, and state conservation.\n- **Recommended Trajectory**: Frame your inquiry in standard mathematical notation or specify if you require algorithmic implementations, circuit topologies, or research literature.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            model: "gemini-3.8-flash (Knowledge Engine)",
            role: selectedRole,
          };
          setMessages((prev) => [...prev, errMessage]);
          if (isLiveVoiceDialogueRef.current) {
            speakResponse(errMessage.text, true);
          }
        }
      }
    } finally {
      setStreamingText("");
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportConversation = () => {
    const transcript = messages
      .map((m) => `### ${m.sender === "user" ? "Scholar" : "AfriVersty AI STEM"} (${m.timestamp})\n\n${m.text}\n`)
      .join("\n---\n\n");
    const blob = new Blob([transcript], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AfriVersty_STEM_Session_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertMathSymbol = (sym: string) => {
    setInputValue((prev) => prev + sym);
    textareaRef.current?.focus();
  };

  const filteredFormulas =
    activeDiscipline === "all"
      ? STEM_FORMULAS
      : STEM_FORMULAS.filter((f) => f.discipline === activeDiscipline);

  return (
    <div
      id="ai-assistant-view"
      className={`transition-all duration-300 flex flex-col ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-[#0c0b09] p-2 sm:p-6 w-screen h-[100dvh] overflow-hidden"
          : isMobile
          ? "fixed inset-0 z-50 bg-[#0c0b09] w-full h-[100dvh] overflow-hidden"
          : "h-[calc(100vh-110px)] w-full relative"
      }`}
    >
      {/* Top Header: Responsive Mobile App Bar OR Desktop Glass Card */}
      {isMobile ? (
        <div className="flex flex-col shrink-0 z-30">
          <div className="h-14 px-3 bg-[#130f1c]/95 border-b border-[#7c3aed]/30 flex items-center justify-between gap-2 shrink-0 backdrop-blur-xl">
            {/* Left: Back to Campus + Avatar + Title */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                id="mobile-ai-back-btn"
                onClick={() => {
                  if (onBack) onBack();
                  else if (setActiveTab) setActiveTab("dashboard");
                }}
                className="p-1.5 -ml-1 text-[#f2ca50] hover:bg-[#251e30] rounded-xl flex items-center gap-0.5 text-xs font-bold transition-all cursor-pointer shrink-0"
                title="Return to Campus"
              >
                <ChevronLeft size={18} />
                <span className="text-[11px] hidden xs:inline">Campus</span>
              </button>

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#d4af37] p-0.5 shrink-0 shadow-md">
                <img
                  src="/afriversty_ai_advisor.jpg"
                  alt="AI Advisor Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-serif-title font-bold text-xs sm:text-sm text-[#f5f3ff] truncate">
                    AI Mentor
                  </span>
                  <span className="bg-[#7c3aed]/40 text-[#c084fc] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#a855f7]/30 shrink-0">
                    3.8 Flash
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <Database size={10} className="text-emerald-400 shrink-0" />
                  <span className="truncate">Database Connected</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Continuous Live Voice Dialogue Trigger */}
              <button
                id="mobile-live-voice-btn"
                type="button"
                onClick={() => toggleLiveVoiceDialogue()}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isLiveVoiceDialogue
                    ? "bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse"
                    : "bg-[#25173c] hover:bg-[#341e54] text-[#c084fc] border-[#7c3aed]/50"
                }`}
                title="Continuous live voice dialogue"
              >
                <span className={`material-symbols-outlined text-[15px] ${isLiveVoiceDialogue ? "animate-spin-slow" : ""}`}>
                  {isLiveVoiceDialogue ? "graphic_eq" : "record_voice_over"}
                </span>
                <span className="hidden xs:inline">{isLiveVoiceDialogue ? "Live" : "Voice"}</span>
              </button>

              {/* STEM Formula Vault Drawer Toggle */}
              <button
                type="button"
                id="mobile-formula-drawer-btn"
                onClick={() => setShowSidebar(true)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  showSidebar
                    ? "bg-[#d4af37]/20 border-[#f2ca50] text-[#f2ca50]"
                    : "bg-[#201c17] border-[#d4af37]/25 text-[#ded8cb] hover:text-[#f2ca50]"
                }`}
                title="STEM Formulas Vault"
              >
                <BookOpen size={16} />
              </button>

              {/* Mobile Actions Menu (Language, Clear, Export, Campus Views) */}
              <div className="relative">
                <button
                  type="button"
                  id="mobile-options-btn"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-xl bg-[#201c17] border border-[#d4af37]/25 text-[#ded8cb] hover:text-[#f2ca50] transition-colors cursor-pointer"
                  title="Tools & Settings"
                >
                  <Sliders size={16} />
                </button>

                {showMobileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-[#181511]/98 backdrop-blur-xl border border-[#d4af37]/35 rounded-2xl shadow-[0_14px_45px_rgba(0,0,0,0.9)] p-3 z-50 space-y-2 animate-fadeIn text-xs">
                    <div className="px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#99907c] border-b border-[#4d4635]/20 flex items-center justify-between">
                      <span>AI Mentor Options</span>
                      <button
                        type="button"
                        onClick={() => setShowMobileMenu(false)}
                        className="text-[#99907c] hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    {/* Indigenous Language Selector */}
                    <div>
                      <label className="text-[10px] text-[#ded8cb] block mb-1 font-semibold flex items-center gap-1">
                        <Globe2 size={12} className="text-[#f2ca50]" />
                        <span>Translation Language</span>
                      </label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value as any);
                          setShowMobileMenu(false);
                        }}
                        className="w-full bg-[#12100d] border border-[#d4af37]/30 text-xs font-semibold text-[#f2ca50] rounded-lg p-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="Swahili">Kiswahili (East Africa)</option>
                        <option value="Yoruba">Yorùbá (West Africa)</option>
                        <option value="Twi">Twi / Akan (Ghana)</option>
                        <option value="Amharic">Amharic (Ethiopia)</option>
                        <option value="Zulu">isiZulu (Southern Africa)</option>
                        <option value="Hausa">Hausa (Nigeria/Sahel)</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        exportConversation();
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#262017] text-[#ded8cb] hover:text-[#f2ca50] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download size={14} className="text-[#f2ca50]" />
                      <span>Export Session (Markdown)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMessages([messages[0]]);
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-950/40 text-red-300 hover:text-red-200 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Reset Chat & Memory</span>
                    </button>

                    {setActiveTab && (
                      <div className="pt-2 border-t border-[#4d4635]/20 space-y-1">
                        <div className="text-[10px] font-bold text-[#99907c] uppercase">Jump to:</div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMobileMenu(false);
                            setActiveTab("dashboard");
                          }}
                          className="w-full text-left px-2 py-1 rounded-lg text-[#ded8cb] hover:text-[#f2ca50] hover:bg-[#201c17] text-xs"
                        >
                          &bull; Campus Dashboard
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMobileMenu(false);
                            setActiveTab("community");
                          }}
                          className="w-full text-left px-2 py-1 rounded-lg text-[#ded8cb] hover:text-[#f2ca50] hover:bg-[#201c17] text-xs"
                        >
                          &bull; Pan-African Community
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>
      ) : null}

      {/* Main Workspace Area (Chat + STEM Drawer) */}
      <div className="flex-1 min-h-0 flex gap-4 overflow-hidden relative">
        {/* Expanded Chat Screen */}
        <div className="flex-1 safari-glass rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-[#d4af37]/20 bg-[#0e0c09] sm:bg-[#12100d]/90 relative">
          {/* Discipline Navigation Header with Controls (Desktop only) */}
          {!isMobile && (
          <div className="px-3 sm:px-5 py-2.5 bg-[#181511]/90 border-b border-[#d4af37]/15 flex items-center justify-between gap-3 relative z-30 flex-wrap">
            {/* Vertical Menu Trigger Button & Popup */}
            <div className="relative" ref={disciplineDropdownRef}>
              <button
                type="button"
                id="stem-discipline-button"
                onClick={() => setIsDisciplineMenuOpen(!isDisciplineMenuOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isDisciplineMenuOpen
                    ? "bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md shadow-[#f2ca50]/20 scale-[1.02]"
                    : "bg-[#201c17] hover:bg-[#2c261e] text-[#ded8cb] hover:text-[#f2ca50] border border-[#d4af37]/30"
                }`}
                title="Click to open STEM Discipline list"
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                    isDisciplineMenuOpen
                      ? "bg-[#3c2f00] text-[#f2ca50]"
                      : "bg-[#2c2419] text-[#f2ca50]"
                  }`}
                >
                  {disciplineTabs.find((t) => t.id === activeDiscipline)?.icon || <Layers size={14} />}
                </div>
                <span className="text-[10px] font-bold text-[#99907c] uppercase tracking-wider hidden sm:inline">
                  Discipline:
                </span>
                <span className="font-bold">
                  {disciplineTabs.find((t) => t.id === activeDiscipline)?.label || "All STEM"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isDisciplineMenuOpen ? "rotate-180 text-[#3c2f00]" : "text-[#d4af37]"
                  }`}
                />
              </button>

              {/* Vertical Discipline List Popover */}
              {isDisciplineMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#161220]/95 backdrop-blur-xl border border-[#7c3aed]/40 sm:border-[#d4af37]/35 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-2 z-50 animate-fadeIn divide-y divide-[#3b2d54]/40">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#a78bfa] flex items-center justify-between">
                    <span>Select STEM Focus</span>
                    <span className="text-[9px] text-[#99907c] font-normal font-sans">
                      {disciplineTabs.length} disciplines
                    </span>
                  </div>

                  <div className="py-1.5 space-y-1">
                    {disciplineTabs.map((tab) => {
                      const isSelected = activeDiscipline === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          id={`select-discipline-${tab.id}`}
                          onClick={() => {
                            setActiveDiscipline(tab.id);
                            setIsDisciplineMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                            isSelected
                              ? "bg-gradient-to-r from-[#f2ca50]/20 to-[#ffd768]/10 text-[#f2ca50] border border-[#f2ca50]/40 font-semibold shadow-sm"
                              : "text-[#ded8cb] hover:bg-[#251b38] hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "bg-[#f2ca50] text-[#3c2f00]"
                                  : "bg-[#25173c] text-[#c084fc] group-hover:text-[#f2ca50] group-hover:bg-[#341e54]"
                              }`}
                            >
                              {tab.icon}
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                                <span>{tab.label}</span>
                              </div>
                              <div className="text-[10px] text-[#99907c] group-hover:text-[#c4b5fd]/80 line-clamp-1 mt-0.5">
                                {tab.desc}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <Check size={14} className="text-[#f2ca50] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions and Utility Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Database Real-Time Connection Indicator */}
              <div
                className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5 shadow-sm"
                title="Connected to AfriVersty Firestore & Catalogue database in real time"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <Database size={13} className="text-emerald-400 shrink-0" />
                <span className="hidden sm:inline font-mono text-[11px]">DB Connected</span>
              </div>

              {/* Language Selector */}
              <LanguageSwitcher variant="assistant" />

              {/* Live Voice Page Quick Launch Button */}
              <button
                type="button"
                id="assistant-open-live-voice-btn"
                onClick={() => openLiveConversation("", activeDiscipline !== "all" ? activeDiscipline : "Pan-African STEM Research")}
                className="px-3 py-1.5 rounded-xl border border-[#d4af37]/60 bg-gradient-to-r from-[#d4af37]/25 via-[#f2ca50]/20 to-[#d4af37]/25 hover:from-[#d4af37]/40 hover:to-[#f2ca50]/35 text-[#f2ca50] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)] cursor-pointer"
                title="Start Live Voice Conversation with Gemini AI (or say 'hey', 'hello', 'hi', 'afriversity')"
              >
                <Sparkles size={13} className="text-[#f2ca50] animate-spin" style={{ animationDuration: "8s" }} />
                <span>Live Voice (Say "Hey")</span>
              </button>

              {/* Career Pathways Database Modal Trigger */}
              <button
                id="open-career-pathways-modal-btn"
                onClick={() => setIsCareerDatabaseOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-[#f2ca50]/40 bg-gradient-to-r from-[#2a2012] to-[#382b18] hover:from-[#352816] hover:to-[#45351e] text-[#f2ca50] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_2px_12px_rgba(242,202,80,0.15)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title="Browse 100+ Pan-African & Global STEM Career Pathways & Roadmaps"
              >
                <Compass size={14} className="text-[#f2ca50]" />
                <span>🧭 Career Pathways ({COMPREHENSIVE_CAREER_DATABASE.length})</span>
              </button>

              {/* STEM Library Drawer Button */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showSidebar
                    ? "bg-[#d4af37]/20 border-[#f2ca50]/40 text-[#f2ca50]"
                    : "bg-[#201c17] border-[#d4af37]/20 text-[#99907c] hover:text-[#e5e2e1]"
                }`}
                title="Toggle STEM Formula Cheatsheet & Library"
              >
                <BookOpen size={14} />
                <span>STEM Library</span>
              </button>

              {/* Export Session */}
              <button
                onClick={exportConversation}
                className="p-2 rounded-xl bg-[#201c17] hover:bg-[#2e2820] text-[#99907c] hover:text-[#f2ca50] border border-[#d4af37]/20 text-xs transition-all cursor-pointer"
                title="Export Session as Markdown"
              >
                <Download size={14} />
              </button>

              {/* Reset Session */}
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-2 rounded-xl bg-[#201c17] hover:bg-[#2e2820] text-[#99907c] hover:text-red-400 border border-[#d4af37]/20 text-xs transition-all cursor-pointer"
                title="Reset Chat & Clear Context"
              >
                <Trash2 size={14} />
              </button>

              {/* Fullscreen Mode */}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                title={isFullScreen ? "Exit Fullscreen" : "Expand to Big Screen Mode"}
              >
                {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>
          </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scrollbar-none relative">
            {/* Live Continuous Voice Dialogue Soundwave & Status Banner */}
            {isLiveVoiceDialogue && (
              <div
                id="live-voice-status-banner"
                className="sticky top-0 z-30 mx-auto max-w-2xl w-full rounded-2xl p-4 bg-gradient-to-r from-[#1c0e33]/95 via-[#181126]/95 to-[#120a22]/95 border border-[#9333ea]/50 shadow-[0_12px_40px_rgba(88,28,135,0.45)] backdrop-blur-xl animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  {/* Dynamic Sound Equalizer Wave Bars */}
                  <div className="flex items-center gap-1 h-8 px-2.5 py-1 bg-[#100720] rounded-xl border border-[#7c3aed]/40">
                    <span className={`w-1 rounded-full bg-[#c084fc] transition-all duration-150 ${liveVoiceStatus === "listening" ? "h-6 animate-pulse" : liveVoiceStatus === "speaking" ? "h-5 animate-bounce" : "h-2"}`} />
                    <span className={`w-1 rounded-full bg-[#a855f7] transition-all duration-200 ${liveVoiceStatus === "listening" ? "h-4 animate-bounce" : liveVoiceStatus === "speaking" ? "h-7 animate-pulse" : "h-2"}`} />
                    <span className={`w-1 rounded-full bg-[#f2ca50] transition-all duration-100 ${liveVoiceStatus === "listening" ? "h-7 animate-pulse" : liveVoiceStatus === "speaking" ? "h-4 animate-bounce" : "h-3"}`} />
                    <span className={`w-1 rounded-full bg-[#38bdf8] transition-all duration-300 ${liveVoiceStatus === "listening" ? "h-5 animate-bounce" : liveVoiceStatus === "speaking" ? "h-6 animate-pulse" : "h-2"}`} />
                    <span className={`w-1 rounded-full bg-[#4ade80] transition-all duration-150 ${liveVoiceStatus === "listening" ? "h-6 animate-pulse" : liveVoiceStatus === "speaking" ? "h-3 animate-bounce" : "h-2"}`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${liveVoiceStatus === "listening" ? "bg-emerald-400" : liveVoiceStatus === "speaking" ? "bg-amber-400" : "bg-purple-400"}`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${liveVoiceStatus === "listening" ? "bg-emerald-500" : liveVoiceStatus === "speaking" ? "bg-amber-500" : "bg-purple-500"}`} />
                      </span>
                      <span className="text-xs font-bold font-sans-body uppercase tracking-wider text-white">
                        {liveVoiceStatus === "listening" && "🎙️ Listening... Speak your thoughts"}
                        {liveVoiceStatus === "analyzing" && "🧠 Mentor analyzing your profile..."}
                        {liveVoiceStatus === "speaking" && "🔊 AI Mentor speaking guidance..."}
                        {liveVoiceStatus === "idle" && "Live Voice Standby"}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#c4b5fd]/80 mt-0.5">
                      Hands-free diagnostic conversation & career roadmapping active
                    </p>
                  </div>
                </div>

                {/* Live Voice Quick Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (liveVoiceStatus === "speaking") {
                        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                        setIsSpeakingTutor(false);
                        setLiveVoiceStatus("listening");
                        startLiveListening();
                      } else {
                        stopLiveListening();
                        setLiveVoiceStatus("idle");
                      }
                    }}
                    className="px-3 py-1 rounded-xl bg-[#281845] hover:bg-[#382260] text-[#ded8cb] text-xs font-semibold border border-[#7c3aed]/30 transition-all cursor-pointer"
                  >
                    {liveVoiceStatus === "speaking" ? "Skip Speech" : "Pause Mic"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLiveVoiceDialogue(false)}
                    className="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold border border-red-500/40 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <X size={13} />
                    <span>End Live Mode</span>
                  </button>
                </div>
              </div>
            )}

            {/* Feedback notification toast popup */}
            {feedbackToast && (
              <div className="sticky top-2 z-30 mx-auto max-w-md w-full bg-[#181126]/95 border border-[#a855f7]/60 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md rounded-2xl p-3 flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      feedbackToast.type === "positive"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    }`}
                  >
                    {feedbackToast.type === "positive" ? (
                      <ThumbsUp size={14} className="fill-emerald-400" />
                    ) : (
                      <ThumbsDown size={14} className="fill-rose-400" />
                    )}
                  </div>
                  <span className="text-xs text-[#e9d5ff] font-medium leading-tight">
                    {feedbackToast.text}
                  </span>
                </div>
                <button
                  onClick={() => setFeedbackToast(null)}
                  className="text-[#99907c] hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isUser ? "justify-end" : "justify-start"} animate-message-fade-in`}
                >
                  {!isUser && (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2b2315] border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] shrink-0 mt-1 shadow-sm">
                      <Bot size={19} className="text-[#f2ca50]" />
                    </div>
                  )}

                  <div
                    className={`w-full max-w-3xl sm:max-w-4xl rounded-2xl p-4 sm:p-6 shadow-xl relative group ${
                      isUser
                        ? "bg-[#252019] text-[#e5e2e1] border border-[#d4af37]/35 rounded-tr-none ml-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                        : "bg-[#181511] text-[#e5e2e1] border border-[#d4af37]/25 rounded-tl-none shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] text-[#99907c] mb-3 pb-2 border-b border-[#d4af37]/15 flex-wrap gap-2">
                      <span className="font-bold flex items-center gap-1.5 text-[#f2ca50]">
                        {!isUser ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
                            <span className="text-[#f2ca50] font-bold">AfriVersty AI</span>
                            {msg.role && (
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/25">
                                {msg.role}
                              </span>
                            )}
                            {msg.model && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 hidden xs:inline">
                                {msg.model}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <span>Scholar {currentUser?.displayName || "Dr. Kofi Mensah"}</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-[#99907c]">{msg.timestamp}</span>
                    </div>

                    {/* Rich Markdown & Math Message Body */}
                    <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-[#e5e2e1] leading-relaxed font-sans-body">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-xl font-bold font-serif-title text-[#f2ca50] mt-4 mb-2 border-b border-[#d4af37]/20 pb-1" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-lg font-bold font-serif-title text-[#f2ca50] mt-3 mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-base font-bold text-[#ffe088] mt-3 mb-1.5" {...props} />,
                          h4: ({ node, ...props }) => <h4 className="text-sm font-semibold text-[#f2ca50] mt-2 mb-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-3 text-xs sm:text-sm text-[#ded8cb] leading-relaxed" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-xs sm:text-sm text-[#ded8cb]" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-xs sm:text-sm text-[#ded8cb]" {...props} />,
                          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                          strong: ({ node, ...props }) => <strong className="text-[#f2ca50] font-semibold" {...props} />,
                          em: ({ node, ...props }) => <em className="text-[#ffe088] italic" {...props} />,
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-[#f2ca50] pl-4 py-2 my-3 bg-[#24201a]/80 rounded-r-xl text-xs sm:text-sm font-mono text-[#ffd768] shadow-inner" {...props} />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3 rounded-xl border border-[#d4af37]/30">
                              <table className="w-full text-xs text-left border-collapse" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => <thead className="bg-[#2a241b] text-[#f2ca50] uppercase font-bold" {...props} />,
                          th: ({ node, ...props }) => <th className="p-2.5 border-b border-[#d4af37]/30" {...props} />,
                          td: ({ node, ...props }) => <td className="p-2.5 border-b border-[#d4af37]/15 bg-[#1a1713]/60" {...props} />,
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || "");
                            const lang = match ? match[1] : "";
                            const rawCode = String(children);
                            if (!inline) {
                              return <CodeBlock language={lang} code={rawCode} />;
                            }
                            return (
                              <code className="bg-[#2c261e] text-[#f2ca50] px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-xs border border-[#d4af37]/20 font-bold" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {formatMathToNormalReadable(msg.text)}
                      </ReactMarkdown>
                    </div>

                    {/* Grounding Sources & Live Citations View */}
                    {!isUser && (msg.groundingChunks || msg.webSearchQueries) && (
                      <GroundingSourcesView
                        groundingChunks={msg.groundingChunks}
                        webSearchQueries={msg.webSearchQueries}
                        model={msg.model}
                      />
                    )}

                    {!isUser && (
                      <div className="mt-4 pt-2.5 border-t border-[#d4af37]/15 flex flex-wrap items-center justify-between gap-2.5">
                        {/* Left status & active reaction badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-[#99907c] flex items-center gap-1">
                            <Check size={12} className="text-[#f2ca50]" />
                            Academic Guidance &bull; Lang: <strong className="text-[#f2ca50]">{currentOption.name} ({currentOption.nativeName})</strong>
                          </span>

                          {msg.reaction === "thumbs-up" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-fadeIn">
                              <ThumbsUp size={10} className="fill-emerald-400 text-emerald-400" />
                              Helpful &bull; Quality Verified
                            </span>
                          )}

                          {msg.reaction === "thumbs-down" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-fadeIn">
                              <ThumbsDown size={10} className="fill-rose-400 text-rose-400" />
                              {msg.feedbackReason ? `Refining: ${msg.feedbackReason}` : "Feedback Noted"}
                            </span>
                          )}
                        </div>

                        {/* Right: Save to Notes, Audio Tutor, Copy, and Thumbs Up / Down Reactions */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {/* Save to Firestore Notes Button */}
                          <button
                            onClick={() => handleSaveNoteToFirestore(msg)}
                            id={`save-note-${msg.id}`}
                            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                              msg.savedToNotes
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold"
                                : "bg-[#201c17] text-[#99907c] hover:text-[#f2ca50] hover:bg-[#2b2419] border-[#d4af37]/20"
                            }`}
                            title="Save this AI response into your secure Firestore Scholar Research Notes"
                          >
                            {msg.savedToNotes ? (
                              <BookmarkCheck size={13} className="text-amber-400" />
                            ) : (
                              <Bookmark size={13} />
                            )}
                            <span className="text-[11px] hidden sm:inline">
                              {msg.savedToNotes ? "Saved to Notes" : "Save Note"}
                            </span>
                          </button>

                          {/* Thumbs Up Reaction Button */}
                          <button
                            onClick={() => handleReaction(msg.id, "thumbs-up")}
                            id={`thumbs-up-${msg.id}`}
                            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                              msg.reaction === "thumbs-up"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.4)] font-bold scale-105"
                                : "bg-[#201c17] text-[#99907c] hover:text-emerald-400 hover:bg-[#152a1e] border-[#d4af37]/20"
                            }`}
                            title="Helpful response (Thumbs up to refine AI accuracy)"
                          >
                            <ThumbsUp
                              size={13}
                              className={msg.reaction === "thumbs-up" ? "fill-emerald-400 text-emerald-400" : ""}
                            />
                            <span className="text-[11px] hidden sm:inline">Helpful</span>
                          </button>

                          {/* Thumbs Down Reaction Button */}
                          <button
                            onClick={() => handleReaction(msg.id, "thumbs-down")}
                            id={`thumbs-down-${msg.id}`}
                            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                              msg.reaction === "thumbs-down"
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.4)] font-bold scale-105"
                                : "bg-[#201c17] text-[#99907c] hover:text-rose-400 hover:bg-[#2e141c] border-[#d4af37]/20"
                            }`}
                            title="Needs refinement (Thumbs down to report inaccurate derivation or code)"
                          >
                            <ThumbsDown
                              size={13}
                              className={msg.reaction === "thumbs-down" ? "fill-rose-400 text-rose-400" : ""}
                            />
                            <span className="text-[11px] hidden sm:inline">Refine</span>
                          </button>

                          {/* Audio Tutor Voice */}
                          <button
                            onClick={() => speakResponse(msg.text)}
                            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
                              isSpeakingTutor
                                ? "bg-[#f2ca50] text-[#3c2f00] font-bold border-[#f2ca50]"
                                : "bg-[#201c17] text-[#99907c] hover:text-[#f2ca50] border-[#d4af37]/20"
                            }`}
                            title="Read Academic Derivation Aloud"
                          >
                            <Volume2 size={13} className={isSpeakingTutor ? "animate-bounce" : ""} />
                            <span className="text-[11px] hidden sm:inline">{isSpeakingTutor ? "Stop Voice" : "Audio Tutor"}</span>
                          </button>

                          {/* Copy Full Academic Response */}
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="text-[#99907c] hover:text-[#f2ca50] p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#201c17] hover:bg-[#2b251d] border border-[#d4af37]/20 transition-all text-xs flex items-center gap-1 cursor-pointer"
                            title="Copy Full Academic Response"
                          >
                            {copiedId === msg.id ? <Check size={13} className="text-[#f2ca50]" /> : <Copy size={13} />}
                            <span className="text-[11px] hidden sm:inline">{copiedId === msg.id ? "Copied" : "Copy"}</span>
                          </button>
                        </div>

                        {/* Thumbs Down Detail Reason Dropdown Bubble */}
                        {activeDislikeMenuId === msg.id && (
                          <div className="w-full mt-2 p-3 rounded-xl bg-[#1b1220] border border-rose-500/40 shadow-xl animate-fadeIn">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                                <AlertCircle size={12} className="text-rose-400" />
                                Help AfriVersty AI refine this response:
                              </span>
                              <button
                                onClick={() => setActiveDislikeMenuId(null)}
                                className="text-[#99907c] hover:text-white p-0.5 rounded"
                              >
                                <X size={13} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                "Inaccurate math derivation",
                                "Code syntax / logic error",
                                "Unclear explanation",
                                "Missing step-by-step detail",
                                "Incorrect translation",
                              ].map((reason) => (
                                <button
                                  key={reason}
                                  onClick={() => handleFeedbackReasonSelect(msg.id, reason)}
                                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                    msg.feedbackReason === reason
                                      ? "bg-rose-500/30 text-rose-200 border-rose-400 font-semibold"
                                      : "bg-[#25172b] hover:bg-[#381e40] text-[#e2d5ec] border-[#7c3aed]/30 hover:border-rose-400/60"
                                  }`}
                                >
                                  {reason}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f2ca50] p-0.5 shrink-0 mt-1 shadow-lg">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                        alt="Dr. Kofi Mensah"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Active Streaming Token Bubble */}
            {isLoading && streamingText && (
              <div className="flex gap-3 sm:gap-4 justify-start animate-message-fade-in">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2e1065] to-[#181511] border border-[#a855f7]/40 flex items-center justify-center text-[#f2ca50] shrink-0 mt-1 shadow-lg overflow-hidden">
                  <img
                    src="/afriversty_ai_advisor.jpg"
                    alt="Afriversty AI Robot Advisor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover animate-pulse"
                  />
                </div>
                <div className="w-full max-w-3xl sm:max-w-4xl rounded-2xl p-4 sm:p-6 shadow-xl bg-gradient-to-br from-[#181028]/95 to-[#161410]/95 text-[#e5e2e1] border border-[#a855f7]/40 rounded-tl-none">
                  <div className="flex items-center justify-between text-[11px] text-[#99907c] mb-3 pb-2 border-b border-[#a855f7]/20">
                    <span className="font-bold flex items-center gap-1.5 text-[#c084fc]">
                      <Sparkles size={13} className="animate-spin-slow text-[#c084fc]" />
                      AfriVersty AI Advisor (Streaming Live...)
                    </span>
                    <span className="text-xs text-[#a855f7] font-mono animate-pulse">● LIVE</span>
                  </div>

                  <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-[#e5e2e1] leading-relaxed font-sans-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || "");
                          const lang = match ? match[1] : "";
                          const rawCode = String(children);
                          if (!inline) {
                            return <CodeBlock language={lang} code={rawCode} />;
                          }
                          return (
                            <code className="bg-[#2c261e] text-[#f2ca50] px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-xs border border-[#d4af37]/20 font-bold" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {formatMathToNormalReadable(streamingText)}
                    </ReactMarkdown>
                    <span className="inline-block w-2.5 h-4 bg-[#c084fc] ml-1 animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator Bubble */}
            {isLoading && !streamingText && (
              <div
                id="ai-typing-indicator-bubble"
                className="flex gap-3 sm:gap-4 justify-start items-end animate-message-fade-in"
              >
                {/* Robot Mascot Avatar with Glowing Ring */}
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3b0764] via-[#2e1065] to-[#120a20] border border-[#a855f7]/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.4)] overflow-hidden">
                  <img
                    src="/afriversty_ai_advisor.jpg"
                    alt="Afriversty AI Robot Advisor Mascot"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover animate-pulse"
                  />
                </div>

                {/* Animated Typing Chat Bubble */}
                <div className="bg-gradient-to-r from-[#1b0e33]/95 via-[#181126]/95 to-[#160d26]/95 border border-[#7e22ce]/50 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-[0_8px_30px_rgba(45,10,80,0.5)] flex items-center gap-3.5 backdrop-blur-md">
                  {/* 3 Animated Jumping / Wave Dots */}
                  <div className="flex items-center gap-1.5 py-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] animate-typing-dot-1 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] animate-typing-dot-2 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] animate-typing-dot-3 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                  </div>

                  {/* Contextual Status Caption */}
                  <span className="text-xs font-medium text-[#e9d5ff]/90 tracking-wide font-sans-body">
                    AfriVersty AI is formulating research & personalized guidance...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-4 py-2.5 bg-[#140f20]/95 border-t border-[#7c3aed]/25 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-[#a855f7]" />
              Quick Inquiries:
            </span>
            {/* AI Advisor Recommended Shortcuts */}
            {[
              "⤑ I want to study AI Engineering",
              "⤑ Find scholarships in Africa",
              "⤑ Universities for Computer Science",
              "⤑ Help me build my career path",
              ...quickPromptsByDiscipline[activeDiscipline],
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt.replace(/^⤑\s*/, ""))}
                className="text-[11px] font-medium bg-[#1e1430]/90 hover:bg-[#2e1c4a] text-[#e9d5ff] hover:text-white px-3.5 py-1.5 rounded-xl border border-[#7c3aed]/30 hover:border-[#a855f7]/60 whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <span>{prompt}</span>
              </button>
            ))}
          </div>


          {/* Toast for file attachment */}
          {attachmentToast && (
            <div className="mx-4 mb-2 p-2.5 rounded-xl bg-[#2a241b] border border-[#d4af37]/40 text-[#f2ca50] text-xs flex items-center gap-2 animate-fadeIn shadow-md">
              <Check size={14} className="text-[#f2ca50] shrink-0" />
              <span>{attachmentToast}</span>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.py,.cpp,.java,.csv"
          />

          {/* Luxury Input Bar from Reference Image */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-[#14120e]/95 border-t border-[#d4af37]/20 flex items-center gap-2 sm:gap-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#201c17] hover:bg-[#2e261a] border border-[#d4af37]/25 text-[#a89e8b] hover:text-[#f2ca50] flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-sm"
              title="Attach notes, syllabus, or PDF for AI review"
            >
              <Paperclip size={18} />
            </button>

            {/* Main Text Input Field */}
            <div className="flex-1 bg-[#1c1813] border border-[#383025] hover:border-[#d4af37]/40 focus-within:border-[#f2ca50] rounded-xl px-3.5 sm:px-4 py-2.5 transition-all flex items-center gap-2 shadow-inner">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Message your academic mentor..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full bg-transparent text-xs sm:text-sm text-[#f5f2eb] placeholder:text-[#7d7568] focus:outline-none resize-none font-sans-body leading-normal max-h-32 scrollbar-none"
              />

              {/* Dictation / Voice Input inside field */}
              <button
                type="button"
                onClick={toggleVoiceListening}
                className={`p-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                  isVoiceListening
                    ? "bg-red-500/25 text-red-400 border border-red-500/40 animate-pulse"
                    : "text-[#a89e8b] hover:text-[#f2ca50] hover:bg-[#282117]"
                }`}
                title="Dictate message with voice recognition"
              >
                {isVoiceListening ? <MicOff size={17} /> : <Mic size={17} />}
              </button>
            </div>

            {/* Warm Gold Squircle Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#c59e47] hover:bg-[#d4af37] disabled:opacity-40 disabled:cursor-not-allowed text-[#1c180f] flex items-center justify-center transition-all duration-150 shrink-0 font-bold shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              title="Send to AI Academic Mentor"
            >
              <Send size={18} className="translate-x-0.5" />
            </button>
          </form>
        </div>

        {/* Collapsible STEM Library & Formula Cheatsheet Drawer */}
        {showSidebar && (
          isMobile ? (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
              <div className="w-full max-w-sm h-full bg-[#161410] border-l border-[#d4af37]/25 flex flex-col justify-between overflow-y-auto p-4 shadow-2xl">
                <div className="space-y-4">
                  {/* Mobile Drawer Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                    <div className="flex items-center gap-2">
                      <BookOpen size={18} className="text-[#f2ca50]" />
                      <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#e5e2e1]">
                        STEM Formula Vault
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#f2ca50] bg-[#f2ca50]/15 px-2 py-0.5 rounded-full font-bold border border-[#f2ca50]/30">
                        {filteredFormulas.length} Equations
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSidebar(false)}
                        className="p-1.5 rounded-lg text-[#ded8cb] hover:text-white hover:bg-[#262017] cursor-pointer"
                        title="Close Vault"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Formula Cards */}
                  <div className="space-y-2.5 max-h-[calc(100vh-230px)] overflow-y-auto pr-1 scrollbar-none">
                    {filteredFormulas.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleSendMessage(item.prompt);
                          setShowSidebar(false);
                        }}
                        className="p-3 rounded-2xl bg-[#1e1b16]/90 hover:bg-[#2c251b] border border-[#d4af37]/25 cursor-pointer transition-all group shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] flex items-center gap-1.5">
                            <Sparkles size={12} className="text-[#f2ca50]" />
                            {item.name}
                          </div>
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#2b2419] text-[#f2ca50] font-mono border border-[#d4af37]/20">
                            {item.discipline}
                          </span>
                        </div>

                        <div className="font-mono text-[11px] text-[#ffd768] bg-[#12100d] p-2 rounded-xl border border-[#d4af37]/20 overflow-x-auto scrollbar-none my-1">
                          {item.formula}
                        </div>

                        <p className="text-[10px] text-[#99907c] line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="mt-2 text-[10px] text-[#f2ca50] font-semibold flex items-center gap-1">
                          <span>Click to solve with proof</span>
                          <ChevronRight size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#d4af37]/20 pb-[env(safe-area-inset-bottom)]">
                  <button
                    type="button"
                    onClick={() => {
                      handleSendMessage("Provide a comprehensive STEM study roadmap for an advanced electrical & computer engineering student in Africa.");
                      setShowSidebar(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#24201a] to-[#30281d] text-[#f2ca50] border border-[#d4af37]/35 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Generate STEM Study Roadmap</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-80 lg:w-96 safari-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-y-auto border border-[#d4af37]/25 bg-[#161410]/95 animate-fadeIn shrink-0">
              <div className="space-y-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-[#f2ca50]" />
                    <h3 className="font-serif-title text-sm sm:text-base font-bold text-[#e5e2e1]">
                      STEM Formula Vault
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#f2ca50] bg-[#f2ca50]/15 px-2 py-0.5 rounded-full font-bold border border-[#f2ca50]/30">
                    {filteredFormulas.length} Equations
                  </span>
                </div>

                {/* Formula Cards */}
                <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 scrollbar-none">
                  {filteredFormulas.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="p-3 rounded-2xl bg-[#1e1b16]/90 hover:bg-[#2c251b] border border-[#d4af37]/25 cursor-pointer transition-all group shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] flex items-center gap-1.5">
                          <Sparkles size={12} className="text-[#f2ca50]" />
                          {item.name}
                        </div>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#2b2419] text-[#f2ca50] font-mono border border-[#d4af37]/20">
                          {item.discipline}
                        </span>
                      </div>

                      <div className="font-mono text-[11px] text-[#ffd768] bg-[#12100d] p-2 rounded-xl border border-[#d4af37]/20 overflow-x-auto scrollbar-none my-1.5">
                        {item.formula}
                      </div>

                      <p className="text-[10px] text-[#99907c] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-2 text-[10px] text-[#f2ca50] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Click to derive with step-by-step proof</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Research Resources */}
                <div className="p-3 rounded-2xl bg-[#201c17] border border-[#d4af37]/20">
                  <div className="text-xs font-bold text-[#e5e2e1] mb-1 flex items-center gap-1.5">
                    <Globe2 size={13} className="text-[#f2ca50]" />
                    Pan-African STEM Research Links
                  </div>
                  <div className="text-[11px] text-[#99907c] space-y-1">
                    <div
                      onClick={() => handleSendMessage("Explain African synchrotron light source research and materials science implications.")}
                      className="hover:text-[#f2ca50] cursor-pointer"
                    >
                      &bull; African Light Source (AfLS) Project
                    </div>
                    <div
                      onClick={() => handleSendMessage("Analyze sub-Saharan microgrid hybrid solar PV and battery storage optimization.")}
                      className="hover:text-[#f2ca50] cursor-pointer"
                    >
                      &bull; Renewable Microgrid Field Architectures
                    </div>
                    <div
                      onClick={() => handleSendMessage("How is NLP being developed for African languages like Yoruba, Swahili, Amharic, and Twi?")}
                      className="hover:text-[#f2ca50] cursor-pointer"
                    >
                      &bull; Masakhane African NLP Research
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Footer */}
              <div className="mt-4 pt-3 border-t border-[#d4af37]/20">
                <button
                  onClick={() => handleSendMessage("Provide a comprehensive STEM study roadmap for an advanced electrical & computer engineering student in Africa.")}
                  className="w-full bg-gradient-to-r from-[#24201a] to-[#30281d] hover:from-[#322b1e] hover:to-[#403423] text-[#f2ca50] border border-[#d4af37]/35 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles size={14} />
                  <span>Generate STEM Study Roadmap</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Note Saved Floating Toast */}
      {noteSavedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#161220]/95 border border-[#a855f7]/60 text-[#f3e8ff] px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold animate-fadeIn">
          <BookmarkCheck size={16} className="text-[#f2ca50]" />
          <span>{noteSavedToast}</span>
        </div>
      )}

      {/* 100+ Career Pathways Database Modal */}
      <CareerPathwaysModal
        isOpen={isCareerDatabaseOpen}
        onClose={() => setIsCareerDatabaseOpen(false)}
        onSelectPathway={handleSelectCareerPathway}
      />
    </div>
  );
};
