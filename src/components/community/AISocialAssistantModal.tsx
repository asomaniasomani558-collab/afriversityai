import React, { useState } from "react";
import { StudentProfile } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  X,
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  User,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface AISocialAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (student: StudentProfile) => void;
}

interface MessageHistory {
  id: string;
  sender: "ai" | "user";
  text: string;
  matchedStudents?: StudentProfile[];
}

export const AISocialAssistantModal: React.FC<AISocialAssistantModalProps> = ({
  isOpen,
  onClose,
  onViewProfile,
}) => {
  const { students, openDirectChatWith } = useCommunity();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<MessageHistory[]>([
    {
      id: "init-1",
      sender: "ai",
      text: "Salibonani! I am your Afriversity AI Scholar Matcher. Tell me what you're working on, what university you're targeting, or what kind of peer or mentor you want to connect with across Africa.",
    },
  ]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Find scholars in Ghana doing AI & Machine Learning",
    "Show me students targeting Mastercard Foundation scholarships",
    "Find students at University of Cape Town in Astrophysics or Data Science",
    "Connect me with winners of African ML Hackathons",
  ];

  const handleAsk = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: MessageHistory = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsSearching(true);

    setTimeout(() => {
      const q = queryText.toLowerCase();
      let matched = students.filter((s) => {
        return (
          (q.includes("ghana") && s.country === "Ghana") ||
          (q.includes("nigeria") && s.country === "Nigeria") ||
          (q.includes("cape town") && s.university.includes("Cape Town")) ||
          (q.includes("ai") && (s.fieldOfStudy.includes("Artificial Intelligence") || s.skills.includes("PyTorch"))) ||
          (q.includes("scholarship") && s.opportunityInterests.length > 0) ||
          (q.includes("hackathon") && s.competitionInterests.length > 0) ||
          s.skills.some((sk) => q.includes(sk.toLowerCase())) ||
          s.fieldOfStudy.toLowerCase().includes(q)
        );
      });

      if (matched.length === 0) {
        matched = students.slice(0, 3);
      }

      const aiReply: MessageHistory = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `I discovered ${matched.length} African scholars with strong academic synergy matching your goal:`,
        matchedStudents: matched,
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#14120e] border border-[#9333ea]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#20152b] via-[#16120d] to-[#1d170f] border-b border-[#3c2f4c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9333ea] to-[#f59e0b] p-0.5 flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-[#0c0a09]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-title">
                Afriversity AI Scholar Matcher
              </h3>
              <p className="text-[11px] text-[#d8b4fe]">
                Natural Language Pan-African Matchmaking & Opportunity Peer Finder
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8c827a] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="shrink-0">
                {msg.sender === "ai" ? (
                  <div className="w-8 h-8 rounded-full bg-[#9333ea] text-white flex items-center justify-center shadow">
                    <Bot size={16} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#f2ca50] text-[#0c0a09] flex items-center justify-center font-bold text-xs">
                    <User size={16} />
                  </div>
                )}
              </div>

              <div
                className={`max-w-[80%] space-y-3 ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#9333ea] text-white rounded-tr-none"
                      : "bg-[#1e1814] text-[#d6d3d1] border border-[#3c3427] rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Matched Student Cards in AI message */}
                {msg.matchedStudents && (
                  <div className="space-y-2 pt-1">
                    {msg.matchedStudents.map((stu) => (
                      <div
                        key={stu.id}
                        onClick={() => {
                          onClose();
                          onViewProfile(stu);
                        }}
                        className="p-3 rounded-2xl bg-[#1a1420] border border-[#7e22ce]/30 hover:border-[#f2ca50] flex items-center justify-between gap-3 cursor-pointer transition-all shadow-md group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={stu.avatar}
                            alt={stu.name}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#d4af37]/30 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] flex items-center gap-1.5 truncate">
                              <span>{stu.name}</span>
                              <span>{stu.countryFlag}</span>
                              <span className="text-[10px] text-[#f59e0b] font-mono">
                                ({stu.compatibilityScore}% Synergy)
                              </span>
                            </div>
                            <div className="text-[11px] text-[#a8a29e] truncate">
                              {stu.university} • {stu.fieldOfStudy}
                            </div>
                            <div className="text-[10px] text-[#c084fc] truncate mt-0.5">
                              Skills: {stu.skills.slice(0, 3).join(", ")}
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-[#281b36] text-[#f2ca50] group-hover:bg-[#f2ca50] group-hover:text-[#0c0a09] transition-colors shrink-0">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSearching && (
            <div className="flex items-center gap-2 p-3 bg-[#1e1814] rounded-2xl text-xs text-[#f2ca50] max-w-xs animate-pulse">
              <Sparkles size={14} className="animate-spin" />
              <span>Analyzing African scholar dataset & skill graphs...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-[#16120d] border-t border-[#2d271f] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleAsk(prompt)}
              className="px-2.5 py-1 rounded-lg bg-[#221c15] hover:bg-[#30261c] border border-[#3c3427] text-[#d0c5af] whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuery);
          }}
          className="p-3 sm:p-4 bg-[#18140f] border-t border-[#2d271f] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI: 'Connect me with a student who knows Python and ROS 2 in Kenya'..."
            className="flex-1 bg-[#12100d] border border-[#3c3427] focus:border-[#f2ca50] rounded-xl py-2.5 px-4 text-xs sm:text-sm text-[#f5f5f4] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-[#f2ca50] text-[#0c0a09] font-bold disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
