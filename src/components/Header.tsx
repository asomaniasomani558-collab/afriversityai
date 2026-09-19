import React, { useState } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Users,
  Compass,
  Home,
  MessageSquare,
  LogOut,
  UserCheck,
  Globe2,
  X,
  Mail,
  User as UserIcon,
  Check,
  LogIn,
  Database,
  Mic,
} from "lucide-react";
import { NavigationTab, UserProfile } from "../types";
import { AfriLogo } from "./AfriLogo";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useVoiceActivation } from "../context/VoiceActivationContext";
import { checkWakeWord } from "../services/wakeWordService";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { PathwaysModal } from "./PathwaysModal";
import { MyNetworkModal } from "./community/MyNetworkModal";

interface HeaderProps {
  user: UserProfile;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useLanguage();
  const { isAuthenticated, openAuthModal, signOutUser, setShowLoginScreen } = useAuth();
  const {
    isListening,
    toggleListening,
    triggerActivationWord,
    openLiveConversation,
  } = useVoiceActivation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPathways, setShowPathways] = useState(false);
  const [showMyNetworkModal, setShowMyNetworkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Peer Connection",
      desc: "Aisha Mohammed from University of Ibadan connected with you.",
      time: "10m ago",
      unread: true,
      tab: "community" as NavigationTab,
    },
    {
      id: "2",
      title: "Hackathon Registration Confirmed",
      desc: "Pan-African AI Hackathon starts May 24th.",
      time: "1h ago",
      unread: true,
      tab: "calendar" as NavigationTab,
    },
    {
      id: "3",
      title: "Erasmus+ Scholarship Deadline",
      desc: "Applications for the 2026 European-African cohort close in 3 days.",
      time: "3h ago",
      unread: true,
      tab: "scholarships" as NavigationTab,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Check if input is or contains activation words ("Hello", "Hey", "Hi", "Hello AfriVersty", etc.)
    const match = checkWakeWord(trimmed);
    if (match.isMatch) {
      triggerActivationWord(match.matchedWord || trimmed, match.remainderQuery);
      setSearchQuery("");
      return;
    }

    setActiveTab("dashboard");
  };

  const navLinks = [
    { label: "Home", tab: "lobby" as NavigationTab },
    { label: "Explore", tab: "dashboard" as NavigationTab },
    { label: "Community", tab: "community" as NavigationTab },
    { label: "Universities", tab: "universities" as NavigationTab },
    { label: "Programs", tab: "my-courses" as NavigationTab },
    { label: "Scholarships", tab: "scholarships" as NavigationTab },
    { label: "Competitions", tab: "calendar" as NavigationTab },
    { label: "Mentors", tab: "ai-assistant" as NavigationTab },
  ];

  return (
    <header
      id="app-main-header"
      className="fixed top-0 left-0 right-0 z-40 bg-[#0c0a09]/95 backdrop-blur-xl border-b border-[#292524] shadow-[0_4px_30px_rgba(0,0,0,0.85)] transition-all"
    >
      {/* Top Navbar Row: Logo + Center Nav / Search + Right Controls */}
      <div className="w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 max-w-full relative">
        {/* Left: African Gold Mask Emblem + AFRIVERSTY */}
        <div className="shrink-0">
          <AfriLogo
            size="md"
            showText={true}
            onClick={() => setActiveTab("lobby")}
          />
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex flex-col items-center mx-auto">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center group">
              <Search
                size={16}
                className="absolute left-4 text-[#a8a29e] group-focus-within:text-[#f59e0b] transition-colors pointer-events-none"
              />
              <input
                id="global-header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or say 'Hello' / 'Hey AfriVersty'..."
                className="w-full bg-[#1c1917]/90 hover:bg-[#201c19] border border-[#3c352f] rounded-full py-2 pl-11 pr-10 text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]/30 transition-all text-xs sm:text-[13px] font-sans-body shadow-inner"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 text-[#8c827a] hover:text-[#f5f5f4]"
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="absolute right-3.5 text-[#8c827a] hover:text-[#f59e0b]"
                >
                  <Search size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Controls: Voice Wake Word + Theme + Language + Notifications + User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Live Voice Chatbot Quick Launch Button */}
          <button
            type="button"
            id="header-live-voice-button"
            onClick={() => openLiveConversation()}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37]/25 via-[#f2ca50]/20 to-[#d4af37]/25 hover:from-[#d4af37]/40 hover:to-[#f2ca50]/35 border border-[#d4af37]/70 text-[#f2ca50] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:shadow-[0_0_18px_rgba(242,202,80,0.5)] cursor-pointer"
            title="Start Live Voice Conversation with Gemini AI Companion (or say 'hey', 'hello', 'hi', 'afriversity')"
          >
            <Sparkles size={13} className="text-[#f2ca50] animate-spin" style={{ animationDuration: "8s" }} />
            <span className="text-[11px] font-semibold hidden sm:inline">Live Voice (Say "Hey" / "Hello")</span>
            <span className="text-[11px] font-semibold sm:hidden">Live</span>
          </button>

          {/* Global Voice Wake Word Toggle Pill */}
          <button
            type="button"
            id="header-wake-word-toggle"
            onClick={toggleListening}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              isListening
                ? "bg-[#231b12] border-[#d4af37] text-[#f2ca50] shadow-[0_0_12px_rgba(212,175,55,0.35)]"
                : "bg-[#171410] hover:bg-[#201c16] border-[#383126] text-[#b0a592] hover:text-[#f5f2eb]"
            }`}
            title="Voice Wake Word: Say 'hey', 'hello', 'hi', or 'afriversity' anywhere in the app"
          >
            <Mic size={13} className={isListening ? "text-emerald-400 animate-pulse" : "text-[#8a8172]"} />
            <span className="hidden xl:inline text-[11px]">
              {isListening ? 'Wake: "Hey / AfriVersty"' : 'Wake Word'}
            </span>
          </button>

          {/* Theme Switcher Button */}
          <ThemeSwitcher variant="compact" />

          {/* Language Switcher */}
          <LanguageSwitcher variant="navbar" />

          {/* Notification Bell (Mobile & Tablet) */}
          <div className="relative md:hidden">
            <button
              id="header-notification-button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={t.notifications}
              className="text-[#d6d3d1] hover:text-[#f59e0b] p-2 rounded-full hover:bg-[#1c1917] transition-all relative cursor-pointer"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Messages Icon (Mobile top bar) */}
          <div className="relative md:hidden">
            <button
              onClick={() => {
                const chatDock = document.getElementById("linkedin-p2p-chat-dock");
                if (chatDock) {
                  chatDock.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-[#d6d3d1] hover:text-[#f59e0b] p-2 rounded-full hover:bg-[#1c1917] transition-all relative cursor-pointer"
            >
              <Mail size={18} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md">
                5
              </span>
            </button>
          </div>

          {/* User Profile Pill */}
          {isAuthenticated ? (
            <div className="relative">
              <div
                id="header-user-profile-pill"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 group cursor-pointer py-1 px-1 rounded-full hover:bg-[#1c1917] transition-all"
              >
                {/* Scholar Avatar */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f59e0b] p-0.5 ring-2 ring-[#f59e0b]/40 group-hover:ring-[#f59e0b] transition-all overflow-hidden relative shadow-md shrink-0">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <ChevronDown size={13} className="text-[#a8a29e] group-hover:text-[#f59e0b] transition-transform" />
              </div>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 bg-[#181511] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <div className="px-2 py-1.5 border-b border-[#4d4635]/30">
                    <div className="text-xs font-bold text-[#e5e2e1] truncate">{user.name}</div>
                    <div className="text-[11px] text-[#99907c] truncate">{user.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
                      <Database size={10} /> Cloud Database Active
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab("profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#262017] text-left text-xs text-[#ded8cb] hover:text-[#f2ca50] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <UserCheck size={14} className="text-[#f2ca50]" />
                      <span>View Scholar Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPathways(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#262017] text-left text-xs text-[#ded8cb] hover:text-[#f2ca50] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Compass size={14} className="text-[#f2ca50]" />
                      <span>All 14 Campus Pathways</span>
                    </button>

                    <button
                      id="header-view-login-btn"
                      onClick={() => {
                        setShowLoginScreen(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#262017] text-left text-xs text-[#ded8cb] hover:text-[#f2ca50] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogIn size={14} className="text-[#f2ca50]" />
                      <span>Switch Account / Login Page</span>
                    </button>

                    <button
                      onClick={() => {
                        signOutUser();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl hover:bg-red-950/40 text-left text-xs text-red-300 hover:text-red-200 flex items-center gap-2 transition-colors border-t border-[#4d4635]/20 mt-1 pt-2 cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-sign-in-btn"
                onClick={() => setShowLoginScreen(true)}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f7d67d] via-[#eab308] to-[#ca8a04] text-[#0a0907] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:brightness-110"
              >
                <LogIn size={13} />
                <span>Login Page</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Dropdown Drawer */}
      {showNotifications && (
        <div
          id="header-notification-drawer"
          className="absolute right-4 sm:right-16 top-14 w-80 md:w-96 bg-[#181511] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#4d4635]/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-serif-title text-base font-bold text-[#e5e2e1]">
                {t.notifications}
              </span>
              <span className="bg-[#f2ca50]/15 text-[#f2ca50] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {unreadCount} {t.newNotifications}
              </span>
            </div>
            <button
              onClick={markAllRead}
              className="text-xs text-[#f2ca50] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Check size={12} /> {t.markAllRead}
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  setActiveTab(notif.tab);
                  setShowNotifications(false);
                }}
                className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                  notif.unread
                    ? "bg-[#20201f] border-[#f2ca50]/20 hover:border-[#f2ca50]/50"
                    : "bg-[#131313]/60 border-transparent hover:bg-[#20201f]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-xs text-[#e5e2e1] leading-snug">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#99907c] shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-[#d0c5af]/80 mt-1 leading-relaxed">
                  {notif.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Navigation Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-t border-[#292524]/60 bg-[#100e0c]/90 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-6 sm:gap-8 py-2 text-xs sm:text-[13px] whitespace-nowrap">
          {navLinks.map((link) => {
            const isActive =
              (link.tab === "lobby" && activeTab === "lobby") ||
              (link.tab === "dashboard" && activeTab === "dashboard") ||
              (link.tab === activeTab);

            return (
              <button
                key={link.label}
                onClick={() => setActiveTab(link.tab)}
                className={`transition-colors font-medium cursor-pointer ${
                  isActive
                    ? "text-[#f59e0b] font-bold border-b-2 border-[#f59e0b] pb-0.5"
                    : "text-[#d6d3d1] hover:text-[#f59e0b]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pathways Directory Drawer */}
      <PathwaysModal
        isOpen={showPathways}
        onClose={() => setShowPathways(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* My Network Modal */}
      <MyNetworkModal
        isOpen={showMyNetworkModal}
        onClose={() => setShowMyNetworkModal(false)}
        onViewProfile={() => setActiveTab("profile")}
      />
    </header>
  );
};
