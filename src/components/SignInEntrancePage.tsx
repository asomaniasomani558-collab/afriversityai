import React, { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Users,
  Brain,
  Globe,
  Globe2,
  ChevronDown,
  User,
  Sprout,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { AfricanMaskIcon } from "./AfricanMaskIcon";
import { AfricanVerticalBorder } from "./AfricanVerticalBorder";
import { AfricanCircleWheel } from "./AfricanCircleWheel";
import { AfricaGlowingMap } from "./AfricaGlowingMap";

export const SignInEntrancePage: React.FC = () => {
  const {
    currentUser,
    signOutUser,
    setShowLoginScreen,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    authError,
    setAuthError,
    continueAsGuest,
  } = useAuth();
  const { isLightMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("University of Ghana (Legon)");
  const [role, setRole] = useState("Computer Engineering & STEM Scholar");
  const [location, setLocation] = useState("Accra, Ghana");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [agreeHonorCode, setAgreeHonorCode] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const africanUniversities = [
    "University of Ghana (Legon) — Ghana",
    "Kwame Nkrumah University of Science and Technology (KNUST) — Ghana",
    "Ashesi University — Ghana",
    "Covenant University — Nigeria",
    "University of Ibadan — Nigeria",
    "University of Lagos (UNILAG) — Nigeria",
    "University of Cape Town (UCT) — South Africa",
    "University of the Witwatersrand (Wits) — South Africa",
    "Makerere University — Uganda",
    "University of Nairobi — Kenya",
    "Strathmore University — Kenya",
    "Addis Ababa University — Ethiopia",
    "Cairo University — Egypt",
    "Université Cheikh Anta Diop (UCAD) — Senegal",
    "African Leadership University (ALU) — Rwanda",
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please enter your email or phone number and password.");
      return;
    }
    setIsSubmitting(true);
    await signInWithEmail(email, password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setAuthError("Please fill out your full name, academic email, and password.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match. Please re-enter.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    if (!agreeHonorCode) {
      setAuthError("Please accept the Pan-African Academic Honor Code to proceed.");
      return;
    }
    setIsSubmitting(true);
    await signUpWithEmail(email, password, displayName, university, role, location);
    setIsSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
  };

  const handleAppleAuth = () => {
    // Apple Auth fallback for student preview
    setAuthError("Apple ID Sign-In is configured. You can also sign in with Google or Academic Email.");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError("Please enter your academic email to receive the reset link.");
      return;
    }
    setIsSubmitting(true);
    const ok = await resetPassword(email);
    setIsSubmitting(false);
    if (ok) {
      setResetSent(true);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoName: string, demoUni: string) => {
    setEmail(demoEmail);
    setPassword("AfricanScholar2026!");
    setDisplayName(demoName);
    setUniversity(demoUni);
    setAuthError(null);
  };

  return (
    <div
      id="afriversty-login-page"
      className={`min-h-screen w-full flex flex-col relative overflow-x-hidden transition-colors duration-300 ${
        isLightMode
          ? "bg-[#faf8f5] text-[#1c1915] selection:bg-[#d4af37]/25 selection:text-[#8a5700]"
          : "bg-[#080705] text-[#f5f5f4] selection:bg-[#d4af37]/35 selection:text-[#fef08a]"
      }`}
    >
      {/* Background African Geometric Vertical Side Borders (Desktop & Tablet) */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-10 hidden xl:block pointer-events-none transition-opacity duration-300 ${
          isLightMode ? "opacity-25" : "opacity-40"
        }`}
      >
        <AfricanVerticalBorder />
      </div>
      <div
        className={`absolute right-0 top-0 bottom-0 z-10 hidden xl:block pointer-events-none transform scale-x-[-1] transition-opacity duration-300 ${
          isLightMode ? "opacity-25" : "opacity-40"
        }`}
      >
        <AfricanVerticalBorder />
      </div>

      {/* TOP HEADER BAR */}
      <header
        className={`relative z-30 w-full px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between border-b backdrop-blur-md transition-colors duration-300 ${
          isLightMode
            ? "border-[#e6dece] bg-[#faf8f5]/90 shadow-xs"
            : "border-[#2a241b]/50 bg-[#080705]/80"
        }`}
      >
        {/* Left: Brand Logo & Tagline (Clickable to return to Home Page) */}
        <div
          onClick={() => setShowLoginScreen(false)}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Home Page"
        >
          <div className="shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AfricanMaskIcon size={34} />
          </div>
          <div className="flex items-center">
            <span
              className={`font-serif-title text-base sm:text-lg font-bold tracking-[0.2em] uppercase ${
                isLightMode ? "text-[#8a5700]" : "text-[#e5be5d]"
              }`}
            >
              AFRIVERSITY
            </span>
            <span
              className={`hidden md:inline-block mx-3 font-light ${
                isLightMode ? "text-[#b49234]/60" : "text-[#d4af37]/40"
              }`}
            >
              |
            </span>
            <span
              className={`hidden md:inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase ${
                isLightMode ? "text-[#6b4507]" : "text-[#d4af37]/80"
              }`}
            >
              DISCOVER. LEARN. CONNECT. SUCCEED.
            </span>
          </div>
        </div>

        {/* Right: Theme Switcher Pill & Language Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Sun/Moon Toggle Capsule */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
            className={`rounded-full p-0.5 border flex items-center gap-1 cursor-pointer transition-all ${
              isLightMode
                ? "bg-[#ede8df] border-[#d4af37]/60 hover:border-[#b49234]"
                : "bg-[#16130e] border-[#d4af37]/40 hover:border-[#d4af37]"
            }`}
          >
            <div
              className={`p-1 rounded-full flex items-center justify-center transition-all ${
                isLightMode
                  ? "bg-[#d4af37] text-[#1c1915] shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                  : "text-[#78716c]"
              }`}
            >
              <Sun size={13} className="stroke-[2.5]" />
            </div>
            <div
              className={`p-1 rounded-full flex items-center justify-center transition-all ${
                !isLightMode
                  ? "bg-[#e5a828] text-[#080705] shadow-[0_0_8px_rgba(229,168,40,0.6)]"
                  : "text-[#8c827a]"
              }`}
            >
              <Moon size={13} className="stroke-[2.5]" />
            </div>
          </button>

          {/* Language Selector Capsule */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`rounded-full px-3 py-1 border flex items-center gap-1.5 text-xs cursor-pointer transition-all ${
                isLightMode
                  ? "bg-[#ffffff] border-[#ded7c8] hover:border-[#d4af37] text-[#1c1915]"
                  : "bg-[#14120e] border-[#3d3424] hover:border-[#d4af37]/60 text-[#e5e2e1]"
              }`}
            >
              <Globe2 size={13} className={isLightMode ? "text-[#8a5700]" : "text-[#a8a29e]"} />
              <span className="font-semibold text-[11px] uppercase tracking-wider">{language}</span>
              <ChevronDown size={12} className={isLightMode ? "text-[#6b4507]" : "text-[#a8a29e]"} />
            </button>

            {showLangMenu && (
              <div
                className={`absolute right-0 mt-2 w-36 py-1.5 rounded-2xl border shadow-2xl z-50 animate-in fade-in zoom-in-95 ${
                  isLightMode
                    ? "bg-[#ffffff] border-[#e6dece] text-[#1c1915]"
                    : "bg-[#14120e] border-[#3d3424] text-[#e5e2e1]"
                }`}
              >
                {[
                  { code: "en", label: "English" },
                  { code: "fr", label: "Français" },
                  { code: "sw", label: "Kiswahili" },
                  { code: "yo", label: "Yorùbá" },
                  { code: "am", label: "አማርኛ" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code as any);
                      setShowLangMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isLightMode
                        ? language === l.code
                          ? "text-[#8a5700] font-bold bg-[#f7f3ea]"
                          : "text-[#2e261d] hover:bg-[#f3eee3]"
                        : language === l.code
                        ? "text-[#f59e0b] font-bold bg-[#262017]"
                        : "text-[#d6d3d1] hover:bg-[#262017]"
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Back to Home Page button */}
          <button
            id="entrance-top-back-home"
            type="button"
            onClick={() => setShowLoginScreen(false)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLightMode
                ? "bg-[#faf6ee] hover:bg-[#ede5d4] border-[#d4af37]/45 text-[#6b4507]"
                : "bg-[#14120e] hover:bg-[#201c15] border-[#d4af37]/40 text-[#f59e0b]"
            }`}
          >
            <span>Home Page</span>
          </button>

          {/* Quick Enter Campus button if authenticated */}
          {currentUser && (
            <button
              id="entrance-top-enter-app"
              type="button"
              onClick={() => {
                try {
                  sessionStorage.setItem("afriversty_entered_session", "true");
                } catch {}
                setShowLoginScreen(false);
              }}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f7d67d] via-[#eab308] to-[#ca8a04] text-[#0a0907] text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <span className="hidden sm:inline">Enter Campus</span>
              <span className="sm:hidden">Enter</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER: Responsive Desktop / Tablet / Mobile */}
      <main className="relative z-20 flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Cinematic Hero Section (Desktop/Tablet) */}
          <div
            className={`lg:col-span-7 flex flex-col justify-between relative min-h-[480px] lg:min-h-[640px] rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 border transition-all duration-300 ${
              isLightMode
                ? "border-[#d4af37]/35 bg-gradient-to-br from-[#f8f5ee] via-[#efe9dd] to-[#e4dcce] shadow-xl"
                : "border-[#2a241b]/60 bg-gradient-to-br from-[#12100d]/90 via-[#0a0907]/95 to-[#050403]"
            }`}
          >
            {/* Cinematic Hero Student Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src="/login_hero_student.jpg"
                alt="Afriversity Scholar in Campus Hallway"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-[55%_30%] sm:object-[50%_25%] transition-all duration-300 ${
                  isLightMode
                    ? "opacity-60 sm:opacity-75 filter contrast-[1.05] saturate-[1.08]"
                    : "opacity-45 sm:opacity-55 filter brightness-[0.9] contrast-[1.1] saturate-[1.1]"
                }`}
              />
              {/* Dynamic Vignette & Atmospheric Radial Glow */}
              <div
                className={`absolute inset-0 transition-colors duration-300 ${
                  isLightMode
                    ? "bg-gradient-to-t from-[#f8f5ee] via-[#f8f5ee]/70 to-[#f8f5ee]/20"
                    : "bg-gradient-to-t from-[#080705] via-[#080705]/65 to-[#080705]/20"
                }`}
              />
              <div
                className={`absolute inset-0 transition-colors duration-300 ${
                  isLightMode
                    ? "bg-gradient-to-r from-[#f8f5ee]/95 via-[#f8f5ee]/40 to-transparent"
                    : "bg-gradient-to-r from-[#080705]/90 via-[#080705]/40 to-transparent"
                }`}
              />
            </div>

            {/* Glowing Africa Constellation Map in the Sky */}
            <div
              className={`absolute top-6 right-6 lg:right-12 z-10 hidden sm:block transition-opacity duration-300 ${
                isLightMode ? "opacity-70" : "opacity-85"
              }`}
            >
              <AfricaGlowingMap size={260} />
            </div>

            {/* Top-Left Building Sign: "AFRICA'S FUTURE BUILDS HERE" */}
            <div className="relative z-10 self-start mb-6">
              <div
                className={`px-3 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.22em] flex flex-col items-start leading-[1.3] transition-all ${
                  isLightMode
                    ? "border border-[#b49234]/70 bg-white/85 text-[#7a4f00] shadow-[0_4px_12px_rgba(138,87,0,0.12)]"
                    : "border border-[#d4af37]/60 bg-black/45 backdrop-blur-md text-[#f2ca50] shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                }`}
              >
                <span>AFRICA'S</span>
                <span>FUTURE</span>
                <span>BUILDS</span>
                <span>HERE</span>
              </div>
            </div>

            {/* Calligraphic Script Accent Badge (Visible on Mobile & Tablet/Desktop) */}
            <div className="relative z-10 self-end sm:self-auto sm:absolute sm:top-28 sm:right-10 transform -rotate-3 text-right">
              <span
                className={`font-script text-lg sm:text-2xl font-bold tracking-wide transition-colors duration-300 ${
                  isLightMode
                    ? "text-[#7a4f00] drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]"
                    : "text-[#fef08a] drop-shadow-[0_2px_12px_rgba(234,179,8,0.7)]"
                }`}
              >
                African Students <br className="hidden sm:inline" />Global Impact
              </span>
            </div>

            {/* Bottom Hero Content: Welcome To Afriversity + Tagline + 4 Feature Pillars */}
            <div className="relative z-10 mt-auto pt-16">
              {/* WELCOME TO */}
              <div
                className={`text-[11px] sm:text-[12px] font-bold tracking-[0.3em] uppercase mb-1 transition-colors duration-300 ${
                  isLightMode ? "text-[#5e4b37]" : "text-[#e7e5e4]"
                }`}
              >
                WELCOME TO
              </div>

              {/* Afriversity Display Title */}
              <h1
                className={`font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 transition-colors duration-300 ${
                  isLightMode
                    ? "text-[#2b1e10] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-[#fff7d6] via-[#f5d47a] to-[#d4af37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                }`}
              >
                Afriversity
              </h1>

              {/* Tagline Quote */}
              <p
                className={`text-sm sm:text-base lg:text-[17px] font-semibold leading-relaxed max-w-xl mb-8 transition-colors duration-300 ${
                  isLightMode ? "text-[#3d2e1e]" : "text-[#f5f5f4] drop-shadow-md"
                }`}
              >
                Your future is not a dream, it’s a path. Let’s build it together.
              </p>

              {/* 4 Feature Pillars */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 pt-5 border-t text-center transition-colors duration-300 ${
                  isLightMode ? "border-[#d4af37]/35" : "border-[#d4af37]/25"
                }`}
              >
                {/* Pillar 1 */}
                <div
                  className={`flex flex-col items-center justify-center p-2 sm:border-r ${
                    isLightMode ? "border-[#d4af37]/30" : "border-[#d4af37]/20"
                  }`}
                >
                  <GraduationCap
                    size={20}
                    className={`mb-1.5 shrink-0 ${
                      isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                      isLightMode ? "text-[#2e2315]" : "text-[#e7e5e4]"
                    }`}
                  >
                    Top Universities Across Africa
                  </span>
                </div>

                {/* Pillar 2 */}
                <div
                  className={`flex flex-col items-center justify-center p-2 sm:border-r ${
                    isLightMode ? "border-[#d4af37]/30" : "border-[#d4af37]/20"
                  }`}
                >
                  <Users
                    size={20}
                    className={`mb-1.5 shrink-0 ${
                      isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                      isLightMode ? "text-[#2e2315]" : "text-[#e7e5e4]"
                    }`}
                  >
                    Scholarships &amp; Opportunities
                  </span>
                </div>

                {/* Pillar 3 */}
                <div
                  className={`flex flex-col items-center justify-center p-2 sm:border-r ${
                    isLightMode ? "border-[#d4af37]/30" : "border-[#d4af37]/20"
                  }`}
                >
                  <Brain
                    size={20}
                    className={`mb-1.5 shrink-0 ${
                      isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                      isLightMode ? "text-[#2e2315]" : "text-[#e7e5e4]"
                    }`}
                  >
                    AI-Powered Guidance
                  </span>
                </div>

                {/* Pillar 4 */}
                <div className="flex flex-col items-center justify-center p-2">
                  <Globe
                    size={20}
                    className={`mb-1.5 shrink-0 ${
                      isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                      isLightMode ? "text-[#2e2315]" : "text-[#e7e5e4]"
                    }`}
                  >
                    A Global Community
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom-Left Circular Adinkra Wheel Decorator */}
            <div
              className={`absolute -bottom-16 -left-16 z-0 transition-opacity duration-300 ${
                isLightMode ? "opacity-20" : "opacity-40"
              }`}
            >
              <AfricanCircleWheel size={240} />
            </div>
          </div>

          {/* RIGHT COLUMN: Sign In / Authentication Card */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div
              className={`w-full max-w-[460px] rounded-[32px] p-6 sm:p-8 lg:p-9 border relative text-left transition-all duration-300 ${
                isLightMode
                  ? "bg-white/95 backdrop-blur-2xl border-[#d4af37]/45 shadow-[0_10px_45px_rgba(138,87,0,0.12),0_1px_4px_rgba(0,0,0,0.06)]"
                  : "bg-[#0b0a08]/92 backdrop-blur-2xl border-[#d4af37]/55 shadow-[0_10px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.15)]"
              }`}
            >
              
              {/* Card Top Branding: Mask Emblem + AFRIVERSITY + Tagline */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="mb-2">
                  <AfricanMaskIcon size={38} />
                </div>
                <div
                  className={`font-serif-title text-base sm:text-lg font-bold tracking-[0.2em] uppercase ${
                    isLightMode ? "text-[#8a5700]" : "text-[#e5be5d]"
                  }`}
                >
                  AFRIVERSITY
                </div>
                <div
                  className={`text-[9px] font-semibold tracking-[0.25em] uppercase mt-0.5 ${
                    isLightMode ? "text-[#6b4507]" : "text-[#d4af37]/75"
                  }`}
                >
                  DISCOVER. LEARN. CONNECT. SUCCEED.
                </div>
              </div>

              {/* Active Session Notification if scholar is already authenticated */}
              {currentUser && (
                <div
                  className={`mb-4 p-3 rounded-2xl border flex items-center justify-between gap-2 shadow-sm animate-in fade-in transition-colors ${
                    isLightMode
                      ? "bg-[#faf7f0] border-[#d4af37]/40"
                      : "bg-[#1c1914] border-[#d4af37]/45"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <div className="text-left truncate">
                      <div
                        className={`text-[10px] uppercase tracking-wider font-semibold ${
                          isLightMode ? "text-[#6b5842]" : "text-[#a8a29e]"
                        }`}
                      >
                        Active Account
                      </div>
                      <div
                        className={`text-xs font-bold truncate ${
                          isLightMode ? "text-[#8a5700]" : "text-[#f2ca50]"
                        }`}
                      >
                        {currentUser.email || currentUser.displayName || "Scholar"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      id="entrance-card-enter-btn"
                      type="button"
                      onClick={() => {
                        try {
                          sessionStorage.setItem("afriversty_entered_session", "true");
                        } catch {}
                        setShowLoginScreen(false);
                      }}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f7d67d] via-[#eab308] to-[#ca8a04] text-[#0a0907] text-xs font-bold hover:brightness-110 flex items-center gap-1 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <span>Enter App</span>
                      <ArrowRight size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => signOutUser()}
                      className={`text-[10px] underline px-1 ${
                        isLightMode
                          ? "text-[#6b5842] hover:text-[#1c1915]"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                      title="Switch scholar or sign out"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              {/* Segmented Tab Bar */}
              <div
                className={`grid grid-cols-2 p-1 rounded-full border mb-5 transition-colors ${
                  isLightMode
                    ? "bg-[#f4efe4] border-[#e2d8c3]"
                    : "bg-[#14120e] border-[#2d261e]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? isLightMode
                        ? "bg-white border border-[#d4af37]/60 text-[#8a5700] shadow-sm"
                        : "bg-[#251f15] border border-[#d4af37]/60 text-[#f2ca50] shadow-sm"
                      : isLightMode
                      ? "text-[#6b5842] hover:text-[#1c1915]"
                      : "text-[#78716c] hover:text-white"
                  }`}
                >
                  <User size={13} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setAuthError(null);
                  }}
                  className={`py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? isLightMode
                        ? "bg-white border border-[#d4af37]/60 text-[#8a5700] shadow-sm"
                        : "bg-[#251f15] border border-[#d4af37]/60 text-[#f2ca50] shadow-sm"
                      : isLightMode
                      ? "text-[#6b5842] hover:text-[#1c1915]"
                      : "text-[#78716c] hover:text-white"
                  }`}
                >
                  <Users size={13} />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Error Message Notice */}
              {authError && (
                <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/35 text-red-500 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{authError}</span>
                </div>
              )}

              {/* Password Reset Confirmation */}
              {resetSent && (
                <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 text-xs flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span className="font-medium">Password reset link sent to {email}. Check your inbox.</span>
                </div>
              )}

              {/* 1-CLICK DEMO SCHOLARS */}
              <div
                className={`mb-4 p-2.5 rounded-2xl border flex items-center justify-between transition-colors ${
                  isLightMode
                    ? "bg-[#faf6ee] border-[#e2d8c3]"
                    : "bg-[#14120e] border-[#2d261e]"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                  }`}
                >
                  <Sparkles size={12} /> 1-Click Demo Fill:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      fillDemoAccount(
                        "kwame.mensah@ug.edu.gh",
                        "Kwame Mensah",
                        "University of Ghana (Legon)"
                      )
                    }
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      isLightMode
                        ? "bg-[#ede4d1] hover:bg-[#e4d7bf] text-[#6b4507] border-[#d4af37]/40"
                        : "bg-[#241f17] hover:bg-[#342b1d] text-[#e5be5d] border-[#d4af37]/25"
                    }`}
                  >
                    Ghana STEM
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      fillDemoAccount(
                        "amara.diallo@uct.ac.za",
                        "Dr. Amara Diallo",
                        "University of Cape Town (UCT)"
                      )
                    }
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      isLightMode
                        ? "bg-[#ede4d1] hover:bg-[#e4d7bf] text-[#6b4507] border-[#d4af37]/40"
                        : "bg-[#241f17] hover:bg-[#342b1d] text-[#e5be5d] border-[#d4af37]/25"
                    }`}
                  >
                    UCT Scholar
                  </button>
                </div>
              </div>

              {/* TAB 1: SIGN IN MODE */}
              {activeTab === "signin" && (
                <div>
                  <h2
                    className={`text-2xl sm:text-[26px] font-bold tracking-tight mb-1 transition-colors ${
                      isLightMode ? "text-[#1c1915]" : "text-white"
                    }`}
                  >
                    Sign In
                  </h2>
                  <p
                    className={`text-xs mb-5 leading-normal transition-colors ${
                      isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                    }`}
                  >
                    Welcome back! Please sign in to continue your journey with Afriversity.
                  </p>

                  <form onSubmit={handleSignIn} className="space-y-3.5">
                    {/* Email / Phone Input */}
                    <div
                      className={`w-full py-3 px-4 rounded-full border focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/40 flex items-center gap-3 transition-all ${
                        isLightMode
                          ? "bg-[#f9f7f2] border-[#ded5c2]"
                          : "bg-[#12100d] border-[#2d261e]"
                      }`}
                    >
                      <Mail
                        size={16}
                        className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                      />
                      <input
                        id="signin-email-input"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address or phone number"
                        className={`bg-transparent text-xs sm:text-[13px] font-medium w-full focus:outline-none ${
                          isLightMode
                            ? "text-[#1c1915] placeholder-[#8c7b67]"
                            : "text-white placeholder-[#78716c]"
                        }`}
                      />
                    </div>

                    {/* Password Input */}
                    <div
                      className={`w-full py-3 px-4 rounded-full border focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37]/40 flex items-center gap-3 transition-all ${
                        isLightMode
                          ? "bg-[#f9f7f2] border-[#ded5c2]"
                          : "bg-[#12100d] border-[#2d261e]"
                      }`}
                    >
                      <Lock
                        size={16}
                        className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                      />
                      <input
                        id="signin-password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className={`bg-transparent text-xs sm:text-[13px] font-medium w-full focus:outline-none ${
                          isLightMode
                            ? "text-[#1c1915] placeholder-[#8c7b67]"
                            : "text-white placeholder-[#78716c]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`cursor-pointer ${
                          isLightMode
                            ? "text-[#6b5842] hover:text-[#1c1915]"
                            : "text-[#a8a29e] hover:text-white"
                        }`}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Checkbox: Remember me & Forgot Password */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          id="remember-me-checkbox"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className={`w-4 h-4 rounded border focus:ring-0 focus:ring-offset-0 accent-[#d4af37] ${
                            isLightMode
                              ? "bg-[#f9f7f2] border-[#ded5c2]"
                              : "bg-[#12100d] border-[#2d261e]"
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isLightMode ? "text-[#3d2e1e]" : "text-[#e7e5e4]"
                          }`}
                        >
                          Remember me
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("forgot");
                          setAuthError(null);
                        }}
                        className={`text-xs font-bold hover:underline cursor-pointer ${
                          isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                        }`}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Main Sign In Button (Golden gradient pill) */}
                    <button
                      id="signin-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-[#0a0907] bg-gradient-to-r from-[#f7d67d] via-[#eab308] to-[#ca8a04] hover:brightness-110 active:scale-[0.99] shadow-[0_4px_25px_rgba(234,179,8,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight size={17} className="stroke-[2.5]" />
                          <span>Sign In</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* OR Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div
                      className={`border-t w-full ${
                        isLightMode ? "border-[#e0d6c4]" : "border-[#292524]"
                      }`}
                    />
                    <span
                      className={`px-3 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        isLightMode ? "text-[#7a6750] bg-white" : "text-[#78716c] bg-[#0b0a08]"
                      }`}
                    >
                      OR
                    </span>
                    <div
                      className={`border-t w-full ${
                        isLightMode ? "border-[#e0d6c4]" : "border-[#292524]"
                      }`}
                    />
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2.5">
                    {/* Google Button */}
                    <button
                      id="google-signin-btn"
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-full border text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer ${
                        isLightMode
                          ? "bg-[#faf7f2] border-[#ded5c2] hover:bg-[#f3ede1] text-[#1c1915]"
                          : "bg-[#14120e] border-[#2d261e] hover:border-[#443a2b] hover:bg-[#1a1713] text-white"
                      }`}
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* Apple Button */}
                    <button
                      id="apple-signin-btn"
                      type="button"
                      onClick={handleAppleAuth}
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-full border text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer ${
                        isLightMode
                          ? "bg-[#faf7f2] border-[#ded5c2] hover:bg-[#f3ede1] text-[#1c1915]"
                          : "bg-[#14120e] border-[#2d261e] hover:border-[#443a2b] hover:bg-[#1a1713] text-white"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 shrink-0 ${isLightMode ? "fill-[#1c1915]" : "fill-white"}`}
                        viewBox="0 0 170 170"
                      >
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.7-11.66-13.97-6.08-9.47-10.9-20.2-14.47-32.2-3.56-12-5.34-23.36-5.34-34.07 0-14.34 3.73-26.17 11.19-35.49 7.46-9.33 16.71-14.07 27.75-14.23 4.24 0 9.17 1.15 14.78 3.46 5.61 2.3 9.4 3.52 11.36 3.65 1.5.13 5.48-1.15 11.95-3.85 6.47-2.7 11.69-3.8 15.66-3.3 11.64.93 20.73 4.96 27.27 12.09-10.45 6.31-15.54 14.93-15.27 25.86.27 8.56 3.63 15.68 10.09 21.36 6.46 5.68 14.16 8.91 23.1 9.69-2.14 6.21-4.72 12.35-7.75 18.43zM119.22 33.56c0-7.23 2.61-13.88 7.82-19.95 5.21-6.07 11.58-9.84 19.12-11.31.25 1.12.38 2.24.38 3.37 0 7.23-2.68 14-8.03 20.31-5.36 6.31-11.83 10.06-19.42 11.26-.13-1.25-.19-2.25-.19-3.68z" />
                      </svg>
                      <span>Continue with Apple</span>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="pt-4 text-center">
                    <span
                      className={`text-xs ${isLightMode ? "text-[#6b5842]" : "text-[#a8a29e]"}`}
                    >
                      Don’t have an account?{" "}
                    </span>
                    <button
                      id="toggle-signup-view-btn"
                      type="button"
                      onClick={() => {
                        setActiveTab("signup");
                        setAuthError(null);
                      }}
                      className={`text-xs font-bold hover:underline cursor-pointer ${
                        isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                      }`}
                    >
                      Sign Up &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SIGN UP / REGISTRATION MODE */}
              {activeTab === "signup" && (
                <div>
                  <h2
                    className={`text-2xl sm:text-[26px] font-bold tracking-tight mb-1 transition-colors ${
                      isLightMode ? "text-[#1c1915]" : "text-white"
                    }`}
                  >
                    Create Scholar Account
                  </h2>
                  <p
                    className={`text-xs mb-4 leading-normal transition-colors ${
                      isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                    }`}
                  >
                    Join 100,000+ researchers, engineers, and students across Africa.
                  </p>

                  <form onSubmit={handleSignUp} className="space-y-3">
                    {/* Full Name */}
                    <div
                      className={`w-full py-2.5 px-4 rounded-full border focus-within:border-[#d4af37] flex items-center gap-3 ${
                        isLightMode
                          ? "bg-[#f9f7f2] border-[#ded5c2]"
                          : "bg-[#12100d] border-[#2d261e]"
                      }`}
                    >
                      <User
                        size={15}
                        className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                      />
                      <input
                        id="signup-name-input"
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Full Name (e.g. Kwame Mensah)"
                        className={`bg-transparent text-xs font-medium w-full focus:outline-none ${
                          isLightMode
                            ? "text-[#1c1915] placeholder-[#8c7b67]"
                            : "text-white placeholder-[#78716c]"
                        }`}
                      />
                    </div>

                    {/* University Select */}
                    <div
                      className={`w-full py-2.5 px-4 rounded-full border focus-within:border-[#d4af37] flex items-center gap-3 ${
                        isLightMode
                          ? "bg-[#f9f7f2] border-[#ded5c2]"
                          : "bg-[#12100d] border-[#2d261e]"
                      }`}
                    >
                      <GraduationCap
                        size={15}
                        className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                      />
                      <select
                        id="signup-university-select"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className={`bg-transparent text-xs font-medium w-full focus:outline-none cursor-pointer ${
                          isLightMode ? "text-[#1c1915]" : "text-white"
                        }`}
                      >
                        {africanUniversities.map((uni) => (
                          <option
                            key={uni}
                            value={uni}
                            className={isLightMode ? "bg-white text-[#1c1915]" : "bg-[#12100d] text-white"}
                          >
                            {uni}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div
                      className={`w-full py-2.5 px-4 rounded-full border focus-within:border-[#d4af37] flex items-center gap-3 ${
                        isLightMode
                          ? "bg-[#f9f7f2] border-[#ded5c2]"
                          : "bg-[#12100d] border-[#2d261e]"
                      }`}
                    >
                      <Mail
                        size={15}
                        className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                      />
                      <input
                        id="signup-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Academic or personal email"
                        className={`bg-transparent text-xs font-medium w-full focus:outline-none ${
                          isLightMode
                            ? "text-[#1c1915] placeholder-[#8c7b67]"
                            : "text-white placeholder-[#78716c]"
                        }`}
                      />
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`w-full py-2.5 px-3.5 rounded-full border focus-within:border-[#d4af37] flex items-center gap-2 ${
                          isLightMode
                            ? "bg-[#f9f7f2] border-[#ded5c2]"
                            : "bg-[#12100d] border-[#2d261e]"
                        }`}
                      >
                        <Lock
                          size={14}
                          className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                        />
                        <input
                          id="signup-password-input"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className={`bg-transparent text-xs font-medium w-full focus:outline-none ${
                            isLightMode
                              ? "text-[#1c1915] placeholder-[#8c7b67]"
                              : "text-white placeholder-[#78716c]"
                          }`}
                        />
                      </div>
                      <div
                        className={`w-full py-2.5 px-3.5 rounded-full border focus-within:border-[#d4af37] flex items-center gap-2 ${
                          isLightMode
                            ? "bg-[#f9f7f2] border-[#ded5c2]"
                            : "bg-[#12100d] border-[#2d261e]"
                        }`}
                      >
                        <Lock
                          size={14}
                          className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                        />
                        <input
                          id="signup-confirm-input"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm"
                          className={`bg-transparent text-xs font-medium w-full focus:outline-none ${
                            isLightMode
                              ? "text-[#1c1915] placeholder-[#8c7b67]"
                              : "text-white placeholder-[#78716c]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Honor code checkbox */}
                    <label className="flex items-start gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={agreeHonorCode}
                        onChange={(e) => setAgreeHonorCode(e.target.checked)}
                        className={`mt-0.5 rounded accent-[#d4af37] ${
                          isLightMode
                            ? "bg-[#f9f7f2] border-[#ded5c2]"
                            : "bg-[#12100d] border-[#2d261e]"
                        }`}
                      />
                      <span
                        className={`text-[11px] leading-tight font-medium ${
                          isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                        }`}
                      >
                        I uphold the Pan-African Academic Honor Code and scientific integrity standards.
                      </span>
                    </label>

                    {/* Create Account Button */}
                    <button
                      id="signup-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-[#0a0907] bg-gradient-to-r from-[#f7d67d] via-[#eab308] to-[#ca8a04] hover:brightness-110 active:scale-[0.99] shadow-[0_4px_25px_rgba(234,179,8,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={15} className="animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <span
                        className={`text-xs ${isLightMode ? "text-[#6b5842]" : "text-[#a8a29e]"}`}
                      >
                        Already have an account?{" "}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("signin");
                          setAuthError(null);
                        }}
                        className={`text-xs font-bold hover:underline cursor-pointer ${
                          isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                        }`}
                      >
                        Sign In &rarr;
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: FORGOT PASSWORD MODE */}
              {activeTab === "forgot" && (
                <div>
                  <h2
                    className={`text-2xl font-bold tracking-tight mb-1 transition-colors ${
                      isLightMode ? "text-[#1c1915]" : "text-white"
                    }`}
                  >
                    Reset Password
                  </h2>
                  <p
                    className={`text-xs mb-4 leading-normal transition-colors ${
                      isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                    }`}
                  >
                    Enter your email address and we will dispatch password recovery instructions.
                  </p>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div
                      className={`w-full py-3 px-4 rounded-full border focus-within:border-[#d4af37] flex items-center gap-3 ${
                        isLightMode
                          ? "bg-[#f9f7f2] border-[#ded5c2]"
                          : "bg-[#12100d] border-[#2d261e]"
                      }`}
                    >
                      <Mail
                        size={16}
                        className={`shrink-0 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                      />
                      <input
                        id="forgot-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="scholar@university.edu"
                        className={`bg-transparent text-xs font-medium w-full focus:outline-none ${
                          isLightMode
                            ? "text-[#1c1915] placeholder-[#8c7b67]"
                            : "text-white placeholder-[#78716c]"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-full font-bold text-sm text-[#0a0907] bg-gradient-to-r from-[#f7d67d] via-[#eab308] to-[#ca8a04] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <span>Send Reset Link</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signin");
                        setAuthError(null);
                      }}
                      className={`w-full text-center text-xs font-bold hover:underline block pt-1 ${
                        isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                      }`}
                    >
                      &larr; Back to Sign In
                    </button>
                  </form>
                </div>
              )}

              {/* Bottom Card Feature Triad */}
              <div
                className={`grid grid-cols-3 gap-1 pt-5 mt-5 border-t text-center transition-colors ${
                  isLightMode ? "border-[#d4af37]/35" : "border-[#d4af37]/20"
                }`}
              >
                {/* Triad 1: Pan-African Platform */}
                <div
                  className={`flex flex-col items-center justify-center p-1 border-r ${
                    isLightMode ? "border-[#d4af37]/25" : "border-[#d4af37]/15"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 mb-1 fill-none stroke-current stroke-[1.8] ${
                      isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                  <span
                    className={`text-[9px] font-semibold leading-tight ${
                      isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                    }`}
                  >
                    A Pan-African Platform
                  </span>
                </div>

                {/* Triad 2: For Students & Dreamers */}
                <div
                  className={`flex flex-col items-center justify-center p-1 border-r ${
                    isLightMode ? "border-[#d4af37]/25" : "border-[#d4af37]/15"
                  }`}
                >
                  <User
                    size={14}
                    className={`mb-1 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                  />
                  <span
                    className={`text-[9px] font-semibold leading-tight ${
                      isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                    }`}
                  >
                    For Students &amp; Dreamers
                  </span>
                </div>

                {/* Triad 3: Built for Africa's Tomorrow */}
                <div className="flex flex-col items-center justify-center p-1">
                  <Sprout
                    size={14}
                    className={`mb-1 ${isLightMode ? "text-[#8a5700]" : "text-[#f59e0b]"}`}
                  />
                  <span
                    className={`text-[9px] font-semibold leading-tight ${
                      isLightMode ? "text-[#5e4b37]" : "text-[#a8a29e]"
                    }`}
                  >
                    Built for Africa's Tomorrow
                  </span>
                </div>
              </div>

              {/* Guest Explorer Option */}
              <div className="mt-4 pt-2 text-center">
                <button
                  id="guest-explorer-btn"
                  type="button"
                  onClick={continueAsGuest}
                  className={`text-[11px] font-semibold transition-colors cursor-pointer hover:underline ${
                    isLightMode
                      ? "text-[#6b5842] hover:text-[#8a5700]"
                      : "text-[#a8a29e] hover:text-[#fef08a]"
                  }`}
                >
                  Explore as Guest Scholar &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`relative z-20 w-full px-6 py-3 text-center text-[10px] sm:text-[11px] border-t transition-colors ${
          isLightMode
            ? "border-[#e0d6c4] bg-[#faf8f5]/90 text-[#6b5842]"
            : "border-[#2a241b]/40 bg-[#080705]/90 text-[#78716c]"
        }`}
      >
        <span>&copy; 2026 AfriVersty &bull; Pan-African Academic &amp; Innovation Network</span>
      </footer>
    </div>
  );
};
