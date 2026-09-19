import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Award,
  CalendarDays,
  Sparkles,
  Bookmark,
  FolderGit2,
  Mail,
  User,
  Compass,
  Building2,
  LogOut,
  Settings,
  Cpu,
  Globe2,
  LogIn,
} from "lucide-react";
import { NavigationTab, UserProfile } from "../types";
import { AfriLogo } from "./AfriLogo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useLanguage } from "../context/LanguageContext";

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  user: UserProfile;
  unreadMessagesCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  unreadMessagesCount = 3,
}) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: "lobby" as NavigationTab,
      label: t.tabLobby,
      icon: Compass,
      materialIcon: "auto_stories",
    },
    {
      id: "dashboard" as NavigationTab,
      label: t.tabDashboard,
      icon: LayoutDashboard,
      materialIcon: "dashboard",
    },
    {
      id: "my-courses" as NavigationTab,
      label: t.tabCourses,
      icon: GraduationCap,
      materialIcon: "school",
    },
    {
      id: "scholarships" as NavigationTab,
      label: t.tabScholarships,
      icon: Award,
      materialIcon: "stars",
      badge: "Active",
    },
    {
      id: "study-groups" as NavigationTab,
      label: t.tabStudyGroups,
      icon: Users,
      materialIcon: "groups",
    },
    {
      id: "universities" as NavigationTab,
      label: t.tabUniversities,
      icon: Building2,
      materialIcon: "account_balance",
    },
    {
      id: "community" as NavigationTab,
      label: "Community",
      icon: Users,
      materialIcon: "diversity_3",
      badge: "Social",
      highlight: true,
    },
    {
      id: "research-radar" as NavigationTab,
      label: t.tabResearchRadar,
      icon: Globe2,
      materialIcon: "hub",
      badge: "Grants",
    },
    {
      id: "projects" as NavigationTab,
      label: t.tabProjects,
      icon: FolderGit2,
      materialIcon: "account_tree",
    },
    {
      id: "ai-assistant" as NavigationTab,
      label: t.tabAiAssistant,
      icon: Sparkles,
      materialIcon: "psychology",
      highlight: true,
    },
    {
      id: "calendar" as NavigationTab,
      label: "Competitions",
      icon: CalendarDays,
      materialIcon: "emoji_events",
      badge: "Hackathons",
    },
    {
      id: "messages" as NavigationTab,
      label: t.tabMessages,
      icon: Mail,
      materialIcon: "mail",
      badgeCount: unreadMessagesCount,
    },
    {
      id: "bookmarks" as NavigationTab,
      label: t.tabBookmarks,
      icon: Bookmark,
      materialIcon: "bookmark",
    },
    {
      id: "profile" as NavigationTab,
      label: t.tabProfile,
      icon: User,
      materialIcon: "person",
    },
    {
      id: "login" as NavigationTab,
      label: "Login Page",
      icon: LogIn,
      materialIcon: "login",
      badge: "Auth",
    },
  ];

  return (
    <aside
      id="app-sidebar-nav"
      className="fixed left-0 top-0 h-full w-72 bg-[#100f0d]/85 backdrop-blur-xl border-r border-[#d4af37]/20 z-50 flex flex-col shadow-[8px_0_32px_rgba(0,0,0,0.6)] transition-all select-none"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[#d4af37]/15 flex items-center justify-between">
        <AfriLogo size="md" onClick={() => setActiveTab("lobby")} />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs tracking-wider transition-all duration-200 group ${
                isActive
                  ? "bg-[#d4af37]/20 text-[#f2ca50] border-l-4 border-[#f2ca50] font-semibold shadow-inner"
                  : "text-[#d0c5af]/80 hover:bg-[#201d18]/70 hover:text-[#e5e2e1]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#f2ca50]" : "text-[#99907c] group-hover:text-[#f2ca50]"
                  }`}
                >
                  {item.materialIcon}
                </span>
                <span className="font-sans-body">{item.label}</span>
              </div>

              {/* Badges */}
              {item.badgeCount && item.badgeCount > 0 ? (
                <span className="bg-[#f2ca50] text-[#3c2f00] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.badgeCount}
                </span>
              ) : null}

              {item.badge ? (
                <span className="bg-[#d4af37]/20 text-[#f2ca50] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {item.badge}
                </span>
              ) : null}

              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Heritage Score & Status Footer */}
      <div className="p-4 border-t border-[#d4af37]/15 bg-[#14120f]/80 backdrop-blur-md space-y-3">
        {/* Ambient Theme Switcher */}
        <ThemeSwitcher variant="sidebar" />

        <div className="bg-[#1c1915]/85 p-3.5 rounded-xl border border-[#d4af37]/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#f2ca50] text-sm">stars</span>
              <span className="text-[11px] font-semibold tracking-wider text-[#f2ca50] uppercase">
                Heritage Score
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#e5e2e1]">{user.heritageScore}%</span>
          </div>

          <div className="w-full bg-[#353535]/60 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-[#d4af37] to-[#f2ca50] h-full rounded-full shadow-[0_0_8px_rgba(242,202,80,0.6)] transition-all duration-500"
              style={{ width: `${user.heritageScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#d0c5af]/70">
            <span>Status:</span>
            <span className="text-[#f2ca50] font-medium">{user.heritageTier}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
