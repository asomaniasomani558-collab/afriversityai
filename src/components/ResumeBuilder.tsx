import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Sliders,
  Award,
  BookOpen,
  Briefcase,
  FolderGit2,
  Globe,
  GraduationCap,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Building,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Github,
  Code,
  Languages,
} from "lucide-react";
import { UserProfile, Course, ProjectItem } from "../types";
import { initialCourses, initialProjects } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface ResumeBuilderProps {
  user: UserProfile;
}

export type AfricanIndustryTemplate =
  | "tech-fintech"
  | "agritech-energy"
  | "research-fellowship"
  | "development-policy"
  | "modern-executive";

interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  highlights: string[];
}

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  gpa: string;
  honors: string;
}

interface ProjectEntry {
  id: string;
  title: string;
  role: string;
  technologies: string[];
  impact: string;
  link?: string;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ user }) => {
  const { t } = useLanguage();
  const { isLightMode } = useTheme();

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState<AfricanIndustryTemplate>("tech-fintech");
  const [accentColor, setAccentColor] = useState<"gold" | "emerald" | "violet" | "sapphire">("gold");
  const [showAdinkraAccent, setShowAdinkraAccent] = useState(true);
  const [showGpa, setShowGpa] = useState(true);
  const [showBadges, setShowBadges] = useState(true);
  const [showCoursework, setShowCoursework] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Resume Data - Pre-populated from student profile & system mock data
  const [fullName, setFullName] = useState(user.name);
  const [headline, setHeadline] = useState(`${user.role} | Pan-African STEM Scholar`);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("+233 24 555 0192");
  const [location, setLocation] = useState(user.location);
  const [github, setGithub] = useState("github.com/kofi-mensah-stem");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/kofi-mensah-africa");
  const [summary, setSummary] = useState(
    `${user.bio} Proven track record developing resilient software and IoT architectures for sub-Saharan markets. Committed to building high-impact technology under the African Continental Free Trade Area (AfCFTA) digital framework.`
  );

  const [educationList, setEducationList] = useState<EducationEntry[]>([
    {
      id: "edu-1",
      institution: user.university || "University of Ghana (Legon)",
      degree: "BSc in Computer Engineering & Intelligent Systems",
      period: "2022 – 2026 (Expected)",
      location: user.location || "Accra, Ghana",
      gpa: "3.88 / 4.0 (First Class Honours Track)",
      honors: "Dean's List (6 Consecutive Semesters), West African STEM Council Scholar",
    },
  ]);

  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([
    {
      id: "exp-1",
      role: "Lead Software & Embedded Systems Fellow",
      organization: "AfriVersty STEM Innovation Laboratory",
      location: "Accra, Ghana",
      period: "Jan 2025 – Present",
      highlights: [
        "Architected distributed IoT telemetry firmware for rural solar microgrids deployed across 14 off-grid communities.",
        "Engineered low-latency USSD payment endpoints integrated with MTN MoMo and Telecel Cash achieving 99.94% transaction success.",
        "Mentored 45 junior African engineers in computer architecture, data structures, and edge AI deployment.",
      ],
    },
    {
      id: "exp-2",
      role: "Machine Learning Engineering Intern",
      organization: "Zindi Africa / Precision Ag Tech",
      location: "Remote / Nairobi, Kenya",
      period: "May 2024 – Nov 2024",
      highlights: [
        "Optimized MobileNetV3 convolutional neural networks for offline mobile crop disease classification with 94.2% top-1 accuracy.",
        "Built synthetic data pipelines for low-resource satellite imagery spanning West & East African agricultural zones.",
      ],
    },
  ]);

  const [selectedProjects, setSelectedProjects] = useState<ProjectEntry[]>([
    {
      id: "proj-1",
      title: "AgriVision AI — Edge Crop Pathology Scanner",
      role: "Technical Lead",
      technologies: ["PyTorch", "Raspberry Pi 4", "OpenCV", "Edge Inference", "FastAPI"],
      impact:
        "Designed edge computer vision system diagnosing cassava mosaic and maize streak viruses in sub-second inference time without cloud dependency.",
    },
    {
      id: "proj-2",
      title: "KilowattMesh — Decentralized Microgrid Billing Protocol",
      role: "Co-Creator & Firmware Engineer",
      technologies: ["C++", "ESP32", "USSD Gateway", "Micro-Ledger", "Solidity"],
      impact:
        "Created peer-to-peer energy monetization gateway allowing mini-grid consumers to trade surplus solar battery hours via mobile money.",
    },
    {
      id: "proj-3",
      title: "AfriScribe — Multilingual Niger-Congo Speech Engine",
      role: "NLP Contributor",
      technologies: ["Hugging Face Transformers", "Whisper", "Python", "Twi / Yoruba Acoustic Models"],
      impact:
        "Trained acoustic phoneme mapping models achieving 89% word error rate reduction for accented English, Pidgin, and Twi spoken commands.",
    },
  ]);

  const [skillsList, setSkillsList] = useState([
    "Python",
    "TypeScript & React",
    "Go (Golang)",
    "PyTorch & TensorFlow",
    "Embedded C++ & ESP32",
    "PostgreSQL & Firebase",
    "Docker & Kubernetes",
    "USSD & Mobile Money APIs",
    "Edge Machine Learning",
    "Distributed Systems",
    "AfCFTA Digital Standards",
  ]);

  const [languagesList, setLanguagesList] = useState([
    { lang: "English", level: "Native / Bilingual" },
    { lang: "Twi (Akan)", level: "Native Fluency" },
    { lang: "French", level: "Professional Working Proficiency (B2)" },
    { lang: "Yoruba", level: "Elementary Working Knowledge" },
  ]);

  // Handle AI Optimization
  const handleAiOptimize = () => {
    setIsAiOptimizing(true);
    setAiSuccessMessage(null);

    setTimeout(() => {
      setIsAiOptimizing(false);
      setSummary(
        `Results-driven Computer Engineering Scholar at ${user.university} with specialized expertise in embedded IoT, distributed cloud infrastructure, and low-resource edge ML. Engineered mission-critical applications across 14 African smart communities with 99.9% uptime. Recognized by the West African STEM Council and Association of African Universities for excellence in indigenous engineering solutions.`
      );
      setAiSuccessMessage("CV successfully optimized with high-impact African industry metrics!");
      setTimeout(() => setAiSuccessMessage(null), 4000);
    }, 1200);
  };

  // Handle Print / PDF
  const handlePrint = () => {
    window.print();
  };

  // Handle Copy Text
  const handleCopyText = () => {
    const textCV = `
${fullName.toUpperCase()}
${headline}
${email} | ${phone} | ${location}
GitHub: ${github} | LinkedIn: ${linkedin}

==================================================
EXECUTIVE SUMMARY
==================================================
${summary}

==================================================
EDUCATION & ACADEMIC ACHIEVEMENTS
==================================================
${educationList
  .map(
    (e) => `${e.degree}
${e.institution} — ${e.location} | ${e.period}
${showGpa ? `GPA: ${e.gpa}\nHonours: ${e.honors}` : ""}`
  )
  .join("\n\n")}

${
  showCoursework
    ? `==================================================
KEY RELEVANT COURSEWORK & CERTIFICATIONS (AFRIVERSTY REGISTRY)
==================================================
${initialCourses
  .slice(0, 4)
  .map((c) => `• ${c.title} (${c.code}) — ${c.institution} [Grade Progress: ${c.progress}%]`)
  .join("\n")}`
    : ""
}

==================================================
PROFESSIONAL EXPERIENCE & LEADERSHIP
==================================================
${experienceList
  .map(
    (exp) => `${exp.role} — ${exp.organization}
${exp.location} | ${exp.period}
${exp.highlights.map((h) => `• ${h}`).join("\n")}`
  )
  .join("\n\n")}

==================================================
KEY ENGINEERING PROJECTS & INNOVATIONS
==================================================
${selectedProjects
  .map(
    (p) => `${p.title} (${p.role})
Technologies: ${p.technologies.join(", ")}
Impact: ${p.impact}`
  )
  .join("\n\n")}

==================================================
TECHNICAL & INDUSTRY SKILLS
==================================================
${skillsList.join(" • ")}

==================================================
LANGUAGES
==================================================
${languagesList.map((l) => `${l.lang} (${l.level})`).join(" | ")}

==================================================
HERITAGE HONOURS & DIGITAL BADGES
==================================================
${user.badges.map((b) => `• ${b.name}: ${b.description} (Earned ${b.dateEarned})`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(textCV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getAccentClass = () => {
    switch (accentColor) {
      case "emerald":
        return {
          primary: "text-emerald-500",
          border: "border-emerald-500",
          bg: "bg-emerald-500",
          bgSubtle: isLightMode ? "bg-emerald-50" : "bg-emerald-950/30",
          badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        };
      case "violet":
        return {
          primary: "text-purple-500",
          border: "border-purple-500",
          bg: "bg-purple-500",
          bgSubtle: isLightMode ? "bg-purple-50" : "bg-purple-950/30",
          badge: "bg-purple-500/10 text-purple-600 border-purple-500/30",
        };
      case "sapphire":
        return {
          primary: "text-blue-500",
          border: "border-blue-500",
          bg: "bg-blue-500",
          bgSubtle: isLightMode ? "bg-blue-50" : "bg-blue-950/30",
          badge: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        };
      default:
        return {
          primary: "text-[#c69a4c]",
          border: "border-[#c69a4c]",
          bg: "bg-[#c69a4c]",
          bgSubtle: isLightMode ? "bg-[#fcfaf5]" : "bg-[#1a1713]",
          badge: "bg-[#c69a4c]/10 text-[#8c6204] border-[#c69a4c]/30",
        };
    }
  };

  const themeStyles = getAccentClass();

  return (
    <div id="resume-builder-root" className="space-y-6">
      {/* Top Controls & African Industry Customization Bar */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border shadow-xl backdrop-blur-md transition-colors ${
          isLightMode
            ? "bg-white border-[#d4af37]/35 text-[#1a1612]"
            : "bg-[#14120f] border-[#d4af37]/25 text-[#e5e2e1]"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#d4af37]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-[#c69a4c]/15 border border-[#c69a4c]/30 text-[#8c6204] dark:text-[#f2ca50]">
              <Sparkles size={13} />
              <span>Pan-African Industry CV Engine</span>
            </div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold tracking-tight">
              African Industry Resume & CV Builder
            </h2>
            <p className="text-xs text-[#736a5c] dark:text-[#a8a29e] mt-1">
              Formatted specifically for continental tech hubs, research councils, AfCFTA enterprises, and global fellowship boards.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="cv-ai-optimize-btn"
              type="button"
              onClick={handleAiOptimize}
              disabled={isAiOptimizing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={14} className={isAiOptimizing ? "animate-spin" : ""} />
              <span>{isAiOptimizing ? "Optimizing CV..." : "AI Metric Enhance"}</span>
            </button>

            <button
              id="cv-copy-text-btn"
              type="button"
              onClick={handleCopyText}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : isLightMode
                  ? "bg-[#f5f2ea] text-[#4a3f32] border-[#d8d0c2] hover:bg-[#eae5d8]"
                  : "bg-[#201d17] text-[#ded8cb] border-[#3c352f] hover:bg-[#2b271f]"
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
            </button>

            <button
              id="cv-print-pdf-btn"
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#c69a4c] to-[#e5bd3b] hover:from-[#d8ad5a] hover:to-[#f2ca50] text-[#050505] flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* AI Feedback Notification */}
        {aiSuccessMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{aiSuccessMessage}</span>
          </div>
        )}

        {/* Templates & Customization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Template Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6e] mb-1.5">
              African Industry Format
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as AfricanIndustryTemplate)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-medium border focus:outline-none focus:ring-1 focus:ring-[#c69a4c] transition-all ${
                isLightMode
                  ? "bg-[#f9f8f5] border-[#d8d0c2] text-[#1a1612]"
                  : "bg-[#1c1914] border-[#3c352f] text-white"
              }`}
            >
              <option value="tech-fintech">Pan-African Tech & FinTech (Mobile/Cloud)</option>
              <option value="agritech-energy">Agritech, Climate Resilience & IoT</option>
              <option value="research-fellowship">Academic Research & Fellowships (AU-CESA)</option>
              <option value="development-policy">African Development & AfCFTA Policy</option>
              <option value="modern-executive">Modern Minimalist Executive</option>
            </select>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6e] mb-1.5">
              Accent Tone
            </label>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAccentColor("gold")}
                className={`w-7 h-7 rounded-full bg-[#c69a4c] transition-transform ${
                  accentColor === "gold" ? "ring-2 ring-offset-2 ring-[#c69a4c] scale-110" : "opacity-70 hover:opacity-100"
                }`}
                title="Sahara Gold"
              />
              <button
                type="button"
                onClick={() => setAccentColor("emerald")}
                className={`w-7 h-7 rounded-full bg-emerald-600 transition-transform ${
                  accentColor === "emerald" ? "ring-2 ring-offset-2 ring-emerald-600 scale-110" : "opacity-70 hover:opacity-100"
                }`}
                title="Rainforest Emerald"
              />
              <button
                type="button"
                onClick={() => setAccentColor("sapphire")}
                className={`w-7 h-7 rounded-full bg-blue-600 transition-transform ${
                  accentColor === "sapphire" ? "ring-2 ring-offset-2 ring-blue-600 scale-110" : "opacity-70 hover:opacity-100"
                }`}
                title="Nile Sapphire"
              />
              <button
                type="button"
                onClick={() => setAccentColor("violet")}
                className={`w-7 h-7 rounded-full bg-purple-600 transition-transform ${
                  accentColor === "violet" ? "ring-2 ring-offset-2 ring-purple-600 scale-110" : "opacity-70 hover:opacity-100"
                }`}
                title="Royal Amethyst"
              />
            </div>
          </div>

          {/* Section Toggles */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6e] mb-1.5">
              Display Sections
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdinkraAccent(!showAdinkraAccent)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  showAdinkraAccent
                    ? "bg-[#c69a4c]/20 text-[#8c6204] dark:text-[#f2ca50] border-[#c69a4c]/40"
                    : "opacity-60 border-transparent"
                }`}
              >
                Adinkra Watermark
              </button>
              <button
                type="button"
                onClick={() => setShowGpa(!showGpa)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  showGpa
                    ? "bg-[#c69a4c]/20 text-[#8c6204] dark:text-[#f2ca50] border-[#c69a4c]/40"
                    : "opacity-60 border-transparent"
                }`}
              >
                GPA & Honours
              </button>
              <button
                type="button"
                onClick={() => setShowCoursework(!showCoursework)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  showCoursework
                    ? "bg-[#c69a4c]/20 text-[#8c6204] dark:text-[#f2ca50] border-[#c69a4c]/40"
                    : "opacity-60 border-transparent"
                }`}
              >
                AfriVersty Courses
              </button>
              <button
                type="button"
                onClick={() => setShowBadges(!showBadges)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  showBadges
                    ? "bg-[#c69a4c]/20 text-[#8c6204] dark:text-[#f2ca50] border-[#c69a4c]/40"
                    : "opacity-60 border-transparent"
                }`}
              >
                Badges & Scores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CV PREVIEW CONTAINER (Ready for High-Quality Print / Export) */}
      <div className="flex justify-center">
        <div
          id="african-industry-cv-sheet"
          className="w-full max-w-[850px] bg-white text-[#1a1612] rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] border border-[#d4af37]/30 p-8 sm:p-12 relative overflow-hidden font-sans-body print:p-0 print:border-none print:shadow-none print:rounded-none print:max-w-none"
        >
          {/* Adinkra Watermark Header Motif */}
          {showAdinkraAccent && (
            <div className="absolute top-0 right-0 p-6 opacity-[0.08] pointer-events-none select-none">
              <svg className="w-44 h-44 text-[#c69a4c]" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M50 15 L85 50 L50 85 L15 50 Z" stroke="currentColor" strokeWidth="3" fill="none" />
                <circle cx="50" cy="50" r="15" fill="currentColor" />
              </svg>
            </div>
          )}

          {/* CV HEADER */}
          <header className="border-b-2 border-[#1a1612]/15 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-[#1a1612] tracking-tight">
                  {fullName}
                </h1>
                <p className={`text-sm sm:text-base font-bold mt-0.5 ${themeStyles.primary}`}>
                  {headline}
                </p>
                <p className="text-xs text-[#594d3f] font-medium mt-0.5">
                  {user.university} &bull; {user.heritageTier} (AfriVersty Verified Scholar)
                </p>
              </div>

              {/* Contact Information */}
              <div className="text-xs text-[#4a3f32] space-y-1 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Mail size={12} className="text-[#8c6204]" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <Phone size={12} className="text-[#8c6204]" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5">
                  <MapPin size={12} className="text-[#8c6204]" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-2 pt-1 text-[11px] text-[#736a5c]">
                  <span>{github}</span> &bull; <span>{linkedin}</span>
                </div>
              </div>
            </div>
          </header>

          {/* EXECUTIVE SUMMARY */}
          <section className="mb-6">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.18em] text-[#8c6204] border-b border-[#8c6204]/30 pb-1 mb-2.5 flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Professional Summary & African Industry Alignment</span>
            </h2>
            <p className="text-xs sm:text-[13px] text-[#2c2419] leading-relaxed font-normal">
              {summary}
            </p>
          </section>

          {/* EDUCATION & ACADEMIC HONORS */}
          <section className="mb-6">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.18em] text-[#8c6204] border-b border-[#8c6204]/30 pb-1 mb-3 flex items-center gap-1.5">
              <GraduationCap size={13} />
              <span>Education & Academic Honours</span>
            </h2>
            <div className="space-y-3">
              {educationList.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold text-[#1a1612]">
                    <span className="text-sm font-serif-title">{edu.degree}</span>
                    <span className="text-[11px] text-[#736a5c]">{edu.period}</span>
                  </div>
                  <div className="text-[#594d3f] font-medium flex items-center justify-between mt-0.5">
                    <span>{edu.institution} — {edu.location}</span>
                    {showGpa && <span className="font-bold text-[#8c6204]">{edu.gpa}</span>}
                  </div>
                  {showGpa && edu.honors && (
                    <div className="text-[11px] text-[#736a5c] mt-1 italic">
                      Honours: {edu.honors}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* RELEVANT COURSEWORK & CERTIFIED TRACKS */}
          {showCoursework && (
            <section className="mb-6">
              <h2 className="text-xs uppercase font-extrabold tracking-[0.18em] text-[#8c6204] border-b border-[#8c6204]/30 pb-1 mb-3 flex items-center gap-1.5">
                <BookOpen size={13} />
                <span>Verified AfriVersty Coursework & Laboratory Milestones</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {initialCourses.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="p-2 rounded-lg bg-[#fbf9f4] border border-[#d8d0c2]/60 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#1a1612] text-[11.5px] leading-tight">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-[#736a5c] mt-0.5">
                        {c.code} &bull; {c.institution}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded shrink-0">
                      {c.progress}% Done
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROFESSIONAL & FIELD EXPERIENCE */}
          <section className="mb-6">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.18em] text-[#8c6204] border-b border-[#8c6204]/30 pb-1 mb-3 flex items-center gap-1.5">
              <Briefcase size={13} />
              <span>Professional & Research Experience</span>
            </h2>
            <div className="space-y-4">
              {experienceList.map((exp) => (
                <div key={exp.id} className="text-xs space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold text-[#1a1612]">
                    <span className="text-sm font-serif-title">{exp.role}</span>
                    <span className="text-[11px] text-[#736a5c]">{exp.period}</span>
                  </div>
                  <div className="text-[#594d3f] font-medium text-[11.5px]">
                    {exp.organization} &bull; {exp.location}
                  </div>
                  <ul className="list-disc list-outside ml-4 text-[11.5px] text-[#3d332a] space-y-1 mt-1 leading-relaxed">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* KEY INNOVATION & INDUSTRY PROJECTS */}
          <section className="mb-6">
            <h2 className="text-xs uppercase font-extrabold tracking-[0.18em] text-[#8c6204] border-b border-[#8c6204]/30 pb-1 mb-3 flex items-center gap-1.5">
              <FolderGit2 size={13} />
              <span>Pan-African Innovation & Capstone Projects</span>
            </h2>
            <div className="space-y-3.5">
              {selectedProjects.map((proj) => (
                <div key={proj.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-[#1a1612]">
                    <span className="text-[12.5px] font-semibold">{proj.title}</span>
                    <span className="text-[10px] text-[#8c6204] bg-[#c69a4c]/10 px-2 py-0.5 rounded font-mono">
                      {proj.role}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#3d332a] leading-relaxed">
                    {proj.impact}
                  </p>
                  <div className="text-[10.5px] text-[#736a5c] font-medium pt-0.5">
                    <span className="font-bold text-[#594d3f]">Stack: </span>
                    {proj.technologies.join(" &bull; ")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SKILLS & LANGUAGES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#1a1612]/15">
            {/* Technical Skills */}
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-[0.15em] text-[#8c6204] mb-2 flex items-center gap-1">
                <Code size={12} />
                <span>Technical & Engineering Skills</span>
              </h3>
              <p className="text-xs text-[#3d332a] leading-relaxed">
                {skillsList.join(" • ")}
              </p>
            </div>

            {/* Languages & Dialects */}
            <div>
              <h3 className="text-xs uppercase font-extrabold tracking-[0.15em] text-[#8c6204] mb-2 flex items-center gap-1">
                <Languages size={12} />
                <span>Languages & Regional Communication</span>
              </h3>
              <div className="space-y-1 text-xs text-[#3d332a]">
                {languagesList.map((lang, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-semibold">{lang.lang}:</span>
                    <span className="text-[11px] text-[#736a5c]">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BADGES & HERITAGE HONORS */}
          {showBadges && user.badges.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#1a1612]/15">
              <h3 className="text-xs uppercase font-extrabold tracking-[0.15em] text-[#8c6204] mb-2 flex items-center gap-1">
                <Award size={12} />
                <span>AfriVersty Digital Credentials & Continental Honors</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {user.badges.map((b) => (
                  <div
                    key={b.id}
                    className="px-2.5 py-1 rounded-lg bg-[#fbf9f4] border border-[#d8d0c2] text-[11px] text-[#4a3f32] flex items-center gap-1.5"
                  >
                    <ShieldCheck size={12} className="text-[#8c6204]" />
                    <span className="font-bold text-[#1a1612]">{b.name}</span>
                    <span className="text-[10px] text-[#736a5c]">({b.dateEarned})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Validation Token */}
          <footer className="mt-8 pt-4 border-t border-dashed border-[#d8d0c2] text-center text-[9.5px] text-[#8c7e6e] flex items-center justify-between">
            <span>Verified Continental Scholar ID: AFRIV-GH-2026-9042</span>
            <span>Accredited via Association of African Universities (AU-CESA Framework)</span>
          </footer>
        </div>
      </div>
    </div>
  );
};
