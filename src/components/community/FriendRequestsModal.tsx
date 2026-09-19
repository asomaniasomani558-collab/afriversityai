import React from "react";
import { useCommunity } from "../../context/CommunityContext";
import { StudentProfile } from "../../types/community";
import {
  X,
  UserCheck,
  UserX,
  Clock,
  Check,
  Sparkles,
  Users,
  GraduationCap,
} from "lucide-react";

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (student: StudentProfile) => void;
}

export const FriendRequestsModal: React.FC<FriendRequestsModalProps> = ({
  isOpen,
  onClose,
  onViewProfile,
}) => {
  const {
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    students,
  } = useCommunity();

  if (!isOpen) return null;

  const receivedRequests = friendRequests.filter((r) => r.type === "received");
  const sentRequests = friendRequests.filter((r) => r.type === "sent");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-5 text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2d271f]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#9333ea] text-[#0c0a09]">
              <Users size={18} className="text-[#0c0a09]" />
            </div>
            <h3 className="text-lg font-bold font-serif-title">
              Connection Requests & Invites
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8c827a] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. Received Requests */}
        <div>
          <h4 className="text-xs uppercase font-bold text-[#f2ca50] mb-2 flex items-center justify-between">
            <span>Received Requests ({receivedRequests.length})</span>
          </h4>

          {receivedRequests.length > 0 ? (
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {receivedRequests.map((req) => {
                const studentProfile =
                  req.student ||
                  students.find((s) => s.id === req.fromUserId) ||
                  ({
                    id: req.fromUserId,
                    name: req.fromUserName,
                    avatar: req.fromUserAvatar,
                    country: req.fromUserCountry,
                    countryFlag: req.fromUserFlag,
                    university: req.fromUserUniversity,
                    fieldOfStudy: req.fromUserField,
                    careerGoal: "African Scholar",
                    graduationYear: "2026",
                    bio: "Afriversity Community Scholar",
                    skills: [],
                    interests: [],
                    languages: ["English"],
                    opportunityInterests: [],
                    competitionInterests: [],
                    presenceStatus: "online",
                    lastActive: "Just now",
                    mutualFriendsCount: 0,
                    compatibilityScore: 85,
                    friendsCount: 0,
                    joinedCommunitiesCount: 0,
                    projectsCount: 0,
                    privacySettings: {
                      whoCanMessage: "everyone",
                      whoCanFriendRequest: "everyone",
                      whoCanSeeProfile: "everyone",
                      showOnlineStatus: true,
                    },
                    passportItems: [],
                    achievements: [],
                    certificates: [],
                  } as StudentProfile);

                return (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-[#1d1813] border border-[#3c3427] flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onViewProfile(studentProfile);
                      }}
                      className="flex items-center gap-3 cursor-pointer min-w-0"
                    >
                      <img
                        src={req.fromUserAvatar || studentProfile.avatar}
                        alt={req.fromUserName || studentProfile.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-[#d4af37]/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#f5f5f4] truncate flex items-center gap-1">
                          <span>{req.fromUserName || studentProfile.name}</span>
                          <span>{req.fromUserFlag || studentProfile.countryFlag}</span>
                        </div>
                        <div className="text-[11px] text-[#a8a29e] truncate">
                          {req.fromUserUniversity || studentProfile.university} •{" "}
                          {req.fromUserField || studentProfile.fieldOfStudy}
                        </div>
                        <div className="text-[10px] text-[#8c827a] mt-0.5">
                          Received {req.createdAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => acceptFriendRequest(req)}
                        className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 shadow"
                        title="Accept request"
                      >
                        <Check size={14} />
                        <span className="hidden sm:inline">Accept</span>
                      </button>
                      <button
                        onClick={() => declineFriendRequest(req.id)}
                        className="p-2 rounded-xl bg-[#241f19] hover:bg-red-950/50 border border-[#3c3427] text-[#a8a29e] hover:text-red-300 text-xs"
                        title="Decline request"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#191510] border border-[#2d271f] text-center text-xs text-[#8c827a]">
              No incoming connection requests at the moment.
            </div>
          )}
        </div>

        {/* 2. Sent Requests */}
        <div>
          <h4 className="text-xs uppercase font-bold text-[#d4af37] mb-2">
            Sent Requests ({sentRequests.length})
          </h4>

          {sentRequests.length > 0 ? (
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {sentRequests.map((req) => {
                const targetStudent =
                  req.student || students.find((s) => s.id === req.toUserId);
                const targetName =
                  targetStudent?.name || req.toUserName || "African Scholar";
                const targetAvatar =
                  targetStudent?.avatar ||
                  req.toUserAvatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
                const targetUniversity =
                  targetStudent?.university ||
                  req.toUserUniversity ||
                  "Pan-African University";
                const targetFlag =
                  targetStudent?.countryFlag || req.toUserFlag || "🌍";

                return (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-[#1a1611] border border-[#2d271f] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={targetAvatar}
                        alt={targetName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-[#d4af37]/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-[#f5f5f4] truncate">
                          {targetName} {targetFlag}
                        </div>
                        <div className="text-[11px] text-[#a8a29e] truncate">
                          {targetUniversity}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => cancelFriendRequest(req.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#241f19] hover:bg-[#2d261d] text-[#8c827a] hover:text-red-400 border border-[#3c3427] text-[11px] shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#191510] border border-[#2d271f] text-center text-xs text-[#8c827a]">
              You have no pending outgoing requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
