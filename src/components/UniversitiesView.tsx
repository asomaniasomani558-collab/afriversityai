import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  Users,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  BookOpen,
  Filter,
  Globe2,
} from "lucide-react";
import { University } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { RealLeafletMap } from "./RealLeafletMap";

interface UniversitiesViewProps {
  universities: University[];
}

export const UniversitiesView: React.FC<UniversitiesViewProps> = ({ universities }) => {
  const { t } = useLanguage();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"ranking" | "established" | "students" | "name">("ranking");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isApplyingUniversity, setIsApplyingUniversity] = useState<University | null>(null);
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // Region filters with counts matching UI mockup
  const regionOptions = [
    { key: "All", label: "All Regions", count: 124 },
    { key: "West Africa", label: "West Africa", count: 42 },
    { key: "East Africa", label: "East Africa", count: 38 },
    { key: "Southern Africa", label: "Southern Africa", count: 25 },
    { key: "North Africa", label: "North Africa", count: 19 },
  ];

  // Academic Focus filters
  const focusPills = [
    "Technology",
    "Business",
    "Arts & Humanities",
    "Medicine",
    "Engineering",
  ];

  // Filter logic
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      // Search query match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.focusAreas.some((f) => f.toLowerCase().includes(q));

      // Region match
      const matchesRegion = selectedRegion === "All" || u.region === selectedRegion;

      // Focus area match
      const matchesFocus =
        !selectedFocus ||
        u.focusAreas.some((f) => {
          const lower = f.toLowerCase();
          const target = selectedFocus.toLowerCase();
          if (target === "technology") return lower.includes("tech") || lower.includes("computer") || lower.includes("software") || lower.includes("data");
          if (target === "engineering") return lower.includes("engin") || lower.includes("robotics") || lower.includes("civil");
          if (target === "business") return lower.includes("business") || lower.includes("commerce") || lower.includes("econ") || lower.includes("finance");
          if (target === "medicine") return lower.includes("med") || lower.includes("health") || lower.includes("pharm") || lower.includes("biomed");
          if (target === "arts & humanities") return lower.includes("art") || lower.includes("law") || lower.includes("social") || lower.includes("studies");
          return lower.includes(target);
        });

      return matchesSearch && matchesRegion && matchesFocus;
    });
  }, [universities, searchQuery, selectedRegion, selectedFocus]);

  // Sort logic
  const sortedUniversities = useMemo(() => {
    return [...filteredUniversities].sort((a, b) => {
      if (sortBy === "ranking") {
        if (a.rankBadge?.includes("#1")) return -1;
        if (b.rankBadge?.includes("#1")) return 1;
        return (a.acceptanceRate || "50%").localeCompare(b.acceptanceRate || "50%");
      }
      if (sortBy === "established") {
        return a.established - b.established;
      }
      if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === "students") {
        const numA = parseInt(a.studentsCount.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.studentsCount.replace(/\D/g, "")) || 0;
        return numB - numA;
      }
      return 0;
    });
  }, [filteredUniversities, sortBy]);

  // Ensure first 3 items match image 2 layout when on page 1
  const displayUniversities = sortedUniversities;

  // Pagination (3 cards per page + 1 explore location card on page 1)
  const itemsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(displayUniversities.length / itemsPerPage));
  const paginatedUniversities = displayUniversities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div id="pan-africa-universities-view" className="w-full max-w-7xl mx-auto space-y-10 pb-16 animate-fadeIn">
      {/* 1. Hero Header & Search Section */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4 sm:pt-6">
        <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#f2ca50] tracking-tight max-w-3xl leading-tight">
          Academic Excellence Across the Continent
        </h1>
        <p className="text-sm sm:text-base text-[#d0c5af] max-w-2xl font-sans-body leading-relaxed">
          Discover and connect with prestigious institutions shaping the future of African leadership and innovation.
        </p>

        {/* Search Bar matching Image 2 */}
        <div className="w-full max-w-2xl mt-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center bg-[#181614] border border-[#3c352f] hover:border-[#f2ca50]/50 focus-within:border-[#f2ca50] rounded-2xl p-1.5 shadow-2xl transition-all"
          >
            <div className="flex items-center pl-3.5 pr-2 text-[#99907c]">
              <Search size={18} />
            </div>
            <input
              id="universities-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by university name, program, or location..."
              className="flex-1 bg-transparent text-sm text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none font-sans-body py-2"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#99907c] hover:text-[#f5f5f4] p-1.5 mr-1"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer font-sans-body"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filters Sidebar */}
        <div className="lg:col-span-3 space-y-7">
          {/* SELECT REGION */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#99907c] block mb-3 font-sans-body">
              SELECT REGION
            </span>
            <div className="space-y-1.5">
              {regionOptions.map((reg) => {
                const isActive = selectedRegion === reg.key;
                return (
                  <button
                    key={reg.key}
                    id={`filter-region-${reg.key.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => {
                      setSelectedRegion(reg.key);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#2a241b] text-[#f2ca50] border border-[#f2ca50]/60 shadow-[0_0_12px_rgba(242,202,80,0.15)] font-semibold"
                        : "bg-transparent hover:bg-[#1c1a17] text-[#d0c5af] border border-transparent"
                    }`}
                  >
                    <span>{reg.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md ${
                        isActive
                          ? "bg-[#f2ca50] text-[#1c1917] font-bold"
                          : "bg-[#25221d] text-[#99907c]"
                      }`}
                    >
                      {reg.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACADEMIC FOCUS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#99907c] font-sans-body">
                ACADEMIC FOCUS
              </span>
              {selectedFocus && (
                <button
                  onClick={() => setSelectedFocus(null)}
                  className="text-[10px] text-[#f2ca50] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {focusPills.map((focus) => {
                const isSelected = selectedFocus === focus;
                return (
                  <button
                    key={focus}
                    id={`filter-focus-${focus.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    onClick={() => {
                      setSelectedFocus(isSelected ? null : focus);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                      isSelected
                        ? "bg-[#f2ca50] text-[#1c1917] font-bold shadow-md"
                        : "bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50]/50 hover:text-white"
                    }`}
                  >
                    {focus}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Partner With Us Card */}
          <div className="bg-gradient-to-b from-[#1c1917] to-[#141210] rounded-2xl p-5 border border-[#3c352f] shadow-lg relative overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#282218] border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] mb-3">
              <Building2 size={18} />
            </div>
            <h3 className="font-serif-title text-base font-bold text-[#f5f5f4]">
              Partner With Us
            </h3>
            <p className="text-xs text-[#a8a29e] mt-1.5 mb-4 leading-relaxed font-sans-body">
              Are you an institution looking to attract top talent? Join our network.
            </p>
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="text-xs font-bold text-[#f2ca50] hover:text-[#ffe088] flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Learn More</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Featured Institutions Header & 2x2 Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Title & Sort */}
          <div className="flex items-center justify-between border-b border-[#292524] pb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-serif-title text-2xl font-bold text-[#f5f5f4]">
                Featured Institutions
              </h2>
              <span className="text-xs text-[#99907c] font-sans-body">
                ({filteredUniversities.length} institutions)
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-sans-body">
              <span className="text-[#a8a29e]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1c1917] border border-[#3c352f] text-[#f2ca50] font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
              >
                <option value="ranking" className="bg-[#1c1917] text-[#f2ca50]">Ranking</option>
                <option value="established" className="bg-[#1c1917] text-[#ded8cb]">Oldest Established</option>
                <option value="students" className="bg-[#1c1917] text-[#ded8cb]">Student Population</option>
                <option value="name" className="bg-[#1c1917] text-[#ded8cb]">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* 2x2 Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Render First 3 Paginated University Cards */}
            {paginatedUniversities.map((uni) => (
              <div
                key={uni.id}
                id={`university-card-${uni.id}`}
                className="bg-[#161412] rounded-3xl border border-[#3c352f] hover:border-[#f2ca50]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl group hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
              >
                <div>
                  {/* Hero Campus Photo with Badges */}
                  <div className="h-52 w-full relative overflow-hidden bg-[#1c1917]">
                    <img
                      src={uni.imageUrl}
                      alt={uni.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Location Badge (Top-Left) */}
                    <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                      <MapPin size={12} className="text-[#f2ca50]" />
                      <span>{uni.location}, {uni.country === "South Africa" ? "SA" : uni.country}</span>
                    </div>

                    {/* Rank Badge (Top-Right) */}
                    {uni.rankBadge && (
                      <div className="absolute top-3.5 right-3.5 bg-[#f2ca50] text-[#1c1917] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                        {uni.rankBadge}
                      </div>
                    )}

                    {/* Initials Badge overlapping bottom-left of hero */}
                    <div className="absolute -bottom-3 left-5 w-14 h-14 rounded-xl bg-[#141210] border-2 border-[#f2ca50]/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] flex items-center justify-center z-10">
                      <span className="font-serif-title font-bold text-xs sm:text-sm text-[#f2ca50] tracking-wider text-center px-1">
                        {uni.shortName}
                      </span>
                    </div>
                  </div>

                  {/* University Body Info */}
                  <div className="pt-6 px-5 pb-4">
                    <h3
                      onClick={() => setSelectedUniversity(uni)}
                      className="font-serif-title text-xl font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors cursor-pointer leading-snug"
                    >
                      {uni.fullName}
                    </h3>
                    <p className="text-xs text-[#a8a29e] mt-2 line-clamp-3 leading-relaxed font-sans-body">
                      {uni.description}
                    </p>

                    {/* Established & Students Stats Row */}
                    <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-[#292524] text-xs font-sans-body">
                      <div>
                        <span className="text-[11px] text-[#78716c] block">Established</span>
                        <span className="font-bold text-[#f5f5f4] text-sm mt-0.5 block">{uni.established}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#78716c] block">Students</span>
                        <span className="font-bold text-[#f5f5f4] text-sm mt-0.5 block">{uni.studentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="p-5 pt-0 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUniversity(uni)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#201c18] hover:bg-[#2c2620] text-[#ded8cb] hover:text-white border border-[#3c352f] text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsApplyingUniversity(uni);
                      setIsApplicationSubmitted(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] text-xs font-bold shadow-md transition-all text-center cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}

            {/* Card 4: Explore by Location Real-World Geospatial Map Card */}
            <div
              id="explore-by-location-map-card"
              className="h-[420px] rounded-3xl overflow-hidden shadow-xl"
            >
              <RealLeafletMap
                universities={universities}
                isCompact={true}
                onExpand={() => setIsMapModalOpen(true)}
                onSelectUniversity={(uni) => setSelectedUniversity(uni)}
                onApplyUniversity={(uni) => {
                  setIsApplyingUniversity(uni);
                  setIsApplicationSubmitted(false);
                }}
              />
            </div>
          </div>

          {/* 3. Bottom Pagination Bar matching Image 2 */}
          <div className="flex items-center justify-center gap-2 pt-8 pb-4">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50] hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page 1 (Active Gold) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 1
                  ? "bg-[#f2ca50] text-[#1c1917] shadow-md"
                  : "bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50]"
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 2
                  ? "bg-[#f2ca50] text-[#1c1917] shadow-md"
                  : "bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50]"
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 3
                  ? "bg-[#f2ca50] text-[#1c1917] shadow-md"
                  : "bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50]"
              }`}
            >
              3
            </button>

            {/* Ellipsis */}
            <span className="text-[#78716c] px-1 text-xs">...</span>

            {/* Page 12 */}
            <button
              onClick={() => setCurrentPage(12)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 12
                  ? "bg-[#f2ca50] text-[#1c1917] shadow-md"
                  : "bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50]"
              }`}
            >
              12
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
              disabled={currentPage === 12}
              className="w-9 h-9 rounded-xl bg-[#1c1917] text-[#d0c5af] border border-[#3c352f] hover:border-[#f2ca50] hover:text-white disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. University Profile Detail Modal */}
      {selectedUniversity && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="university-detail-modal"
            className="bg-[#181614] border border-[#d4af37]/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn"
          >
            <button
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-white p-2 rounded-full bg-[#201c18] border border-[#3c352f] transition-all"
            >
              <X size={18} />
            </button>

            {/* Modal Campus Hero */}
            <div className="h-56 rounded-2xl overflow-hidden mb-6 relative">
              <img
                src={selectedUniversity.imageUrl}
                alt={selectedUniversity.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-black/40" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="bg-[#f2ca50] text-[#1c1917] text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                  {selectedUniversity.region}
                </span>
                {selectedUniversity.rankBadge && (
                  <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-md border border-white/20">
                    {selectedUniversity.rankBadge}
                  </span>
                )}
              </div>
            </div>

            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#f5f5f4]">
              {selectedUniversity.fullName} ({selectedUniversity.shortName})
            </h2>
            <p className="text-xs text-[#f2ca50] font-semibold mt-1 flex items-center gap-1.5">
              <MapPin size={14} />
              {selectedUniversity.location}, {selectedUniversity.country} &bull; Founded in {selectedUniversity.established}
            </p>

            <p className="text-xs sm:text-sm text-[#d0c5af] mt-4 leading-relaxed font-sans-body">
              {selectedUniversity.description}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3.5 my-6">
              <div className="p-3.5 bg-[#201c18] rounded-xl border border-[#3c352f]">
                <span className="text-[10px] text-[#99907c] uppercase font-bold">Total Students</span>
                <div className="text-sm sm:text-base font-bold text-[#f5f5f4] mt-0.5">{selectedUniversity.studentsCount}</div>
              </div>
              <div className="p-3.5 bg-[#201c18] rounded-xl border border-[#3c352f]">
                <span className="text-[10px] text-[#99907c] uppercase font-bold">Acceptance Rate</span>
                <div className="text-sm sm:text-base font-bold text-[#f2ca50] mt-0.5">{selectedUniversity.acceptanceRate || "Competitive"}</div>
              </div>
              <div className="p-3.5 bg-[#201c18] rounded-xl border border-[#3c352f]">
                <span className="text-[10px] text-[#99907c] uppercase font-bold">Status</span>
                <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">Accredited</div>
              </div>
            </div>

            {/* Focus Faculties */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ded8cb] mb-2.5">
                Flagship Academic Faculties & Research Centers
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedUniversity.focusAreas.map((area, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-[#201c18] text-xs text-[#f2ca50] border border-[#d4af37]/30"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#292524]">
              <a
                href={selectedUniversity.website}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#201c18] hover:bg-[#2c2620] text-[#ded8cb] text-xs font-bold border border-[#3c352f] transition-all flex items-center gap-2"
              >
                <span>Official Website</span>
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => {
                  setIsApplyingUniversity(selectedUniversity);
                  setSelectedUniversity(null);
                  setIsApplicationSubmitted(false);
                }}
                className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Apply for Admission</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Admission Application Portal Modal */}
      {isApplyingUniversity && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-[#f2ca50]/50 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsApplyingUniversity(null)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-white p-2 rounded-full bg-[#201c18]"
            >
              <X size={18} />
            </button>

            {!isApplicationSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsApplicationSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#282218] border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50]">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif-title text-xl font-bold text-white">
                      Apply to {isApplyingUniversity.fullName}
                    </h3>
                    <p className="text-xs text-[#d0c5af]">
                      Pan-African Fast-Track Scholar Application (2026/2027 Cohort)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#ded8cb] block mb-1">Intended Major / Degree Program</label>
                  <select className="w-full bg-[#201c18] border border-[#3c352f] text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50]">
                    {isApplyingUniversity.focusAreas.map((f, i) => (
                      <option key={i} value={f}>{f} (BSc / BEng / MSc)</option>
                    ))}
                    <option value="Computer Science">Computer Science & Artificial Intelligence</option>
                    <option value="Renewable Energy">Renewable Energy Systems Engineering</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#ded8cb] block mb-1">Full Legal Name</label>
                    <input
                      required
                      type="text"
                      defaultValue="Dr. Kofi Mensah"
                      className="w-full bg-[#201c18] border border-[#3c352f] text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#ded8cb] block mb-1">Country of Citizenship</label>
                    <input
                      required
                      type="text"
                      defaultValue="Ghana"
                      className="w-full bg-[#201c18] border border-[#3c352f] text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#ded8cb] block mb-1">Statement of Motivation & Capstone Vision</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your academic ambition, research interests, and why you wish to study at this institution..."
                    defaultValue="I am eager to contribute to pan-African deep-tech infrastructure, clean energy storage, and embedded systems engineering."
                    className="w-full bg-[#201c18] border border-[#3c352f] text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50]"
                  />
                </div>

                <div className="p-3 bg-[#241e16] rounded-xl border border-[#f2ca50]/30 text-xs text-[#ffd768] flex items-center gap-2">
                  <Sparkles size={16} className="shrink-0 text-[#f2ca50]" />
                  <span>Your Afriversty Heritage Scholar Profile credentials will be attached automatically.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyingUniversity(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#201c18] text-[#ded8cb] text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] text-xs font-bold shadow-lg cursor-pointer"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-white">
                  Application Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-[#d0c5af] max-w-md mx-auto">
                  Your admissions file has been transmitted directly to the international registry of{" "}
                  <strong className="text-[#f2ca50]">{isApplyingUniversity.fullName}</strong>. You will receive an email update regarding your interview status within 5 business days.
                </p>
                <button
                  onClick={() => setIsApplyingUniversity(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#f2ca50] text-[#1c1917] font-bold text-xs shadow-md cursor-pointer"
                >
                  Close & Return to Directory
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Interactive Pan-African Geospatial Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161412] border border-[#f2ca50]/50 w-full max-w-4xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#292524]">
              <div className="flex items-center gap-2.5">
                <Compass size={22} className="text-[#f2ca50]" />
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-white">
                    Pan-African Universities Geospatial Explorer
                  </h3>
                  <p className="text-xs text-[#a8a29e]">Interactive Map of Higher Education citadels across Africa</p>
                </div>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-[#99907c] hover:text-white p-2 rounded-full bg-[#201c18]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Real Interactive Pan-African Geospatial Map */}
            <div className="relative w-full rounded-2xl overflow-hidden my-4 border border-[#3c352f] min-h-[500px]">
              <RealLeafletMap
                height="500px"
                universities={universities}
                onSelectUniversity={(uni) => {
                  setSelectedUniversity(uni);
                  setIsMapModalOpen(false);
                }}
                onApplyUniversity={(uni) => {
                  setIsApplyingUniversity(uni);
                  setIsApplicationSubmitted(false);
                  setIsMapModalOpen(false);
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#a8a29e] pt-2">
              <span>Explore live interactive satellite & street layers, click university badges for profiles & direct applications.</span>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#1c1917] font-bold cursor-pointer transition-all shadow-md"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Partner Modal */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-[#f2ca50]/50 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsPartnerModalOpen(false)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-white p-2 rounded-full bg-[#201c18]"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#282218] border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] mb-4">
              <Building2 size={24} />
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-white">
              Institutional Partnership Program
            </h3>
            <p className="text-xs sm:text-sm text-[#d0c5af] mt-2 mb-4 leading-relaxed font-sans-body">
              Afriversty connects leading academic institutions, research laboratories, and polytechnics across all 54 African countries with over 500,000 top STEM candidates, postgraduate researchers, and global scholarship recipients.
            </p>
            <div className="space-y-2 mb-6 text-xs text-[#ded8cb]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#f2ca50]" />
                <span>Publish accredited degree, diploma & certificate programs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#f2ca50]" />
                <span>Direct admission routing & scholarship matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#f2ca50]" />
                <span>Collaborative inter-university research symposiums</span>
              </div>
            </div>
            <button
              onClick={() => {
                alert("Thank you for your interest. The Afriversty Institutional Relations team has logged your inquiry.");
                setIsPartnerModalOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-[#f2ca50] text-[#1c1917] font-bold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              Submit Institution Partnership Inquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
