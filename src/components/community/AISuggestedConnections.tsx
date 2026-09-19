import React from "react";
import { AISuggestion, StudentProfile } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  Sparkles,
  UserPlus,
  MessageSquare,
  GraduationCap,
  Briefcase,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";

interface AISuggestedConnectionsProps {
  onViewProfile: (student: StudentProfile) => void;
  onOpenAIAssistant: () => void;
}

export const AISuggestedConnections: React.FC<AISuggestedConnectionsProps> = ({
  onViewProfile,
  onOpenAIAssistant,
}) => {
  const {
    aiSuggestions,
    sendFriendRequest,
    isFriend,
    hasPendingRequestWith,
    openDirectChatWith,
    getStudentPresence,
    toggleStudentPresenceDemo,
  } = useCommunity();

  if (aiSuggestions.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-[#1c1424]/90 via-[#15120d]/90 to-[#1e170f]/90 border border-[#9333ea]/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl mb-8 overflow-hidden">
      {/* Decorative Gold & Purple Nebula Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#9333ea]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner with Afriversity AI Assistant Trigger */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#3d2e4f]/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#9333ea] to-[#f59e0b] text-[#0c0a09]">
              <Sparkles size={18} className="text-[#0c0a09]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif-title text-[#f5f5f4] tracking-tight">
              AI Connection Recommendations
            </h3>
          </div>
          <p className="text-xs text-[#c084fc] mt-1">
            Smart academic synergy matching based on career trajectories, research goals & competitions across Africa.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#9333ea]/20 hover:bg-[#9333ea]/40 border border-[#9333ea]/50 text-purple-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
        >
          <Sparkles size={14} className="text-[#f2ca50]" />
          <span>Ask AI Match Assistant</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Grid of AI Recommended Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiSuggestions.map((item) => {
          const student = item.student;
          const friendStatus = isFriend(student.id);
          const requestStatus = hasPendingRequestWith(student.id);
          const presence = getStudentPresence(student.id);

          return (
            <div
              key={student.id}
              onClick={() => onViewProfile(student)}
              className="group relative bg-[#17121c]/80 hover:bg-[#201827] border border-[#7e22ce]/30 hover:border-[#f2ca50]/70 rounded-2xl p-4 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Avatar + Match Score */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#f59e0b] to-[#9333ea] transition-all overflow-hidden ${
                          presence.status === "online"
                            ? "ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            : presence.status === "away"
                            ? "ring-2 ring-amber-400"
                            : "ring-2 ring-stone-700"
                        }`}
                      >
                        <img
                          src={student.avatar}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-[#17121c] flex items-center justify-center ${
                          presence.status === "online"
                            ? "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                            : presence.status === "away"
                            ? "bg-amber-400"
                            : "bg-stone-500"
                        }`}
                        title={`Live Status: ${presence.label}`}
                      >
                        {presence.status === "online" && (
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                        )}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors flex items-center gap-1.5">
                        <span>{student.name}</span>
                        <span className="text-xs">{student.countryFlag}</span>
                      </h4>
                      <div className="text-[11px] text-[#d8b4fe] truncate max-w-[150px]">
                        {student.universityShort || student.university}
                      </div>
                      {/* Presence pill badge */}
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold border ${presence.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${presence.dotColor}`} />
                          <span>
                            {presence.emoji} {presence.label}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/40 text-[#f2ca50] text-[11px] font-bold shrink-0">
                    {item.matchScore}%
                  </div>
                </div>

                {/* AI Explanation Snippet */}
                <div className="p-2 rounded-xl bg-[#281b36]/60 border border-[#7e22ce]/20 text-[11px] text-[#e9d5ff] leading-snug my-2">
                  <span className="text-[#f59e0b] font-semibold">Why match: </span>
                  {item.aiExplanation}
                </div>

                {/* Shared Interest Chips */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.sharedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-0.5 rounded-md bg-[#381e4d]/60 border border-[#9333ea]/30 text-[10px] text-purple-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-[#3d2e4f]/40 flex items-center gap-2">
                {friendStatus ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDirectChatWith(student);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/60 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Check size={12} />
                    <span>Connected</span>
                  </button>
                ) : requestStatus === "sent" ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#241f19] text-[#a8a29e] text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
                  >
                    <Clock size={12} />
                    <span>Pending</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sendFriendRequest(student);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-[#0c0a09] text-xs font-bold flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow"
                  >
                    <UserPlus size={13} />
                    <span>Connect</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirectChatWith(student);
                  }}
                  className="p-1.5 rounded-lg bg-[#2b1e38] hover:bg-[#3b284e] text-[#f2ca50] border border-[#7e22ce]/40 transition-colors"
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
