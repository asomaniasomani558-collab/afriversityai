import React, { useState } from "react";
import {
  X,
  Compass,
  Search,
  ChevronRight,
  Sparkles,
  Award,
  DollarSign,
  Briefcase,
  Layers,
  ExternalLink,
  GraduationCap,
  Globe2,
  Cpu,
  Zap,
  HeartPulse,
  ShieldAlert,
  Building2,
  Satellite,
  Sprout,
  Gem,
  CheckCircle2,
} from "lucide-react";
import {
  COMPREHENSIVE_CAREER_DATABASE,
  CAREER_CATEGORIES,
  CareerPathwayItem,
} from "../data/careerPathwaysDatabase";

interface CareerPathwaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPathway: (pathway: CareerPathwayItem) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Layers size={14} />,
  "AI & Data": <Cpu size={14} />,
  "Software & Cloud": <Globe2 size={14} />,
  "Cybersecurity & Fintech": <ShieldAlert size={14} />,
  "Clean Energy & Power": <Zap size={14} />,
  "Biomedical & Health": <HeartPulse size={14} />,
  "Robotics & Hardware": <Cpu size={14} />,
  "Civil & Infrastructure": <Building2 size={14} />,
  "Aerospace & Telecom": <Satellite size={14} />,
  "Agritech & Environmental": <Sprout size={14} />,
  "Mining & Materials": <Gem size={14} />,
};

export const CareerPathwaysModal: React.FC<CareerPathwaysModalProps> = ({
  isOpen,
  onClose,
  onSelectPathway,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePathway, setActivePathway] = useState<CareerPathwayItem>(
    COMPREHENSIVE_CAREER_DATABASE[0]
  );
  const [activeTab, setActiveTab] = useState<"short" | "mid" | "long">("short");

  if (!isOpen) return null;

  const filteredPathways = COMPREHENSIVE_CAREER_DATABASE.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyToolsAndTech.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      item.topHiringCompanies.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="career-pathways-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="career-pathways-modal-content"
        className="bg-[#14110e] border border-[#d4af37]/35 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#e5e2e1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#d4af37]/20 flex items-center justify-between bg-gradient-to-r from-[#1c1813] via-[#16130f] to-[#120f0c]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/20 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.25)]">
              <Compass size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-title text-[#f2ca50]">
                  Pan-African & Global STEM Career Pathways Database
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] font-mono font-bold border border-[#f2ca50]/30 hidden sm:inline">
                  {COMPREHENSIVE_CAREER_DATABASE.length} Comprehensive Disciplines
                </span>
              </div>
              <p className="text-xs text-[#99907c] mt-0.5 font-sans-body">
                Detailed chronological roadmaps with salary benchmarks, certifications, portfolio architectures, and AI mentor guidance
              </p>
            </div>
          </div>

          <button
            id="close-career-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#201c17] hover:bg-[#2e2820] text-[#99907c] hover:text-[#f2ca50] border border-[#d4af37]/20 flex items-center justify-center transition-all cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-[#d4af37]/15 bg-[#171410] flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]"
            />
            <input
              id="career-db-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, tools, skills (e.g., PyTorch, Solar, Rust)..."
              className="w-full bg-[#1e1a15] border border-[#d4af37]/25 focus:border-[#f2ca50] text-xs rounded-xl pl-9 pr-3 py-2 text-[#e5e2e1] placeholder-[#7a7263] focus:outline-none transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {CAREER_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`career-cat-filter-${cat.replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md"
                      : "bg-[#1f1a14] text-[#99907c] hover:text-[#ded8cb] hover:bg-[#282218] border border-[#d4af37]/15"
                  }`}
                >
                  {CATEGORY_ICONS[cat] || <Layers size={12} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body: Left List + Right Detail View */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left: Career Pathway List */}
          <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-[#d4af37]/15 overflow-y-auto p-3 space-y-2 bg-[#120f0c]/60 max-h-56 lg:max-h-none">
            <div className="text-[11px] font-bold text-[#99907c] px-2 py-1 uppercase tracking-wider flex items-center justify-between">
              <span>Matching Pathways ({filteredPathways.length})</span>
            </div>

            {filteredPathways.map((pathway) => {
              const isSelected = activePathway.id === pathway.id;
              return (
                <div
                  key={pathway.id}
                  id={`pathway-item-${pathway.id}`}
                  onClick={() => setActivePathway(pathway)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#251f17] border-[#f2ca50] text-[#f2ca50] shadow-md"
                      : "bg-[#181410] border-[#d4af37]/15 hover:border-[#d4af37]/40 text-[#ded8cb] hover:bg-[#1f1a14]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold leading-tight font-serif-title">
                      {pathway.title}
                    </h3>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                        pathway.growthDemand === "Exponential"
                          ? "bg-purple-950 text-purple-300 border border-purple-700/40"
                          : pathway.growthDemand === "Critical"
                          ? "bg-amber-950 text-amber-300 border border-amber-700/40"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-700/40"
                      }`}
                    >
                      {pathway.growthDemand}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#99907c] mt-1 line-clamp-2 font-sans-body">
                    {pathway.shortDescription}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#b8ad96]">
                    <span className="font-mono text-[#f2ca50]">
                      {pathway.salaryRange.globalRemoteUSD}
                    </span>
                    <span className="flex items-center gap-1 text-[#d4af37]">
                      Explore <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredPathways.length === 0 && (
              <div className="p-8 text-center text-[#99907c] text-xs">
                No career pathways matching "{searchQuery}".
              </div>
            )}
          </div>

          {/* Right: Detailed Pathway Roadmap Deep-Dive */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#14110e]">
            {/* Active Pathway Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30">
                    {activePathway.category}
                  </span>
                  <span className="text-[10px] text-[#99907c]">
                    Discipline: {activePathway.discipline}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif-title text-[#f2ca50]">
                  {activePathway.title}
                </h1>
                <p className="text-xs sm:text-sm text-[#ded8cb] mt-1 font-sans-body leading-relaxed max-w-3xl">
                  {activePathway.shortDescription}
                </p>
              </div>

              {/* Action: Consult AI Mentor Button */}
              <button
                id={`consult-mentor-btn-${activePathway.id}`}
                onClick={() => {
                  onSelectPathway(activePathway);
                  onClose();
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#f2ca50] to-[#e6b830] text-[#3c2f00] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(242,202,80,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 self-start sm:self-center"
              >
                <Sparkles size={16} />
                <span>Launch AI Mentor Roadmap</span>
              </button>
            </div>

            {/* Salary Benchmark & African Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Compensation Box */}
              <div className="p-4 rounded-2xl bg-[#1b1712] border border-[#d4af37]/25 space-y-2">
                <div className="flex items-center gap-2 text-[#f2ca50] text-xs font-bold">
                  <DollarSign size={15} />
                  <span>Verified Salary & Compensation Benchmarks</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[#ded8cb]">
                    <span className="text-[#99907c]">African Tech Hubs:</span>
                    <span className="font-semibold text-white">
                      {activePathway.salaryRange.africanHubs}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#ded8cb]">
                    <span className="text-[#99907c]">Global Remote (USD):</span>
                    <span className="font-semibold text-[#f2ca50] font-mono">
                      {activePathway.salaryRange.globalRemoteUSD}
                    </span>
                  </div>
                </div>
              </div>

              {/* African Real-World Impact */}
              <div className="p-4 rounded-2xl bg-[#1b1712] border border-[#d4af37]/25 space-y-2">
                <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold">
                  <Globe2 size={15} />
                  <span>Continental Impact & Innovation</span>
                </div>
                <p className="text-xs text-[#ded8cb] leading-relaxed">
                  {activePathway.africanRealWorldImpact}
                </p>
              </div>
            </div>

            {/* Milestone Chronological Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                <h3 className="text-sm font-bold text-[#f2ca50] uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} />
                  <span>Chronological Career Milestones</span>
                </h3>

                {/* Milestone Tab Switches */}
                <div className="flex items-center gap-1 bg-[#1c1813] p-1 rounded-xl border border-[#d4af37]/20">
                  <button
                    onClick={() => setActiveTab("short")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "short"
                        ? "bg-[#f2ca50] text-[#3c2f00] font-bold"
                        : "text-[#99907c] hover:text-[#ded8cb]"
                    }`}
                  >
                    0–6 Months
                  </button>
                  <button
                    onClick={() => setActiveTab("mid")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "mid"
                        ? "bg-[#f2ca50] text-[#3c2f00] font-bold"
                        : "text-[#99907c] hover:text-[#ded8cb]"
                    }`}
                  >
                    1–3 Years
                  </button>
                  <button
                    onClick={() => setActiveTab("long")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === "long"
                        ? "bg-[#f2ca50] text-[#3c2f00] font-bold"
                        : "text-[#99907c] hover:text-[#ded8cb]"
                    }`}
                  >
                    3–5+ Years
                  </button>
                </div>
              </div>

              {/* Tab 1: Short Term */}
              {activeTab === "short" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1712] border border-[#d4af37]/25 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Phase 1: {activePathway.shortTermMilestones.period} (Foundations & Entry)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1.5">
                        Core Competencies to Master:
                      </span>
                      <ul className="space-y-1 text-xs text-[#ded8cb]">
                        {activePathway.shortTermMilestones.foundations.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-[#f2ca50] shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1.5">
                        Recommended Certifications:
                      </span>
                      <ul className="space-y-1 text-xs text-[#ded8cb]">
                        {activePathway.shortTermMilestones.certifications.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Award size={13} className="text-purple-400 shrink-0 mt-0.5" />
                            <span className="font-semibold text-purple-200">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Portfolio Project Box */}
                  <div className="p-3.5 rounded-xl bg-[#231d16] border border-[#d4af37]/30">
                    <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1">
                      🏗️ High-Impact Beginner Portfolio Project:
                    </span>
                    <p className="text-xs text-[#e5e2e1] leading-relaxed">
                      {activePathway.shortTermMilestones.portfolioProject}
                    </p>
                  </div>

                  {/* Target Job Titles */}
                  <div>
                    <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-wider block mb-1.5">
                      Target Entry Job Titles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePathway.shortTermMilestones.targetJobTitles.map((job, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#252019] border border-[#d4af37]/20 text-[11px] text-[#e5e2e1] font-semibold"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Mid Term */}
              {activeTab === "mid" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1712] border border-[#d4af37]/25 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Phase 2: {activePathway.midTermMilestones.period} (Systems & Professional Scale)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1.5">
                        Advanced Production Skills:
                      </span>
                      <ul className="space-y-1 text-xs text-[#ded8cb]">
                        {activePathway.midTermMilestones.advancedSkills.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-[#f2ca50] shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1.5">
                        Professional & Speciality Certifications:
                      </span>
                      <ul className="space-y-1 text-xs text-[#ded8cb]">
                        {activePathway.midTermMilestones.certifications.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Award size={13} className="text-purple-400 shrink-0 mt-0.5" />
                            <span className="font-semibold text-purple-200">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Portfolio Project */}
                  <div className="p-3.5 rounded-xl bg-[#231d16] border border-[#d4af37]/30">
                    <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1">
                      🚀 Advanced Production Portfolio Architecture:
                    </span>
                    <p className="text-xs text-[#e5e2e1] leading-relaxed">
                      {activePathway.midTermMilestones.portfolioProject}
                    </p>
                  </div>

                  {/* Target Mid Titles */}
                  <div>
                    <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-wider block mb-1.5">
                      Target Mid-Level Titles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePathway.midTermMilestones.targetJobTitles.map((job, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#252019] border border-[#d4af37]/20 text-[11px] text-[#e5e2e1] font-semibold"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Long Term */}
              {activeTab === "long" && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1712] border border-[#d4af37]/25 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Phase 3: {activePathway.longTermMilestones.period} (Staff/Principal & Fellowships)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1.5">
                        Leadership & Architectural Focus:
                      </span>
                      <ul className="space-y-1 text-xs text-[#ded8cb]">
                        {activePathway.longTermMilestones.leadershipFocus.map((l, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={13} className="text-[#f2ca50] shrink-0 mt-0.5" />
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider block mb-1.5">
                        Global Fellowships & Fully-Funded Scholarships:
                      </span>
                      <ul className="space-y-1 text-xs text-[#ded8cb]">
                        {activePathway.longTermMilestones.fellowshipsAndScholarships.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <GraduationCap size={13} className="text-amber-400 shrink-0 mt-0.5" />
                            <span className="font-semibold text-amber-200">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Target Senior Titles */}
                  <div>
                    <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-wider block mb-1.5">
                      Target Senior / Principal Job Titles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePathway.longTermMilestones.targetJobTitles.map((job, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-[#252019] border border-[#d4af37]/20 text-[11px] text-[#e5e2e1] font-semibold"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tools & Hiring Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#181410] border border-[#d4af37]/15">
                <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-wider block mb-2">
                  🛠️ Key Tools, Frameworks & Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePathway.keyToolsAndTech.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-[#221c15] text-[#ded8cb] text-[11px] font-mono border border-[#d4af37]/15"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#181410] border border-[#d4af37]/15">
                <span className="text-[11px] font-bold text-[#99907c] uppercase tracking-wider block mb-2">
                  🏢 Leading Employers & Research Institutes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activePathway.topHiringCompanies.map((comp, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-[#221c15] text-[#f2ca50] text-[11px] font-semibold border border-[#d4af37]/15"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
