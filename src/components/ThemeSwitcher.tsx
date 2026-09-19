import React from "react";
import { Moon, Sun, Sparkles, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { AppTheme } from "../types";

interface ThemeSwitcherProps {
  variant?: "compact" | "segmented" | "sidebar";
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = "compact",
  className = "",
}) => {
  const { theme, isLightMode, toggleTheme, setTheme } = useTheme();

  if (variant === "compact") {
    return (
      <button
        id="theme-switcher-compact-btn"
        onClick={toggleTheme}
        type="button"
        aria-label={`Toggle theme (Current: ${isLightMode ? "Light Academic" : "Deep Night"})`}
        title={isLightMode ? "Switch to Deep Night Mode (🌙)" : "Switch to Light Academic Mode (☀️)"}
        className={`relative p-2 sm:px-2.5 sm:py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 group shrink-0 cursor-pointer min-w-[36px] min-h-[36px] ${
          isLightMode
            ? "bg-[#efebe2] hover:bg-[#e4ddcf] text-[#8c6204] border border-[#d4af37]/40 shadow-sm hover:border-[#8c6204]/60"
            : "bg-[#1f1c17] hover:bg-[#2c261e] text-[#f2ca50] border border-[#d4af37]/30 shadow-md hover:border-[#f2ca50]/50"
        } ${className}`}
      >
        <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
          {isLightMode ? (
            <Sun
              size={17}
              className="text-[#9e7409] animate-in spin-in-180 duration-300 transition-transform group-hover:rotate-45"
            />
          ) : (
            <Moon
              size={17}
              className="text-[#f2ca50] animate-in spin-in-180 duration-300 transition-transform group-hover:-rotate-12"
            />
          )}
        </div>
        <span className="text-[11px] sm:text-xs font-semibold hidden md:inline font-sans-body">
          {isLightMode ? "Light" : "Night"}
        </span>
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <div
        id="theme-switcher-sidebar"
        className={`p-2.5 rounded-xl border transition-all ${
          isLightMode
            ? "bg-[#f5f2ea] border-[#d4af37]/30"
            : "bg-[#181512] border-[#d4af37]/20"
        } ${className}`}
      >
        <div className="flex items-center justify-between text-[11px] mb-2 px-1">
          <span className="font-semibold text-[#8c6204] dark:text-[#f2ca50] uppercase tracking-wider flex items-center gap-1.5">
            {isLightMode ? <Sun size={12} /> : <Moon size={12} />}
            Ambient Mode
          </span>
          <span className="text-[10px] text-[#786e5c] dark:text-[#99907c]">
            {isLightMode ? "Light Academic" : "Deep Night"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-[#000000]/10 dark:bg-[#0c0b09]/50">
          <button
            type="button"
            onClick={() => setTheme("deep-night")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
              !isLightMode
                ? "bg-[#d4af37]/25 text-[#f2ca50] font-bold shadow-sm border border-[#f2ca50]/35"
                : "text-[#6b6250] hover:text-[#1b1814]"
            }`}
          >
            <Moon size={12} />
            <span>Night</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("light-academic")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[11px] font-medium transition-all ${
              isLightMode
                ? "bg-[#ffffff] text-[#8c6204] font-bold shadow-sm border border-[#d4af37]/40"
                : "text-[#99907c] hover:text-[#e5e2e1]"
            }`}
          >
            <Sun size={12} />
            <span>Light</span>
          </button>
        </div>
      </div>
    );
  }

  // Segmented Mode for Settings and Profile Pages
  return (
    <div id="theme-switcher-segmented" className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Deep Night Card */}
        <div
          onClick={() => setTheme("deep-night")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
            !isLightMode
              ? "bg-[#1a1713] border-[#f2ca50] ring-1 ring-[#f2ca50]/50 shadow-xl"
              : "bg-[#f8f6f0] border-[#d4af37]/25 hover:border-[#d4af37]/60"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#24201a] border border-[#d4af37]/40 flex items-center justify-center text-[#f2ca50]">
                <Moon size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#e5e2e1] dark:text-[#e5e2e1] font-serif-title">
                  Deep Night Mode
                </h4>
                <span className="text-[10px] text-[#f2ca50] font-semibold">
                  African Twilight Obsidian
                </span>
              </div>
            </div>
            {!isLightMode && (
              <span className="w-6 h-6 rounded-full bg-[#f2ca50] text-[#3c2f00] flex items-center justify-center">
                <Check size={14} className="stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-[#99907c] leading-relaxed">
            Atmospheric low-glare twilight palette featuring obsidian backgrounds, warm royal gold accents, and rich contrast for nighttime research.
          </p>
        </div>

        {/* Light Academic Card */}
        <div
          onClick={() => setTheme("light-academic")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
            isLightMode
              ? "bg-[#ffffff] border-[#8c6204] ring-1 ring-[#8c6204]/40 shadow-xl"
              : "bg-[#181511] border-[#d4af37]/25 hover:border-[#d4af37]/60"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#f5f1e8] border border-[#d4af37]/50 flex items-center justify-center text-[#8c6204]">
                <Sun size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1b1814] dark:text-[#1b1814] font-serif-title">
                  Light Academic Mode
                </h4>
                <span className="text-[10px] text-[#8c6204] font-semibold">
                  High-Ambient-Light Readability
                </span>
              </div>
            </div>
            {isLightMode && (
              <span className="w-6 h-6 rounded-full bg-[#8c6204] text-white flex items-center justify-center">
                <Check size={14} className="stroke-[3]" />
              </span>
            )}
          </div>
          <p className="text-xs text-[#6e6350] leading-relaxed">
            High-contrast parchment canvas with deep charcoal typography and golden bronze framing, engineered for bright sunlight and high ambient illumination.
          </p>
        </div>
      </div>
    </div>
  );
};
