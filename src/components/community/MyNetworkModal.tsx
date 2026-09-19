import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  X,
  Check,
  Building2,
  GraduationCap,
  MapPin,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { StudentProfile } from "../../types/community";

interface MyNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDirectChat?: (student: StudentProfile) => void;
  onViewProfile?: (student: StudentProfile) => void;
}

interface InvitationItem {
  id: string;
  name: string;
  avatar: string;
  country: string;
  flag: string;
  university: string;
  field: string;
  mutualCount: number;
  timeAgo: string;
  note?: string;
}

export const MyNetworkModal: React.FC<MyNetworkModalProps> = ({
  isOpen,
  onClose,
  onOpenDirectChat,
  onViewProfile,
}) => {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState<"invitations" | "connections" | "discover">("invitations");
  const [searchFilter, setSearchFilter] = useState("");

  const [invitations, setInvitations] = useState<InvitationItem[]>([
    {
      id: "inv-1",
      name: "Chinedu Okafor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      country: "Nigeria",
      flag: "🇳🇬",
      university: "University of Lagos",
      field: "Data Science & AI",
      mutualCount: 12,
      timeAgo: "2 hours ago",
      note: "Hi Kojo! Saw your post on Afriversity about the IoT solar tracker. Would love to connect and exchange research notes!",
    },
    {
      id: "inv-2",
      name: "Fatima Al-Mansoor",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      country: "Egypt",
      flag: "🇪🇬",
      university: "Cairo University",
      field: "Renewable Energy Engineering",
      mutualCount: 7,
      timeAgo: "1 day ago",
      note: "Connecting across North and West African universities for the Pan-African CleanTech Challenge.",
    },
  ]);

  const [myConnections, setMyConnections] = useState([
    {
      id: "con-1",
      name: "Aisha Mohammed",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      country: "Nigeria",
      flag: "🇳🇬",
      university: "University of Ibadan",
      field: "Computer Science • UI",
      connectedDate: "Connected 2 days ago",
    },
    {
      id: "con-2",
      name: "Ama Serwaa",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      country: "Ghana",
      flag: "🇬🇭",
      university: "University of Ghana",
      field: "Computer Science",
      connectedDate: "Connected 1 week ago",
    },
    {
      id: "con-3",
      name: "Kwame Mensah",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      country: "Ghana",
      flag: "🇬🇭",
      university: "KNUST",
      field: "Engineering",
      connectedDate: "Connected 2 weeks ago",
    },
    {
      id: "con-4",
      name: "Grace Ndlovu",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
      country: "South Africa",
      flag: "🇿🇦",
      university: "University of Cape Town",
      field: "Business • UCT",
      connectedDate: "Connected 3 weeks ago",
    },
  ]);

  const handleAccept = (inv: InvitationItem) => {
    setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    setMyConnections((prev) => [
      {
        id: inv.id,
        name: inv.name,
        avatar: inv.avatar,
        country: inv.country,
        flag: inv.flag,
        university: inv.university,
        field: inv.field,
        connectedDate: "Connected just now",
      },
      ...prev,
    ]);
  };

  const handleIgnore = (invId: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== invId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#14120e] border border-[#d4af37]/40 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-[#1c1813] px-6 py-4 border-b border-[#3d311c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#241f18] border border-[#3d311c] text-[#f2ca50] flex items-center justify-center shadow-inner">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#f5f5f4] font-serif-title">
                My Pan-African Network
              </h2>
              <p className="text-xs text-[#a8a29e]">
                Manage connections, invitations, and academic peer collaborations.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a8a29e] hover:text-[#f5f5f4] hover:bg-[#2c2417] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="px-6 py-3 bg-[#181510] border-b border-[#2d2417] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab("invitations")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === "invitations"
                  ? "bg-[#f2ca50] text-[#0c0a09]"
                  : "bg-[#241f18] text-[#d0c5af] hover:text-[#f2ca50]"
              }`}
            >
              Invitations ({invitations.length})
            </button>
            <button
              onClick={() => setActiveSubTab("connections")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === "connections"
                  ? "bg-[#f2ca50] text-[#0c0a09]"
                  : "bg-[#241f18] text-[#d0c5af] hover:text-[#f2ca50]"
              }`}
            >
              Connections ({128 + (4 - myConnections.length) * 0})
            </button>
          </div>

          {/* Search */}
          <div className="relative flex items-center">
            <Search size={13} className="absolute left-3 text-[#8c827a]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search network..."
              className="bg-[#100e0b] border border-[#332a19] focus:border-[#f2ca50] rounded-full py-1 pl-8 pr-3 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#100e0b]">
          {activeSubTab === "invitations" && (
            <div className="space-y-3">
              {invitations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#a8a29e]">
                  No pending invitations right now! You're all caught up.
                </div>
              ) : (
                invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-[#16130f] border border-[#332917] hover:border-[#544324] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={inv.avatar}
                        alt={inv.name}
                        className="w-12 h-12 rounded-full object-cover ring-1 ring-[#d4af37]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#f5f5f4]">
                            {inv.name}
                          </span>
                          <span>{inv.flag}</span>
                        </div>
                        <div className="text-xs text-[#a8a29e] mt-0.5">
                          {inv.university} &bull; {inv.field}
                        </div>
                        {inv.note && (
                          <p className="text-xs text-[#d0c5af] italic mt-1.5 bg-[#201a13] p-2 rounded-xl border border-[#3d311c]/60">
                            &ldquo;{inv.note}&rdquo;
                          </p>
                        )}
                        <span className="text-[10px] text-[#8c827a] block mt-1">
                          {inv.mutualCount} mutual connections &bull; {inv.timeAgo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleIgnore(inv.id)}
                        className="px-3.5 py-1.5 rounded-full border border-[#3d311c] text-xs font-bold text-[#a8a29e] hover:text-[#f5f5f4] hover:bg-[#241f18] transition-colors"
                      >
                        Ignore
                      </button>
                      <button
                        onClick={() => handleAccept(inv)}
                        className="px-4 py-1.5 rounded-full bg-[#f2ca50] text-[#0c0a09] text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSubTab === "connections" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {myConnections
                .filter((c) =>
                  c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  c.university.toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map((con) => (
                  <div
                    key={con.id}
                    className="bg-[#16130f] border border-[#332917] p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={con.avatar}
                        alt={con.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3d311c]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#f5f5f4] truncate">
                            {con.name}
                          </span>
                          <span className="text-xs">{con.flag}</span>
                        </div>
                        <p className="text-[11px] text-[#a8a29e] truncate">
                          {con.university}
                        </p>
                        <span className="text-[10px] text-[#8c827a] block">
                          {con.connectedDate}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenDirectChat) {
                          onOpenDirectChat({
                            id: con.id,
                            name: con.name,
                            avatar: con.avatar,
                            country: con.country,
                            countryFlag: con.flag,
                            university: con.university,
                            fieldOfStudy: con.field,
                            careerGoal: "Software Engineer",
                            graduationYear: "2026",
                            bio: "",
                            skills: [],
                            interests: [],
                            languages: [],
                            opportunityInterests: [],
                            competitionInterests: [],
                            presenceStatus: "online",
                            lastActive: "Now",
                            mutualFriendsCount: 5,
                            compatibilityScore: 92,
                            friendsCount: 50,
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
                          });
                        }
                      }}
                      className="p-2 rounded-xl bg-[#241f18] hover:bg-[#332a19] text-[#f2ca50] hover:text-[#ffe088] transition-colors shrink-0"
                      title="Direct P2P Message"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
