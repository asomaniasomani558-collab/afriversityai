import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Compass,
  Layers,
  Cpu,
  Globe2,
  GraduationCap,
  Users,
  Award,
  Building2,
  Calendar,
  MessageSquare,
  Bookmark,
  User,
  FolderGit2,
  LayoutGrid,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { NavigationTab } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface PathwaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

interface PathwayItem {
  id: NavigationTab;
  titleKey: string;
  category: "Academic Core & Campus" | "Advanced STEM & Research" | "Learning & Community";
  categoryKey: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tags: string[];
  badge?: string;
  badgeColor?: string;
  path: string;
  subPages: string[];
}

export const PathwaysModal: React.FC<PathwaysModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const pathways: PathwayItem[] = useMemo(
    () => [
      // 1. Academic Core & Campus
      {
        id: "dashboard",
        titleKey: t.tabDashboard,
        category: "Academic Core & Campus",
        categoryKey: t.filterAcademic,
        subtitle: "Academic KPIs, Active STEM Modules & Progression",
        description:
          "High-level telemetry on semester milestones, enrolled courses, daily class agenda, GPA trajectory, and quick action launchpads.",
        icon: LayoutGrid,
        tags: ["Dashboard", "KPIs", "Courses", "Analytics", "Daily Schedule", "GPA"],
        path: "/app/dashboard",
        subPages: ["Progress Tracker", "Quick Access", "Current Milestones", "Daily Timetable"],
      },
      {
        id: "lobby",
        titleKey: t.tabLobby,
        category: "Academic Core & Campus",
        categoryKey: t.filterAcademic,
        subtitle: "AfriVersty Welcome, Heritage & Tour Gateway",
        description:
          "Pan-African scholar welcoming portal. Tour campus modules, explore heritage tiers, academic honor codes, and orientation guidelines.",
        icon: GraduationCap,
        tags: ["Lobby", "Orientation", "Welcome", "Campus Tour", "Accreditation", "Heritage"],
        path: "/app/lobby",
        subPages: ["Campus Tour", "Scholar Manifesto", "Academic Honor Code", "Platform Guide"],
      },
      {
        id: "profile",
        titleKey: t.tabProfile,
        category: "Academic Core & Campus",
        categoryKey: t.filterAcademic,
        subtitle: "University SSO, EduID, Achievements & Low-Data Mode",
        description:
          "Manage academic credentials, Institutional SSO (EduID/Eduroam), STEM badge vault, and low-bandwidth network configurations.",
        icon: User,
        tags: ["Profile", "EduID", "SSO", "Badges", "Offline Vault", "Low-Data", "Settings"],
        badge: "EduID SSO",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        path: "/app/profile",
        subPages: ["Academic Bio", "Institutional SSO", "STEM Badges", "Low-Data Mode", "Theme Selector"],
      },
      {
        id: "bookmarks",
        titleKey: t.tabBookmarks,
        category: "Academic Core & Campus",
        categoryKey: t.filterAcademic,
        subtitle: "Bookmarked Grants, Lecture Notes & Research Pins",
        description:
          "Quickly review saved scholarship deadlines, pinned course syllabi, faculty research papers, and curated study notes.",
        icon: Bookmark,
        tags: ["Bookmarks", "Saved", "Archive", "Vault", "Pinned Notes"],
        path: "/app/bookmarks",
        subPages: ["Saved Scholarships", "Archived Modules", "Pinned Research", "Study Guides"],
      },
      {
        id: "messages",
        titleKey: t.tabMessages,
        category: "Academic Core & Campus",
        categoryKey: t.filterAcademic,
        subtitle: "Encrypted Direct Chats & Cohort Peer Discussions",
        description:
          "Secure messaging channels with university colleagues, research cohort leads, and faculty advisors with offline queueing.",
        icon: MessageSquare,
        tags: ["Messenger", "Chat", "Peers", "Mentors", "Study Groups"],
        badge: "Live Chat",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        path: "/app/messages",
        subPages: ["Peer Direct Messages", "Study Group Channels", "Mentor Office Hours"],
      },

      // 2. Advanced STEM & Research Hub
      {
        id: "stem-sandbox",
        titleKey: t.tabStemSandbox,
        category: "Advanced STEM & Research",
        categoryKey: t.filterStem,
        subtitle: "RLC Oscilloscope, Python ODE & 3D Crystal Lattices",
        description:
          "Interactive laboratory suite: dual-channel RLC circuit oscilloscope with live waveform analysis, Euler-Cromer Python ODE solver, and 3D semiconductor crystal visualizer.",
        icon: Cpu,
        tags: ["STEM", "Lab", "Circuits", "RLC", "Python", "ODE", "Physics", "Semiconductor", "3D Lattice"],
        badge: "Interactive Lab",
        badgeColor: "bg-[#f2ca50]/20 text-[#f2ca50] border-[#d4af37]/40",
        path: "/app/stem-sandbox",
        subPages: [
          "Dual-Channel RLC Oscilloscope",
          "In-Browser Python ODE Solver",
          "3D Semiconductor Crystal Lattice",
          "Resonance Frequency Calculator",
        ],
      },
      {
        id: "research-radar",
        titleKey: t.tabResearchRadar,
        category: "Advanced STEM & Research",
        categoryKey: t.filterStem,
        subtitle: "$38M+ Pan-African Grants, Equipment Sharing & Faculty",
        description:
          "Live grant matchmaker, cross-institutional STEM lab equipment sharing, active research publications, and faculty mentorship network.",
        icon: Globe2,
        tags: ["Research", "Grants", "Funding", "Equipment", "Faculty", "Publications"],
        badge: "$38M+ Grants",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        path: "/app/research-radar",
        subPages: [
          "Pan-African Grant Matchmaker",
          "STEM Lab Equipment Sharing",
          "Active Research Projects",
          "Faculty Directory",
        ],
      },
      {
        id: "ai-assistant",
        titleKey: t.tabAiAssistant,
        category: "Advanced STEM & Research",
        categoryKey: t.filterStem,
        subtitle: "Gemini 3.8 Academic Mentor with Formatted Readable Math",
        description:
          "Comprehensive academic STEM tutoring across physics, chemistry, calculus, and engineering systems with clear, standard mathematical notation and African multilingual support.",
        icon: Sparkles,
        tags: ["AI", "Gemini", "STEM", "Physics", "Chemistry", "Math", "Engineering", "Multilingual"],
        badge: "Gemini 3.8",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        path: "/app/ai-assistant",
        subPages: [
          "Physics & Wave Mechanics",
          "Reaction Dynamics & Kinetics",
          "Calculus & Linear Algebra",
          "Renewable Microgrid Engineering",
        ],
      },
      {
        id: "projects",
        titleKey: t.tabProjects,
        category: "Advanced STEM & Research",
        categoryKey: t.filterStem,
        subtitle: "Student Engineering Repositories & Hardware Prototypes",
        description:
          "Showcase of student-built engineering repositories, Sahel solar microgrids, drone soil telemetry, and open-source African software.",
        icon: FolderGit2,
        tags: ["Projects", "Repositories", "Hardware", "Open Source", "Prototypes", "Code"],
        path: "/app/projects",
        subPages: ["Featured Projects", "Hardware Prototypes", "Open-Source Repos", "Submit Project"],
      },

      // 3. Learning & Community Gateways
      {
        id: "my-courses",
        titleKey: t.tabCourses,
        category: "Learning & Community",
        categoryKey: t.filterCommunity,
        subtitle: "Curated STEM Curricula, Interactive Video & Syllabi",
        description:
          "Full course modules spanning Renewable Energy, Embedded Systems, Vector Calculus, and Distributed Computing with offline sync.",
        icon: GraduationCap,
        tags: ["Courses", "Curriculum", "Lectures", "Syllabus", "STEM", "Exams"],
        path: "/app/my-courses",
        subPages: ["Active Courses", "Completed Modules", "Course Catalog", "Lecture Notes"],
      },
      {
        id: "scholarships",
        titleKey: t.tabScholarships,
        category: "Learning & Community",
        categoryKey: t.filterCommunity,
        subtitle: "Undergraduate, Masters & PhD Academic Funding Portals",
        description:
          "Direct funding directory featuring DAAD, Mastercard Foundation, Mandela Rhodes, and African Development Bank fellowships.",
        icon: Award,
        tags: ["Scholarships", "Grants", "Fellowships", "Mastercard", "DAAD", "Funding"],
        badge: "Funding",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        path: "/app/scholarships",
        subPages: ["Open Applications", "Eligibility Checker", "Application Tracker", "Deadlines"],
      },
      {
        id: "study-groups",
        titleKey: t.tabStudyGroups,
        category: "Learning & Community",
        categoryKey: t.filterCommunity,
        subtitle: "Peer Study Circles, Code Africa & Exam Prep Rooms",
        description:
          "Collaborative peer learning cohorts across 18+ African universities with voice rooms, shared whiteboards, and assignment study rooms.",
        icon: Users,
        tags: ["Study Groups", "Peer Learning", "Collaboration", "Code Africa", "Exam Prep"],
        path: "/app/study-groups",
        subPages: ["My Study Circles", "Discover Groups", "Create Circle", "Peer Whiteboard"],
      },
      {
        id: "universities",
        titleKey: t.tabUniversities,
        category: "Learning & Community",
        categoryKey: t.filterCommunity,
        subtitle: "Pan-African Universities Network & Research Labs",
        description:
          "Explore top universities across Africa: UCT, Cairo University, Makerere, KNUST, University of Ibadan, and Ashesi University.",
        icon: Building2,
        tags: ["Universities", "Campuses", "Institutions", "Faculty", "Programs", "Africa"],
        path: "/app/universities",
        subPages: ["University Directory", "Faculty Roster", "Campus Rankings", "Exchange Programs"],
      },
      {
        id: "calendar",
        titleKey: t.tabCalendar,
        category: "Learning & Community",
        categoryKey: t.filterCommunity,
        subtitle: "Academic Deadlines, Pan-African Hackathons & Lectures",
        description:
          "Synced master calendar with university lecture schedules, hackathon deadlines, faculty office hours, and international research symposiums.",
        icon: Calendar,
        tags: ["Calendar", "Events", "Deadlines", "Hackathons", "Symposiums", "Schedule"],
        path: "/app/calendar",
        subPages: ["Monthly Schedule", "Upcoming Hackathons", "Assignment Deadlines", "Symposiums"],
      },
    ],
    [t]
  );

  const filteredPathways = useMemo(() => {
    return pathways.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "academic" && item.category === "Academic Core & Campus") ||
        (selectedCategory === "stem" && item.category === "Advanced STEM & Research") ||
        (selectedCategory === "community" && item.category === "Learning & Community");

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.titleKey.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.subPages.some((sp) => sp.toLowerCase().includes(q)) ||
        item.path.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [pathways, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleNavigate = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div
      id="all-pathways-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-black/75 flex items-center justify-center p-3 sm:p-6 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="all-pathways-modal-content"
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#14120f] border border-[#d4af37]/40 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 text-[#e5e2e1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-7 border-b border-[#d4af37]/25 bg-[#1a1713] relative shrink-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#f2ca50]/20 flex items-center justify-center text-[#f2ca50] border border-[#d4af37]/40 shadow-sm shrink-0">
                <Compass size={28} className="animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#f2ca50] tracking-wide">
                    {t.pathwaysHub}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] border border-[#d4af37]/30">
                    14 Gateways
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#99907c] mt-0.5">
                  {t.pathwaysSubtitle}
                </p>
              </div>
            </div>

            <button
              id="close-pathways-modal-btn"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-[#201c17] hover:bg-[#322c22] border border-[#d4af37]/30 flex items-center justify-center text-[#ded8cb] hover:text-[#f2ca50] transition-colors shrink-0"
              aria-label={t.close}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99907c]" />
              <input
                id="pathways-search-modal-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPathways}
                className="w-full bg-[#0d0c0a] border border-[#d4af37]/30 rounded-full py-2.5 pl-11 pr-10 text-sm text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50] focus:ring-1 focus:ring-[#f2ca50]/30 transition-all font-sans-body"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#99907c] hover:text-[#e5e2e1]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: "all", label: t.filterAll },
                { id: "academic", label: t.filterAcademic },
                { id: "stem", label: t.filterStem },
                { id: "community", label: t.filterCommunity },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                    selectedCategory === cat.id
                      ? "bg-[#f2ca50] text-[#2a2000] border-[#f2ca50] font-bold shadow-sm"
                      : "bg-[#201c17] text-[#ded8cb] hover:text-[#f2ca50] border-[#d4af37]/25 hover:border-[#d4af37]/60"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pathways Grid */}
        <div
          id="pathways-grid-container"
          className="flex-1 p-5 sm:p-7 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scrollbar-thin scrollbar-thumb-[#d4af37]/30"
        >
          {filteredPathways.length === 0 ? (
            <div className="col-span-full py-16 text-center space-y-3">
              <Compass size={48} className="mx-auto text-[#99907c] opacity-50" />
              <h3 className="text-base font-bold text-[#e5e2e1]">{t.noMatchingPathways}</h3>
              <p className="text-xs text-[#99907c] max-w-sm mx-auto">
                No gateway matched &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;STEM&rdquo;, &ldquo;Courses&rdquo;, &ldquo;Grants&rdquo;, or &ldquo;Profile&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-[#201c17] text-[#f2ca50] rounded-xl border border-[#d4af37]/30 text-xs font-bold hover:bg-[#2e261a] transition-all"
              >
                {t.resetSearch}
              </button>
            </div>
          ) : (
            filteredPathways.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <div
                  key={item.id}
                  id={`pathway-item-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`group relative p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "bg-[#252018] border-[#f2ca50] shadow-lg shadow-[#f2ca50]/10 ring-1 ring-[#f2ca50]/50"
                      : "bg-[#181511]/90 hover:bg-[#221e18] border-[#d4af37]/20 hover:border-[#f2ca50]/60 hover:shadow-md"
                  }`}
                >
                  <div>
                    {/* Top Row: Icon, Category, Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-[#f2ca50] text-[#2a2000] shadow-md shadow-[#f2ca50]/20"
                              : "bg-[#24201a] text-[#f2ca50] group-hover:scale-110 border border-[#d4af37]/30"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm sm:text-base font-bold transition-colors ${
                                isActive ? "text-[#f2ca50]" : "text-[#e5e2e1] group-hover:text-[#f2ca50]"
                              }`}
                            >
                              {item.titleKey}
                            </h3>
                            {isActive && (
                              <span className="bg-[#f2ca50]/20 text-[#f2ca50] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-[#f2ca50]/40 flex items-center gap-0.5">
                                <CheckCircle2 size={10} /> Active
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#99907c] font-mono">
                            {item.categoryKey}
                          </span>
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            item.badgeColor || "bg-[#f2ca50]/15 text-[#f2ca50] border-[#f2ca50]/30"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Subtitle & Description */}
                    <p className="text-xs font-semibold text-[#f2ca50]/90 mb-1">
                      {item.subtitle}
                    </p>
                    <p className="text-[11px] text-[#d0c5af] leading-relaxed line-clamp-2 mb-3 font-sans-body">
                      {item.description}
                    </p>

                    {/* Sub-pages pills */}
                    {item.subPages && item.subPages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.subPages.map((sp, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-[#0f0e0c] text-[#ded8cb] px-2 py-0.5 rounded-md border border-[#d4af37]/15 flex items-center gap-1"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#f2ca50]" />
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Route & Jump Action */}
                  <div className="pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-[11px]">
                    <span className="text-[#99907c] font-mono text-[10px]">
                      {t.routeLabel}: <strong className="text-[#ded8cb]">{item.path}</strong>
                    </span>
                    <div className="flex items-center gap-1 text-[#f2ca50] font-bold group-hover:translate-x-1 transition-transform">
                      <span>{t.openPathway}</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 sm:p-5 bg-[#171410] border-t border-[#d4af37]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#99907c] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {t.allGatewaysOnline} &bull; <strong className="text-[#f2ca50] uppercase">{activeTab}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block font-mono text-[11px]">
              Press <kbd className="px-1.5 py-0.5 bg-[#252019] rounded border border-[#d4af37]/30 text-[#f2ca50]">Esc</kbd> to close
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#201c17] hover:bg-[#322c22] text-[#ded8cb] hover:text-[#f2ca50] rounded-xl border border-[#d4af37]/30 font-semibold transition-all"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
