import React, { useState } from "react";
import { StudentProfile } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  X,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Languages,
  Award,
  BookOpen,
  Trophy,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Clock,
  Flag,
  Ban,
  Share2,
  ExternalLink,
  Target,
  FileCheck,
} from "lucide-react";

interface StudentProfileModalProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReport?: (student: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
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

  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !student) return null;

  const friendStatus = isFriend(student.id);
  const requestStatus = hasPendingRequestWith(student.id);
  const presence = getStudentPresence(student.id);

  const handleConnect = async () => {
    if (friendStatus || requestStatus) return;
    setIsSending(true);
    await sendFriendRequest(student);
    setIsSending(false);
  };

  const handleChat = () => {
    onClose();
    openDirectChatWith(student);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://afriversity.org/scholar/${student.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#12100d] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header with Pan-African Artwork Motif */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-[#1e170f] via-[#2d1b40] to-[#1a1209] overflow-hidden border-b border-[#3c3427]">
          {/* Subtle Geometric Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* African Glow Elements */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-[#9333ea]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close & Share Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-[#d4af37]/30 text-[#d6d3d1] hover:text-[#f2ca50] transition-colors"
              title="Share profile link"
            >
              {copied ? <CheckCircle size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 border border-[#d4af37]/30 text-[#d6d3d1] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Verified Badge Ribbon */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/40 text-[#f2ca50] text-xs font-bold shadow-md">
            <ShieldCheck size={14} className="text-[#f2ca50]" />
            <span>Afriversity Verified Scholar</span>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 relative">
          {/* Header Row: Avatar + Main Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-[#2d271f]">
            {/* Avatar with Live Status */}
            <div className="relative">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#d4af37] via-[#9333ea] to-[#f59e0b] shadow-2xl overflow-hidden transition-all ${
                  presence.status === "online"
                    ? "ring-4 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    : presence.status === "away"
                    ? "ring-4 ring-amber-400"
                    : "ring-4 ring-stone-700"
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
                className={`absolute bottom-1 right-1 w-6 h-6 rounded-full ring-4 ring-[#12100d] flex items-center justify-center ${
                  presence.status === "online"
                    ? "bg-emerald-500 shadow-[0_0_12px_#10b981]"
                    : presence.status === "away"
                    ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                    : "bg-stone-500"
                }`}
                title={`Live Presence: ${presence.label}`}
              >
                {presence.status === "online" && (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
                )}
              </span>
            </div>

            {/* Quick Actions (Connect, Message, More) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {friendStatus ? (
                <button
                  type="button"
                  onClick={handleChat}
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle size={14} />
                  <span>Connected Friend</span>
                </button>
              ) : requestStatus === "sent" ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-[#241f19] border border-[#443b2c] text-[#a8a29e] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  <Clock size={14} />
                  <span>Request Pending</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={isSending}
                  className="flex-1 sm:flex-initial py-2 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#e5bd3b] hover:to-[#d97706] text-[#0c0a09] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <UserPlus size={15} />
                  <span>{isSending ? "Sending..." : "Send Connection Request"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleChat}
                className="py-2 px-4 rounded-xl bg-[#241f19] hover:bg-[#2f2820] border border-[#d4af37]/40 hover:border-[#f2ca50] text-[#f2ca50] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <MessageSquare size={15} />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Name & Academic Credentials Info */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold font-serif-title text-[#f5f5f4] flex items-center gap-2">
                  <span>{student.name}</span>
                  <span className="text-xl" title={student.country}>
                    {student.countryFlag}
                  </span>
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#d0c5af] mt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} className="text-[#f2ca50]" />
                    <strong className="text-[#f5f5f4]">{student.university}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#a8a29e]" />
                    {student.country}
                  </span>
                  <span>•</span>
                  <span>Class of {student.graduationYear}</span>
                </div>

                {/* Live Real-Time Presence Indicator Pill (🟢, 🟡, ⚫) */}
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStudentPresenceDemo(student.id)}
                    title="Real-time Firestore Presence. Click to toggle status simulation."
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${presence.badgeClass} hover:brightness-125 cursor-pointer`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${presence.dotColor} ${
                        presence.status === "online" ? "animate-pulse" : ""
                      }`}
                    />
                    <span>
                      {presence.emoji} {presence.label}
                    </span>
                    <span className="text-[11px] opacity-75 font-normal">
                      • {presence.lastActiveText}
                    </span>
                  </button>
                </div>
              </div>

              {/* Match Score Box */}
              <div className="p-2.5 rounded-xl bg-[#241f19] border border-[#d4af37]/30 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f2ca50]/15 text-[#f2ca50]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-[10px] text-[#a8a29e] uppercase font-bold tracking-wider">
                    Compatibility
                  </div>
                  <div className="text-sm font-bold text-[#f2ca50]">
                    {student.compatibilityScore}% Synergy
                  </div>
                </div>
              </div>
            </div>

            {/* Match Reason Banner */}
            {student.matchReason && (
              <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-[#9333ea]/15 to-[#d4af37]/10 border border-[#9333ea]/30 text-xs text-[#e9d5ff] flex items-start gap-2.5">
                <Sparkles size={16} className="text-[#f2ca50] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{student.matchReason}</p>
              </div>
            )}
          </div>

          {/* Expanded Profile Tabs & Sections */}
          <div className="mt-6 space-y-6">
            {/* 1. Academic Bio */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-bold mb-2 flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>Academic Bio & Research Focus</span>
              </h4>
              <p className="text-sm text-[#d6d3d1] leading-relaxed bg-[#191612] p-4 rounded-xl border border-[#2d271f]">
                {student.bio}
              </p>
            </div>

            {/* 2. Target Pathway & Career Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#2d271f]">
                <div className="text-[11px] text-[#a8a29e] uppercase font-bold flex items-center gap-1.5 mb-1">
                  <GraduationCap size={13} className="text-[#f2ca50]" />
                  <span>Primary Discipline</span>
                </div>
                <div className="text-sm font-semibold text-[#f5f5f4]">
                  {student.fieldOfStudy}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-[#2d271f]">
                <div className="text-[11px] text-[#a8a29e] uppercase font-bold flex items-center gap-1.5 mb-1">
                  <Target size={13} className="text-[#f59e0b]" />
                  <span>Target Career Goal</span>
                </div>
                <div className="text-sm font-semibold text-[#f5f5f4]">
                  {student.careerGoal}
                </div>
              </div>
            </div>

            {/* 3. Student Passport Vault (Verified Badges, Olympiads, Hackathons) */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-bold mb-2.5 flex items-center gap-1.5">
                <Trophy size={14} />
                <span>Student Passport & Verified Honors</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {student.passportItems.length > 0 ? (
                  student.passportItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#1c1813] border border-[#3c3427] flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-[#f2ca50]/15 text-[#f2ca50] shrink-0">
                        {item.type === "hackathon" || item.type === "olympiad" ? (
                          <Trophy size={16} />
                        ) : (
                          <Award size={16} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#f5f5f4] truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#a8a29e] mt-0.5">
                          {item.issuer} • {item.date}
                        </div>
                        {item.verificationCode && (
                          <div className="text-[10px] text-[#f2ca50] font-mono mt-1">
                            ID: {item.verificationCode}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-xs text-[#8c827a] italic p-3 bg-[#191612] rounded-xl border border-[#2d271f]">
                    Verified academic passport entries will appear as honors are achieved.
                  </div>
                )}
              </div>
            </div>

            {/* 4. Skills, Languages & Opportunity Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Skills */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-bold mb-2">
                  Verified Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-[#241f19] border border-[#3c3427] text-xs text-[#d6d3d1] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-bold mb-2 flex items-center gap-1.5">
                  <Languages size={13} />
                  <span>Languages Spoken</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {student.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 rounded-lg bg-[#241f19] border border-[#3c3427] text-xs text-[#d6d3d1] font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Opportunity & Competition Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-bold mb-2">
                  Target Scholarships & Grants
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {student.opportunityInterests.map((opp) => (
                    <span
                      key={opp}
                      className="px-2.5 py-1 rounded-lg bg-[#2b1d3a] border border-[#7e22ce]/40 text-xs text-purple-200"
                    >
                      {opp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-[#d4af37] font-bold mb-2">
                  Target Competitions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {student.competitionInterests.map((comp) => (
                    <span
                      key={comp}
                      className="px-2.5 py-1 rounded-lg bg-[#2b1d3a] border border-[#7e22ce]/40 text-xs text-purple-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Safety Actions (Report / Block) */}
          <div className="mt-8 pt-4 border-t border-[#2d271f] flex items-center justify-between text-xs text-[#8c827a]">
            <span>Afriversity Trust & Safety Safe Community</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenReport) onOpenReport(student);
                }}
                className="hover:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <Flag size={13} /> Report Profile
              </button>
              <button
                onClick={() => {
                  blockUser(student.id);
                  onClose();
                }}
                className="hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Ban size={13} /> Block User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
