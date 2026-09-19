import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  StudentProfile,
  CommunityGroup,
  CommunityPost,
  CommunityChatMessage,
  MentorProfile,
  MentorshipRequest,
  Conversation,
  ChatMessage,
  NotificationItem,
  FriendRequest,
  ReportItem,
  StudentFilterState,
  AISuggestion,
  PresenceStatus,
  PrivacySettings,
  MessageAttachment,
  CommunityTabType,
} from "../types/community";
import {
  initialAfricanStudents,
  initialCommunities,
  initialCommunityPosts,
  initialMentors,
  initialConversations,
  initialFriendRequests,
  initialNotifications,
} from "../data/communityDemoData";
import { useAuth } from "./AuthContext";
import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "../lib/firebase";

export interface StudentPresenceInfo {
  status: PresenceStatus;
  label: string;
  dotColor: string;
  emoji: string;
  badgeClass: string;
  lastActiveText: string;
}

interface CommunityContextType {
  // Navigation
  activeCommunityTab: CommunityTabType;
  setActiveCommunityTab: (tab: CommunityTabType) => void;

  // Real-time Presence
  realtimePresence: Record<string, { status: PresenceStatus; lastActiveText?: string; updatedAt?: number }>;
  getStudentPresence: (studentId: string) => StudentPresenceInfo;
  toggleStudentPresenceDemo: (studentId: string) => Promise<void>;

  // Students & Discovery
  students: StudentProfile[];
  filteredStudents: StudentProfile[];
  friends: StudentProfile[];
  incomingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  friendRequests: FriendRequest[];
  unreadTotalMessages: number;
  filterState: StudentFilterState;
  setFilterState: (updater: Partial<StudentFilterState> | ((prev: StudentFilterState) => StudentFilterState)) => void;
  resetFilters: () => void;
  
  // Current User Profile & Presence
  mySocialProfile: StudentProfile;
  updateMySocialProfile: (updates: Partial<StudentProfile>) => void;
  setMyPresenceStatus: (status: PresenceStatus) => void;

  // Social Friend Actions
  sendFriendRequest: (student: StudentProfile) => Promise<boolean>;
  acceptFriendRequest: (request: FriendRequest) => Promise<boolean>;
  declineFriendRequest: (requestId: string) => Promise<boolean>;
  cancelFriendRequest: (requestId: string) => Promise<boolean>;
  removeFriend: (studentId: string) => Promise<boolean>;
  isFriend: (studentId: string) => boolean;
  hasPendingRequestWith: (studentId: string) => "sent" | "received" | false;

  // 1-on-1 Realtime Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  activeMessages: ChatMessage[];
  setActiveConversationId: (id: string | null) => void;
  openDirectChatWith: (student: StudentProfile) => void;
  sendDirectMessage: (
    conversationId: string,
    text: string,
    attachments?: MessageAttachment[],
    replyTo?: { id: string; senderName: string; text: string } | null
  ) => Promise<void>;
  deleteMessage: (conversationId: string, messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  unreadMessagesCount: number;

  // Communities
  communities: CommunityGroup[];
  activeCommunityId: string | null;
  activeCommunity: CommunityGroup | null;
  setActiveCommunityId: (id: string | null) => void;
  communityPosts: CommunityPost[];
  activeCommunityPosts: CommunityPost[];
  communityChatMessages: Record<string, CommunityChatMessage[]>;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  createCommunityPost: (communityId: string, title: string, content: string, tags: string[]) => void;
  likeCommunityPost: (communityId: string, postId: string) => void;
  sendCommunityChatMessage: (communityId: string, text: string) => void;

  // AI Connection Engine
  aiSuggestions: AISuggestion[];
  isAiSearching: boolean;
  aiQueryResult: { summary: string; recommendedStudentIds: string[] } | null;
  searchWithAIChatAssistant: (query: string) => Promise<void>;
  clearAISearch: () => void;

  // Mentors
  mentors: MentorProfile[];
  mentorshipRequests: MentorshipRequest[];
  requestMentorship: (mentorId: string, goal: string, message: string, proposedDate?: string) => Promise<boolean>;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Trust, Safety & Moderation
  privacySettings: PrivacySettings;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  blockedUsers: StudentProfile[];
  blockedUserIds: string[];
  blockUser: (studentId: string) => void;
  unblockUser: (studentId: string) => void;
  reports: ReportItem[];
  submitReport: (targetType: "user" | "message" | "community" | "post", targetId: string, reason: any, details: string, targetName?: string) => void;
  reportContent: (
    targetOrOptions:
      | {
          targetType: "user" | "message" | "community" | "post";
          targetId: string;
          reason: any;
          details: string;
          targetName?: string;
        }
      | "user"
      | "message"
      | "community"
      | "post",
    targetId?: string,
    reason?: any,
    details?: string,
    targetName?: string
  ) => void;
  dismissReport: (reportId: string) => void;
  resolveReport: (reportId: string) => void;
}

const initialFilterState: StudentFilterState = {
  searchQuery: "",
  country: "all",
  university: "all",
  fieldOfStudy: "all",
  careerGoal: "all",
  skill: "all",
  interest: "all",
  language: "all",
  graduationYear: "all",
  opportunityInterest: "all",
  competitionInterest: "all",
  onlineOnly: false,
  matchThreshold: 0,
};

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userData } = useAuth();

  // Current User's dynamic social profile
  const [mySocialProfile, setMySocialProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem("afriversity_social_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: currentUser?.uid || "current-user-id",
      name: userData?.displayName || currentUser?.displayName || "Kofi Boateng",
      avatar:
        userData?.avatar ||
        currentUser?.photoURL ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      email: currentUser?.email || "kofi.boateng@afriversity.org",
      country: "Ghana",
      countryFlag: "🇬🇭",
      university: userData?.university || "University of Ghana (Legon)",
      universityShort: "UG Legon",
      fieldOfStudy: "Artificial Intelligence & Software Engineering",
      careerGoal: "AI Research Scientist & Pan-African Tech Founder",
      graduationYear: "2026",
      bio: "Afriversity scholar passionate about distributed machine learning, speech NLP for African dialects, and building pan-African student study circles.",
      skills: ["Python", "Machine Learning", "PyTorch", "TypeScript", "React", "Docker"],
      interests: ["Artificial Intelligence", "African NLP", "CleanTech", "Scholarships", "Hackathons"],
      languages: ["English", "Twi", "French"],
      opportunityInterests: ["Master's Scholarships", "DeepMind Fellowships", "Research Internships"],
      competitionInterests: ["Zindi Africa ML", "Kaggle African NLP"],
      presenceStatus: "online",
      lastActive: "Now",
      mutualFriendsCount: 0,
      compatibilityScore: 100,
      friendsCount: 3,
      joinedCommunitiesCount: 3,
      projectsCount: 2,
      privacySettings: {
        whoCanMessage: "everyone",
        whoCanFriendRequest: "everyone",
        whoCanSeeProfile: "everyone",
        showOnlineStatus: true,
      },
      passportItems: [
        {
          id: "my-p-1",
          type: "badge",
          title: "Afriversity Heritage Pioneer",
          issuer: "Afriversity Pan-African Council",
          date: "Jan 2025",
          icon: "shield",
          verificationCode: "AFR-PIONEER-01",
        },
        {
          id: "my-p-2",
          type: "certificate",
          title: "African AI Research Fellow",
          issuer: "Masakhane NLP & DeepMind",
          date: "Oct 2024",
          icon: "award",
          verificationCode: "MSK-RES-440",
        },
      ],
      achievements: [
        "President: Afriversity STEM Student Chapter",
        "Top 10 Finalist: West Africa AI Innovation Sprint",
      ],
      certificates: ["Google Associate Cloud Engineer", "DeepLearning.AI PyTorch Specialist"],
    };
  });

  // Sync auth user data changes to social profile
  useEffect(() => {
    if (userData || currentUser) {
      setMySocialProfile((prev) => ({
        ...prev,
        id: currentUser?.uid || prev.id,
        name: userData?.displayName || currentUser?.displayName || prev.name,
        avatar: userData?.avatar || currentUser?.photoURL || prev.avatar,
        email: currentUser?.email || prev.email,
        university: userData?.university || prev.university,
      }));
    }
  }, [userData, currentUser]);

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem("afriversity_social_profile", JSON.stringify(mySocialProfile));
  }, [mySocialProfile]);

  // Active Community Tab Navigation
  const [activeCommunityTab, setActiveCommunityTab] = useState<CommunityTabType>("discover");

  // Initial Presence Map from Initial African Students
  const initialPresenceMap = useMemo(() => {
    const map: Record<string, { status: PresenceStatus; lastActiveText?: string; updatedAt?: number }> = {};
    initialAfricanStudents.forEach((s) => {
      map[s.id] = {
        status: s.presenceStatus,
        lastActiveText: s.lastActive,
        updatedAt: Date.now(),
      };
    });
    if (mySocialProfile?.id) {
      map[mySocialProfile.id] = {
        status: mySocialProfile.presenceStatus || "online",
        lastActiveText: "Active now",
        updatedAt: Date.now(),
      };
    }
    return map;
  }, []);

  // Live Real-Time Presence State (🟢 Online, 🟡 Away, ⚫ Offline)
  const [realtimePresence, setRealtimePresence] =
    useState<Record<string, { status: PresenceStatus; lastActiveText?: string; updatedAt?: number }>>(initialPresenceMap);

  // 1. Real-time Firestore onSnapshot listener for presence collection
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const presenceCol = collection(db, "presence");
      unsubscribe = onSnapshot(
        presenceCol,
        (snapshot) => {
          const map: Record<string, { status: PresenceStatus; lastActiveText?: string; updatedAt?: number }> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.status) {
              map[docSnap.id] = {
                status: data.status as PresenceStatus,
                lastActiveText:
                  data.lastActiveText ||
                  (data.status === "online"
                    ? "Active now"
                    : data.status === "away"
                    ? "Away"
                    : "Recently"),
                updatedAt: typeof data.lastSeen === "number" ? data.lastSeen : Date.now(),
              };
            }
          });
          setRealtimePresence((prev) => ({ ...prev, ...map }));
        },
        (err) => {
          console.warn("Firestore presence onSnapshot listener notice:", err);
        }
      );
    } catch (err) {
      console.warn("Error initializing presence onSnapshot listener:", err);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. Broadcast and keep alive current user's presence in Firestore
  useEffect(() => {
    const userId = mySocialProfile.id;
    if (!userId) return;

    const syncPresenceToFirestore = async (status: PresenceStatus, note?: string) => {
      try {
        await setDoc(
          doc(db, "presence", userId),
          {
            userId,
            userName: mySocialProfile.name,
            avatar: mySocialProfile.avatar,
            university: mySocialProfile.university,
            country: mySocialProfile.country,
            countryFlag: mySocialProfile.countryFlag,
            status,
            lastActiveText:
              note ||
              (status === "online"
                ? "Active now"
                : status === "away"
                ? "Away"
                : "Recently"),
            lastSeen: Date.now(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Failed to sync presence to Firestore:", err);
      }
    };

    // Initial broadcast
    syncPresenceToFirestore(mySocialProfile.presenceStatus || "online");

    // Regular heartbeat to keep status fresh
    const heartbeat = setInterval(() => {
      if (document.visibilityState === "visible" && mySocialProfile.presenceStatus === "online") {
        syncPresenceToFirestore("online", "Active now");
      }
    }, 45000);

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        syncPresenceToFirestore("away", "Away (background)");
      } else {
        syncPresenceToFirestore(mySocialProfile.presenceStatus || "online", "Active now");
      }
    };

    const handleUnload = () => {
      syncPresenceToFirestore("offline", "Last active moments ago");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [
    mySocialProfile.id,
    mySocialProfile.name,
    mySocialProfile.presenceStatus,
    mySocialProfile.university,
    mySocialProfile.avatar,
    mySocialProfile.country,
    mySocialProfile.countryFlag,
  ]);

  // Helper to get formatted status info for any scholar
  const getStudentPresence = useCallback(
    (studentId: string): StudentPresenceInfo => {
      const p = realtimePresence[studentId];
      const status: PresenceStatus = p?.status || "offline";
      const lastActiveText =
        p?.lastActiveText ||
        (status === "online" ? "Active now" : status === "away" ? "Away" : "Recently");

      if (status === "online") {
        return {
          status: "online",
          label: "Online Now",
          dotColor: "bg-emerald-500",
          emoji: "🟢",
          badgeClass:
            "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
          lastActiveText,
        };
      }
      if (status === "away") {
        return {
          status: "away",
          label: "Away",
          dotColor: "bg-amber-500",
          emoji: "🟡",
          badgeClass:
            "bg-amber-950/80 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]",
          lastActiveText,
        };
      }
      return {
        status: "offline",
        label: "Offline",
        dotColor: "bg-stone-500",
        emoji: "⚫",
        badgeClass: "bg-stone-900/90 border-stone-700/50 text-stone-400",
        lastActiveText,
      };
    },
    [realtimePresence]
  );

  // Toggle presence for interactive live demo & testing
  const toggleStudentPresenceDemo = async (studentId: string) => {
    const current = realtimePresence[studentId]?.status || "offline";
    const nextStatus: PresenceStatus =
      current === "online" ? "away" : current === "away" ? "offline" : "online";
    const nextLabel =
      nextStatus === "online" ? "Active now" : nextStatus === "away" ? "Away" : "Just now";

    setRealtimePresence((prev) => ({
      ...prev,
      [studentId]: {
        status: nextStatus,
        lastActiveText: nextLabel,
        updatedAt: Date.now(),
      },
    }));

    try {
      await setDoc(
        doc(db, "presence", studentId),
        {
          userId: studentId,
          status: nextStatus,
          lastActiveText: nextLabel,
          lastSeen: Date.now(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Failed to toggle presence in Firestore:", err);
    }
  };

  // Raw Students list
  const [rawStudents, setRawStudents] = useState<StudentProfile[]>(() => {
    const cached = localStorage.getItem("afriversity_community_students");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return initialAfricanStudents;
  });

  // Friends list (connected)
  const [rawFriends, setRawFriends] = useState<StudentProfile[]>(() => {
    return initialAfricanStudents.slice(0, 3); // Ama, Kwame, David
  });
  const setFriends = setRawFriends;

  // Real-time presence enriched students
  const students = useMemo(() => {
    return rawStudents.map((stu) => {
      const p = realtimePresence[stu.id];
      if (p) {
        return {
          ...stu,
          presenceStatus: p.status,
          lastActive:
            p.lastActiveText ||
            (p.status === "online" ? "Active now" : p.status === "away" ? "Away" : stu.lastActive),
        };
      }
      return stu;
    });
  }, [rawStudents, realtimePresence]);

  // Real-time presence enriched friends
  const friends = useMemo(() => {
    return rawFriends.map((f) => {
      const p = realtimePresence[f.id];
      if (p) {
        return {
          ...f,
          presenceStatus: p.status,
          lastActive:
            p.lastActiveText ||
            (p.status === "online" ? "Active now" : p.status === "away" ? "Away" : f.lastActive),
        };
      }
      return f;
    });
  }, [rawFriends, realtimePresence]);

  // Friend Requests
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>(() => {
    return initialFriendRequests;
  });

  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  // Real-time Firestore onSnapshot listener for friendRequests collection
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const frCol = collection(db, "friendRequests");
      unsubscribe = onSnapshot(
        frCol,
        (snapshot) => {
          const fsIncoming: FriendRequest[] = [];
          const fsSent: FriendRequest[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (!data || data.status !== "pending") return;

            const req: FriendRequest = {
              id: docSnap.id,
              fromUserId: data.fromUserId || "",
              fromUserName: data.fromUserName || "African Scholar",
              fromUserAvatar:
                data.fromUserAvatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
              fromUserUniversity: data.fromUserUniversity || "Pan-African Partner Institution",
              fromUserCountry: data.fromUserCountry || "Africa",
              fromUserFlag: data.fromUserFlag || "🌍",
              fromUserField: data.fromUserField || "STEM",
              toUserId: data.toUserId || "",
              toUserName: data.toUserName,
              toUserAvatar: data.toUserAvatar,
              toUserUniversity: data.toUserUniversity,
              toUserCountry: data.toUserCountry,
              toUserFlag: data.toUserFlag,
              status: data.status || "pending",
              createdAt: data.createdAt || "Just now",
              note: data.note,
              mutualFriendsCount: data.mutualFriendsCount || 1,
            };

            const myId = mySocialProfile?.id || "current-user-id";
            if (
              req.toUserId === myId ||
              req.toUserId === "current-user-id" ||
              (!req.toUserId && req.fromUserId !== myId)
            ) {
              fsIncoming.push({ ...req, type: "received" });
            } else if (req.fromUserId === myId || req.fromUserId === "current-user-id") {
              fsSent.push({ ...req, type: "sent" });
            }
          });

          if (fsIncoming.length > 0) {
            setIncomingRequests((prev) => {
              const prevNonFs = prev.filter((p) => !snapshot.docs.some((d) => d.id === p.id));
              return [
                ...fsIncoming,
                ...prevNonFs.filter((p) => !fsIncoming.some((f) => f.fromUserId === p.fromUserId)),
              ];
            });
          }
          if (fsSent.length > 0) {
            setSentRequests((prev) => {
              const prevNonFs = prev.filter((p) => !snapshot.docs.some((d) => d.id === p.id));
              return [...fsSent, ...prevNonFs];
            });
          }
        },
        (err) => {
          console.warn("Firestore friendRequests onSnapshot notice:", err);
        }
      );
    } catch (err) {
      console.warn("Error initializing friendRequests listener:", err);
    }

    return () => {
      unsubscribe();
    };
  }, [mySocialProfile?.id]);

  // Real-time Firestore onSnapshot listener for Privacy Settings
  useEffect(() => {
    const userId = mySocialProfile?.id;
    if (!userId) return;

    let unsubscribe = () => {};
    try {
      const privDoc = doc(db, "privacySettings", userId);
      unsubscribe = onSnapshot(
        privDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setMySocialProfile((prev) => ({
              ...prev,
              privacySettings: {
                ...prev.privacySettings,
                ...(data as Partial<PrivacySettings>),
              },
            }));
          }
        },
        (err) => {
          console.warn("Firestore privacySettings onSnapshot notice:", err);
        }
      );
    } catch (err) {
      console.warn("Error initializing privacySettings listener:", err);
    }

    return () => {
      unsubscribe();
    };
  }, [mySocialProfile?.id]);

  // Unified Friend Requests for Modal & Badge Count
  const friendRequests: FriendRequest[] = useMemo(() => {
    const inc: FriendRequest[] = incomingRequests.map((r) => ({
      ...r,
      type: "received" as const,
    }));
    const sent: FriendRequest[] = sentRequests.map((r) => ({
      ...r,
      type: "sent" as const,
    }));
    return [...inc, ...sent];
  }, [incomingRequests, sentRequests]);

  // Blocked users
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const cached = localStorage.getItem("afriversity_blocked_users");
    return cached ? JSON.parse(cached) : [];
  });

  // Conversations and Messages
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const cached = localStorage.getItem("afriversity_conversations");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return initialConversations;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const initialMap: Record<string, ChatMessage[]> = {
      "conv-ama-mensah": [
        {
          id: "m-1",
          conversationId: "conv-ama-mensah",
          senderId: "stu-ama-mensah",
          senderName: "Ama Mensah",
          senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          text: "Hi Kofi! I saw your recent post on the Masakhane NLP dataset. Super impressed with your speech evaluation metrics!",
          timestamp: "Yesterday, 3:15 PM",
          status: "read",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "m-2",
          conversationId: "conv-ama-mensah",
          senderId: "current-user-id",
          senderName: mySocialProfile.name,
          senderAvatar: mySocialProfile.avatar,
          text: "Thanks Ama! We are actually planning to test the models on low-resource dialect benchmarks this semester.",
          timestamp: "Yesterday, 3:20 PM",
          status: "read",
          createdAt: new Date(Date.now() - 85000000).toISOString(),
        },
        {
          id: "m-3",
          conversationId: "conv-ama-mensah",
          senderId: "stu-ama-mensah",
          senderName: "Ama Mensah",
          senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          text: "That's great. I'm also interested in AI research at UCT! Let's team up for the Zindi Hackathon.",
          timestamp: "2m ago",
          status: "read",
          createdAt: new Date(Date.now() - 120000).toISOString(),
        },
      ],
      "conv-kwame-boateng": [
        {
          id: "m-4",
          conversationId: "conv-kwame-boateng",
          senderId: "stu-kwame-boateng",
          senderName: "Kwame Boateng",
          senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
          text: "Hello! Did you check the MasterCard Foundation scholarship criteria for KNUST? The portal opens next week.",
          timestamp: "15m ago",
          status: "delivered",
          createdAt: new Date(Date.now() - 900000).toISOString(),
        },
      ],
      "conv-david-okafor": [
        {
          id: "m-5",
          conversationId: "conv-david-okafor",
          senderId: "stu-david-okafor",
          senderName: "David Okafor",
          senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
          text: "See you at the Pan-African Cloud Summit next weekend!",
          timestamp: "1h ago",
          status: "read",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    };
    return initialMap;
  });

  // Communities
  const [communities, setCommunities] = useState<CommunityGroup[]>(() => {
    const cached = localStorage.getItem("afriversity_communities");
    return cached ? JSON.parse(cached) : initialCommunities;
  });

  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    return initialCommunityPosts;
  });

  const [communityChatMessages, setCommunityChatMessages] = useState<Record<string, CommunityChatMessage[]>>({
    "comm-ai-students-africa": [
      {
        id: "cc-1",
        communityId: "comm-ai-students-africa",
        senderId: "stu-ama-mensah",
        senderName: "Ama Mensah",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        senderFlag: "🇬🇭",
        text: "Welcome to all new scholars from Makerere, UNILAG and UCT joining the NLP working group today! 🌍✨",
        timestamp: "10:30 AM",
      },
      {
        id: "cc-2",
        communityId: "comm-ai-students-africa",
        senderId: "stu-brian-kiprop",
        senderName: "Brian Kiprop",
        senderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
        senderFlag: "🇰🇪",
        text: "Excited to collaborate! Let me know if anyone wants to run quantum circuit benchmarks.",
        timestamp: "11:15 AM",
      },
    ],
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const cached = localStorage.getItem("afriversity_notifications");
    return cached ? JSON.parse(cached) : initialNotifications;
  });

  // Mentors & Requests
  const [mentors] = useState<MentorProfile[]>(initialMentors);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([
    {
      id: "mreq-1",
      mentorId: "mentor-dr-kwame-asante",
      mentorName: "Dr. Kwame Asante",
      studentId: "current-user-id",
      studentName: mySocialProfile.name,
      goal: "Graduate NLP Research & Oxford/UCT Scholarship guidance",
      message: "Looking for advice on framing my research statement for Masakhane NLP Fellowships.",
      proposedDate: "Next Tuesday, 6:00 PM GMT",
      status: "accepted",
      createdAt: "2 days ago",
    },
  ]);

  // Reports
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Filtering & Search
  const [filterState, setFilterStateInternal] = useState<StudentFilterState>(initialFilterState);

  const setFilterState = useCallback(
    (updater: Partial<StudentFilterState> | ((prev: StudentFilterState) => StudentFilterState)) => {
      setFilterStateInternal((prev) => {
        if (typeof updater === "function") {
          return updater(prev);
        }
        return { ...prev, ...updater };
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilterStateInternal(initialFilterState);
  }, []);

  // Filtered Students Calculation
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      // Exclude blocked
      if (blockedUserIds.includes(stu.id)) return false;

      // Text query
      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase();
        const matchesName = stu.name.toLowerCase().includes(q);
        const matchesUni = stu.university.toLowerCase().includes(q);
        const matchesCountry = stu.country.toLowerCase().includes(q);
        const matchesField = stu.fieldOfStudy.toLowerCase().includes(q);
        const matchesCareer = stu.careerGoal.toLowerCase().includes(q);
        const matchesBio = stu.bio.toLowerCase().includes(q);
        const matchesSkills = stu.skills.some((s) => s.toLowerCase().includes(q));
        const matchesInterests = stu.interests.some((i) => i.toLowerCase().includes(q));
        if (
          !matchesName &&
          !matchesUni &&
          !matchesCountry &&
          !matchesField &&
          !matchesCareer &&
          !matchesBio &&
          !matchesSkills &&
          !matchesInterests
        ) {
          return false;
        }
      }

      // Dropdown filters
      if (filterState.country !== "all" && stu.country.toLowerCase() !== filterState.country.toLowerCase()) {
        return false;
      }
      if (filterState.university !== "all" && !stu.university.toLowerCase().includes(filterState.university.toLowerCase())) {
        return false;
      }
      if (filterState.fieldOfStudy !== "all" && !stu.fieldOfStudy.toLowerCase().includes(filterState.fieldOfStudy.toLowerCase())) {
        return false;
      }
      if (filterState.careerGoal !== "all" && !stu.careerGoal.toLowerCase().includes(filterState.careerGoal.toLowerCase())) {
        return false;
      }
      if (filterState.skill !== "all" && !stu.skills.some((s) => s.toLowerCase() === filterState.skill.toLowerCase())) {
        return false;
      }
      if (filterState.interest !== "all" && !stu.interests.some((i) => i.toLowerCase() === filterState.interest.toLowerCase())) {
        return false;
      }
      if (filterState.language !== "all" && !stu.languages.some((l) => l.toLowerCase().includes(filterState.language.toLowerCase()))) {
        return false;
      }
      if (filterState.graduationYear !== "all" && stu.graduationYear !== filterState.graduationYear) {
        return false;
      }
      if (filterState.opportunityInterest !== "all" && !stu.opportunityInterests.some((o) => o.toLowerCase().includes(filterState.opportunityInterest.toLowerCase()))) {
        return false;
      }
      if (filterState.competitionInterest !== "all" && !stu.competitionInterests.some((c) => c.toLowerCase().includes(filterState.competitionInterest.toLowerCase()))) {
        return false;
      }
      if (filterState.onlineOnly && stu.presenceStatus !== "online") {
        return false;
      }
      if (filterState.matchThreshold > 0 && stu.compatibilityScore < filterState.matchThreshold) {
        return false;
      }

      return true;
    });
  }, [students, blockedUserIds, filterState]);

  // AI Suggestions Generation
  const aiSuggestions: AISuggestion[] = useMemo(() => {
    return students
      .filter((stu) => !friends.some((f) => f.id === stu.id) && !blockedUserIds.includes(stu.id))
      .slice(0, 6)
      .map((stu) => ({
        student: stu,
        matchScore: stu.compatibilityScore,
        sharedInterests: stu.interests.slice(0, 3),
        commonGoal: stu.careerGoal,
        aiExplanation:
          stu.matchReason ||
          `High Pan-African synergy in ${stu.fieldOfStudy} with aligned goals in ${stu.careerGoal}.`,
      }));
  }, [students, friends, blockedUserIds]);

  // AI Chat Assistant Search Engine
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiQueryResult, setAiQueryResult] = useState<{ summary: string; recommendedStudentIds: string[] } | null>(null);

  const searchWithAIChatAssistant = async (queryText: string) => {
    setIsAiSearching(true);
    // Simulate smart AI understanding & natural semantic ranking
    await new Promise((res) => setTimeout(res, 800));

    const q = queryText.toLowerCase();
    const matched = students.filter((s) => {
      const matchScore =
        (s.fieldOfStudy.toLowerCase().includes("ai") || s.fieldOfStudy.toLowerCase().includes("machine learning") ? 3 : 0) +
        (q.includes("ai") || q.includes("nlp") || q.includes("data") ? 2 : 0) +
        (q.includes(s.country.toLowerCase()) ? 4 : 0) +
        (q.includes(s.university.toLowerCase()) ? 4 : 0) +
        (s.skills.some((sk) => q.includes(sk.toLowerCase())) ? 2 : 0);
      return matchScore > 0 || s.compatibilityScore > 88;
    });

    const recommendedIds = matched.slice(0, 4).map((m) => m.id);
    const summary = `Based on your request "${queryText}", I analyzed academic trajectories, verified skill graphs, and research interests across 50+ African university cohorts. Here are top recommended peer matches with high alignment.`;

    setAiQueryResult({
      summary,
      recommendedStudentIds: recommendedIds.length > 0 ? recommendedIds : students.slice(0, 3).map((s) => s.id),
    });
    setIsAiSearching(false);
  };

  const clearAISearch = () => {
    setAiQueryResult(null);
  };

  // Helper getters
  const isFriend = useCallback(
    (studentId: string) => {
      return friends.some((f) => f.id === studentId);
    },
    [friends]
  );

  const hasPendingRequestWith = useCallback(
    (studentId: string) => {
      if (sentRequests.some((r) => r.toUserId === studentId && r.status === "pending")) {
        return "sent";
      }
      if (incomingRequests.some((r) => r.fromUserId === studentId && r.status === "pending")) {
        return "received";
      }
      return false;
    },
    [sentRequests, incomingRequests]
  );

  // Friend Request Actions
  const sendFriendRequest = async (student: StudentProfile): Promise<boolean> => {
    const newReq: FriendRequest = {
      id: `req-${Date.now()}`,
      fromUserId: mySocialProfile.id,
      fromUserName: mySocialProfile.name,
      fromUserAvatar: mySocialProfile.avatar,
      fromUserUniversity: mySocialProfile.university,
      fromUserCountry: mySocialProfile.country,
      fromUserFlag: mySocialProfile.countryFlag,
      fromUserField: mySocialProfile.fieldOfStudy,
      toUserId: student.id,
      status: "pending",
      createdAt: "Just now",
      createdAtTimestamp: Date.now(),
      mutualFriendsCount: student.mutualFriendsCount || 1,
    };

    setSentRequests((prev) => [...prev, newReq]);

    // Persist to Firestore in real-time
    try {
      await setDoc(doc(db, "friendRequests", newReq.id), {
        ...newReq,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Notice: Firestore friend request write (using local state fallback):", err);
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-sent-${Date.now()}`,
      userId: mySocialProfile.id,
      type: "friend_request",
      title: "Friend Request Sent",
      message: `You sent a connection request to ${student.name} (${student.university}).`,
      targetId: student.id,
      targetType: "student",
      isRead: true,
      createdAt: "Just now",
      timeAgo: "Just now",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return true;
  };

  const acceptFriendRequest = async (request: FriendRequest): Promise<boolean> => {
    // Remove from incoming
    setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));

    // Update or delete from Firestore in real-time
    try {
      await updateDoc(doc(db, "friendRequests", request.id), {
        status: "accepted",
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      try {
        await deleteDoc(doc(db, "friendRequests", request.id));
      } catch (err) {
        // Safe local fallback
      }
    }

    // Find student
    const student = students.find((s) => s.id === request.fromUserId) || {
      id: request.fromUserId,
      name: request.fromUserName,
      avatar: request.fromUserAvatar,
      country: request.fromUserCountry,
      countryFlag: request.fromUserFlag,
      university: request.fromUserUniversity,
      fieldOfStudy: request.fromUserField,
      careerGoal: "African Scholar",
      graduationYear: "2026",
      bio: "Afriversity Community Scholar",
      skills: ["Collaboration", "STEM"],
      interests: ["Research", "Innovation"],
      languages: ["English"],
      opportunityInterests: ["Scholarships"],
      competitionInterests: ["Hackathons"],
      presenceStatus: "online",
      lastActive: "Just now",
      mutualFriendsCount: 2,
      compatibilityScore: 90,
      friendsCount: 10,
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
    };

    // Add to friends
    setFriends((prev) => {
      if (prev.some((f) => f.id === student.id)) return prev;
      return [student, ...prev];
    });

    // Add confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-acc-${Date.now()}`,
      userId: mySocialProfile.id,
      type: "friend_accepted",
      title: "Connection Confirmed",
      message: `You and ${request.fromUserName} are now connected on Afriversity!`,
      fromUserId: request.fromUserId,
      fromUserName: request.fromUserName,
      fromUserAvatar: request.fromUserAvatar,
      targetId: request.fromUserId,
      targetType: "student",
      isRead: false,
      createdAt: "Just now",
      timeAgo: "Just now",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return true;
  };

  const declineFriendRequest = async (requestId: string): Promise<boolean> => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    try {
      await updateDoc(doc(db, "friendRequests", requestId), {
        status: "declined",
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      try {
        await deleteDoc(doc(db, "friendRequests", requestId));
      } catch (err) {}
    }
    return true;
  };

  const cancelFriendRequest = async (requestId: string): Promise<boolean> => {
    setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
    try {
      await deleteDoc(doc(db, "friendRequests", requestId));
    } catch (e) {}
    return true;
  };

  const removeFriend = async (studentId: string): Promise<boolean> => {
    setFriends((prev) => prev.filter((f) => f.id !== studentId));
    return true;
  };

  // 1-on-1 Chat Functions
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return chatMessages[activeConversationId] || [];
  }, [chatMessages, activeConversationId]);

  const openDirectChatWith = useCallback(
    (student: StudentProfile) => {
      // Find existing or create
      const existing = conversations.find((c) =>
        c.participantIds.includes(student.id)
      );

      if (existing) {
        setActiveConversationId(existing.id);
      } else {
        const newConvId = `conv-${student.id}`;
        const newConv: Conversation = {
          id: newConvId,
          participantIds: [mySocialProfile.id, student.id],
          otherUser: student,
          lastMessage: {
            text: "Started a new connection conversation",
            senderId: mySocialProfile.id,
            timestamp: "Just now",
            status: "read",
          },
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        setConversations((prev) => [newConv, ...prev]);
        setChatMessages((prev) => ({
          ...prev,
          [newConvId]: [
            {
              id: `welcome-${Date.now()}`,
              conversationId: newConvId,
              senderId: student.id,
              senderName: student.name,
              senderAvatar: student.avatar,
              text: `Hello ${mySocialProfile.name}! Glad to connect with you from ${student.university}. Feel free to ask me anything about our research, courses, or hackathons! 🌍✨`,
              timestamp: "Just now",
              status: "read",
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        setActiveConversationId(newConvId);
      }
    },
    [conversations, mySocialProfile]
  );

  const sendDirectMessage = async (
    conversationId: string,
    text: string,
    attachments?: MessageAttachment[],
    replyTo?: { id: string; senderName: string; text: string } | null
  ) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: mySocialProfile.id,
      senderName: mySocialProfile.name,
      senderAvatar: mySocialProfile.avatar,
      text: text.trim(),
      timestamp: "Just now",
      status: "sent",
      attachments,
      replyTo,
      createdAt: new Date().toISOString(),
    };

    // Update messages
    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // Update conversation preview
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: {
              text: text.trim() || (attachments ? "Sent an attachment" : ""),
              senderId: mySocialProfile.id,
              timestamp: "Just now",
              status: "sent",
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // Simulate peer delivery, read receipt, and smart dynamic reply after short delay
    const targetConv = conversations.find((c) => c.id === conversationId);
    if (targetConv && targetConv.otherUser) {
      const peer = targetConv.otherUser;

      setTimeout(() => {
        // Set message status to read
        setChatMessages((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map((m) =>
            m.id === newMsg.id ? { ...m, status: "read" } : m
          ),
        }));

        // Set typing indicator
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId ? { ...c, isTyping: true, typingUserName: peer.name } : c
          )
        );

        setTimeout(() => {
          // Send smart contextual peer reply
          const replies = [
            `Thanks for reaching out! That's a great point regarding ${peer.fieldOfStudy}. Have you tried testing this on our campus compute cluster?`,
            `Definitely! Let's collaborate on this. I can share my notes and repository links for our research team.`,
            `Sounds awesome! I'm free this Thursday for a 15-min sync or we can organize a group study session in the Pan-African hub.`,
            `Great insight. I've sent you a link to our shared dataset folder. Let me know what you think!`,
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          const peerMsg: ChatMessage = {
            id: `msg-peer-${Date.now()}`,
            conversationId,
            senderId: peer.id,
            senderName: peer.name,
            senderAvatar: peer.avatar,
            text: randomReply,
            timestamp: "Just now",
            status: "read",
            createdAt: new Date().toISOString(),
          };

          setChatMessages((prev) => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), peerMsg],
          }));

          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === conversationId) {
                return {
                  ...c,
                  isTyping: false,
                  typingUserName: undefined,
                  lastMessage: {
                    text: randomReply,
                    senderId: peer.id,
                    timestamp: "Just now",
                    status: "delivered",
                  },
                  unreadCount: activeConversationId === conversationId ? 0 : c.unreadCount + 1,
                  updatedAt: new Date().toISOString(),
                };
              }
              return c;
            })
          );
        }, 2200);
      }, 1200);
    }
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).filter((m) => m.id !== messageId),
    }));
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const unreadMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  // Communities Actions
  const activeCommunity = useMemo(() => {
    return communities.find((c) => c.id === activeCommunityId) || null;
  }, [communities, activeCommunityId]);

  const activeCommunityPosts = useMemo(() => {
    if (!activeCommunityId) return communityPosts;
    return communityPosts.filter((p) => p.communityId === activeCommunityId);
  }, [communityPosts, activeCommunityId]);

  const joinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: true, memberCount: c.memberCount + 1 }
          : c
      )
    );
  };

  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, isJoined: false, memberCount: Math.max(1, c.memberCount - 1) }
          : c
      )
    );
  };

  const createCommunityPost = (
    communityId: string,
    title: string,
    content: string,
    tags: string[]
  ) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId,
      authorId: mySocialProfile.id,
      authorName: mySocialProfile.name,
      authorAvatar: mySocialProfile.avatar,
      authorCountry: mySocialProfile.country,
      authorFlag: mySocialProfile.countryFlag,
      authorUniversity: mySocialProfile.university,
      title,
      content,
      tags,
      likesCount: 1,
      likedBy: [mySocialProfile.id],
      commentsCount: 0,
      createdAt: "Just now",
    };

    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const likeCommunityPost = (communityId: string, postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = p.likedBy.includes(mySocialProfile.id);
          return {
            ...p,
            likesCount: hasLiked ? p.likesCount - 1 : p.likesCount + 1,
            likedBy: hasLiked
              ? p.likedBy.filter((id) => id !== mySocialProfile.id)
              : [...p.likedBy, mySocialProfile.id],
          };
        }
        return p;
      })
    );
  };

  const sendCommunityChatMessage = (communityId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: CommunityChatMessage = {
      id: `cmsg-${Date.now()}`,
      communityId,
      senderId: mySocialProfile.id,
      senderName: mySocialProfile.name,
      senderAvatar: mySocialProfile.avatar,
      senderFlag: mySocialProfile.countryFlag,
      text: text.trim(),
      timestamp: "Just now",
    };

    setCommunityChatMessages((prev) => ({
      ...prev,
      [communityId]: [...(prev[communityId] || []), newMsg],
    }));
  };

  // Mentorship Actions
  const requestMentorship = async (
    mentorId: string,
    goal: string,
    message: string,
    proposedDate?: string
  ): Promise<boolean> => {
    const mentor = mentors.find((m) => m.id === mentorId);
    const newReq: MentorshipRequest = {
      id: `mreq-${Date.now()}`,
      mentorId,
      mentorName: mentor ? mentor.name : "Mentor",
      studentId: mySocialProfile.id,
      studentName: mySocialProfile.name,
      goal,
      message,
      proposedDate,
      status: "pending",
      createdAt: "Just now",
    };

    setMentorshipRequests((prev) => [newReq, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-m-${Date.now()}`,
      userId: mySocialProfile.id,
      type: "mentor_response",
      title: "Mentorship Request Submitted",
      message: `Your mentorship session proposal has been sent to ${mentor?.name || "the mentor"}.`,
      targetId: mentorId,
      targetType: "mentor",
      isRead: true,
      createdAt: "Just now",
      timeAgo: "Just now",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return true;
  };

  // Notification Actions
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Trust, Safety & Moderation
  const blockUser = (studentId: string) => {
    setBlockedUserIds((prev) => {
      const updated = Array.from(new Set([...prev, studentId]));
      localStorage.setItem("afriversity_blocked_users", JSON.stringify(updated));
      return updated;
    });
    // Remove from friends and active conversations
    setFriends((prev) => prev.filter((f) => f.id !== studentId));
    setConversations((prev) =>
      prev.map((c) =>
        c.participantIds.includes(studentId) ? { ...c, isBlocked: true } : c
      )
    );
  };

  const unblockUser = (studentId: string) => {
    setBlockedUserIds((prev) => {
      const updated = prev.filter((id) => id !== studentId);
      localStorage.setItem("afriversity_blocked_users", JSON.stringify(updated));
      return updated;
    });
    setConversations((prev) =>
      prev.map((c) =>
        c.participantIds.includes(studentId) ? { ...c, isBlocked: false } : c
      )
    );
  };

  const submitReport = (
    targetType: "user" | "message" | "community" | "post",
    targetId: string,
    reason: any,
    details: string,
    targetName?: string
  ) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      reporterId: mySocialProfile.id,
      reporterName: mySocialProfile.name,
      targetType,
      targetId,
      targetName,
      reason,
      details,
      status: "pending",
      createdAt: "Just now",
    };

    setReports((prev) => [newReport, ...prev]);

    // Add acknowledgment notification
    setNotifications((prev) => [
      {
        id: `notif-rep-${Date.now()}`,
        userId: mySocialProfile.id,
        type: "community_activity",
        title: "Report Received",
        message: "Thank you for keeping Afriversity safe. Our Pan-African Trust & Safety council is reviewing your report.",
        isRead: true,
        createdAt: "Just now",
        timeAgo: "Just now",
      },
      ...prev,
    ]);
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "dismissed" } : r))
    );
  };

  const resolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "resolved" } : r))
    );
  };

  const updateMySocialProfile = (updates: Partial<StudentProfile>) => {
    setMySocialProfile((prev) => ({ ...prev, ...updates }));
  };

  const updatePrivacySettings = useCallback((settings: Partial<PrivacySettings>) => {
    setMySocialProfile((prev) => {
      const updated = {
        ...prev,
        privacySettings: {
          ...prev.privacySettings,
          ...settings,
        },
      };
      localStorage.setItem("afriversity_social_profile", JSON.stringify(updated));

      // Persist to Firestore in real-time
      if (prev.id) {
        setDoc(
          doc(db, "privacySettings", prev.id),
          {
            ...updated.privacySettings,
            userId: prev.id,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        ).catch((err) => {
          console.warn("Notice: Firestore privacy settings sync (using local state fallback):", err);
        });
      }

      return updated;
    });
  }, []);

  const blockedUsers = useMemo(() => {
    return initialAfricanStudents.filter((s) => blockedUserIds.includes(s.id));
  }, [blockedUserIds]);

  const reportContent = (
    targetOrOptions:
      | {
          targetType: "user" | "message" | "community" | "post";
          targetId: string;
          reason: any;
          details: string;
          targetName?: string;
        }
      | "user"
      | "message"
      | "community"
      | "post",
    targetId?: string,
    reason?: any,
    details?: string,
    targetName?: string
  ) => {
    if (typeof targetOrOptions === "object") {
      submitReport(
        targetOrOptions.targetType,
        targetOrOptions.targetId,
        targetOrOptions.reason,
        targetOrOptions.details,
        targetOrOptions.targetName
      );
    } else {
      submitReport(targetOrOptions, targetId || "", reason || "other", details || "", targetName);
    }
  };

  const setMyPresenceStatus = async (status: PresenceStatus) => {
    setMySocialProfile((prev) => ({ ...prev, presenceStatus: status }));
    setRealtimePresence((prev) => ({
      ...prev,
      [mySocialProfile.id]: {
        status,
        lastActiveText: status === "online" ? "Active now" : status === "away" ? "Away" : "Offline",
        updatedAt: Date.now(),
      },
    }));

    try {
      await setDoc(
        doc(db, "presence", mySocialProfile.id),
        {
          userId: mySocialProfile.id,
          userName: mySocialProfile.name,
          avatar: mySocialProfile.avatar,
          university: mySocialProfile.university,
          country: mySocialProfile.country,
          countryFlag: mySocialProfile.countryFlag,
          status,
          lastActiveText: status === "online" ? "Active now" : status === "away" ? "Away" : "Recently",
          lastSeen: Date.now(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Could not push presence change to Firestore:", e);
    }
  };

  const unreadTotalMessages = unreadMessagesCount;

  return (
    <CommunityContext.Provider
      value={{
        activeCommunityTab,
        setActiveCommunityTab,
        realtimePresence,
        getStudentPresence,
        toggleStudentPresenceDemo,
        students,
        filteredStudents,
        friends,
        incomingRequests,
        sentRequests,
        friendRequests,
        unreadTotalMessages,
        filterState,
        setFilterState,
        resetFilters,
        mySocialProfile,
        updateMySocialProfile,
        setMyPresenceStatus,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        cancelFriendRequest,
        removeFriend,
        isFriend,
        hasPendingRequestWith,
        conversations,
        activeConversationId,
        activeConversation,
        activeMessages,
        setActiveConversationId,
        openDirectChatWith,
        sendDirectMessage,
        deleteMessage,
        markConversationAsRead,
        unreadMessagesCount,
        communities,
        activeCommunityId,
        activeCommunity,
        setActiveCommunityId,
        communityPosts,
        activeCommunityPosts,
        communityChatMessages,
        joinCommunity,
        leaveCommunity,
        createCommunityPost,
        likeCommunityPost,
        sendCommunityChatMessage,
        aiSuggestions,
        isAiSearching,
        aiQueryResult,
        searchWithAIChatAssistant,
        clearAISearch,
        mentors,
        mentorshipRequests,
        requestMentorship,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        blockedUserIds,
        blockedUsers,
        privacySettings: mySocialProfile.privacySettings,
        updatePrivacySettings,
        blockUser,
        unblockUser,
        reports,
        submitReport,
        reportContent,
        dismissReport,
        resolveReport,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
