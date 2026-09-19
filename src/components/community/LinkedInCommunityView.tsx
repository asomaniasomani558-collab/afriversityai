import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  Globe,
  Share2,
  Heart,
  Repeat,
  Send,
  Image as ImageIcon,
  Video,
  BarChart2,
  Edit3,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  UserPlus,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  X,
  Smile,
  Paperclip,
  Flame,
  ArrowRight,
  MoreHorizontal,
  Bookmark,
  ExternalLink,
  Code,
  GraduationCap,
  Briefcase,
  MapPin,
  Clock,
  Layers,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { StudentProfile } from "../../types/community";

interface CommunityPostData {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    university: string;
    field: string;
    country: string;
    countryFlag: string;
  };
  timeAgo: string;
  content: string;
  tags?: string[];
  media?: {
    type: "image";
    url: string;
    tagLabel?: string;
    tagIcon?: "workshop" | "study" | "award" | "general";
  };
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
  isReposted?: boolean;
  commentsList?: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
  }[];
}

interface RecommendedPerson {
  id: string;
  name: string;
  avatar: string;
  country: string;
  countryFlag: string;
  university: string;
  field: string;
  mutualCount: number;
  status: "connect" | "pending" | "connected";
}

interface UpcomingEventData {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  attendeesCount: number;
  isJoined: boolean;
}

interface LinkedInCommunityViewProps {
  onViewProfile?: (student: StudentProfile) => void;
  onOpenDirectChat?: (student: StudentProfile) => void;
  onNavigateTab?: (tab: string) => void;
}

export const LinkedInCommunityView: React.FC<LinkedInCommunityViewProps> = ({
  onViewProfile,
  onOpenDirectChat,
  onNavigateTab,
}) => {
  // Active Filter Tab
  const [activeFilter, setActiveFilter] = useState<
    "all" | "students" | "groups" | "mentors" | "events" | "opportunities"
  >("all");

  // User's Live Connection State
  const [connectionsCount, setConnectionsCount] = useState(128);
  const [communitiesCount, setCommunitiesCount] = useState(3);
  const [showYourCommunities, setShowYourCommunities] = useState(true);

  // Direct Peer Chat State
  const [activeChatPeer, setActiveChatPeer] = useState<StudentProfile | null>(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Recommended People State
  const [recommendedPeople, setRecommendedPeople] = useState<RecommendedPerson[]>([
    {
      id: "rec-aisha",
      name: "Aisha Mohammed",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      country: "Nigeria",
      countryFlag: "🇳🇬",
      university: "UI",
      field: "Computer Science • UI",
      mutualCount: 14,
      status: "connect",
    },
    {
      id: "rec-daniel",
      name: "Daniel Tetteth",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      country: "Ghana",
      countryFlag: "🇬🇭",
      university: "KNUST",
      field: "Engineering • KNUST",
      mutualCount: 8,
      status: "connect",
    },
    {
      id: "rec-grace",
      name: "Grace Ndlovu",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
      country: "South Africa",
      countryFlag: "🇿🇦",
      university: "UCT",
      field: "Business • UCT",
      mutualCount: 19,
      status: "connect",
    },
    {
      id: "rec-samuel",
      name: "Samuel Ofori",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      country: "Ghana",
      countryFlag: "🇬🇭",
      university: "UoG",
      field: "Data Science • UoG",
      mutualCount: 6,
      status: "connect",
    },
  ]);

  // Handle Connect Click
  const handleConnectClick = (person: RecommendedPerson) => {
    if (person.status === "connect") {
      setRecommendedPeople((prev) =>
        prev.map((p) => (p.id === person.id ? { ...p, status: "pending" } : p))
      );
      showToast(`Connection request sent to ${person.name} via P2P network! ⏳`);

      // Simulate peer accepting connection in real-time
      setTimeout(() => {
        setRecommendedPeople((prev) =>
          prev.map((p) => (p.id === person.id ? { ...p, status: "connected" } : p))
        );
        setConnectionsCount((c) => c + 1);
        showToast(`🎉 ${person.name} accepted your connection! You can now collaborate in real time.`);
      }, 2500);
    } else if (person.status === "connected") {
      // Open direct message
      const studentObj: StudentProfile = {
        id: person.id,
        name: person.name,
        avatar: person.avatar,
        country: person.country,
        countryFlag: person.countryFlag,
        university: person.university,
        fieldOfStudy: person.field,
        careerGoal: "Software Engineer & Pan-African Innovator",
        graduationYear: "2026",
        bio: `Student at ${person.university} passionate about pan-African tech ecosystems.`,
        skills: ["Python", "Cloud Systems", "React", "AI Research"],
        interests: ["Hackathons", "Tech Innovation", "Scholarships"],
        languages: ["English"],
        opportunityInterests: ["Internships", "Fellowships"],
        competitionInterests: ["Zindi Africa", "Masakhane AI"],
        presenceStatus: "online",
        lastActive: "Just now",
        mutualFriendsCount: person.mutualCount,
        compatibilityScore: 94,
        friendsCount: 45,
        joinedCommunitiesCount: 4,
        projectsCount: 3,
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
      setActiveChatPeer(studentObj);
    }
  };

  // Upcoming Events State
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventData[]>([
    {
      id: "ev-1",
      day: "24",
      month: "May",
      title: "Pan-African AI Hackathon",
      time: "10:00 AM - 4:00 PM",
      attendeesCount: 412,
      isJoined: false,
    },
    {
      id: "ev-2",
      day: "28",
      month: "May",
      title: "University Fair (West Africa)",
      time: "9:00 AM - 3:00 PM",
      attendeesCount: 890,
      isJoined: false,
    },
    {
      id: "ev-3",
      day: "02",
      month: "Jun",
      title: "Career Growth Webinar",
      time: "5:00 PM - 6:30 PM",
      attendeesCount: 650,
      isJoined: false,
    },
  ]);

  const handleToggleJoinEvent = (eventId: string) => {
    setUpcomingEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextJoined = !e.isJoined;
          showToast(nextJoined ? `Joined ${e.title}! 🎟️ Added to your calendar.` : `Unregistered from ${e.title}.`);
          return {
            ...e,
            isJoined: nextJoined,
            attendeesCount: nextJoined ? e.attendeesCount + 1 : e.attendeesCount - 1,
          };
        }
        return e;
      })
    );
  };

  // Posts Feed State
  const [posts, setPosts] = useState<CommunityPostData[]>([
    {
      id: "post-ama",
      author: {
        id: "stu-ama-mensah",
        name: "Ama Serwaa",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        university: "UG",
        field: "Computer Science",
        country: "Ghana",
        countryFlag: "🇬🇭",
      },
      timeAgo: "2h ago",
      content:
        "Just finished the AI for Social Good workshop on Afriversity! It was amazing! Meeting people from different countries and working on real-world solutions gives me so much hope for Africa's future. 🌍✨ #AI #SocialImpact #Afriversity #TeamGhana",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80",
        tagLabel: "AI for Social Good",
        tagIcon: "workshop",
      },
      likes: 128,
      comments: 24,
      reposts: 12,
      isLiked: false,
      isReposted: false,
      commentsList: [
        {
          id: "c1",
          author: "Kofi Asante",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          text: "Incredible work Ama! Let's collaborate on the NLP translation pipeline.",
          time: "1h ago",
        },
      ],
    },
    {
      id: "post-kwame",
      author: {
        id: "stu-kwame-mensah",
        name: "Kwame Mensah",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        university: "KNUST",
        field: "Engineering",
        country: "Ghana",
        countryFlag: "🇬🇭",
      },
      timeAgo: "4h ago",
      content:
        "Looking for study partners for Data Structures and Algorithms. Anyone interested? Let's build together! 💪",
      tags: ["Study Group", "DSA", "Engineering"],
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80",
        tagLabel: "Study Group",
        tagIcon: "study",
      },
      likes: 96,
      comments: 18,
      reposts: 6,
      isLiked: false,
      isReposted: false,
      commentsList: [
        {
          id: "c2",
          author: "Daniel Tetteth",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
          text: "I'm in! Let's do nightly DP and Graph challenges on Discord/Afriversity.",
          time: "3h ago",
        },
      ],
    },
    {
      id: "post-esther",
      author: {
        id: "stu-esther-adjei",
        name: "Esther Adjei",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80",
        university: "Legon",
        field: "Business",
        country: "Ghana",
        countryFlag: "🇬🇭",
      },
      timeAgo: "6h ago",
      content:
        "Happy to announce I got the Erasmus+ scholarship! 🎉 Thank you Afriversity for making this possible!",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
        tagLabel: "Scholarship Success",
        tagIcon: "award",
      },
      likes: 214,
      comments: 42,
      reposts: 28,
      isLiked: false,
      isReposted: false,
    },
  ]);

  // Post Creator State
  const [postInputText, setPostInputText] = useState("");
  const [isCreatingPostModalOpen, setIsCreatingPostModalOpen] = useState(false);
  const [selectedPostMedia, setSelectedPostMedia] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputText, setCommentInputText] = useState("");

  // Create New Post Handler
  const handlePublishPost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postInputText.trim()) return;

    const newPost: CommunityPostData = {
      id: `post-${Date.now()}`,
      author: {
        id: "kojo-boateng",
        name: "Kojo Boateng",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        university: "UG",
        field: "Computer Science",
        country: "Ghana",
        countryFlag: "🇬🇭",
      },
      timeAgo: "Just now",
      content: postInputText,
      media: selectedPostMedia
        ? {
            type: "image",
            url: selectedPostMedia,
            tagLabel: "Community Post",
            tagIcon: "general",
          }
        : undefined,
      likes: 1,
      comments: 0,
      reposts: 0,
      isLiked: true,
      isReposted: false,
    };

    setPosts([newPost, ...posts]);
    setPostInputText("");
    setSelectedPostMedia(null);
    setIsCreatingPostModalOpen(false);
    showToast("Post shared with the Afriversity pan-African community! 🚀");
  };

  // Like Toggle
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Repost Toggle
  const handleToggleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextRepost = !p.isReposted;
          showToast(nextRepost ? "Reposted to your African scholar network! 🔁" : "Removed repost.");
          return {
            ...p,
            isReposted: nextRepost,
            reposts: nextRepost ? p.reposts + 1 : p.reposts - 1,
          };
        }
        return p;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    if (!commentInputText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: "Kojo Boateng",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            text: commentInputText,
            time: "Just now",
          };
          return {
            ...p,
            comments: p.comments + 1,
            commentsList: [...(p.commentsList || []), newComment],
          };
        }
        return p;
      })
    );
    setCommentInputText("");
    showToast("Comment posted! 💬");
  };

  // Trending Topics List
  const trendingTopics = [
    { rank: 1, tag: "Scholarships", count: "12.4K posts", pillColor: "bg-emerald-950/70 border-emerald-500/30 text-emerald-400" },
    { rank: 2, tag: "AI & Technology", count: "8.7K posts", pillColor: "bg-amber-950/70 border-amber-500/30 text-amber-400" },
    { rank: 3, tag: "University Admissions", count: "6.1K posts", pillColor: "bg-purple-950/70 border-purple-500/30 text-purple-300" },
    { rank: 4, tag: "Internships", count: "4.8K posts", pillColor: "bg-teal-950/70 border-teal-500/30 text-teal-300" },
    { rank: 5, tag: "Study Abroad", count: "3.9K posts", pillColor: "bg-orange-950/70 border-orange-500/30 text-orange-300" },
  ];

  return (
    <div className="w-full text-[#f5f5f4] pb-24 font-sans-body">
      {/* Real-time Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#1a1611] border border-[#f2ca50] text-[#f2ca50] text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto">
        {/* =========================================================================
            LEFT COLUMN (Sidebar): Profile Card + Communities Card + Adinkra Deco
           ========================================================================= */}
        <aside className="lg:col-span-3 space-y-4">
          {/* 1. Scholar Profile Summary Card */}
          <div
            id="community-user-profile-card"
            className="bg-[#12100d] border border-[#3d311c] hover:border-[#5a4828] transition-all rounded-3xl p-5 shadow-xl text-center relative overflow-hidden"
          >
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

            {/* Avatar Circle with Gold Border */}
            <div className="relative w-24 h-24 mx-auto mb-3">
              <div className="w-full h-full rounded-full p-1 ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#12100d] shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                  alt="Kojo Boateng"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Name, Subtitle, and Quote */}
            <h2 className="font-bold text-lg text-[#f5f5f4] font-serif-title tracking-tight">
              Kojo Boateng
            </h2>
            <p className="text-xs text-[#a8a29e] mt-0.5">
              Computer Science &bull; UG
            </p>
            <p className="text-xs text-[#d0c5af]/80 italic mt-2">
              &ldquo;Better skills. Bigger dreams.&rdquo;
            </p>

            {/* Horizontal Divider */}
            <div className="border-t border-[#2d2417] my-4" />

            {/* Connections & Communities Count */}
            <div className="flex items-center justify-around text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-xs text-[#a8a29e]">
                  <Users size={14} className="text-[#d4af37]" />
                  <span className="font-bold text-[#f5f5f4] text-sm">
                    {connectionsCount}
                  </span>
                </div>
                <span className="text-[10px] text-[#8c827a] uppercase tracking-wider mt-0.5">
                  Connections
                </span>
              </div>

              <div className="h-6 w-px bg-[#2d2417]" />

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-xs text-[#a8a29e]">
                  <Users size={14} className="text-[#d4af37]" />
                  <span className="font-bold text-[#f5f5f4] text-sm">
                    {communitiesCount}
                  </span>
                </div>
                <span className="text-[10px] text-[#8c827a] uppercase tracking-wider mt-0.5">
                  Communities
                </span>
              </div>
            </div>

            {/* View Profile Action Button */}
            <button
              id="view-profile-btn"
              onClick={() => {
                if (onNavigateTab) onNavigateTab("profile");
              }}
              className="mt-4 w-full py-2.5 rounded-full border border-[#d4af37]/60 hover:border-[#f2ca50] bg-transparent hover:bg-[#d4af37]/10 text-[#f2ca50] hover:text-[#ffe088] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer group"
            >
              <span>View Profile</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* 2. Your Communities Card */}
          <div
            id="community-your-communities-card"
            className="bg-[#12100d] border border-[#3d311c] rounded-3xl p-5 shadow-xl space-y-4"
          >
            {/* Header with Chevron */}
            <div
              onClick={() => setShowYourCommunities(!showYourCommunities)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#f2ca50]" />
                <h3 className="text-xs font-bold tracking-wide text-[#f5f5f4] uppercase">
                  Your Communities
                </h3>
              </div>
              {showYourCommunities ? (
                <ChevronUp size={16} className="text-[#a8a29e]" />
              ) : (
                <ChevronDown size={16} className="text-[#a8a29e]" />
              )}
            </div>

            {/* List of Communities */}
            {showYourCommunities && (
              <div className="space-y-3 pt-1">
                {[
                  {
                    name: "Africa Tech Builders",
                    members: "24.8K members",
                    icon: Code,
                  },
                  {
                    name: "EdTech Africa",
                    members: "18.2K members",
                    icon: Edit3,
                  },
                  {
                    name: "Women in STEM Africa",
                    members: "31.7K members",
                    icon: MapPin,
                  },
                  {
                    name: "Entrepreneurs Circle",
                    members: "15.4K members",
                    icon: Users,
                  },
                  {
                    name: "Design & Innovation Hub",
                    members: "12.9K members",
                    icon: Layers,
                  },
                ].map((comm, idx) => {
                  const IconComp = comm.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#1c1813] transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#241f18] border border-[#3d311c] text-[#f2ca50] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors truncate">
                          {comm.name}
                        </h4>
                        <span className="text-[10px] text-[#8c827a]">
                          {comm.members}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Explore all communities link */}
                <button
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab("study-groups");
                  }}
                  className="mt-2 w-full py-2 text-center text-xs font-bold text-[#f2ca50] hover:text-[#ffe088] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Explore all communities</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* 3. Decorative Adinkra Pattern Box (Desktop) */}
          <div className="hidden lg:block bg-gradient-to-br from-[#1c1813] to-[#12100d] border border-[#3d311c]/60 rounded-3xl p-4 text-center relative overflow-hidden shadow-inner">
            <div className="african-kente-pattern opacity-10 absolute inset-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase font-bold">
                PAN-AFRICAN MESH NETWORK
              </span>
              <p className="text-[11px] text-[#a8a29e] mt-1">
                Direct WebRTC & P2P Academic Exchange across 54 Nations.
              </p>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            CENTER COLUMN (Main Feed): Hero + Filter Pills + Post Creator + Posts
           ========================================================================= */}
        <main className="lg:col-span-6 space-y-4 min-w-0">
          {/* 1. Community Hero Banner with Stats Badges */}
          <div
            id="community-hero-banner"
            className="relative rounded-3xl overflow-hidden border border-[#3d311c] shadow-2xl bg-[#14120e]"
          >
            {/* Background Image of African Students Collaborating */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"
                alt="African Students Collaborating"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.12]"
              />

              {/* Gradient Darkening Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14120e] via-[#14120e]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#14120e]/90 via-[#14120e]/40 to-transparent" />

              {/* Banner Text Content */}
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-10">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Users size={18} className="text-[#f2ca50]" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#f2ca50]">
                      COMMUNITY
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-[#f5f5f4] tracking-tight leading-tight">
                    Real People. Shared Dreams.
                  </h1>

                  <p className="text-xs text-[#d0c5af] mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    Connect with students, mentors and changemakers across
                    Africa. Share ideas, build together and create impact.
                  </p>
                </div>

                {/* "Stronger Together" Hand-Script Doodle on Right */}
                <div className="absolute top-5 right-5 hidden sm:flex flex-col items-center rotate-[-6deg] select-none pointer-events-none">
                  <Sparkles size={16} className="text-[#f2ca50] mb-0.5" />
                  <span className="font-serif-title italic font-bold text-lg sm:text-xl text-[#f2ca50] tracking-wide drop-shadow-md">
                    Stronger Together
                  </span>
                </div>

                {/* 3 Floating Badges at Bottom of Banner */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 bg-[#1c1813]/80 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#3d311c]/60">
                    <div className="w-6 h-6 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center shrink-0">
                      <Users size={12} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#f5f5f4] truncate">
                        150K+
                      </div>
                      <div className="text-[9px] text-[#a8a29e] truncate">
                        Active Students
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#1c1813]/80 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#3d311c]/60">
                    <div className="w-6 h-6 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center shrink-0">
                      <Globe size={12} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#f5f5f4] truncate">
                        50+
                      </div>
                      <div className="text-[9px] text-[#a8a29e] truncate">
                        Countries
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#1c1813]/80 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#3d311c]/60">
                    <div className="w-6 h-6 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center shrink-0">
                      <Users size={12} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#f5f5f4] truncate">
                        1M+
                      </div>
                      <div className="text-[9px] text-[#a8a29e] truncate">
                        Connections
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Golden Adinkra Geometric Trim Under Hero */}
            <div className="h-2 w-full bg-gradient-to-r from-[#b38f28] via-[#f2ca50] to-[#b38f28] opacity-80" />
          </div>

          {/* 2. Filter Pills (All, Students, Groups, Mentors, Events, Opportunities) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "All", icon: Users },
              { id: "students", label: "Students", icon: GraduationCap },
              { id: "groups", label: "Groups", icon: Layers },
              { id: "mentors", label: "Mentors", icon: Award },
              { id: "events", label: "Events", icon: Calendar },
              { id: "opportunities", label: "Opportunities", icon: Briefcase },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#c69a4c] to-[#f2ca50] text-[#0c0a09] shadow-md scale-105"
                      : "bg-[#14120e] hover:bg-[#1f1a14] text-[#d6d3d1] border border-[#3d311c] hover:border-[#d4af37]/40"
                  }`}
                >
                  <IconComp size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Create Post Box (LinkedIn-Style) */}
          <div
            id="community-post-creator"
            className="bg-[#12100d] border border-[#3d311c] rounded-3xl p-4 shadow-xl space-y-3"
          >
            {/* Top Input Row */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Kojo Boateng"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#d4af37] shrink-0"
              />
              <button
                onClick={() => setIsCreatingPostModalOpen(true)}
                className="flex-1 text-left bg-[#1a1611] hover:bg-[#241e17] border border-[#3d311c] hover:border-[#f2ca50]/40 rounded-full py-2.5 px-4 text-xs text-[#8c827a] transition-all cursor-pointer shadow-inner"
              >
                Share something with the community...
              </button>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-1 border-t border-[#241d13]">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setIsCreatingPostModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1c1813] text-[#a8a29e] hover:text-[#f2ca50] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ImageIcon size={16} className="text-emerald-400" />
                  <span className="hidden xs:inline">Photo</span>
                </button>

                <button
                  onClick={() => setIsCreatingPostModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1c1813] text-[#a8a29e] hover:text-[#f2ca50] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Video size={16} className="text-amber-400" />
                  <span className="hidden xs:inline">Video</span>
                </button>

                <button
                  onClick={() => setIsCreatingPostModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1c1813] text-[#a8a29e] hover:text-[#f2ca50] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <BarChart2 size={16} className="text-purple-400" />
                  <span className="hidden xs:inline">Poll</span>
                </button>

                <button
                  onClick={() => setIsCreatingPostModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#1c1813] text-[#a8a29e] hover:text-[#f2ca50] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 size={16} className="text-blue-400" />
                  <span className="hidden xs:inline">Post</span>
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={() => setIsCreatingPostModalOpen(true)}
                className="px-4 py-1.5 rounded-full border border-[#f2ca50]/50 hover:border-[#f2ca50] bg-transparent hover:bg-[#f2ca50]/10 text-[#f2ca50] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Send size={13} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* 4. Social Feed Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-[#12100d] border border-[#3d311c] hover:border-[#544324] rounded-3xl p-5 shadow-xl transition-all space-y-3.5"
              >
                {/* Author Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-[#d4af37]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#f5f5f4] hover:text-[#f2ca50] transition-colors cursor-pointer">
                          {post.author.name}
                        </span>
                        <span className="text-xs">{post.author.countryFlag}</span>
                      </div>
                      <div className="text-[11px] text-[#a8a29e] flex items-center gap-1.5 mt-0.5">
                        <span>{post.author.country}</span>
                        <span>&bull;</span>
                        <span>{post.author.university}</span>
                        <span>&bull;</span>
                        <span>{post.author.field}</span>
                      </div>
                      <div className="text-[10px] text-[#8c827a] flex items-center gap-1 mt-0.5">
                        <span>{post.timeAgo}</span>
                        <span>&bull;</span>
                        <Globe size={11} />
                      </div>
                    </div>
                  </div>

                  <button className="text-[#8c827a] hover:text-[#f5f5f4] p-1.5 rounded-full hover:bg-[#1c1813] transition-colors cursor-pointer">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Post Text Content */}
                <p className="text-xs sm:text-[13px] text-[#e5e2e1] leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Tags */}
                {post.tags && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.tags.map((tg, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#241f18] text-[#f2ca50] border border-[#3d311c]"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}

                {/* Media Attachment Card */}
                {post.media && (
                  <div className="relative rounded-2xl overflow-hidden border border-[#3d311c] group">
                    <img
                      src={post.media.url}
                      alt={post.media.tagLabel || "Post Media"}
                      referrerPolicy="no-referrer"
                      className="w-full h-56 sm:h-72 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* Overlay Badge Tag */}
                    {post.media.tagLabel && (
                      <div className="absolute bottom-3 left-3 bg-[#12100d]/90 backdrop-blur-md border border-[#d4af37]/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-[#f5f5f4] shadow-lg">
                        <Users size={14} className="text-[#f2ca50]" />
                        <span>{post.media.tagLabel}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Post Engagement Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[#241d13] text-xs text-[#a8a29e]">
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Like Button */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isLiked
                          ? "text-red-400 font-bold"
                          : "hover:text-red-400"
                      }`}
                    >
                      <Heart
                        size={16}
                        className={post.isLiked ? "fill-red-400" : ""}
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post.id ? null : post.id
                        )
                      }
                      className="flex items-center gap-1.5 hover:text-[#f2ca50] transition-colors cursor-pointer"
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments}</span>
                    </button>

                    {/* Repost Button */}
                    <button
                      onClick={() => handleToggleRepost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isReposted
                          ? "text-[#f2ca50] font-bold"
                          : "hover:text-[#f2ca50]"
                      }`}
                    >
                      <Repeat size={16} />
                      <span>{post.reposts}</span>
                    </button>
                  </div>

                  {/* Share Action */}
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      showToast("Post link copied to clipboard! 🔗");
                    }}
                    className="hover:text-[#f2ca50] transition-colors cursor-pointer p-1"
                    title="Share Post"
                  >
                    <Share2 size={15} />
                  </button>
                </div>

                {/* Inline Expandable Comment Section */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 border-t border-[#241d13] space-y-3 animate-in fade-in duration-150">
                    {/* Comments List */}
                    {post.commentsList && post.commentsList.length > 0 && (
                      <div className="space-y-2">
                        {post.commentsList.map((c) => (
                          <div
                            key={c.id}
                            className="bg-[#181510] p-2.5 rounded-2xl border border-[#2d2417] flex items-start gap-2.5"
                          >
                            <img
                              src={c.avatar}
                              alt={c.author}
                              className="w-7 h-7 rounded-full object-cover mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#f5f5f4]">
                                  {c.author}
                                </span>
                                <span className="text-[10px] text-[#8c827a]">
                                  {c.time}
                                </span>
                              </div>
                              <p className="text-xs text-[#d0c5af] mt-0.5">
                                {c.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Comment Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={commentInputText}
                        onChange={(e) => setCommentInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddComment(post.id);
                        }}
                        placeholder="Write a comment for African peers..."
                        className="flex-1 bg-[#181510] border border-[#332a19] focus:border-[#f2ca50] rounded-full py-1.5 px-3.5 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-2 rounded-full bg-[#f2ca50] text-[#0c0a09] font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </main>

        {/* =========================================================================
            RIGHT COLUMN (Sidebar): Trending Topics + Recommended People + Events
           ========================================================================= */}
        <aside className="lg:col-span-3 space-y-4">
          {/* 1. 🔥 Trending Topics Card */}
          <div
            id="community-trending-topics-card"
            className="bg-[#12100d] border border-[#3d311c] rounded-3xl p-5 shadow-xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#f5f5f4]">
                  Trending Topics
                </h3>
              </div>
              <button
                onClick={() => showToast("Showing all pan-African trends 📈")}
                className="text-xs text-[#a8a29e] hover:text-[#f2ca50] transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                <span>See all</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* List of Trending Topics */}
            <div className="space-y-2.5 pt-1">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.rank}
                  onClick={() => {
                    setPostInputText((p) => p + ` #${topic.tag.replace(/\s+/g, "")}`);
                    showToast(`Filtered feed by #${topic.tag}`);
                  }}
                  className="flex items-center justify-between group cursor-pointer p-1.5 rounded-xl hover:bg-[#1a1611] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#8c827a] group-hover:text-[#f2ca50] w-3">
                      {topic.rank}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${topic.pillColor} group-hover:scale-105 transition-transform`}
                    >
                      {topic.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8c827a]">
                    {topic.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Recommended People Card (LinkedIn-Style with [Connect] Buttons) */}
          <div
            id="community-recommended-people-card"
            className="bg-[#12100d] border border-[#3d311c] rounded-3xl p-5 shadow-xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#f5f5f4]">
                Recommended People
              </h3>
              <button
                onClick={() => showToast("Expanded recommendation queue")}
                className="text-xs text-[#a8a29e] hover:text-[#f2ca50] transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                <span>See all</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* List of People */}
            <div className="space-y-3 pt-1">
              {recommendedPeople.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-2xl hover:bg-[#1a1611] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3d311c] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#f5f5f4] truncate">
                        {person.name}
                      </div>
                      <div className="text-[10px] text-[#a8a29e] flex items-center gap-1 truncate">
                        <span>{person.countryFlag}</span>
                        <span>{person.country}</span>
                      </div>
                      <div className="text-[10px] text-[#8c827a] truncate">
                        {person.field}
                      </div>
                    </div>
                  </div>

                  {/* Connect Button */}
                  <button
                    onClick={() => handleConnectClick(person)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      person.status === "connected"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                        : person.status === "pending"
                        ? "bg-amber-950/60 text-amber-300 border border-amber-500/40 animate-pulse"
                        : "border border-[#d4af37]/60 hover:border-[#f2ca50] bg-transparent hover:bg-[#d4af37]/10 text-[#f2ca50]"
                    }`}
                  >
                    {person.status === "connected"
                      ? "Message"
                      : person.status === "pending"
                      ? "Pending"
                      : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 📅 Upcoming Events Card */}
          <div
            id="community-upcoming-events-card"
            className="bg-[#12100d] border border-[#3d311c] rounded-3xl p-5 shadow-xl space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#f2ca50]" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-[#f5f5f4]">
                  Upcoming Events
                </h3>
              </div>
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab("calendar");
                }}
                className="text-xs text-[#a8a29e] hover:text-[#f2ca50] transition-colors flex items-center gap-0.5 cursor-pointer"
              >
                <span>See all</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* Event Items */}
            <div className="space-y-3 pt-1">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between gap-2.5 p-1.5 rounded-2xl hover:bg-[#1a1611] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Date Block */}
                    <div className="w-10 h-10 rounded-xl bg-[#241f18] border border-[#3d311c] flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-extrabold text-[#f2ca50] leading-none">
                        {ev.day}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-[#a8a29e] mt-0.5 leading-none">
                        {ev.month}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#f5f5f4] truncate">
                        {ev.title}
                      </h4>
                      <p className="text-[10px] text-[#8c827a]">{ev.time}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleJoinEvent(ev.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      ev.isJoined
                        ? "bg-[#f2ca50] text-[#0c0a09]"
                        : "border border-[#d4af37]/60 hover:border-[#f2ca50] text-[#f2ca50] hover:bg-[#d4af37]/10"
                    }`}
                  >
                    {ev.isJoined ? "Joined" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. "From Africa, For Africa." Banner Card */}
          <div
            id="community-from-africa-card"
            className="relative rounded-3xl overflow-hidden border border-[#3d311c] p-5 shadow-2xl group cursor-pointer"
          >
            {/* Background Image of African City Skyline */}
            <img
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80"
              alt="Pan-African Horizon"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#14120e] via-[#14120e]/80 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="font-serif-title text-base font-bold text-[#f2ca50] tracking-tight">
                  From Africa, For Africa.
                </h4>
                <p className="text-[11px] text-[#d0c5af] mt-1">
                  A community. A movement. A future.
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#f2ca50] text-[#0c0a09] flex items-center justify-center font-bold shadow-lg group-hover:translate-x-1 transition-transform">
                <ChevronRight size={18} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Post Creation Modal */}
      {isCreatingPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d2417]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#f2ca50]" />
                <h3 className="text-base font-bold text-[#f5f5f4] font-serif-title">
                  Create a Post
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingPostModalOpen(false)}
                className="text-[#a8a29e] hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Kojo Boateng"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#d4af37]"
              />
              <div>
                <div className="text-xs font-bold text-[#f5f5f4]">
                  Kojo Boateng
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Globe size={10} /> Public &bull; Pan-African Network
                </div>
              </div>
            </div>

            <textarea
              value={postInputText}
              onChange={(e) => setPostInputText(e.target.value)}
              placeholder="What do you want to share with fellow African scholars and changemakers?"
              rows={4}
              className="w-full bg-[#1a1611] border border-[#332a19] focus:border-[#f2ca50] rounded-2xl p-3.5 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none resize-none leading-relaxed"
            />

            {/* Quick Media Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8c827a]">
                Attach Media
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  {
                    label: "Workshop Photo",
                    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
                  },
                  {
                    label: "Study Group",
                    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
                  },
                  {
                    label: "Hackathon Lab",
                    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
                  },
                ].map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedPostMedia(m.url)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                      selectedPostMedia === m.url
                        ? "bg-[#f2ca50] text-[#0c0a09] border-[#f2ca50]"
                        : "bg-[#1f1a14] text-[#d0c5af] border-[#3d311c]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#2d2417]">
              <div className="flex items-center gap-2 text-[#a8a29e]">
                <button
                  type="button"
                  onClick={() => setPostInputText((p) => p + " #AI #PanAfrica")}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#241f18] hover:text-[#f2ca50] transition-colors"
                >
                  + Add Hashtags
                </button>
              </div>

              <button
                onClick={handlePublishPost}
                disabled={!postInputText.trim()}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  postInputText.trim()
                    ? "bg-[#f2ca50] text-[#0c0a09] shadow-lg hover:scale-105 active:scale-95"
                    : "bg-[#2c2417] text-[#8c827a] cursor-not-allowed"
                }`}
              >
                <Send size={13} />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Pan-African Peer-to-Peer Chat Sidebar removed per user request */}
    </div>
  );
};
