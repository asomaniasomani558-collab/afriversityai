import React, { useState, useEffect } from "react";
import {
  Mic,
  Volume2,
  Trash2,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Clock,
  Radio,
  Search,
  Check,
  Compass,
  X,
  ChevronRight,
} from "lucide-react";
import { VoiceCommandRecord } from "../types";
import {
  subscribeVoiceCommands,
  deleteVoiceCommand,
  clearVoiceCommandHistory,
} from "../services/voiceHistoryService";

interface VoiceCommandHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onReplayInteraction: (command: string) => void;
}

export const VoiceCommandHistoryModal: React.FC<VoiceCommandHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  onReplayInteraction,
}) => {
  const [records, setRecords] = useState<VoiceCommandRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "wake-word" | "ai-assistant" | "gemini-live">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeVoiceCommands(userId, (newRecords) => {
      setRecords(newRecords);
    });
    return () => unsubscribe();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.discipline && rec.discipline.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSource = filterSource === "all" || rec.source === filterSource;

    return matchesSearch && matchesSource;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteVoiceCommand(userId, id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear your entire voice interaction history?")) {
      setIsClearing(true);
      await clearVoiceCommandHistory(userId);
      setRecords([]);
      setIsClearing(false);
    }
  };

  const getSourceBadge = (source: VoiceCommandRecord["source"]) => {
    switch (source) {
      case "wake-word":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Radio size={10} className="text-amber-400" />
            Wake Word ("Hey")
          </span>
        );
      case "gemini-live":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Sparkles size={10} className="text-purple-400" />
            Gemini Live Voice
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Mic size={10} className="text-emerald-400" />
            Voice Command
          </span>
        );
    }
  };

  return (
    <div
      id="voice-command-history-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-[#14120e] border border-[#d4af37]/35 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#2d261b] bg-[#1a1712]/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37]/25 to-[#f2ca50]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#f2ca50] shadow-sm">
              <Mic size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[#f5f2eb] tracking-wide">
                  Recent Spoken Voice Commands & AI Responses
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#f2ca50] border border-[#d4af37]/35">
                  {records.length} Saved
                </span>
              </div>
              <p className="text-[11px] text-[#99907c] mt-0.5">
                Revisit past voice questions, wake commands, and AI spoken guidance saved in your persistent Firestore database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button
                type="button"
                id="clear-voice-history-btn"
                onClick={handleClearAll}
                disabled={isClearing}
                className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/30 hover:bg-red-900/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Clear all stored voice command records"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            )}
            <button
              type="button"
              id="close-voice-history-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-[#99907c] hover:text-white hover:bg-[#262017] transition-all cursor-pointer"
              title="Close Voice Command History"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-5 sm:px-6 py-3 bg-[#171410] border-b border-[#2d261b] flex flex-wrap items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past voice commands or AI responses..."
              className="w-full bg-[#100e0b] border border-[#3b3223] rounded-xl pl-9 pr-3 py-2 text-xs text-[#ded8cb] placeholder-[#7d7565] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Filter Badges */}
          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "All Voices" },
              { id: "wake-word", label: "Wake Word" },
              { id: "ai-assistant", label: "Voice Prompts" },
              { id: "gemini-live", label: "Gemini Live" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterSource(f.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterSource === f.id
                    ? "bg-[#d4af37] text-[#12100d] shadow-sm font-bold"
                    : "bg-[#201c17] text-[#99907c] hover:text-[#ded8cb] border border-[#3b3223]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Record Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="py-12 text-center text-[#99907c] flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#201c17] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] mb-3">
                <Mic size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#ded8cb] mb-1">No Spoken Interactions Found</h4>
              <p className="text-xs max-w-sm text-[#7d7568] leading-relaxed">
                Try asking a question using your microphone, or say <strong className="text-[#f2ca50]">"Hey"</strong>, <strong className="text-[#f2ca50]">"Hello"</strong>, or <strong className="text-[#f2ca50]">"AfriVersty"</strong> to start an instant voice conversation.
              </p>
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#181510] border border-[#382e1e] hover:border-[#d4af37]/50 rounded-2xl p-4 sm:p-5 transition-all shadow-sm group hover:shadow-md relative"
              >
                {/* Card Header: Metadata + Actions */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSourceBadge(rec.source)}
                    {rec.discipline && (
                      <span className="text-[10px] text-[#99907c] flex items-center gap-1 font-mono">
                        <Compass size={11} className="text-[#f2ca50]" />
                        {rec.discipline}
                      </span>
                    )}
                    <span className="text-[10px] text-[#7d7568] flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(rec.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &bull;{" "}
                      {new Date(rec.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Ask Again / Replay prompt */}
                    <button
                      type="button"
                      onClick={() => {
                        onReplayInteraction(rec.command);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#2a2316] hover:bg-[#3d321d] border border-[#d4af37]/30 text-[#f2ca50] text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Send this voice prompt to the AI mentor again"
                    >
                      <RotateCcw size={11} />
                      <span>Re-ask</span>
                    </button>

                    {/* Delete item */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, rec.id)}
                      className="p-1 rounded-lg text-[#7d7568] hover:text-red-400 hover:bg-[#261818] transition-colors cursor-pointer"
                      title="Delete this record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Spoken Command */}
                <div className="mb-3 pl-3 border-l-2 border-[#f2ca50] py-0.5">
                  <div className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                    <Mic size={12} />
                    <span>Your Spoken Voice Command:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#f5f2eb]">
                    "{rec.command}"
                  </p>
                </div>

                {/* AI Spoken Response */}
                <div className="bg-[#12100d] rounded-xl p-3 border border-[#2b2419]">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="text-[10px] font-bold text-[#99907c] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={11} className="text-[#f2ca50]" />
                      <span>AI Spoken Guidance:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(rec.response, rec.id)}
                      className="text-[10px] text-[#99907c] hover:text-[#f2ca50] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy AI response"
                    >
                      {copiedId === rec.id ? (
                        <>
                          <Check size={11} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#ded8cb] leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                    {rec.response}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-[#1a1712] border-t border-[#2d261b] flex items-center justify-between text-xs text-[#99907c]">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Radio size={12} className="text-[#f2ca50]" />
            Say <strong className="text-[#f2ca50]">"Hey"</strong>, <strong className="text-[#f2ca50]">"Hello"</strong>, or <strong className="text-[#f2ca50]">"AfriVersty"</strong> anytime to open Live Voice.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#262017] hover:bg-[#332b1f] text-[#ded8cb] border border-[#d4af37]/30 text-xs font-semibold cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
