import React, { useState } from "react";
import {
  Bot,
  Lightbulb,
  FileText,
  ClipboardList,
  Paperclip,
  Mic,
  MicOff,
  Send,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AIAdvisorCardProps {
  onSelectPrompt?: (prompt: string) => void;
  onSendMessage?: (message: string) => void;
  className?: string;
}

export const AIAdvisorCard: React.FC<AIAdvisorCardProps> = ({
  onSelectPrompt,
  onSendMessage,
  className = "",
}) => {
  const { userData } = useAuth();
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [fileAttachedToast, setFileAttachedToast] = useState(false);

  const studentName = userData?.displayName?.split(" ")[0] || "Kofi";

  const actionPills = [
    {
      id: "explain-ds",
      label: "Explain Data Structures",
      icon: Lightbulb,
      prompt: "Explain Data Structures and Algorithms with African engineering context and step-by-step examples.",
    },
    {
      id: "summarize-lecture",
      label: "Summarize Last Lecture",
      icon: FileText,
      prompt: "Summarize the key takeaways and core formulas from the last Engineering lecture on Data Structures.",
    },
    {
      id: "help-assignment",
      label: "Help with Assignment",
      icon: ClipboardList,
      prompt: "Help me break down and solve my Computer & Electrical Engineering assignment on Data Structures.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSendMessage) {
      onSendMessage(query);
    } else if (onSelectPrompt) {
      onSelectPrompt(query);
    }
    setQuery("");
  };

  const handlePillClick = (prompt: string) => {
    if (onSendMessage) {
      onSendMessage(prompt);
    } else if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
  };

  const handleAttachmentClick = () => {
    setFileAttachedToast(true);
    setTimeout(() => setFileAttachedToast(false), 2500);
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div
      id="ai-advisor-container"
      className={`relative w-full max-w-2xl mx-auto flex flex-col items-center justify-between text-[#ded8cb] font-sans-body ${className}`}
    >
      {/* Top Header: AfriVersty AI in Luxury Serif Gold */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#f2ca50] drop-shadow-sm">
          AfriVersty AI
        </h2>
        <p className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#a89e8b] uppercase mt-2 font-sans-body">
          YOUR DEDICATED ACADEMIC MENTOR
        </p>
      </div>

      {/* Main Advisor Greeting Card */}
      <div
        id="ai-advisor-message-card"
        className="w-full bg-[#1a1815] border border-[#2c2821] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl transition-all"
      >
        {/* Card Header: Mascot Icon Badge, Title, Timestamp */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2b2315] border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] shadow-sm">
              <Bot size={19} className="text-[#f2ca50]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#f5f2eb] leading-tight">
                AfriVersty AI
              </h3>
            </div>
          </div>
          <span className="text-xs text-[#8a8275] font-medium font-mono">
            10:42 AM
          </span>
        </div>

        {/* Advisor Message Body */}
        <p className="text-sm sm:text-[15px] text-[#ded8cb] leading-relaxed mb-5 font-normal">
          Greetings, {studentName}. I see you're currently reviewing Data Structures for your Engineering module. How can I assist you with your studies today?
        </p>

        {/* Action / Suggestion Pills */}
        <div className="flex flex-wrap gap-2.5">
          {actionPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <button
                key={pill.id}
                type="button"
                id={`action-pill-${pill.id}`}
                onClick={() => handlePillClick(pill.prompt)}
                className="px-3.5 py-2 rounded-xl bg-[#26221c] hover:bg-[#332e26] border border-[#3d372e] hover:border-[#d4af37]/40 text-xs sm:text-[13px] font-medium text-[#f5f2eb] flex items-center gap-2 transition-all duration-150 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                <Icon size={14} className="text-[#f2ca50] shrink-0" />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attachment Toast */}
      {fileAttachedToast && (
        <div className="mt-3 px-3 py-1.5 rounded-xl bg-[#26221c] border border-[#d4af37]/40 text-xs text-[#f2ca50] flex items-center gap-2 animate-fadeIn">
          <Paperclip size={12} />
          <span>Upload PDF/Notes for Data Structures syllabus reference</span>
        </div>
      )}

      {/* Bottom Chat Input Bar */}
      <form
        onSubmit={handleSubmit}
        id="ai-advisor-input-bar"
        className="w-full mt-6 sm:mt-8 bg-[#181613] border border-[#2e2a22] rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 shadow-2xl focus-within:border-[#d4af37]/60 focus-within:ring-1 focus-within:ring-[#d4af37]/30 transition-all"
      >
        {/* Attachment Button (Paperclip) */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          id="ai-advisor-attach-btn"
          className="p-2 sm:p-2.5 rounded-xl text-[#8a8275] hover:text-[#ded8cb] hover:bg-[#25211b] transition-all cursor-pointer shrink-0"
          title="Attach Course Syllabus, Notes, or Code file"
        >
          <Paperclip size={18} />
        </button>

        {/* Text Input */}
        <input
          id="ai-advisor-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Message your academic mentor..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-[#f5f2eb] placeholder:text-[#787164] focus:outline-none font-sans-body"
        />

        {/* Microphone Voice Button */}
        <button
          type="button"
          onClick={toggleVoice}
          id="ai-advisor-mic-btn"
          className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
            isListening
              ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
              : "text-[#8a8275] hover:text-[#f2ca50] hover:bg-[#25211b]"
          }`}
          title={isListening ? "Listening... (Click to stop)" : "Dictate your question with Voice"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Send Button (Warm Gold Squircle with Dark Paper Plane) */}
        <button
          type="submit"
          disabled={!query.trim()}
          id="ai-advisor-send-btn"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#c59e47] hover:bg-[#d4af37] active:scale-95 disabled:opacity-40 disabled:hover:bg-[#c59e47] text-[#1c180f] flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
          title="Send message to AfriVersty AI"
        >
          <Send size={16} className="fill-[#1c180f] translate-x-0.5 -translate-y-0.5" />
        </button>
      </form>
    </div>
  );
};
