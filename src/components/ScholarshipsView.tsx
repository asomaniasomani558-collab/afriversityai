import React, { useState } from "react";
import { DollarSign, Clock, CheckCircle2, ChevronRight, Sparkles, Filter, Search, ArrowUpRight, X, FileCheck, Bookmark } from "lucide-react";
import { Scholarship } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ScholarshipsViewProps {
  scholarships: Scholarship[];
  onBookmarkScholarship?: (scholarship: Scholarship) => void;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({
  scholarships,
  onBookmarkScholarship,
}) => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applyingScholarship, setApplyingScholarship] = useState<Scholarship | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Application form fields
  const [fullName] = useState("Dr. Kofi Mensah");
  const [university] = useState("University of Ghana");
  const [gpa] = useState("3.88 / 4.0");
  const [statement, setStatement] = useState("");

  const filterChips = [
    { key: "All", label: t.all },
    { key: "Full Tuition", label: t.fullTuition },
    { key: "Postgraduate", label: t.postgraduate },
    { key: "STEM", label: "STEM" },
    { key: "Research", label: t.researchGrants },
    { key: "West Africa", label: "West Africa" },
    { key: "Fellowship", label: t.tabGrants },
  ];

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.field.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "All") return matchesSearch;
    if (selectedFilter === "Full Tuition") return matchesSearch && s.type === "Full Ride";
    if (selectedFilter === "Postgraduate") return matchesSearch && (s.level === "Postgraduate" || s.level === "Doctoral");
    if (selectedFilter === "STEM") return matchesSearch && (s.field.includes("STEM") || s.field.includes("Engineering") || s.field.includes("CS"));
    if (selectedFilter === "Research") return matchesSearch && s.type === "Research";
    if (selectedFilter === "West Africa") return matchesSearch && s.location.includes("West Africa");
    if (selectedFilter === "Fellowship") return matchesSearch && s.type === "Fellowship";
    return matchesSearch;
  });

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSuccess(true);
    setTimeout(() => {
      setApplicationSuccess(false);
      setApplyingScholarship(null);
      setStatement("");
    }, 2200);
  };

  return (
    <div id="scholarships-view-container" className="space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl safari-glass border border-[#d4af37]/35 p-6 sm:p-10 shadow-2xl overflow-hidden african-pattern-bg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/20 text-[#f2ca50] border border-[#d4af37]/30 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles size={14} />
              <span>{t.heritageExcellenceFund}</span>
            </div>

            <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#f2ca50] leading-tight">
              {t.scholarshipsTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#d0c5af] leading-relaxed">
              {t.scholarshipsSubtitle}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-row md:flex-col gap-4 bg-[#14120e]/80 backdrop-blur-md p-5 rounded-2xl border border-[#d4af37]/25 shadow-lg">
            <div>
              <span className="text-[10px] text-[#99907c] uppercase tracking-wider font-semibold">
                {t.activeScholarships}
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-[#f2ca50]">342 Grants</h3>
            </div>
            <div className="border-t border-[#d4af37]/20 pt-2">
              <span className="text-[10px] text-[#99907c] uppercase tracking-wider font-semibold">
                {t.totalFundingValue}
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-[#e5e2e1]">$12.4M USD</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between safari-glass p-4 rounded-2xl shadow-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" />
          <input
            type="text"
            placeholder={t.searchScholarshipsPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#201c17]/80 border border-[#d4af37]/30 rounded-xl py-2 pl-10 pr-4 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setSelectedFilter(chip.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedFilter === chip.key
                  ? "bg-[#d4af37]/30 text-[#f2ca50] border border-[#f2ca50]/50 shadow-sm"
                  : "bg-[#201c17]/60 text-[#d0c5af]/80 border border-[#d4af37]/20 hover:border-[#f2ca50]/40"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured & Main Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((sch) => (
          <div
            key={sch.id}
            id={`scholarship-card-${sch.id}`}
            className="safari-glass safari-glass-hover rounded-2xl p-5 transition-all flex flex-col justify-between shadow-xl group relative overflow-hidden"
          >
            {sch.daysLeft && sch.daysLeft <= 3 && (
              <div className="absolute top-0 right-0 bg-[#ffb4ab]/20 text-[#ffb4ab] border-b border-l border-[#ffb4ab]/30 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                <Clock size={11} /> {sch.deadline}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f2ca50] bg-[#24201a]/90 px-2 py-0.5 rounded border border-[#d4af37]/30">
                  {sch.type}
                </span>
                <span className="text-[10px] text-[#99907c]">{sch.level}</span>
              </div>

              <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug">
                {sch.title}
              </h3>
              <p className="text-xs text-[#d0c5af] mt-1 font-medium">
                {sch.organization}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-[#201c17]/80 border border-[#d4af37]/20">
                <div className="text-[10px] text-[#99907c] uppercase tracking-wider font-semibold">
                  {t.fundingCap}
                </div>
                <div className="text-sm font-bold text-[#f2ca50] mt-0.5 font-serif-title">
                  {sch.amount}
                </div>
              </div>

              <p className="text-xs text-[#99907c] mt-3 line-clamp-2 leading-relaxed">
                {sch.description}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-[#d4af37]/15 flex items-center gap-2">
              <button
                onClick={() => setApplyingScholarship(sch)}
                className="flex-1 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>{t.applyNow}</span>
                <ArrowUpRight size={14} />
              </button>

              <button
                onClick={() => setSelectedScholarship(sch)}
                className="bg-[#24201a]/90 hover:bg-[#322c24] text-[#e5e2e1] p-2.5 rounded-xl border border-[#d4af37]/25 hover:text-[#f2ca50] transition-colors text-xs font-semibold"
                title="View Full Guidelines"
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alumni Editorial & Application Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alumni Story */}
        <div className="lg:col-span-2 safari-glass rounded-2xl p-6 md:p-8 shadow-xl flex flex-col sm:flex-row gap-6 items-center">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
            alt="Amara Nweke - Scholar Alumni"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-[#d4af37]/40 shrink-0 shadow-lg"
          />
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#f2ca50] uppercase tracking-widest">
              Scholar Spotlight
            </span>
            <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1]">
              "AfriVersty opened doors to the Mandela Rhodes Foundation."
            </h3>
            <p className="text-xs text-[#d0c5af] leading-relaxed">
              "Through the structured peer review groups and AI essay mentor on AfriVersty, I articulated my solar microgrid thesis with total clarity. Today, our research is lighting rural communities in South Africa."
            </p>
            <p className="text-xs text-[#99907c] font-semibold pt-1">
              — Amara Nweke, Mandela Rhodes Fellow 2025
            </p>
          </div>
        </div>

        {/* 3-Step Strategy */}
        <div className="bg-[#1b1b1b] rounded-2xl border border-[#4d4635]/25 p-6 shadow-xl space-y-4">
          <h4 className="font-serif-title text-lg font-bold text-[#f2ca50]">
            Application Strategy
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#3c2f00] font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <p className="text-[#d0c5af]">Map your research impact directly to pan-African sustainable development.</p>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#3c2f00] font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <p className="text-[#d0c5af]">Run your personal statement through the AfriVersty AI Academic Mentor.</p>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-[#f2ca50] text-[#3c2f00] font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <p className="text-[#d0c5af]">Request letters of recommendation at least 3 weeks in advance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarship Details Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="scholarship-details-modal"
            className="bg-[#1b1b1b] border border-[#d4af37]/40 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setSelectedScholarship(null)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#f2ca50] mb-2">
              <span>{selectedScholarship.type}</span>
              <span>&bull;</span>
              <span>{selectedScholarship.level}</span>
              <span>&bull;</span>
              <span>{selectedScholarship.location}</span>
            </div>

            <h2 className="font-serif-title text-2xl font-bold text-[#e5e2e1]">
              {selectedScholarship.title}
            </h2>
            <p className="text-xs text-[#d0c5af] mt-1 font-semibold">
              Presented by {selectedScholarship.organization}
            </p>

            <div className="my-5 p-4 rounded-xl bg-[#20201f] border border-[#4d4635]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#99907c] uppercase">{t.fundingCap}</span>
                <div className="font-serif-title text-lg font-bold text-[#f2ca50]">{selectedScholarship.amount}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#99907c] uppercase">Deadline</span>
                <div className="text-xs font-bold text-[#e5e2e1]">{selectedScholarship.deadline}</div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e5e2e1] mb-2">
                  {t.eligibilityCriteria}
                </h4>
                <ul className="space-y-2">
                  {selectedScholarship.eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#d0c5af]">
                      <CheckCircle2 size={14} className="text-[#f2ca50] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e5e2e1] mb-2">
                  {t.fellowshipBenefits}
                </h4>
                <ul className="space-y-2">
                  {selectedScholarship.benefits.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#d0c5af]">
                      <CheckCircle2 size={14} className="text-[#f2ca50] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setApplyingScholarship(selectedScholarship);
                setSelectedScholarship(null);
              }}
              className="w-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
            >
              {t.applyNow}
            </button>
          </div>
        </div>
      )}

      {/* Application Submission Modal */}
      {applyingScholarship && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="scholarship-application-modal"
            className="bg-[#1b1b1b] border border-[#d4af37]/40 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setApplyingScholarship(null)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
            >
              <X size={18} />
            </button>

            {applicationSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50] flex items-center justify-center mx-auto animate-bounce">
                  <FileCheck size={32} />
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-[#e5e2e1]">
                  {t.applicationDraftSaved}
                </h3>
                <p className="text-xs text-[#d0c5af]">
                  Your dossier for <span className="text-[#f2ca50] font-bold">{applyingScholarship.title}</span> has been dispatched to the review committee.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="font-serif-title text-2xl font-bold text-[#e5e2e1] mb-1">
                  {t.applyNow}: {applyingScholarship.title}
                </h2>
                <p className="text-xs text-[#d0c5af] mb-5">
                  Verification through your verified AfriVersty academic transcript.
                </p>

                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Applicant Name</label>
                      <input
                        type="text"
                        disabled
                        value={fullName}
                        className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-3.5 py-2 text-xs text-[#99907c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Academic Standing</label>
                      <input
                        type="text"
                        disabled
                        value={gpa}
                        className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-3.5 py-2 text-xs text-[#99907c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d0c5af] mb-1">
                      Personal Statement of Intent & Impact (500 words)
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Outline your research focus, past academic milestones, and how this scholarship accelerates your pan-African development goals..."
                      value={statement}
                      onChange={(e) => setStatement(e.target.value)}
                      className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl p-3 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>

                  <div className="p-3 bg-[#20201f] rounded-xl border border-[#4d4635]/30 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#f2ca50] shrink-0" />
                    <span className="text-[11px] text-[#d0c5af]">
                      Automatic inclusion of verified UG Transcript & Identity verification badge.
                    </span>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyingScholarship(null)}
                      className="px-4 py-2 text-xs text-[#d0c5af] hover:text-[#e5e2e1]"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                    >
                      {t.submitApplication}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
