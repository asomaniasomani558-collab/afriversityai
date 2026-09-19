import React, { useState } from "react";
import { StudentProfile } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import { StudentCard } from "./StudentCard";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Users,
  Globe,
  GraduationCap,
  Briefcase,
  Code,
  Languages,
  Calendar,
  Award,
  Zap,
} from "lucide-react";

interface StudentDiscoveryViewProps {
  onViewProfile: (student: StudentProfile) => void;
  onOpenReport?: (student: StudentProfile) => void;
}

export const StudentDiscoveryView: React.FC<StudentDiscoveryViewProps> = ({
  onViewProfile,
  onOpenReport,
}) => {
  const {
    filteredStudents,
    filterState,
    setFilterState,
    resetFilters,
    students,
  } = useCommunity();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Preset filter helper
  const applyPreset = (preset: string) => {
    resetFilters();
    switch (preset) {
      case "ai-ml":
        setFilterState({ interest: "Artificial Intelligence" });
        break;
      case "ghana":
        setFilterState({ country: "Ghana" });
        break;
      case "nigeria":
        setFilterState({ country: "Nigeria" });
        break;
      case "east-africa":
        setFilterState({ country: "Kenya" });
        break;
      case "scholarships":
        setFilterState({ opportunityInterest: "Master's Scholarships" });
        break;
      case "hackathons":
        setFilterState({ competitionInterest: "Zindi Africa ML" });
        break;
      case "online":
        setFilterState({ onlineOnly: true });
        break;
      default:
        resetFilters();
        break;
    }
  };

  const countries = ["Ghana", "Nigeria", "Kenya", "South Africa", "Uganda", "Rwanda", "Egypt", "Senegal"];
  const universities = [
    "University of Ghana",
    "KNUST",
    "University of Lagos",
    "University of Cape Town",
    "University of Nairobi",
    "Makerere University",
    "African Leadership University",
    "Cairo University",
    "Université Cheikh Anta Diop",
  ];
  const fields = [
    "Artificial Intelligence",
    "Computer Science",
    "Computer Engineering",
    "Software Engineering",
    "Biomedical Engineering",
    "Data Science",
    "Astrophysics",
    "Robotics",
    "Mechatronics",
    "Cybersecurity",
  ];
  const skillsList = [
    "Python",
    "PyTorch",
    "Go (Golang)",
    "TypeScript",
    "React",
    "ROS 2",
    "TensorFlow",
    "Qiskit",
    "Docker",
    "Kubernetes",
    "C++",
  ];
  const interestsList = [
    "Artificial Intelligence",
    "African NLP",
    "CleanTech",
    "FinTech",
    "Women in STEM",
    "Quantum Computing",
    "Bioinformatics",
    "Robotics",
    "Cybersecurity",
  ];
  const languagesList = ["English", "French", "Swahili", "Arabic", "Twi", "Yoruba", "isiZulu"];
  const graduationYears = ["2025", "2026", "2027", "2028"];

  const activeFiltersCount =
    (filterState.country !== "all" ? 1 : 0) +
    (filterState.university !== "all" ? 1 : 0) +
    (filterState.fieldOfStudy !== "all" ? 1 : 0) +
    (filterState.careerGoal !== "all" ? 1 : 0) +
    (filterState.skill !== "all" ? 1 : 0) +
    (filterState.interest !== "all" ? 1 : 0) +
    (filterState.language !== "all" ? 1 : 0) +
    (filterState.graduationYear !== "all" ? 1 : 0) +
    (filterState.opportunityInterest !== "all" ? 1 : 0) +
    (filterState.competitionInterest !== "all" ? 1 : 0) +
    (filterState.onlineOnly ? 1 : 0) +
    (filterState.matchThreshold > 0 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Control Bar */}
      <div className="bg-[#14120e]/90 border border-[#d4af37]/25 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        {/* Main Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a29e] group-focus-within:text-[#f59e0b] transition-colors pointer-events-none"
            />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => setFilterState({ searchQuery: e.target.value })}
              placeholder="Search African scholars by name, university, skills, research, country..."
              className="w-full bg-[#1e1a14] border border-[#3c3427] focus:border-[#f2ca50] rounded-xl py-3 pl-11 pr-10 text-sm text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none focus:ring-1 focus:ring-[#f2ca50]/40 transition-all shadow-inner"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => setFilterState({ searchQuery: "" })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c827a] hover:text-[#f5f5f4]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-[#f2ca50] text-[#0c0a09] border-[#f2ca50]"
                : "bg-[#1e1a14] text-[#d6d3d1] border-[#3c3427] hover:border-[#f2ca50]/50"
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#0c0a09] text-[#f2ca50] text-xs flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Filter Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none text-xs">
          <span className="text-[#a8a29e] text-[11px] uppercase font-bold shrink-0">
            Quick:
          </span>
          <button
            onClick={() => applyPreset("all")}
            className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
              activeFiltersCount === 0 && !filterState.searchQuery
                ? "bg-[#f2ca50] text-[#0c0a09] font-bold"
                : "bg-[#1f1b15] text-[#d0c5af] hover:bg-[#2a241b] border border-[#3c3427]"
            }`}
          >
            All Scholars ({students.length})
          </button>
          <button
            onClick={() => applyPreset("ai-ml")}
            className="px-3 py-1 rounded-full whitespace-nowrap font-medium bg-[#1f1b15] hover:bg-[#2a241b] border border-[#3c3427] text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1.5 transition-all"
          >
            <Sparkles size={12} className="text-[#9333ea]" />
            <span>AI & NLP</span>
          </button>
          <button
            onClick={() => applyPreset("ghana")}
            className="px-3 py-1 rounded-full whitespace-nowrap font-medium bg-[#1f1b15] hover:bg-[#2a241b] border border-[#3c3427] text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1.5 transition-all"
          >
            <span>🇬🇭 Ghana</span>
          </button>
          <button
            onClick={() => applyPreset("nigeria")}
            className="px-3 py-1 rounded-full whitespace-nowrap font-medium bg-[#1f1b15] hover:bg-[#2a241b] border border-[#3c3427] text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1.5 transition-all"
          >
            <span>🇳🇬 Nigeria</span>
          </button>
          <button
            onClick={() => applyPreset("east-africa")}
            className="px-3 py-1 rounded-full whitespace-nowrap font-medium bg-[#1f1b15] hover:bg-[#2a241b] border border-[#3c3427] text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1.5 transition-all"
          >
            <span>🇰🇪 East Africa</span>
          </button>
          <button
            onClick={() => applyPreset("scholarships")}
            className="px-3 py-1 rounded-full whitespace-nowrap font-medium bg-[#1f1b15] hover:bg-[#2a241b] border border-[#3c3427] text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1.5 transition-all"
          >
            <Award size={12} className="text-[#f59e0b]" />
            <span>Scholarship Targets</span>
          </button>
          <button
            onClick={() => applyPreset("online")}
            className="px-3 py-1 rounded-full whitespace-nowrap font-medium bg-[#1f1b15] hover:bg-[#2a241b] border border-[#3c3427] text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1.5 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Online Now</span>
          </button>
        </div>

        {/* Expandable Advanced Multi-Attribute Filters Drawer */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-[#2d271f] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-in fade-in duration-150 text-xs">
            {/* Country */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Country
              </label>
              <select
                value={filterState.country}
                onChange={(e) => setFilterState({ country: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All African Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* University */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                University
              </label>
              <select
                value={filterState.university}
                onChange={(e) => setFilterState({ university: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All Universities</option>
                {universities.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Field of Study
              </label>
              <select
                value={filterState.fieldOfStudy}
                onChange={(e) => setFilterState({ fieldOfStudy: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All Disciplines</option>
                {fields.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Skills */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Skill
              </label>
              <select
                value={filterState.skill}
                onChange={(e) => setFilterState({ skill: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All Skills</option>
                {skillsList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Interests & Subfields
              </label>
              <select
                value={filterState.interest}
                onChange={(e) => setFilterState({ interest: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All Interests</option>
                {interestsList.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Language
              </label>
              <select
                value={filterState.language}
                onChange={(e) => setFilterState({ language: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All Languages</option>
                {languagesList.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Graduation Year
              </label>
              <select
                value={filterState.graduationYear}
                onChange={(e) => setFilterState({ graduationYear: e.target.value })}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-lg p-2 focus:border-[#f2ca50] focus:outline-none"
              >
                <option value="all">All Years</option>
                {graduationYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Compatibility Threshold */}
            <div>
              <label className="block text-[11px] text-[#a8a29e] uppercase font-bold mb-1">
                Min Match % ({filterState.matchThreshold}%)
              </label>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={filterState.matchThreshold}
                onChange={(e) => setFilterState({ matchThreshold: Number(e.target.value) })}
                className="w-full accent-[#f2ca50] cursor-pointer mt-2"
              />
            </div>

            {/* Reset Action */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-end gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg bg-[#241f19] hover:bg-[#2e271e] text-[#d6d3d1] hover:text-[#f2ca50] flex items-center gap-1.5 transition-colors text-xs font-semibold"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Results Header (Count & Live Info) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-[#f5f5f4] font-serif-title">
            Discover African Scholars
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] text-xs font-bold border border-[#f2ca50]/30">
            {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"}
          </span>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#f2ca50] hover:underline flex items-center gap-1"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewProfile={onViewProfile}
              onOpenReport={onOpenReport}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#14120e]/60 border border-[#2d271f] rounded-3xl space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#241f19] text-[#a8a29e] flex items-center justify-center mx-auto">
            <Users size={24} />
          </div>
          <h4 className="text-base font-bold text-[#f5f5f4]">
            No scholars match your current search filters
          </h4>
          <p className="text-xs text-[#a8a29e] max-w-md mx-auto">
            Try broadening your university, country, or skill filters to explore other brilliant African students.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#f2ca50] text-[#0c0a09] text-xs font-bold hover:bg-[#d97706] transition-colors shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
