import React, { useState } from "react";
import {
  Globe2,
  Users,
  Award,
  Sparkles,
  Search,
  ArrowUpRight,
  Building2,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  MessageSquare,
  Share2,
  Flame,
  Check,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface GrantOpportunity {
  id: string;
  title: string;
  institution: string;
  funder: string;
  amount: string;
  deadline: string;
  daysRemaining: number;
  category: "Renewable Energy" | "Artificial Intelligence" | "Agritech & Food Security" | "Biotech & Health" | "Climate Resilience";
  region: "Pan-Africa" | "West Africa" | "East Africa" | "Southern Africa" | "North Africa";
  description: string;
  eligibility: string[];
  featured?: boolean;
}

interface FacultyMentor {
  id: string;
  name: string;
  title: string;
  university: string;
  country: string;
  avatar: string;
  researchFocus: string[];
  hIndex: number;
  openings: number;
  availableForMentorship: boolean;
}

const GRANTS_DATA: GrantOpportunity[] = [
  {
    id: "g1",
    title: "African Academy of Sciences Climate & Renewable Microgrid Grant",
    institution: "African Academy of Sciences (AAS)",
    funder: "African Union & Global Energy Alliance",
    amount: "$75,000 USD",
    deadline: "October 15, 2026",
    daysRemaining: 47,
    category: "Renewable Energy",
    region: "Pan-Africa",
    description: "Multi-institutional research grant supporting graduate scholars designing decentralized solar-storage microgrids and battery degradation algorithms in rural communities.",
    eligibility: ["Enrolled Master's or PhD student in Africa", "Sub-Saharan university affiliation", "Open-source data methodology"],
    featured: true,
  },
  {
    id: "g2",
    title: "IndabaX Deep Learning & NLP Indigenous Language Fellowship",
    institution: "Deep Learning Indaba",
    funder: "Google Research & AI for Development Foundation",
    amount: "$25,000 USD + GPU Compute",
    deadline: "September 30, 2026",
    daysRemaining: 32,
    category: "Artificial Intelligence",
    region: "West Africa",
    description: "Direct research stipends and cloud compute credits for training multilingual speech-to-text models on low-resource African languages (Yoruba, Swahili, Amharic, Twi).",
    eligibility: ["Postgraduate researcher or undergraduate capstone lead", "Published paper or GitHub repository demo", "African citizen or permanent resident"],
    featured: true,
  },
  {
    id: "g3",
    title: "AGRA Agri-Robotics & Satellite Soil Remote Sensing Fund",
    institution: "Alliance for a Green Revolution in Africa",
    funder: "Rockefeller Foundation & AfDB",
    amount: "$50,000 USD",
    deadline: "November 20, 2026",
    daysRemaining: 83,
    category: "Agritech & Food Security",
    region: "East Africa",
    description: "Funding cross-border field robotics, drone hyperspectral imaging, and automated drip irrigation sensors for drought-prone farming corridors.",
    eligibility: ["Cross-university collaborative team (2+ institutions)", "Field deployment roadmap in Africa"],
  },
  {
    id: "g4",
    title: "Institut Pasteur Infectious Disease Genomics & CRISPR Fellowship",
    institution: "Institut Pasteur Dakar & CAPRISA",
    funder: "Wellcome Trust & WHO AFRO",
    amount: "$60,000 USD / Year",
    deadline: "December 5, 2026",
    daysRemaining: 98,
    category: "Biotech & Health",
    region: "Southern Africa",
    description: "Pre-doctoral genomics fellowships focused on pathogen surveillance, molecular diagnostics, and mRNA vaccine stability for tropical neglected diseases.",
    eligibility: ["Biomedical, Bioinformatics or Chemical Engineering background", "Letter of endorsement from faculty supervisor"],
  },
];

const FACULTY_MENTORS: FacultyMentor[] = [
  {
    id: "m1",
    name: "Prof. Kwame Osei-Tutu",
    title: "Chair of Power Systems & Microgrids",
    university: "KNUST (Kwame Nkrumah Univ of Science & Technology)",
    country: "Ghana",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    researchFocus: ["Photovoltaics", "Smart Inverters", "Rural Energy Transitions"],
    hIndex: 34,
    openings: 2,
    availableForMentorship: true,
  },
  {
    id: "m2",
    name: "Dr. Amina Diallo",
    title: "Senior Research Fellow in Computational AI",
    university: "Cheikh Anta Diop University (UCAD)",
    country: "Senegal",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    researchFocus: ["Low-Resource NLP", "Speech Synthesis", "Indaba Fellow"],
    hIndex: 22,
    openings: 3,
    availableForMentorship: true,
  },
  {
    id: "m3",
    name: "Prof. Sipho Ndlovu",
    title: "Director of Advanced Materials & Metallurgy",
    university: "University of Cape Town (UCT)",
    country: "South Africa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    researchFocus: ["Battery Chemistry", "Perovskites", "Green Hydrogen Electrocatalysis"],
    hIndex: 48,
    openings: 1,
    availableForMentorship: true,
  },
  {
    id: "m4",
    name: "Dr. Wanjiku Muthoni",
    title: "Associate Professor in Agricultural Robotics",
    university: "University of Nairobi (UoN)",
    country: "Kenya",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    researchFocus: ["Drone Hyperspectral Imaging", "IoT Sensor Grids", "Embedded Edge AI"],
    hIndex: 19,
    openings: 4,
    availableForMentorship: true,
  },
];

export const ResearchRadarView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"grants" | "mentors" | "whiteboard">("grants");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [appliedGrants, setAppliedGrants] = useState<string[]>([]);
  const [contactedMentors, setContactedMentors] = useState<string[]>([]);

  // Collaborative Markdown/LaTeX draft state
  const [latexDoc, setLatexDoc] = useState<string>(`\\documentclass{article}
\\title{Decentralized Microgrid Frequency Regulation using Deep Reinforcement Learning}
\\author{Dr. Kofi Mensah, Prof. Kwame Osei-Tutu \\\\ AfriVersty Research Consortium}

\\begin{document}
\\maketitle

\\begin{abstract}
Sub-Saharan microgrids require robust dynamic state estimation to mitigate solar intermittency. Here we derive an optimal control framework yielding $\\Delta f \\leq 0.05$ Hz under 40\\% peak load shed conditions.
\\end{abstract}

\\section{Mathematical Formulation}
Let the total system kinetic inertia be described by the swing equation:
\\[
2H \\frac{d\\Delta f(t)}{dt} = P_m(t) - P_e(t) - D\\Delta f(t)
\\]
where $H$ is the lumped inertia constant and $D$ represents damping coefficient.
\\end{document}`);

  const [copiedDoc, setCopiedDoc] = useState(false);

  const handleApplyGrant = (id: string) => {
    if (appliedGrants.includes(id)) {
      setAppliedGrants(appliedGrants.filter((g) => g !== id));
    } else {
      setAppliedGrants([...appliedGrants, id]);
    }
  };

  const handleContactMentor = (id: string) => {
    if (contactedMentors.includes(id)) {
      setContactedMentors(contactedMentors.filter((m) => m !== id));
    } else {
      setContactedMentors([...contactedMentors, id]);
    }
  };

  const categories = [
    { key: "All", label: t.all },
    { key: "Renewable Energy", label: t.catRenewableEnergy },
    { key: "Artificial Intelligence", label: t.catArtificialIntelligence },
    { key: "Agritech & Food Security", label: t.catAgritech },
    { key: "Biotech & Health", label: t.catBiotechHealth },
  ];

  const filteredGrants = GRANTS_DATA.filter((grant) => {
    const matchesSearch =
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || grant.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="research-radar-container" className="space-y-6 animate-fadeIn pb-12">
      {/* Top Hero Banner */}
      <div className="safari-glass p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#f2ca50]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-[#f2ca50]/15 text-[#f2ca50] border border-[#d4af37]/30">
                <Globe2 size={22} />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#f2ca50]">
                {t.panAfricanVanguard}
              </span>
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#e5e2e1]">
              {t.researchRadarTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#ded8cb] max-w-2xl mt-1.5 leading-relaxed">
              {t.researchRadarSubtitle}
            </p>
          </div>

          {/* Sub Navigation Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#14120f]/90 border border-[#d4af37]/25 shrink-0">
            <button
              onClick={() => setActiveTab("grants")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "grants"
                  ? "bg-[#d4af37]/25 text-[#f2ca50] border border-[#f2ca50]/40 shadow-sm"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Award size={15} />
              <span>{t.tabGrants}</span>
            </button>

            <button
              onClick={() => setActiveTab("mentors")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "mentors"
                  ? "bg-[#d4af37]/25 text-[#f2ca50] border border-[#f2ca50]/40 shadow-sm"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <Users size={15} />
              <span>{t.tabMentors}</span>
            </button>

            <button
              onClick={() => setActiveTab("whiteboard")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "whiteboard"
                  ? "bg-[#d4af37]/25 text-[#f2ca50] border border-[#f2ca50]/40 shadow-sm"
                  : "text-[#99907c] hover:text-[#e5e2e1]"
              }`}
            >
              <FileText size={15} />
              <span>{t.tabLatex}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. GRANTS & FELLOWSHIPS RADAR */}
      {activeTab === "grants" && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="safari-glass p-4 rounded-2xl border border-[#d4af37]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" size={16} />
              <input
                type="text"
                placeholder={t.searchGrantsPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181511] border border-[#d4af37]/25 rounded-xl pl-10 pr-4 py-2 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.key
                      ? "bg-[#f2ca50] text-[#3c2f00] font-bold"
                      : "bg-[#1e1b16] text-[#ded8cb] hover:bg-[#2c261e] border border-[#d4af37]/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grants Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGrants.map((grant) => {
              const isApplied = appliedGrants.includes(grant.id);

              return (
                <div
                  key={grant.id}
                  className="safari-glass safari-glass-hover p-6 rounded-3xl border border-[#d4af37]/25 flex flex-col justify-between space-y-4 relative group"
                >
                  {grant.featured && (
                    <span className="absolute top-4 right-4 bg-[#f2ca50]/20 text-[#f2ca50] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#f2ca50]/30 flex items-center gap-1">
                      <Flame size={12} /> {t.highImpact}
                    </span>
                  )}

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-[#99907c]">
                      <span className="text-[#f2ca50] font-semibold">{grant.funder}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {grant.region}</span>
                    </div>

                    <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug">
                      {grant.title}
                    </h3>

                    <p className="text-xs text-[#ded8cb] leading-relaxed">
                      {grant.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-[#f2ca50] block mb-1.5">{t.keyCriteria}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {grant.eligibility.map((crit, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#221e18] text-[#ded8cb] px-2 py-0.5 rounded-lg border border-[#d4af37]/20"
                          >
                            ✓ {crit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#99907c] block">{t.fundingCap}</span>
                      <span className="text-sm font-bold font-mono text-[#4ade80]">{grant.amount}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#99907c] flex items-center gap-1">
                        <Clock size={13} className="text-amber-400" />
                        <strong>{grant.daysRemaining} {t.daysLeft}</strong>
                      </span>

                      <button
                        onClick={() => handleApplyGrant(grant.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                          isApplied
                            ? "bg-green-500/20 text-green-300 border border-green-500/40"
                            : "bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#3c2f00] hover:brightness-110"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check size={14} />
                            <span>{t.applicationDraftSaved}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.applyAndPrepDraft}</span>
                            <ArrowUpRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. PAN-AFRICAN FACULTY MENTORS */}
      {activeTab === "mentors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FACULTY_MENTORS.map((mentor) => {
            const isContacted = contactedMentors.includes(mentor.id);

            return (
              <div
                key={mentor.id}
                className="safari-glass p-6 rounded-3xl border border-[#d4af37]/25 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#d4af37]/40 shadow-lg shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif-title text-base font-bold text-[#e5e2e1]">
                        {mentor.name}
                      </h3>
                      <span className="text-[10px] bg-[#f2ca50]/15 text-[#f2ca50] font-bold px-2 py-0.5 rounded-full border border-[#f2ca50]/30 font-mono">
                        h-index: {mentor.hIndex}
                      </span>
                    </div>
                    <p className="text-xs text-[#f2ca50] font-medium">{mentor.title}</p>
                    <p className="text-xs text-[#99907c] flex items-center gap-1">
                      <Building2 size={12} /> {mentor.university} &bull; {mentor.country}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#ded8cb] block">{t.researchFocusAreas}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.researchFocus.map((focus, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#221e18] text-[#ded8cb] px-2.5 py-1 rounded-lg border border-[#d4af37]/20"
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#d4af37]/15 flex items-center justify-between">
                  <span className="text-xs text-[#4ade80] font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>{mentor.openings} {t.openResearchPositions}</span>
                  </span>

                  <button
                    onClick={() => handleContactMentor(mentor.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isContacted
                        ? "bg-green-500/20 text-green-300 border border-green-500/40"
                        : "bg-[#201c17] hover:bg-[#2c251d] text-[#f2ca50] border border-[#d4af37]/35"
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>{isContacted ? t.invitationSent : t.requestCoAdvising}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. LATEX / MARKDOWN CO-AUTHORING WORKSPACE */}
      {activeTab === "whiteboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#f2ca50]" />
                <h3 className="font-serif-title text-base font-bold text-[#e5e2e1]">
                  {t.latexSourceEditor}
                </h3>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(latexDoc);
                  setCopiedDoc(true);
                  setTimeout(() => setCopiedDoc(false), 2000);
                }}
                className="px-3 py-1 rounded-lg bg-[#201c17] text-xs text-[#d0c5af] border border-[#d4af37]/25 flex items-center gap-1"
              >
                {copiedDoc ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
                <span>{copiedDoc ? t.copied : t.exportTex}</span>
              </button>
            </div>

            <textarea
              value={latexDoc}
              onChange={(e) => setLatexDoc(e.target.value)}
              rows={16}
              className="w-full p-4 bg-[#0c0b0a] border border-[#d4af37]/25 rounded-2xl font-mono text-xs text-[#a5d6a7] focus:outline-none resize-none leading-relaxed scrollbar-none"
            />
          </div>

          <div className="lg:col-span-6 safari-glass p-5 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
              <h3 className="font-serif-title text-base font-bold text-[#e5e2e1] flex items-center gap-2">
                <Sparkles size={18} className="text-[#f2ca50]" />
                <span>{t.renderedPreprint}</span>
              </h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30 font-mono">
                {t.autoCompiled}
              </span>
            </div>

            {/* Rendered Academic Sheet Paper Simulation */}
            <div className="p-6 bg-[#fcfbfa] text-[#1a1714] rounded-2xl shadow-xl space-y-4 font-serif leading-relaxed min-h-[380px] border border-[#d4af37]/40">
              <div className="text-center space-y-1 pb-3 border-b border-[#000000]/15">
                <h2 className="text-base sm:text-lg font-bold">
                  Decentralized Microgrid Frequency Regulation using Deep Reinforcement Learning
                </h2>
                <p className="text-xs italic text-[#554e42]">
                  Dr. Kofi Mensah¹, Prof. Kwame Osei-Tutu² &bull; AfriVersty Research Consortium
                </p>
              </div>

              <div className="text-xs space-y-2">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#7a6f5d]">Abstract</p>
                <p className="text-[#332e27] text-justify leading-relaxed">
                  Sub-Saharan microgrids require robust dynamic state estimation to mitigate solar intermittency. Here we derive an optimal control framework yielding Δf ≤ 0.05 Hz under 40% peak load shed conditions.
                </p>
              </div>

              <div className="text-xs space-y-2 pt-2">
                <p className="font-bold uppercase tracking-wider text-[10px] text-[#7a6f5d]">1. Mathematical Formulation</p>
                <div className="p-3 bg-[#f2ede4] rounded-xl text-center font-mono text-xs text-[#1a1714] my-2 shadow-inner border border-[#d4af37]/30">
                  2H (dΔf(t) / dt) = P_m(t) - P_e(t) - D · Δf(t)
                </div>
                <p className="text-[#332e27] leading-relaxed">
                  where <em>H</em> denotes lumped system inertia and <em>D</em> represents load damping coefficient.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
