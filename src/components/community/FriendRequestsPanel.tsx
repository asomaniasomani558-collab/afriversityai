import React, { useState } from "react";
import { useCommunity } from "../../context/CommunityContext";
import { StudentProfile } from "../../types/community";
import {
  UserCheck,
  UserX,
  Clock,
  Check,
  Sparkles,
  Users,
  GraduationCap,
  ShieldCheck,
  Radio,
  Send,
  UserPlus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface FriendRequestsPanelProps {
  onViewProfile?: (student: StudentProfile) => void;
  onOpenDirectChat?: (student: StudentProfile) => void;
}

export const FriendRequestsPanel: React.FC<FriendRequestsPanelProps> = ({
  onViewProfile,
  onOpenDirectChat,
}) => {
  const {
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    students,
  } = useCommunity();

  const [filterType, setFilterType] = useState<"incoming" | "outgoing">("incoming");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const receivedRequests = friendRequests.filter((r) => r.type === "received");
  const sentRequests = friendRequests.filter((r) => r.type === "sent");

  const handleAccept = async (req: (typeof friendRequests)[0]) => {
    setProcessingId(req.id);
    try {
      await acceptFriendRequest(req);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (reqId: string) => {
    setProcessingId(reqId);
    try {
      await declineFriendRequest(reqId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (reqId: string) => {
    setProcessingId(reqId);
    try {
      await cancelFriendRequest(reqId);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div id="friend-requests-panel" className="space-y-6">
      {/* Panel Header */}
      <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#9333ea] text-[#0c0a09]">
                <Users size={20} className="text-[#0c0a09]" />
              </div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#e5e2e1]">
                Friend & Connection Requests
              </h2>
            </div>
            <p className="text-xs text-[#a8a29e] max-w-xl">
              Manage incoming academic networking invitations from peer scholars across African universities. Real-time synchronizations are powered by Cloud Firestore.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Real-time Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Firestore Sync</span>
            </div>
          </div>
        </div>

        {/* Tab switcher: Incoming vs Outgoing */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#262018]">
          <button
            onClick={() => setFilterType("incoming")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filterType === "incoming"
                ? "bg-[#f2ca50] text-[#0c0a09] shadow-md"
                : "bg-[#201d18] text-[#c5bcab] hover:text-[#f5f5f4] border border-[#383126]"
            }`}
          >
            <span>Incoming Requests</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                filterType === "incoming"
                  ? "bg-[#0c0a09]/20 text-[#0c0a09]"
                  : "bg-[#2d271f] text-[#f2ca50]"
              }`}
            >
              {receivedRequests.length}
            </span>
          </button>

          <button
            onClick={() => setFilterType("outgoing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              filterType === "outgoing"
                ? "bg-[#f2ca50] text-[#0c0a09] shadow-md"
                : "bg-[#201d18] text-[#c5bcab] hover:text-[#f5f5f4] border border-[#383126]"
            }`}
          >
            <span>Sent Requests</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                filterType === "outgoing"
                  ? "bg-[#0c0a09]/20 text-[#0c0a09]"
                  : "bg-[#2d271f] text-[#a8a29e]"
              }`}
            >
              {sentRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      {filterType === "incoming" ? (
        <div className="space-y-3">
          {receivedRequests.length > 0 ? (
            receivedRequests.map((req) => {
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
                  skills: ["Academic Research", "Collaboration"],
                  interests: ["Innovation"],
                  languages: ["English"],
                  opportunityInterests: [],
                  competitionInterests: [],
                  presenceStatus: "online",
                  lastActive: "Just now",
                  mutualFriendsCount: req.mutualFriendsCount || 1,
                  compatibilityScore: 92,
                  friendsCount: 12,
                  joinedCommunitiesCount: 3,
                  projectsCount: 2,
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

              const isProcessing = processingId === req.id;

              return (
                <div
                  key={req.id}
                  id={`friend-request-${req.id}`}
                  className="bg-[#181613] rounded-2xl border border-[#332c22] hover:border-[#f2ca50]/40 p-4 sm:p-5 transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Scholar Information */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={req.fromUserAvatar || studentProfile.avatar}
                        alt={req.fromUserName}
                        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#d4af37]/30"
                      />
                      <span className="absolute bottom-0 right-0 text-base leading-none">
                        {req.fromUserFlag || studentProfile.countryFlag}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          onClick={() => onViewProfile && onViewProfile(studentProfile)}
                          className="font-serif-title text-base sm:text-lg font-bold text-[#f5f5f4] hover:text-[#f2ca50] cursor-pointer transition-colors truncate"
                        >
                          {req.fromUserName}
                        </h4>
                        <span className="text-[10px] font-semibold text-[#f2ca50] bg-[#221e18] px-2 py-0.5 rounded-full border border-[#4d4635]/40">
                          {studentProfile.compatibilityScore || 85}% Match
                        </span>
                      </div>

                      <p className="text-xs text-[#d0c5af] flex items-center gap-1.5 truncate">
                        <GraduationCap size={13} className="text-[#f2ca50] shrink-0" />
                        <span>
                          {req.fromUserUniversity} &bull; {req.fromUserField}
                        </span>
                      </p>

                      {req.note && (
                        <p className="text-xs text-[#a8a29e] italic bg-[#201d18] p-2 rounded-xl border border-[#2d271f] mt-1">
                          "{req.note}"
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-[#8c827a] pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#a8a29e]" />
                          <span>Received {req.createdAt}</span>
                        </span>
                        <span>&bull;</span>
                        <span>{req.mutualFriendsCount || 1} mutual connection</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Accept & Decline */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262018] w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleAccept(req)}
                      disabled={isProcessing}
                      className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#0c0a09] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <UserCheck size={14} />
                      <span>{isProcessing ? "Connecting..." : "Accept Request"}</span>
                    </button>

                    <button
                      onClick={() => handleDecline(req.id)}
                      disabled={isProcessing}
                      className="bg-[#201d18] hover:bg-[#2b251e] text-[#d6d3d1] hover:text-[#f87171] border border-[#383126] font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <UserX size={14} />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#201d18] border border-[#383126] text-[#f2ca50] flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <h3 className="text-base font-bold text-[#e5e2e1]">All caught up!</h3>
              <p className="text-xs text-[#a8a29e] max-w-sm mx-auto">
                You have no pending incoming connection requests. Explore the student directory to discover and connect with scholars across the continent.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {sentRequests.length > 0 ? (
            sentRequests.map((req) => (
              <div
                key={req.id}
                id={`sent-request-${req.id}`}
                className="bg-[#181613] rounded-2xl border border-[#332c22] p-4 sm:p-5 transition-all shadow-md flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-[#241f19] border border-[#3c3427] flex items-center justify-center text-[#f2ca50] font-bold shrink-0">
                    <Send size={16} />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-sm font-bold text-[#f5f5f4] truncate">
                      Request sent to student {req.toUserId}
                    </h4>
                    <p className="text-xs text-[#a8a29e] flex items-center gap-1.5">
                      <Clock size={11} />
                      <span>Pending acceptance &bull; Sent {req.createdAt}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(req.id)}
                  disabled={processingId === req.id}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#201d18] hover:bg-[#2a221b] text-[#a8a29e] hover:text-[#f87171] border border-[#383126] transition-all cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            ))
          ) : (
            <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#201d18] border border-[#383126] text-[#a8a29e] flex items-center justify-center mx-auto">
                <Send size={20} />
              </div>
              <h3 className="text-base font-bold text-[#e5e2e1]">No pending outgoing requests</h3>
              <p className="text-xs text-[#a8a29e] max-w-sm mx-auto">
                Requests you send to other scholars will appear here while awaiting their confirmation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
