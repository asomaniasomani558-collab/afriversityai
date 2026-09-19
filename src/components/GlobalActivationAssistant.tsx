import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Send,
  ArrowUpRight,
  Database,
  Radio,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Award,
  Globe,
} from "lucide-react";
import { useVoiceActivation } from "../context/VoiceActivationContext";
import { useAuth } from "../context/AuthContext";
import { NavigationTab } from "../types";
import {
  compileDatabaseContext,
  formatDatabaseContextForPrompt,
} from "../services/databaseContextService";

interface GlobalActivationAssistantProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

export const GlobalActivationAssistant: React.FC<GlobalActivationAssistantProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const {
    isListening,
    isSupported,
    toggleListening,
    isAssistantOpen,
    closeAssistant,
    initialPrompt,
    spokenTrigger,
    isSpeaking,
    speak,
    stopSpeech,
    activationWords,
    openLiveConversation,
  } = useVoiceActivation();

  const { userData, currentUser } = useAuth();
  const userName = userData?.displayName || currentUser?.displayName || "Scholar";

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMicDictating, setIsMicDictating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dictationRef = useRef<any>(null);

  // Initialize conversation when opened via activation word
  useEffect(() => {
    if (isAssistantOpen) {
      const triggerWord = spokenTrigger ? `"${spokenTrigger}"` : '"Hello"';
      const welcomeText = initialPrompt
        ? `Hello **${userName}**! I heard your activation word ${triggerWord}. Let me look into: *"${initialPrompt}"* for you right away.`
        : `Hello **${userName}**! I'm your AfriVersty Academic & Campus Companion, connected directly to your university database in real time.\n\nI heard ${triggerWord} — how can I help you today?`;

      setMessages([{ role: "assistant", text: welcomeText }]);

      // If a remainder query was spoken along with the activation word (e.g. "hey afriversity what scholarships can I get?")
      if (initialPrompt.trim()) {
        handleExecuteQuery(initialPrompt);
      }
    } else {
      setMessages([]);
      setInputQuery("");
      stopSpeech();
    }
  }, [isAssistantOpen, spokenTrigger, initialPrompt, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle follow-up query submission
  const handleExecuteQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInputQuery("");
    setIsLoading(true);

    try {
      // Gather real-time database snapshot
      let databaseContext = "";
      try {
        const dbSnapshot = await compileDatabaseContext(userData, currentUser?.uid);
        databaseContext = formatDatabaseContextForPrompt(dbSnapshot);
      } catch (err) {
        console.warn("Could not compile DB context for activation popup:", err);
      }

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          databaseContext,
          role: "Academic Advisor",
          discipline: "african-innovation",
          context: `Scholar: ${userName}. Active Page: ${activeTab}. Mode: Responsive Voice & Wake Word Activation HUD. Keep response concise, warm, actionable, and human-like.`,
          history: messages.slice(-4).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      const answer = data.response || "I am here to assist your academic journey. What specific course or scholarship should we check?";

      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);

      if (!isMuted) {
        speak(answer);
      }
    } catch (e) {
      const fallback = `I'm here to help with your academic courses, scholarships, universities, and competitions. Let's explore your records!`;
      setMessages((prev) => [...prev, { role: "assistant", text: fallback }]);
      if (!isMuted) {
        speak(fallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Dictation when typing query inside the popover
  const toggleDictation = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isMicDictating) {
      if (dictationRef.current) {
        dictationRef.current.stop();
      }
      setIsMicDictating(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsMicDictating(true);
    };

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0]?.transcript || "";
      if (transcript.trim()) {
        setInputQuery(transcript);
        handleExecuteQuery(transcript);
      }
      setIsMicDictating(false);
    };

    recognition.onerror = () => {
      setIsMicDictating(false);
    };

    recognition.onend = () => {
      setIsMicDictating(false);
    };

    dictationRef.current = recognition;
    recognition.start();
  };

  // Contextual prompts based on current active tab
  const getContextualPills = () => {
    switch (activeTab) {
      case "scholarships":
        return [
          { label: "Mastercard Foundation Fellowships", query: "What are the eligibility requirements for Mastercard Foundation scholarships?" },
          { label: "Upcoming Deadlines", query: "Which scholarship applications are closing soon in my database?" },
        ];
      case "my-courses":
        return [
          { label: "Review My Enrolled Courses", query: "What courses am I currently enrolled in and what is my progress?" },
          { label: "Explain Next Assignment", query: "Help me prepare for the upcoming assignment in my engineering course." },
        ];
      case "universities":
        return [
          { label: "Top African Tech Universities", query: "What are the top universities in Africa for software engineering and computer science?" },
          { label: "Faculty Rankings", query: "Which universities have the best renewable energy research labs?" },
        ];
      case "research-radar":
        return [
          { label: "Research Radar Grants", query: "What active Pan-African research grants and lab projects can I join?" },
        ];
      default:
        return [
          { label: "Check My Database", query: "What is my current enrolled status and saved scholarships?" },
          { label: "Pan-African Hackathons", query: "What upcoming competitions and hackathons can I register for?" },
          { label: "Explore Universities", query: "Show me leading African universities in Ghana, Nigeria, and Kenya." },
        ];
    }
  };

  return (
    <>
      {/* 1. Floating Persistent Wake Word Pill & Status (Always visible on all pages, unless in full AI Assistant view) */}
      {activeTab !== "ai-assistant" && (
        <div
          id="global-wake-word-widget"
          className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          {/* Main Floating Trigger Button */}
          <div className="relative group">
            {/* Listening Wave Rings when wake word is actively listening */}
            {isListening && (
              <>
                <span className="absolute -inset-1 rounded-full bg-[#d4af37]/25 animate-ping pointer-events-none" />
                <span className="absolute -inset-2 rounded-full bg-[#f2ca50]/15 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              id="global-wake-word-trigger-button"
              type="button"
              onClick={() => openLiveConversation()}
              className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-200 cursor-pointer ${
                isListening
                  ? "bg-[#1f1a14]/95 border-[#d4af37] text-[#f2ca50] shadow-[0_4px_25px_rgba(212,175,55,0.35)] scale-[1.02]"
                  : "bg-[#14120e]/90 hover:bg-[#1f1a14] border-[#383126] hover:border-[#d4af37]/60 text-[#ded8cb]"
              }`}
              title={
                isListening
                  ? "Wake Word Listening Active! Say 'hey', 'hello', 'hi', or 'afriversity' anytime — or tap to talk live."
                  : "Tap to talk live with Gemini AI Companion"
              }
            >
              {/* Mic / Mascot Icon */}
              <div className="relative flex items-center justify-center">
                {isListening ? (
                  <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#f2ca50]">
                    <Mic size={14} className="animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#262017] flex items-center justify-center text-[#a89e8b]">
                    <MicOff size={14} />
                  </div>
                )}
                {isListening && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#14120e] animate-pulse" />
                )}
              </div>

              {/* Text Label */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-serif-title tracking-wide text-[#f5f2eb]">
                    AfriVersty AI
                  </span>
                  {isListening && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#b0a592] truncate max-w-[150px] sm:max-w-[200px]">
                  {isListening ? 'Say "Hey", "Hello", "AfriVersty"' : "Tap to Talk Live"}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive Instant Response Modal / Popover (Triggered immediately by activation word) */}
      {isAssistantOpen && (
        <div
          id="activation-response-overlay"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeAssistant();
          }}
        >
          <div
            id="activation-response-card"
            className="w-full max-w-lg bg-[#14120e] border border-[#d4af37]/40 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
          >
            {/* Header: Title, Activation Tag, Audio Toggle, Close */}
            <div className="px-5 py-3.5 bg-[#1f1a14] border-b border-[#362e21] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f2ca50] flex items-center justify-center text-[#1c1402] shadow-sm font-bold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-serif-title font-bold text-[#f5f2eb]">
                      AfriVersty AI
                    </h3>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-[9px] font-semibold text-emerald-400">
                      <Database size={9} /> DB Live
                    </div>
                  </div>
                  {spokenTrigger && (
                    <div className="text-[10px] text-[#f2ca50] font-mono flex items-center gap-1">
                      <span>Activated by:</span>
                      <span className="px-1 py-0.2 rounded bg-[#332a1b] font-bold">"{spokenTrigger}"</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls: Mute/Unmute, Open Full Studio, Close */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeech();
                    }
                    setIsMuted(!isMuted);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isMuted
                      ? "bg-[#262017] border-[#383126] text-[#8c827a]"
                      : "bg-[#2e261a] border-[#d4af37]/40 text-[#f2ca50]"
                  }`}
                  title={isMuted ? "Unmute Voice Response" : "Mute Voice Response"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className={isSpeaking ? "animate-pulse" : ""} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const query = inputQuery.trim() || initialPrompt;
                    closeAssistant();
                    openLiveConversation(query);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37]/30 to-[#f2ca50]/30 hover:from-[#d4af37]/50 hover:to-[#f2ca50]/50 border border-[#d4af37]/70 text-[11px] font-bold text-[#f2ca50] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="Switch to Live Voice Conversation"
                >
                  <Radio size={13} className="text-[#f2ca50] animate-pulse" />
                  <span>Talk Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeAssistant();
                    setActiveTab("ai-assistant");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#2e261a] hover:bg-[#3d3222] border border-[#d4af37]/40 text-[11px] font-semibold text-[#f5f2eb] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Open Full AI Companion Studio"
                >
                  <span>Full Studio</span>
                  <ArrowUpRight size={13} className="text-[#f2ca50]" />
                </button>

                <button
                  type="button"
                  onClick={closeAssistant}
                  className="p-1.5 rounded-lg hover:bg-[#2e261a] text-[#a89e8b] hover:text-[#f5f2eb] transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Conversation Flow Body */}
            <div className="p-4 sm:p-5 max-h-[380px] overflow-y-auto space-y-3.5 text-xs sm:text-sm font-sans-body">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-[#262017] border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] shrink-0 mt-0.5">
                      <Sparkles size={12} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#d4af37] text-[#1a1403] font-medium rounded-tr-none shadow-sm"
                        : "bg-[#1c1914] text-[#ece6d9] border border-[#362e21] rounded-tl-none shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#d4af37] animate-pulse">
                  <Sparkles size={14} />
                  <span>Consulting your campus database & STEM engine...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Contextual Quick Suggestions */}
            <div className="px-4 py-2 bg-[#171410] border-t border-[#292218] flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#7d7363] shrink-0">
                Suggestions:
              </span>
              {getContextualPills().map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleExecuteQuery(pill.query)}
                  className="px-2.5 py-1 rounded-full bg-[#231d15] hover:bg-[#31291d] border border-[#3d3323] hover:border-[#d4af37]/50 text-[11px] text-[#ded8cb] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Input Footer: Text and Dictation */}
            <div className="p-3 bg-[#1a1712] border-t border-[#2d251a]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteQuery(inputQuery);
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isMicDictating
                      ? "bg-red-950/80 border-red-500 text-red-400 animate-pulse"
                      : "bg-[#231d15] border-[#383022] hover:border-[#d4af37]/50 text-[#ded8cb]"
                  }`}
                  title={isMicDictating ? "Listening... Click to stop" : "Speak your question"}
                >
                  <Mic size={15} />
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a question or type 'Help'..."
                  className="flex-1 bg-[#14120e] border border-[#383022] focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#f5f2eb] placeholder:text-[#6e6556] focus:outline-none transition-colors"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#1c1402] font-bold hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-md"
                  aria-label="Send query"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
