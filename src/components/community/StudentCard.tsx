import React, { useState } from "react";
import {
  StudentProfile,
  PresenceStatus,
} from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  UserPlus,
  Check,
  Clock,
  MessageSquare,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Shield,
  MoreVertical,
  Flag,
  Ban,
  Award,
  BookOpen,
} from "lucide-react";

interface StudentCardProps {
  student: StudentProfile;
  onViewProfile: (student: StudentProfile) => void;
  onOpenReport?: (student: StudentProfile) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onViewProfile,
  onOpenReport,
}) => {
  const {
    sendFriendRequest,
    isFriend,
    hasPendingRequestWith,
    openDirectChatWith,
    blockUser,
    getStudentPresence,
    toggleStudentPresenceDemo,
  } = useCommunity();

  const [isSending, setIsSending] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const friendStatus = isFriend(student.id);
  const requestStatus = hasPendingRequestWith(student.id);
  const presence = getStudentPresence(student.id);

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (friendStatus || requestStatus) return;
    setIsSending(true);
    await sendFriendRequest(student);
    setIsSending(false);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirectChatWith(student);
  };

  return (
    <div
      id={`student-card-${student.id}`}
      onClick={() => onViewProfile(student)}
      className="group relative bg-[#14120e]/80 hover:bg-[#1c1914] border border-[#d4af37]/25 hover:border-[#f2ca50]/60 rounded-2xl p-5 shadow-xl hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-md"
    >
      {/* Subtle African Kente/Geometric Glow Top Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#9333ea] to-[#f59e0b] opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Card Header: Avatar, Online Status, Name, Match Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Avatar with Live Online/Away/Offline Presence Ring & Dot */}
          <div className="relative shrink-0">
            <div
              className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-[#7e22ce] transition-all overflow-hidden shadow-lg ${
                presence.status === "online"
                  ? "ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : presence.status === "away"
                  ? "ring-2 ring-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
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
            {/* Real-time Status indicator */}
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ring-2 ring-[#14120e] flex items-center justify-center ${
                presence.status === "online"
                  ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                  : presence.status === "away"
                  ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                  : "bg-stone-500"
              }`}
              title={`Live Presence: ${presence.label}`}
            >
              {presence.status === "online" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
              )}
            </span>
          </div>

          {/* Compatibility Match Badge */}
          <div className="flex flex-col items-end gap-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] text-[11px] font-bold tracking-wide shadow-sm">
              <Sparkles size={11} className="text-[#f2ca50] animate-pulse" />
              <span>{student.compatibilityScore}% Match</span>
            </div>

            {student.mutualFriendsCount > 0 && (
              <span className="text-[10px] text-[#a8a29e]">
                {student.mutualFriendsCount} mutual friends
              </span>
            )}
          </div>
        </div>

        {/* Name, Country Flag, and University */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors flex items-center gap-1.5 truncate">
              <span>{student.name}</span>
              <span className="text-sm shrink-0" title={student.country}>
                {student.countryFlag}
              </span>
            </h3>

            {/* Menu button */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-[#a8a29e] hover:text-[#f5f5f4] p-1 rounded-lg hover:bg-[#292524] transition-colors"
              >
                <MoreVertical size={15} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-7 w-44 bg-[#1f1b16] border border-[#d4af37]/30 rounded-xl shadow-2xl py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onViewProfile(student);
                    }}
                    className="w-full px-3 py-1.5 text-left text-[#d6d3d1] hover:bg-[#2e271e] hover:text-[#f2ca50] flex items-center gap-2"
                  >
                    <BookOpen size={13} /> View Passport
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      toggleStudentPresenceDemo(student.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-[#d6d3d1] hover:bg-[#2e271e] hover:text-[#f2ca50] flex items-center gap-2"
                  >
                    <span className="text-xs">🔄</span> Toggle Presence ({presence.emoji})
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (onOpenReport) onOpenReport(student);
                    }}
                    className="w-full px-3 py-1.5 text-left text-amber-300 hover:bg-[#2e271e] flex items-center gap-2"
                  >
                    <Flag size={13} /> Report
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      blockUser(student.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                  >
                    <Ban size={13} /> Block
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* University & Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#d0c5af] font-medium mt-0.5 truncate">
            <GraduationCap size={13} className="text-[#f2ca50] shrink-0" />
            <span className="truncate">{student.university}</span>
          </div>

          {/* Real-time Presence Indicator Badge (🟢 Online, 🟡 Away, ⚫ Offline) */}
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStudentPresenceDemo(student.id);
              }}
              title="Real-time Firestore Presence Status. Click to simulate status change."
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border transition-all ${presence.badgeClass} hover:brightness-125`}
            >
              <span
                className={`w-2 h-2 rounded-full ${presence.dotColor} ${
                  presence.status === "online" ? "animate-pulse" : ""
                }`}
              />
              <span>
                {presence.emoji} {presence.label}
              </span>
              {presence.status === "offline" && presence.lastActiveText && (
                <span className="text-[9.5px] opacity-75 font-normal">
                  • {presence.lastActiveText}
                </span>
              )}
            </button>
          </div>

          {/* Field of Study & Career Goal */}
          <div className="mt-2.5 space-y-1">
            <div className="text-xs text-[#e7e5e4] font-semibold flex items-start gap-1.5 leading-snug">
              <span className="text-[#a8a29e] font-normal text-[11px] shrink-0">Study:</span>
              <span className="truncate">{student.fieldOfStudy}</span>
            </div>
            <div className="text-[11px] text-[#f59e0b] flex items-center gap-1.5 truncate">
              <Briefcase size={11} className="shrink-0 text-[#f59e0b]" />
              <span className="truncate">Aim: {student.careerGoal}</span>
            </div>
          </div>

          {/* Academic Bio snippet */}
          <p className="text-xs text-[#a8a29e] mt-2 line-clamp-2 leading-relaxed">
            {student.bio}
          </p>

          {/* Key Skills Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {student.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-[#241f19] border border-[#3c3427] text-[10px] text-[#d6d3d1] font-medium"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-[#1f1b16] text-[10px] text-[#8c827a]">
                +{student.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-4 pt-3 border-t border-[#2d271f] flex items-center gap-2">
        {/* Connect Button */}
        {friendStatus ? (
          <button
            type="button"
            onClick={handleChat}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Check size={14} className="text-emerald-400" />
            <span>Connected</span>
          </button>
        ) : requestStatus === "sent" ? (
          <button
            type="button"
            disabled
            className="flex-1 py-2 px-3 rounded-xl bg-[#241f19] border border-[#443b2c] text-[#a8a29e] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
          >
            <Clock size={13} />
            <span>Pending</span>
          </button>
        ) : requestStatus === "received" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(student);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-[#9333ea]/30 hover:bg-[#9333ea]/50 border border-[#9333ea]/60 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>Respond</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            disabled={isSending}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#e5bd3b] hover:to-[#d97706] text-[#0c0a09] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <UserPlus size={14} />
            <span>{isSending ? "Sending..." : "Connect"}</span>
          </button>
        )}

        {/* Message Button */}
        <button
          type="button"
          onClick={handleChat}
          aria-label="Direct message"
          className="p-2 rounded-xl bg-[#241f19] hover:bg-[#2f2820] border border-[#443b2c] hover:border-[#f2ca50]/50 text-[#f5f5f4] hover:text-[#f2ca50] transition-all"
        >
          <MessageSquare size={15} />
        </button>
      </div>
    </div>
  );
};
