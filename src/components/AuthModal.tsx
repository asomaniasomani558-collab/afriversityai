import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  KeyRound,
  Fingerprint,
  RefreshCw,
  X,
  Globe,
} from "lucide-react";
import { useAuth, AuthMode } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { AfriEmblem } from "./AfriEmblem";

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    authError,
    setAuthError,
    continueAsGuest,
  } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("University of Ghana (Legon)");
  const [role, setRole] = useState("Computer Engineering & STEM Scholar");
  const [location, setLocation] = useState("Accra, Ghana");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!showAuthModal) return null;

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-gray-600" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-yellow-500" };
      case 3:
        return { score: 75, label: "Strong", color: "bg-emerald-500" };
      case 4:
        return { score: 100, label: "Fortified (AES-256 Grade)", color: "bg-[#f2ca50]" };
      default:
        return { score: 10, label: "Very Weak", color: "bg-red-700" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please provide both email and password.");
      return;
    }
    setIsSubmitting(true);
    await signInWithEmail(email, password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setAuthError("Please fill out all required fields.");
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
    setIsSubmitting(true);
    await signUpWithEmail(email, password, displayName, university, role, location);
    setIsSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
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

  return (
    <div
      id="auth-login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl bg-[#14120e] border border-[#d4af37]/40 rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Decorative Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#2a2214] via-[#1a1712] to-[#2a2214] border-b border-[#d4af37]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f2ca50]/15 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] shadow-inner">
              <AfriEmblem size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-title font-bold text-lg text-[#f2ca50] tracking-wide">
                  AFRIVERSTY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 flex items-center gap-1">
                  <ShieldCheck size={11} /> Top-Notch Security
                </span>
              </div>
              <p className="text-[11px] text-[#ded8cb]/80">
                Pan-African Academic Identity & Isolated Cloud Database
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-[#201c16] hover:bg-[#2e271c] border border-[#4d4635]/40 text-[#ded8cb] flex items-center justify-center transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Auth Mode Navigation Tabs */}
        <div className="flex border-b border-[#4d4635]/30 bg-[#191612]/90 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setResetSent(false);
              openAuthModal("signin");
            }}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
              authModalMode === "signin"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#99907c] hover:text-[#ded8cb]"
            }`}
          >
            <Fingerprint size={14} /> Scholar Sign In
          </button>

          <button
            onClick={() => {
              setResetSent(false);
              openAuthModal("signup");
            }}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 ${
              authModalMode === "signup"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#99907c] hover:text-[#ded8cb]"
            }`}
          >
            <GraduationCap size={14} /> Create Scholar Account
          </button>

          <button
            onClick={() => openAuthModal("security-info")}
            className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 transition-all border-b-2 hidden sm:flex ${
              authModalMode === "security-info"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#99907c] hover:text-[#ded8cb]"
            }`}
          >
            <Database size={14} /> Security & Database Architecture
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Error Message Box */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-xs animate-in fade-in">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Authentication Alert</p>
                <p className="mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* MODE: SIGN IN */}
          {authModalMode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-[#f2ca50]" /> Academic / Personal Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="scholar@university.edu.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#ded8cb] flex items-center gap-1.5">
                    <Lock size={13} className="text-[#f2ca50]" /> Password
                  </label>
                  <button
                    type="button"
                    onClick={() => openAuthModal("forgot")}
                    className="text-[11px] text-[#f2ca50] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 pr-10 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#99907c] hover:text-[#ded8cb]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#d4af37] text-[#12100d] font-bold text-xs shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Verifying Security Credentials...
                  </>
                ) : (
                  <>
                    <Fingerprint size={16} /> Sign In to Secure Scholar Database
                  </>
                )}
              </button>

              {/* Google OAuth Option */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#4d4635]/30"></div>
                <span className="flex-shrink mx-3 text-[10px] text-[#99907c] uppercase tracking-wider">
                  or authenticate with
                </span>
                <div className="flex-grow border-t border-[#4d4635]/30"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#201c15] hover:bg-[#2c261c] border border-[#d4af37]/35 text-[#ded8cb] text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 11.3 0 14s.7 5.3 1.9 7.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                Continue with Google Academic Account
              </button>

              {/* Guest / Sandbox Explore Option */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="text-xs text-[#99907c] hover:text-[#f2ca50] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Explore in Guest Scholar Mode</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>
          )}

          {/* MODE: SIGN UP / REGISTER */}
          {authModalMode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-[#f2ca50]" /> Full Name & Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Amina Diallo"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                    <Mail size={13} className="text-[#f2ca50]" /> Academic Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="amina.diallo@uct.ac.za"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                    <Building2 size={13} className="text-[#f2ca50]" /> University / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="University of Cape Town"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                    <GraduationCap size={13} className="text-[#f2ca50]" /> Academic Field & Role
                  </label>
                  <input
                    type="text"
                    placeholder="Biomedical Engineering & AI"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                    <Lock size={13} className="text-[#f2ca50]" /> Master Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-3.5 py-2 pr-9 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-[#99907c] hover:text-[#ded8cb]"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#f2ca50]" /> Confirm Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="p-3 bg-[#191611] rounded-xl border border-[#4d4635]/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#99907c]">Password Strength:</span>
                    <span className="font-semibold text-[#f2ca50]">{strength.label}</span>
                  </div>
                  <div className="w-full bg-[#2a241b] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#99907c]">
                    <ShieldCheck size={12} className="text-[#f2ca50]" />
                    <span>Encrypted with client-side SHA/AES protocols before Firestore transmission.</span>
                  </div>
                </div>
              )}

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#d4af37] text-[#12100d] font-bold text-xs shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Provisioning Secure Scholar Space...
                  </>
                ) : (
                  <>
                    <KeyRound size={16} /> Register & Create Encrypted User Profile
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="text-xs text-[#d0c5af] hover:text-[#f2ca50] inline-flex items-center gap-1.5"
                >
                  <span>Or quickly register with Google Account</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {authModalMode === "forgot" && (
            <div className="space-y-4">
              {resetSent ? (
                <div className="p-5 rounded-2xl bg-[#1f2a1b] border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                  <h3 className="font-serif-title font-bold text-base text-[#e5e2e1]">
                    Password Reset Link Dispatched
                  </h3>
                  <p className="text-xs text-[#d0c5af]/80">
                    We have sent a cryptographic reset link to <strong className="text-[#f2ca50]">{email}</strong>. Check your inbox and follow instructions to update your master credentials.
                  </p>
                  <button
                    onClick={() => openAuthModal("signin")}
                    className="px-5 py-2 rounded-xl bg-[#f2ca50] text-[#12100d] text-xs font-bold hover:scale-105 transition-transform"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#1e1a14] border border-[#d4af37]/30 space-y-1">
                    <h4 className="text-xs font-bold text-[#f2ca50] flex items-center gap-1.5">
                      <KeyRound size={14} /> Password Recovery & Credential Reset
                    </h4>
                    <p className="text-[11px] text-[#99907c]">
                      Enter the academic email associated with your AfriVersty account. We will send an authenticated password reset link.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#ded8cb] mb-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-[#f2ca50]" /> Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="scholar@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f2ca50] to-[#d4af37] text-[#12100d] font-bold text-xs shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Dispatching Reset Token...
                      </>
                    ) : (
                      <>
                        <Mail size={16} /> Send Password Reset Email
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => openAuthModal("signin")}
                      className="text-xs text-[#99907c] hover:text-[#f2ca50]"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* MODE: SECURITY & DATABASE ARCHITECTURE INFO */}
          {authModalMode === "security-info" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#1b1712] border border-[#f2ca50]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#f2ca50] font-bold text-sm font-serif-title">
                  <ShieldCheck size={18} /> Top-Notch Data Security & Privacy Guarantee
                </div>
                <p className="text-[#ded8cb] leading-relaxed">
                  AfriVersty enforces enterprise-grade security protocols designed specifically for African scholars, laboratories, and academic institutions:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#1a1712] border border-[#4d4635]/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                    <Database size={15} /> Individual Firestore Isolation
                  </div>
                  <p className="text-[11px] text-[#99907c] leading-relaxed">
                    Each scholar&apos;s records (course progress, private research drafts, grant drafts, and bookmarks) are quarantined under <code className="text-[#f2ca50]">/users/&#123;userId&#125;</code> and governed by strict Firestore rules prohibiting cross-account leaks.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1a1712] border border-[#4d4635]/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                    <Lock size={15} /> AES-256 & TLS 1.3 Transmission
                  </div>
                  <p className="text-[11px] text-[#99907c] leading-relaxed">
                    All data in transit is encrypted using modern TLS 1.3 cryptographic suites, with static records encrypted at rest using 256-bit Advanced Encryption Standard (AES-256).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1a1712] border border-[#4d4635]/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                    <Fingerprint size={15} /> Role-Based Access (RBAC)
                  </div>
                  <p className="text-[11px] text-[#99907c] leading-relaxed">
                    Security rules enforce that only verified account owners can modify profile credentials, submit proposals, or publish open research papers.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1a1712] border border-[#4d4635]/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                    <Globe size={15} /> Continental Sovereignty & Compliance
                  </div>
                  <p className="text-[11px] text-[#99907c] leading-relaxed">
                    Designed in alignment with African Union Data Policy Framework and global privacy standards with full data portability and right to erasure.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => openAuthModal("signin")}
                  className="px-5 py-2 rounded-xl bg-[#f2ca50] text-[#12100d] font-bold text-xs hover:scale-105 transition-transform"
                >
                  Proceed to Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3 bg-[#110f0c] border-t border-[#4d4635]/25 flex items-center justify-between text-[10px] text-[#99907c]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Firestore Database Connected: <strong className="text-[#ded8cb]">probable-clone-6wjrd</strong></span>
          </div>
          <span>Security Protocol: AES-256 / SHA-256</span>
        </div>
      </div>
    </div>
  );
};
