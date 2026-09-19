import React, { useState, useRef, useEffect } from "react";
import { Globe2, Check, ChevronDown, Search, X, Sparkles } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface LanguageSwitcherProps {
  variant?: "header" | "compact" | "full" | "navbar" | "assistant";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "navbar",
  className = "",
}) => {
  const { language, setLanguage, currentOption, t } = useLanguage();
  const { isLightMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  // ASSISTANT VARIANT
  if (variant === "assistant") {
    return (
      <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
        {/* Assistant Trigger Button */}
        <button
          id="ai-assistant-language-dropdown-btn"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-sm ${
            isOpen
              ? isLightMode
                ? "bg-[#f5f2ea] border-[#8c6204] text-[#8c6204] ring-1 ring-[#8c6204]/40"
                : "bg-[#2c2419] border-[#f2ca50] text-[#f2ca50] ring-1 ring-[#f2ca50]/50"
              : isLightMode
              ? "bg-white hover:bg-[#faf8f5] border-[#d4af37]/40 text-[#524332] hover:text-[#8c6204]"
              : "bg-[#201c17] hover:bg-[#28221a] border-[#d4af37]/35 text-[#ded8cb] hover:text-[#f2ca50]"
          }`}
          title="Select AI Mentor Language"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Globe2 size={13} className={isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"} />
          <span className="text-sm shrink-0">{currentOption.flag}</span>
          <span className={`font-bold ${isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"}`}>
            {currentOption.nativeName}
          </span>
          {currentOption.name !== currentOption.nativeName && (
            <span className="hidden sm:inline text-[11px] opacity-75">
              ({currentOption.name})
            </span>
          )}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
              isLightMode
                ? "bg-[#d4af37]/20 text-[#8c6204]"
                : "bg-[#f2ca50]/15 text-[#f2ca50]"
            }`}
          >
            {currentOption.code}
          </span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 shrink-0 ${
              isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"
            } ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            id="ai-assistant-language-dropdown-menu"
            className={`absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border shadow-2xl z-[100] p-3 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl ${
              isLightMode
                ? "bg-white/95 border-[#d4af37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.18)]"
                : "bg-[#181511]/95 border-[#f2ca50]/40 shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
            }`}
            role="menu"
          >
            <div className="px-2 py-1.5 border-b border-[#d4af37]/20 mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Globe2 size={14} className={isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"} />
                <span className={`text-xs font-bold ${isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"}`}>
                  AI Mentor Language ({SUPPORTED_LANGUAGES.length})
                </span>
              </div>
              <span className="text-[10px] text-[#786e5c] dark:text-[#99907c]">Active: {currentOption.code.toUpperCase()}</span>
            </div>

            {/* Search Input */}
            <div className="relative mb-2.5">
              <Search size={13} className="absolute left-3.5 top-2.5 text-[#786e5c] dark:text-[#99907c]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language (Swahili, Yoruba, Twi...)"
                className={`w-full rounded-xl pl-8 pr-7 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4af37] border transition-all ${
                  isLightMode
                    ? "bg-[#faf8f5] border-[#d4af37]/30 text-[#140e07] placeholder-[#8c827a]"
                    : "bg-[#12100d] border-[#d4af37]/25 text-[#ded8cb] placeholder-[#736b5e]"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-[#786e5c] hover:text-[#d4af37]"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* List of Languages */}
            <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar pr-0.5">
              {filteredLanguages.length === 0 ? (
                <div className="py-4 text-center text-xs text-[#786e5c] dark:text-[#99907c]">
                  No languages found matching "{searchQuery}"
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      id={`assistant-lang-option-${lang.code}`}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? isLightMode
                            ? "bg-[#f5f0e1] border border-[#d4af37] text-[#8c6204] font-bold shadow-sm"
                            : "bg-gradient-to-r from-[#2e2417] to-[#3a2c1a] border border-[#f2ca50]/70 text-[#f2ca50] font-bold shadow-sm"
                          : isLightMode
                          ? "hover:bg-[#f5f2ea] text-[#382c1e] hover:text-[#8c6204] border border-transparent"
                          : "hover:bg-[#241e17] text-[#ded8cb] hover:text-[#f2ca50] border border-transparent"
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg shrink-0">{lang.flag}</span>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5 leading-tight">
                            <span>{lang.nativeName}</span>
                            {lang.name !== lang.nativeName && (
                              <span className="text-[11px] text-[#786e5c] dark:text-[#99907c] font-normal">
                                ({lang.name})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#786e5c] dark:text-[#99907c] leading-tight mt-0.5">
                            {lang.region}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isLightMode
                              ? "bg-[#d4af37]/25 text-[#8c6204]"
                              : "bg-[#f2ca50]/20 text-[#f2ca50]"
                          }`}
                        >
                          <Check size={13} />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT NAVBAR / HEADER VARIANT
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        id="header-language-switcher-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full transition-all group text-xs font-semibold cursor-pointer border ${
          isOpen
            ? isLightMode
              ? "bg-[#f5f2ea] border-[#8c6204] text-[#8c6204] shadow-sm ring-1 ring-[#8c6204]/30"
              : "bg-[#2a2217] border-[#f2ca50]/60 text-[#f2ca50] shadow-sm"
            : isLightMode
            ? "bg-white hover:bg-[#faf8f5] border-[#d4af37]/40 text-[#423728] hover:text-[#8c6204] shadow-sm"
            : "bg-[#1a1713]/90 hover:bg-[#262017] border-[#d4af37]/30 text-[#e7e5e4] hover:text-[#f59e0b]"
        }`}
        title={`${t.languageSelect}: ${currentOption.name} (${currentOption.nativeName})`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe2
          size={14}
          className={`shrink-0 ${isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"}`}
        />
        <span className="text-sm shrink-0">{currentOption.flag}</span>
        <span
          className={`font-bold text-xs tracking-tight ${
            isLightMode ? "text-[#140e07] group-hover:text-[#8c6204]" : "text-[#f5f5f4] group-hover:text-[#f59e0b]"
          }`}
        >
          {currentOption.nativeName}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-bold hidden sm:inline ${
            isLightMode
              ? "bg-[#d4af37]/20 text-[#8c6204]"
              : "bg-[#f2ca50]/15 text-[#f2ca50]"
          }`}
        >
          {currentOption.code}
        </span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 shrink-0 ${
            isLightMode ? "text-[#8c6204]" : "text-[#a8a29e] group-hover:text-[#f59e0b]"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Language Selection Dropdown Menu */}
      {isOpen && (
        <div
          id="header-language-dropdown"
          className={`absolute right-0 top-full mt-2 w-72 sm:w-84 max-w-[calc(100vw-24px)] rounded-2xl border shadow-2xl z-[100] p-3 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl ${
            isLightMode
              ? "bg-white/95 border-[#d4af37]/45 shadow-[0_15px_40px_rgba(0,0,0,0.18)]"
              : "bg-[#181511]/95 border-[#d4af37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2 py-1.5 border-b border-[#d4af37]/20 mb-2.5 flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLightMode ? "text-[#8c6204]" : "text-[#f2ca50]"
              }`}
            >
              <Globe2 size={13} />
              {t.languageSelect}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isLightMode
                  ? "bg-[#d4af37]/20 text-[#8c6204]"
                  : "bg-[#f2ca50]/15 text-[#f2ca50]"
              }`}
            >
              {SUPPORTED_LANGUAGES.length} Pan-African Languages
            </span>
          </div>

          {/* Search input in header dropdown */}
          <div className="relative mb-2.5">
            <Search
              size={13}
              className="absolute left-3 top-2.5 text-[#786e5c] dark:text-[#99907c]"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter languages..."
              className={`w-full rounded-xl pl-8 pr-7 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#d4af37] border transition-all ${
                isLightMode
                  ? "bg-[#faf8f5] border-[#d4af37]/30 text-[#140e07] placeholder-[#8c827a]"
                  : "bg-[#12100d] border-[#d4af37]/25 text-[#ded8cb] placeholder-[#736b5e]"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-[#786e5c] hover:text-[#d4af37]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Languages list with max-height and custom scrollbar */}
          <div className="space-y-1 max-h-[min(65vh,340px)] overflow-y-auto custom-scrollbar pr-0.5">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#786e5c] dark:text-[#99907c]">
                No languages found matching "{searchQuery}"
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = language === lang.code;

                return (
                  <button
                    key={lang.code}
                    id={`lang-option-${lang.code}`}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? isLightMode
                          ? "bg-[#f5f0e1] border border-[#d4af37] text-[#8c6204] font-bold shadow-sm"
                          : "bg-[#282218] border border-[#f2ca50]/60 text-[#f2ca50] font-bold shadow-sm"
                        : isLightMode
                        ? "hover:bg-[#f5f2ea] text-[#382c1e] hover:text-[#8c6204] border border-transparent"
                        : "hover:bg-[#231e18] text-[#ded8cb] hover:text-[#f2ca50] border border-transparent"
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg shrink-0">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5 leading-tight">
                          <span>{lang.nativeName}</span>
                          {lang.name !== lang.nativeName && (
                            <span className="text-[10px] text-[#786e5c] dark:text-[#99907c] font-normal">
                              ({lang.name})
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#786e5c] dark:text-[#99907c] leading-tight mt-0.5">
                          {lang.region}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isLightMode
                            ? "bg-[#d4af37]/25 text-[#8c6204]"
                            : "bg-[#f2ca50]/20 text-[#f2ca50]"
                        }`}
                      >
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
