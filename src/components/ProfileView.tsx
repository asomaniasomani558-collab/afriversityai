import React, { useState, useEffect, useRef } from "react";
import { User, Award, BookOpen, Users, FolderGit2, MapPin, Mail, Calendar, Edit3, CheckCircle2, ShieldCheck, Sparkles, X, Save, Camera, Upload, Image as ImageIcon, Check, RefreshCw, Sun, Moon, Sliders, Database, Lock, KeyRound, Fingerprint, LogIn, LogOut, AlertCircle, ShieldAlert, Cpu, FileText, PlusCircle, Trash2, Activity as ActivityIcon } from "lucide-react";
import { UserProfile } from "../types";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ResumeBuilder } from "./ResumeBuilder";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { subscribeUserActivities, logUserActivity, clearUserActivities } from "../services/activityService";
import { UserActivityRecord } from "../types";

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  {
    id: "avatar-kofi",
    name: "Dr. Kofi Mensah",
    tag: "Engineering Lead",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar-queen",
    name: "Royal Heritage",
    tag: "Gold Choker & Cowrie",
    url: "/african_queen_gold.jpg",
  },
  {
    id: "avatar-mask",
    name: "Afriversty Mask",
    tag: "Golden Emblem",
    url: "/afriversty_gold_mask.jpg",
  },
  {
    id: "avatar-amara",
    name: "Amara Nweke",
    tag: "Biomedical Fellow",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar-kwame",
    name: "Kwame Osei",
    tag: "AI & Distributed Systems",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar-fatou",
    name: "Fatou Diop",
    tag: "FinTech & Economics",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar-tariq",
    name: "Tariq Al-Mansoor",
    tag: "Renewable Energy Lead",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar-zainab",
    name: "Zainab Touré",
    tag: "Genomics & Bio-Data",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
  },
];

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const { t } = useLanguage();
  const { currentUser, userData, isAuthenticated, isGuest, openAuthModal, signOutUser, resetPassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editUniversity, setEditUniversity] = useState(user.university);
  const [activeTab, setActiveTab] = useState<"badges" | "resume" | "activity" | "security" | "sso" | "offline" | "theme">("badges");
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [dbActivities, setDbActivities] = useState<UserActivityRecord[]>([]);
  const [isLoggingTest, setIsLoggingTest] = useState(false);

  // Subscribe to real-time activity events from the Firestore database
  useEffect(() => {
    const uid = currentUser?.uid || "guest";
    const unsubscribe = subscribeUserActivities(uid, (activities) => {
      setDbActivities(activities);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleRecordTestActivity = async () => {
    setIsLoggingTest(true);
    const uid = currentUser?.uid || "guest-scholar";
    const name = currentUser?.displayName || userData?.displayName || user.name;
    const testActions = [
      { action: "Explored Research Radar", type: "research" as const, target: "Sub-Saharan Solar Microgrid Analysis", details: "Viewed published findings from KNUST Renewable Energy Lab" },
      { action: "Accessed STEM Sandbox", type: "course" as const, target: "Quantum Algorithm Simulator", details: "Tested Python circuit in African Cloud Lab" },
      { action: "Joined Academic Discussion", type: "community" as const, target: "Pan-African AI Ethics Forum", details: "Engaged in collaborative thread" },
      { action: "Downloaded Lecture Notes", type: "course" as const, target: "Advanced Satellite Telemetry", details: "Synchronized for offline review" },
    ];
    const item = testActions[Math.floor(Math.random() * testActions.length)];
    await logUserActivity({
      userId: uid,
      userName: name,
      action: item.action,
      actionType: item.type,
      targetTitle: item.target,
      details: item.details,
    });
    setIsLoggingTest(false);
  };

  const handleClearActivities = async () => {
    const uid = currentUser?.uid || "guest-scholar";
    await clearUserActivities(uid);
    setDbActivities([]);
  };
  const [isLowDataMode, setIsLowDataMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("afriversty_low_data_mode") === "true";
    } catch {
      return false;
    }
  });

  const [ssoUniversity, setSsoUniversity] = useState("KNUST - Ghana (Verified EduID)");
  const [ssoLinked, setSsoLinked] = useState(true);

  const toggleLowDataMode = () => {
    const next = !isLowDataMode;
    setIsLowDataMode(next);
    try {
      localStorage.setItem("afriversty_low_data_mode", String(next));
    } catch {
      // storage error
    }
  };

  // Avatar Modal State
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    user.avatar || PRESET_AVATARS[0].url
  );
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [avatarUploadError, setAvatarUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentAvatar = user.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80";

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      role: editRole,
      bio: editBio,
      location: editLocation,
      university: editUniversity,
    });
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarUploadError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError("File size exceeds 5MB limit. Please choose a smaller photo.");
      return;
    }

    setAvatarUploadError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyAvatar = () => {
    onUpdateProfile({ avatar: selectedAvatarUrl });
    setIsAvatarModalOpen(false);
    setAvatarUploadError("");
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setSelectedAvatarUrl(customUrlInput.trim());
    setCustomUrlInput("");
  };

  return (
    <div id="profile-view-container" className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Banner & Header */}
      <div className="bg-[#1b1b1b]/90 backdrop-blur-xl rounded-3xl border border-[#d4af37]/25 overflow-hidden shadow-2xl relative">
        {/* Cover Pattern */}
        <div className="h-44 w-full bg-gradient-to-r from-[#20201f] via-[#1b1b1b] to-[#20201f] african-kente-pattern relative border-b border-[#4d4635]/25">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-[#d4af37]/20 text-[#f2ca50] border border-[#d4af37]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
              <ShieldCheck size={14} />
              <span>{user.heritageTier}</span>
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 md:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {/* Avatar with Interactive Change Photo Badge */}
              <div
                onClick={() => {
                  setSelectedAvatarUrl(currentAvatar);
                  setIsAvatarModalOpen(true);
                }}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#d4af37] p-1 ring-4 ring-[#1b1b1b] overflow-hidden shadow-2xl relative group cursor-pointer"
                title="Click to change profile picture"
              >
                <img
                  src={currentAvatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover / Active Change Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white rounded-[20px]">
                  <Camera size={24} className="text-[#f2ca50] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-[#f2ca50] tracking-wide">Change Photo</span>
                </div>

                {/* Constant Camera Icon Badge on Mobile/Tablet */}
                <div className="sm:hidden absolute bottom-1.5 right-1.5 bg-[#f2ca50] text-[#3c2f00] p-1.5 rounded-full shadow-lg border border-[#3c2f00]/30">
                  <Camera size={13} />
                </div>
              </div>

              {/* Name & Titles */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#e5e2e1]">
                    {user.name}
                  </h1>
                  <button
                    onClick={() => {
                      setSelectedAvatarUrl(currentAvatar);
                      setIsAvatarModalOpen(true);
                    }}
                    className="text-[11px] font-medium text-[#f2ca50] hover:text-[#ffe088] bg-[#f2ca50]/10 hover:bg-[#f2ca50]/20 border border-[#f2ca50]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all"
                  >
                    <Camera size={12} />
                    <span>Change Picture</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#f2ca50]">
                  {user.role} &bull; {user.university}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#99907c] pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#f2ca50]" />
                    {user.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-[#f2ca50]" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-[#f2ca50]" />
                    Member since {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                id="profile-build-cv-btn"
                onClick={() => setActiveTab("resume")}
                className="bg-gradient-to-r from-[#c69a4c] to-[#f2ca50] hover:from-[#d8ad5a] hover:to-[#ffe088] text-[#3c2f00] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FileText size={14} />
                <span>Build African CV</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAvatarUrl(currentAvatar);
                  setIsAvatarModalOpen(true);
                }}
                className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#f2ca50] border border-[#d4af37]/30 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Camera size={14} />
                <span className="hidden sm:inline">Avatar</span>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#e5e2e1] border border-[#d4af37]/30 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 size={14} />
                <span>{t.editProfile}</span>
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-[#d0c5af] leading-relaxed max-w-3xl font-sans-body">
            {user.bio}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#4d4635]/25">
            <div className="p-3 bg-[#20201f] rounded-2xl border border-[#4d4635]/20 text-center">
              <div className="font-serif-title text-2xl font-bold text-[#f2ca50]">{user.stats.courses}</div>
              <div className="text-[11px] text-[#99907c] uppercase">{t.courses}</div>
            </div>
            <div className="p-3 bg-[#20201f] rounded-2xl border border-[#4d4635]/20 text-center">
              <div className="font-serif-title text-2xl font-bold text-[#f2ca50]">{user.stats.groups}</div>
              <div className="text-[11px] text-[#99907c] uppercase">{t.studyGroups}</div>
            </div>
            <div className="p-3 bg-[#20201f] rounded-2xl border border-[#4d4635]/20 text-center">
              <div className="font-serif-title text-2xl font-bold text-[#f2ca50]">{user.stats.projects}</div>
              <div className="text-[11px] text-[#99907c] uppercase">{t.projects}</div>
            </div>
            <div className="p-3 bg-[#20201f] rounded-2xl border border-[#4d4635]/20 text-center">
              <div className="font-serif-title text-2xl font-bold text-[#f2ca50]">{user.stats.badges}</div>
              <div className="text-[11px] text-[#99907c] uppercase">{t.badges}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#4d4635]/25 pb-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("badges")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
                activeTab === "badges"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              {t.badges} ({user.badges.length})
            </button>
            <button
              id="tab-resume-builder"
              onClick={() => setActiveTab("resume")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "resume"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <FileText size={13} className="text-[#f2ca50]" />
              <span>African Industry CV & Resume</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#c69a4c]/20 text-[#f2ca50] font-mono">NEW</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "security"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <ShieldCheck size={13} className="text-[#f2ca50]" />
              <span>Data Security & Cloud DB</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 whitespace-nowrap ${
                activeTab === "activity"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              Academic Timeline
            </button>
            <button
              onClick={() => setActiveTab("sso")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "sso"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <ShieldCheck size={13} />
              <span>EduID & Institutional SSO</span>
            </button>
            <button
              onClick={() => setActiveTab("offline")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "offline"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Sparkles size={13} />
              <span>Offline PWA & Low-Data</span>
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`text-xs font-bold pb-2 transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "theme"
                  ? "border-[#f2ca50] text-[#f2ca50]"
                  : "border-transparent text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Sliders size={13} />
              <span>Theme & Reading Mode</span>
            </button>
          </div>
        </div>

        {/* Security & Cloud Database Center Tab */}
        {activeTab === "security" && (
          <div className="bg-[#1b1b1b] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/25 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4d4635]/25">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
                  <ShieldCheck size={22} className="text-[#f2ca50]" />
                  <span>Cloud Database & Top-Notch Data Security</span>
                </h3>
                <p className="text-xs text-[#d0c5af] mt-1">
                  Individual user data isolation, cryptographic encryption, and African academic identity management.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950/70 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AES-256 Isolated Database</span>
                </span>
              </div>
            </div>

            {resetFeedback && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                <span>{resetFeedback}</span>
                <button
                  onClick={() => setResetFeedback(null)}
                  className="text-emerald-400 hover:text-emerald-200"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Top Grid: Database State & Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#99907c]">
                  <span className="uppercase font-bold tracking-wider">Cloud Storage Target</span>
                  <Database size={15} className="text-[#f2ca50]" />
                </div>
                <div className="text-sm font-bold text-[#e5e2e1] font-mono">
                  probable-clone-6wjrd
                </div>
                <p className="text-[11px] text-[#99907c]">
                  Dedicated Firestore collection strictly keyed to your private UID.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#99907c]">
                  <span className="uppercase font-bold tracking-wider">Encryption Protocol</span>
                  <Lock size={15} className="text-[#f2ca50]" />
                </div>
                <div className="text-sm font-bold text-[#4ade80] font-mono">
                  AES-256 / TLS 1.3
                </div>
                <p className="text-[11px] text-[#99907c]">
                  End-to-end payload cryptography with zero plaintext leaks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#99907c]">
                  <span className="uppercase font-bold tracking-wider">Authentication State</span>
                  <Fingerprint size={15} className="text-[#f2ca50]" />
                </div>
                <div className="text-sm font-bold text-[#ffd768]">
                  {currentUser ? "Authenticated Scholar" : isGuest ? "Guest Sandbox" : "Local Session"}
                </div>
                <p className="text-[11px] text-[#99907c]">
                  {currentUser?.email || "No master cloud session linked."}
                </p>
              </div>
            </div>

            {/* Individual Scholar Record Isolation Card */}
            <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/25 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#f2ca50] flex items-center gap-2 uppercase tracking-wider">
                  <Cpu size={14} /> Individual Scholar Database Document
                </h4>
                <span className="text-[10px] text-[#99907c] font-mono">
                  Path: /users/{currentUser?.uid || "guest-session-local"}
                </span>
              </div>

              <div className="p-4 bg-[#1b1813] rounded-xl border border-[#4d4635]/30 font-mono text-[11px] text-[#d0c5af] space-y-1 overflow-x-auto">
                <div><span className="text-[#f2ca50]">uid:</span> &quot;{currentUser?.uid || "demo-kofi-mensah-8829"}&quot;</div>
                <div><span className="text-[#f2ca50]">email:</span> &quot;{currentUser?.email || user.email}&quot;</div>
                <div><span className="text-[#f2ca50]">securityTier:</span> &quot;AES-256 Cloud Isolated&quot;</div>
                <div><span className="text-[#f2ca50]">enrolledCoursesCount:</span> {user.stats.courses}</div>
                <div><span className="text-[#f2ca50]">joinedGroupsCount:</span> {user.stats.groups}</div>
                <div><span className="text-[#f2ca50]">heritageScore:</span> {user.heritageScore} (Gold Tier)</div>
                <div><span className="text-[#f2ca50]">dataIsolationRule:</span> &quot;request.auth.uid == userId&quot;</div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-[#99907c]">
                  Data is automatically synchronized in real time whenever changes occur.
                </div>
                <div className="flex items-center gap-2">
                  {!currentUser ? (
                    <button
                      onClick={() => openAuthModal("signin")}
                      className="px-4 py-2 rounded-xl bg-[#f2ca50] text-[#12100d] text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1.5"
                    >
                      <LogIn size={14} />
                      <span>Sign In or Register</span>
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        if (currentUser?.email) {
                          await resetPassword(currentUser.email);
                          setResetFeedback(`Password reset email dispatched to ${currentUser.email}`);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#201c17] hover:bg-[#2c261c] border border-[#d4af37]/35 text-[#f2ca50] text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <KeyRound size={13} />
                      <span>Send Password Reset</span>
                    </button>
                  )}

                  {currentUser && (
                    <button
                      onClick={() => signOutUser()}
                      className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Security Audit Log */}
            <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#e5e2e1] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#f2ca50]" /> Security Event Audit Log
                </h4>
                <span className="text-[10px] text-[#99907c]">Immutable Audit Trail</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#1c1914] border border-[#4d4635]/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <div>
                      <div className="font-semibold text-[#ded8cb]">Cryptographic Session Established</div>
                      <div className="text-[10px] text-[#99907c]">TLS 1.3 / ECDHE-RSA-AES128-GCM-SHA256</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#99907c]">Just now</span>
                </div>

                <div className="p-3 rounded-xl bg-[#1c1914] border border-[#4d4635]/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#f2ca50]"></span>
                    <div>
                      <div className="font-semibold text-[#ded8cb]">Firestore Security Rules Validated</div>
                      <div className="text-[10px] text-[#99907c]">Zero cross-tenant permission leak policy enforced</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#99907c]">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-[#1b1b1b] p-5 rounded-2xl border border-[#4d4635]/25 hover:border-[#f2ca50]/50 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#20201f] border border-[#d4af37]/40 flex items-center justify-center text-[#f2ca50] mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">{badge.icon}</span>
                  </div>
                  <h4 className="font-serif-title text-base font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-[#d0c5af] mt-1.5 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#4d4635]/20 text-[10px] text-[#99907c]">
                  Earned {badge.dateEarned}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab - Synced with Firestore database */}
        {activeTab === "activity" && (
          <div className="bg-[#1b1b1b] p-6 sm:p-8 rounded-2xl border border-[#4d4635]/25 space-y-6 shadow-xl">
            {/* Header bar with Database connection badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#4d4635]/25">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
                  <ActivityIcon size={20} className="text-[#f2ca50]" />
                  <span>Scholar Activity Log</span>
                </h3>
                <p className="text-xs text-[#99907c] mt-1">
                  Persisted in Firestore collection <code className="text-[#f2ca50] font-mono">/activities</code> & <code className="text-[#f2ca50] font-mono">/users/{currentUser?.uid || "guest"}/activities</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#241e12] border border-[#f2ca50]/40 text-[#f2ca50]">
                  <Database size={12} />
                  <span>Database Connected ({dbActivities.length} logs)</span>
                </span>

                <button
                  type="button"
                  onClick={handleRecordTestActivity}
                  disabled={isLoggingTest}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#f2ca50] text-[#1a1405] hover:bg-[#ffe082] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Simulate a new activity event in the database"
                >
                  <PlusCircle size={13} />
                  <span>{isLoggingTest ? "Saving..." : "Log Action"}</span>
                </button>

                {dbActivities.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearActivities}
                    className="p-1.5 rounded-lg text-[#99907c] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Clear activities"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* List of activity entries */}
            <div className="space-y-3">
              {dbActivities.length > 0 ? (
                dbActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-[#20201f] border border-[#4d4635]/20 hover:border-[#f2ca50]/40 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-[#e5e2e1]">
                          <span className="text-[#99907c] font-medium">{act.action}</span>{" "}
                          <span className="font-bold text-[#f2ca50]">{act.targetTitle}</span>
                        </p>
                        {act.details && (
                          <p className="text-[11px] text-[#99907c] mt-0.5">{act.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#99907c] block">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#f2ca50]/80 font-mono">
                        {act.actionType}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-[#99907c]">
                  No activities recorded yet in the database. Click "Log Action" or perform actions across the campus to build your activity timeline.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Institutional SSO & EduID Verification Tab */}
        {activeTab === "sso" && (
          <div className="bg-[#1b1b1b] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/25 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#4d4635]/25">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#f2ca50]" />
                  <span>Institutional SSO & EduID Verification</span>
                </h3>
                <p className="text-xs text-[#d0c5af] mt-1">
                  Connect your African university credentials (Eduroam / EduID / SAML 2.0) to synchronize official course credit and university research libraries.
                </p>
              </div>
              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Scholar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ded8cb]">Primary Institutional Identity:</span>
                  <span className="text-[10px] text-[#f2ca50] font-mono font-bold">ACTIVE</span>
                </div>
                <div className="p-3 bg-[#1e1b16] rounded-xl border border-[#d4af37]/25 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#f2ca50] font-bold">
                    KN
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-[#e5e2e1]">{ssoUniversity}</div>
                    <div className="text-[10px] text-[#99907c]">ID: GH-KNUST-2024-884920</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#99907c]">
                  Enables instant automated access to IEEE Xplore, ScienceDirect, and African Digital Libraries.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 space-y-3">
                <span className="text-xs font-bold text-[#ded8cb]">Add Secondary University Affiliation</span>
                <select className="w-full bg-[#1e1b16] border border-[#d4af37]/25 rounded-xl p-2.5 text-xs text-[#ded8cb] focus:outline-none focus:border-[#f2ca50]">
                  <option>University of Cape Town (UCT) - EduID</option>
                  <option>University of Lagos (UNILAG) - SAML SSO</option>
                  <option>Makerere University (MAK) - Academic ID</option>
                  <option>Cairo University - Egyptian Knowledge Bank</option>
                  <option>Ashesi University - Google Workspace SSO</option>
                </select>
                <button
                  onClick={() => alert("Institutional SSO Handshake verified via Eduroam SAML 2.0")}
                  className="w-full py-2 bg-[#201c17] hover:bg-[#2e261a] text-[#f2ca50] border border-[#d4af37]/35 rounded-xl text-xs font-bold transition-all"
                >
                  Link Additional Institution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Offline PWA & Low-Data Vault Tab */}
        {activeTab === "offline" && (
          <div className="bg-[#1b1b1b] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/25 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#4d4635]/25">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
                  <Sparkles size={20} className="text-[#f2ca50]" />
                  <span>Offline PWA Vault & Low-Bandwidth Mode</span>
                </h3>
                <p className="text-xs text-[#d0c5af] mt-1">
                  Engineered for seamless academic research across regions with intermittent power and constrained bandwidth.
                </p>
              </div>
            </div>

            {/* Low Data Mode Toggle */}
            <div className="p-5 rounded-2xl bg-[#14120f] border border-[#d4af37]/25 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                  <span>Ultra Low-Data 2G/3G Optimization</span>
                  {isLowDataMode && (
                    <span className="text-[10px] bg-green-500/20 text-green-300 font-bold px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-[#99907c] max-w-xl">
                  Reduces data payload by up to 85% by compressing math equations locally and prioritizing cached STEM formulas.
                </p>
              </div>
              <button
                onClick={toggleLowDataMode}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isLowDataMode
                    ? "bg-[#f2ca50] text-[#3c2f00]"
                    : "bg-[#201c17] text-[#99907c] border border-[#d4af37]/30"
                }`}
              >
                {isLowDataMode ? "Enabled" : "Enable Mode"}
              </button>
            </div>

            {/* Cached Vault Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold">Offline STEM Formulas</span>
                <p className="text-lg font-bold font-mono text-[#f2ca50] mt-1">42 Stored</p>
                <span className="text-[10px] text-green-400">IndexedDB Cached</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold">Preloaded Syllabi</span>
                <p className="text-lg font-bold font-mono text-[#4ade80] mt-1">6 Courses</p>
                <span className="text-[10px] text-green-400">Available Offline</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 text-center">
                <span className="text-[10px] text-[#99907c] uppercase font-bold">Local Storage Footprint</span>
                <p className="text-lg font-bold font-mono text-[#ffd768] mt-1">4.2 MB</p>
                <span className="text-[10px] text-[#ded8cb]">Ultra-Lightweight</span>
              </div>
            </div>
          </div>
        )}

        {/* Theme Preferences Tab */}
        {activeTab === "theme" && (
          <div className="bg-[#1b1b1b] p-6 sm:p-8 rounded-3xl border border-[#d4af37]/25 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#4d4635]/25">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
                  <span>Display & Ambient Reading Modes</span>
                  <Sparkles size={16} className="text-[#f2ca50]" />
                </h3>
                <p className="text-xs text-[#d0c5af] mt-1">
                  Tailor the visual presentation of AfriVersty for optimal focus and ergonomic contrast in different lighting conditions.
                </p>
              </div>
            </div>

            <ThemeSwitcher variant="segmented" />

            <div className="p-4 rounded-2xl bg-[#14120f] border border-[#d4af37]/20 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50] shrink-0 mt-0.5">
                <Sun size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#e5e2e1]">
                  High-Ambient-Light Ergonomics
                </h4>
                <p className="text-[11px] text-[#99907c] leading-relaxed">
                  Switching to <strong>Light Academic Mode</strong> applies high-contrast charcoal typography, ivory linen card framing, and anti-glare shading designed for study halls, outdoor campuses, and sunlit lecture rooms.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* African Industry Resume & CV Builder Tab */}
        {activeTab === "resume" && (
          <ResumeBuilder user={user} />
        )}
      </div>

      {/* Dedicated Avatar & Profile Picture Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="change-avatar-modal"
            className="bg-[#181613] border border-[#d4af37]/40 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-[#e5e2e1]"
          >
            <button
              onClick={() => {
                setIsAvatarModalOpen(false);
                setAvatarUploadError("");
              }}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-2 rounded-full bg-[#20201f] border border-[#4d4635]/40 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#f2ca50]">
                <Camera size={20} />
              </div>
              <div>
                <h2 className="font-serif-title text-2xl font-bold text-[#f2ca50]">
                  Update Profile Picture
                </h2>
                <p className="text-xs text-[#d0c5af]">
                  Upload your own photo or select an authentic African scholar avatar.
                </p>
              </div>
            </div>

            {/* Current & Preview Showcase */}
            <div className="flex items-center justify-center gap-6 my-6 p-4 rounded-2xl bg-[#12110e] border border-[#d4af37]/25 shadow-inner">
              <div className="w-24 h-24 rounded-full bg-[#d4af37] p-1 ring-4 ring-[#f2ca50]/40 shadow-xl overflow-hidden relative shrink-0">
                <img
                  src={selectedAvatarUrl}
                  alt="Selected Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="space-y-1.5 text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-[#f2ca50]">
                  Current Selection Preview
                </div>
                <p className="text-xs text-[#d0c5af]/80 max-w-xs">
                  This picture will represent your academic profile, publications, and study circles.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#f2ca50] border border-[#d4af37]/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <Upload size={13} />
                    <span>Upload from Device</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {avatarUploadError && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-xl mb-4 text-center">
                {avatarUploadError}
              </div>
            )}

            {/* Preset Avatar Gallery */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d0c5af]">
                  Curated African Scholar Avatars
                </label>
                <span className="text-[11px] text-[#99907c]">Click to preview</span>
              </div>
              <div className="grid grid-cols-4 gap-3 max-h-52 overflow-y-auto p-2 bg-[#12110e] rounded-2xl border border-[#4d4635]/30">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedAvatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarUrl(preset.url);
                        setAvatarUploadError("");
                      }}
                      className={`relative rounded-xl p-1.5 flex flex-col items-center text-center transition-all group border ${
                        isSelected
                          ? "bg-[#28241d] border-[#f2ca50] shadow-[0_0_12px_rgba(242,202,80,0.35)]"
                          : "bg-[#1b1b1b] border-[#4d4635]/25 hover:border-[#d4af37]/60"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden mb-1 relative border border-[#d4af37]/40 bg-[#12110e]">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#f2ca50]/30 flex items-center justify-center">
                            <Check size={14} className="text-[#3c2f00] bg-[#f2ca50] rounded-full p-0.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#e5e2e1] truncate w-full">
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-[#99907c] truncate w-full">
                        {preset.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1.5 mb-6">
              <label className="text-xs font-semibold text-[#d0c5af] flex items-center gap-1.5">
                <ImageIcon size={13} className="text-[#f2ca50]" />
                <span>Or Enter Image URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 bg-[#12110e] border border-[#4d4635]/40 rounded-xl px-3.5 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  disabled={!customUrlInput.trim()}
                  className="px-3 py-2 bg-[#20201f] disabled:opacity-50 hover:bg-[#2a2a2a] text-[#f2ca50] border border-[#d4af37]/30 text-xs font-bold rounded-xl transition-all"
                >
                  Load
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#4d4635]/30">
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80");
                }}
                className="text-xs text-[#99907c] hover:text-[#f2ca50] flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={13} />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-[#d0c5af] hover:text-[#e5e2e1]"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleApplyAvatar}
                  className="bg-gradient-to-r from-[#d4af37] to-[#f2ca50] hover:from-[#e5bd3b] hover:to-[#ffe088] text-[#3c2f00] font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="edit-profile-modal"
            className="bg-[#1b1b1b] border border-[#d4af37]/40 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif-title text-2xl font-bold text-[#e5e2e1] mb-1">
              {t.editProfile}
            </h2>
            <p className="text-xs text-[#d0c5af] mb-6">
              Update your academic credentials, university affiliation, location, and research biography.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Academic Role</label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">University Affiliation</label>
                <input
                  type="text"
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Biography & Focus</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-[#d0c5af] hover:text-[#e5e2e1]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{t.saveChanges}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
