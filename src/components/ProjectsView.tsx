import React, { useState } from "react";
import { FolderGit2, Star, Users, Plus, ExternalLink, Search, Sparkles, X, Check } from "lucide-react";
import { ProjectItem } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ProjectsViewProps {
  projects: ProjectItem[];
  onCreateProject?: (project: ProjectItem) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  const { t } = useLanguage();
  const [projectList, setProjectList] = useState(projects);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Computer Vision & Agritech");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("Python, IoT, CleanTech");

  const filtered = projectList.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStar = (id: string) => {
    setProjectList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stars: p.stars + 1 } : p))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProjectItem = {
      id: `p-${Date.now()}`,
      title: newTitle,
      lead: "Dr. Kofi Mensah",
      university: "University of Ghana",
      category: newCategory,
      description: newDesc || "Engineering high-impact sustainable software and hardware architectures.",
      status: "Active",
      membersCount: 1,
      tags: newTags.split(",").map((t) => t.trim()),
      stars: 1,
    };

    setProjectList([newProj, ...projectList]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div id="projects-view-container" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-[#e5e2e1]">
            {t.projectsTitle}
          </h1>
          <p className="text-xs text-[#d0c5af] mt-1">
            {t.projectsSubtitle}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>{t.launchProject}</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#1b1b1b] p-4 rounded-2xl border border-[#4d4635]/25 shadow-lg">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" />
          <input
            type="text"
            placeholder={t.searchProjectsPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl py-2 pl-10 pr-4 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            id={`project-card-${proj.id}`}
            className="bg-[#1b1b1b] rounded-2xl border border-[#4d4635]/25 p-5 hover:border-[#f2ca50]/50 transition-all flex flex-col justify-between shadow-xl group hover:shadow-[#f2ca50]/5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#f2ca50] bg-[#20201f] px-2.5 py-0.5 rounded border border-[#4d4635]/30">
                  {proj.category}
                </span>
                <span className="text-[10px] text-[#e0a77f] font-bold bg-[#e0a77f]/10 px-2 py-0.5 rounded">
                  {proj.status}
                </span>
              </div>

              <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug">
                {proj.title}
              </h3>
              <p className="text-xs text-[#99907c] mt-1">
                Lead: <span className="text-[#d0c5af] font-medium">{proj.lead}</span> &bull; {proj.university}
              </p>

              <p className="text-xs text-[#d0c5af] mt-3 line-clamp-3 leading-relaxed">
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {proj.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#20201f] text-[#d0c5af]/80 px-2 py-0.5 rounded-md border border-[#4d4635]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#4d4635]/20 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[#99907c]">
                <span className="flex items-center gap-1">
                  <Users size={13} /> {proj.membersCount} collaborators
                </span>
              </div>

              <button
                onClick={() => toggleStar(proj.id)}
                className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#f2ca50] border border-[#d4af37]/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Star size={13} className="fill-current" />
                <span>{proj.stars}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1b1b1b] border border-[#d4af37]/40 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif-title text-2xl font-bold text-[#e5e2e1] mb-1">
              {t.launchProject}
            </h2>
            <p className="text-xs text-[#d0c5af] mb-6">
              Recruit student engineers, researchers, and designers across Africa.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SolarGrid-USSD Autonomous Controller"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Domain</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                >
                  <option>Computer Vision & Agritech</option>
                  <option>CleanTech & IoT Microgrids</option>
                  <option>Natural Language Processing</option>
                  <option>Fintech & Cross-Border Mesh</option>
                  <option>Biomedical Diagnostics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specify system goals, hardware/software stack, and open collaborator roles..."
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl p-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-[#d0c5af] hover:text-[#e5e2e1]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {t.publishProject}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
