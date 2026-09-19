import React from "react";
import { NavigationTab } from "../types";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Compass,
  LayoutDashboard,
  GraduationCap,
  Users,
  Sparkles,
  User,
} from "lucide-react";

interface MobileNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { isLightMode } = useTheme();
  const { t } = useLanguage();

  const tabs = [
    {
      id: "lobby" as NavigationTab,
      label: t.tabLobby,
      icon: Compass,
    },
    {
      id: "dashboard" as NavigationTab,
      label: t.tabDashboard,
      icon: LayoutDashboard,
    },
    {
      id: "my-courses" as NavigationTab,
      label: t.tabCourses,
      icon: GraduationCap,
    },
    {
      id: "community" as NavigationTab,
      label: t.tabCommunity || "Community",
      icon: Users,
    },
    {
      id: "ai-assistant" as NavigationTab,
      label: t.tabAiAssistant || "Ask Afra AI",
      icon: Sparkles,
      highlight: true,
    },
    {
      id: "profile" as NavigationTab,
      label: t.tabProfile,
      icon: User,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className={`lg:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-xl border-t z-50 px-1 flex items-center justify-around transition-colors duration-300 ${
        isLightMode
          ? "bg-white/95 border-[#d4af37]/30 shadow-[0_-4px_20px_rgba(212,175,55,0.12)] text-[#140e07]"
          : "bg-[#100f0d]/95 border-[#d4af37]/20 shadow-[0_-4px_24px_rgba(0,0,0,0.6)] text-[#e5e2e1]"
      }`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComp = tab.icon;

        return (
          <button
            key={tab.label}
            id={`mobile-tab-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 relative transition-all cursor-pointer ${
              isActive
                ? isLightMode
                  ? "text-[#8c6204]"
                  : "text-[#f2ca50]"
                : isLightMode
                ? "text-[#6b5d4f] hover:text-[#140e07]"
                : "text-[#d0c5af]/70 hover:text-[#e5e2e1]"
            }`}
          >
            {/* Active Indicator Bar on top */}
            {isActive && (
              <span className="absolute top-0 left-3 right-3 h-0.5 bg-[#f2ca50] rounded-full shadow-[0_0_8px_rgba(242,202,80,0.8)]" />
            )}

            <div className="relative">
              <IconComp
                size={20}
                className={
                  isActive
                    ? isLightMode
                      ? "text-[#8c6204] stroke-[2.5]"
                      : "text-[#f2ca50] stroke-[2.5]"
                    : tab.highlight
                    ? "text-[#f2ca50]"
                    : "text-[#99907c]"
                }
              />
            </div>

            <span
              className={`text-[9px] font-sans-body tracking-tight mt-1 truncate max-w-[56px] ${
                isActive
                  ? isLightMode
                    ? "font-extrabold text-[#8c6204]"
                    : "font-extrabold text-[#f2ca50]"
                  : "font-medium"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
