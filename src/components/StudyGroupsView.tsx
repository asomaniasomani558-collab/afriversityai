import React, { useState } from "react";
import { Users, Plus, Search, MessageSquare, ArrowRight, X, Send, Sparkles, Check } from "lucide-react";
import { StudyGroup } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface StudyGroupsViewProps {
  studyGroups: StudyGroup[];
  onToggleJoinGroup: (groupId: string) => void;
  onCreateGroup: (newGroup: Partial<StudyGroup>) => void;
}

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  studyGroups,
  onToggleJoinGroup,
  onCreateGroup,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "my-groups" | "popular" | "new">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeChatGroup, setActiveChatGroup] = useState<StudyGroup | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [groupMessages, setGroupMessages] = useState<{ [groupId: string]: { sender: string; text: string; time: string; avatar?: string }[] }>({
    g1: [
      { sender: "Amara Nweke", text: "Welcome everyone to the Engineering Hub! Our solar microgrid paper draft is now open for review.", time: "10:15 AM", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
      { sender: "Kofi Mensah", text: "I uploaded the ESP32 circuit schematic in the resources folder.", time: "10:30 AM", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    ],
    g2: [
      { sender: "Sipho Dlamini", text: "Who is attending the PyTorch Pan-African model optimization webinar tomorrow?", time: "09:00 AM", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
    ],
  });

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState("Engineering & Architecture");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupTags, setNewGroupTags] = useState("STEM, Innovation");

  const filteredGroups = studyGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "my-groups") return matchesSearch && group.isJoined;
    if (activeTab === "popular") return matchesSearch && group.membersCount > 800;
    if (activeTab === "new") return matchesSearch && group.membersCount <= 500;
    return matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeChatGroup) return;

    const newMsg = {
      sender: "Dr. Kofi Mensah",
      text: chatMessage,
      time: "Just now",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    };

    setGroupMessages((prev) => ({
      ...prev,
      [activeChatGroup.id]: [...(prev[activeChatGroup.id] || []), newMsg],
    }));

    setChatMessage("");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup({
      name: newGroupName,
      category: newGroupCategory,
      description: newGroupDesc || "Dedicated study community building impact across African campuses.",
      tags: newGroupTags.split(",").map((t) => t.trim()),
      membersCount: 1,
      iconName: "groups",
      activeDiscussions: 1,
      isJoined: true,
      members: [
        {
          id: "u-kofi",
          name: "Dr. Kofi Mensah",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          role: "Founder",
        },
      ],
    });

    setShowCreateModal(false);
    setNewGroupName("");
    setNewGroupDesc("");
  };

  return (
    <div id="study-groups-container" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-[#e5e2e1]">
            {t.studyGroupsTitle}
          </h1>
          <p className="text-xs text-[#d0c5af] mt-1">
            {t.studyGroupsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="create-study-group-btn"
            onClick={() => setShowCreateModal(true)}
            className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Plus size={16} />
            <span>{t.createGroup}</span>
          </button>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-[#1b1b1b] p-4 rounded-2xl border border-[#4d4635]/25 shadow-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" />
          <input
            type="text"
            placeholder={t.searchGroupsPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl py-2 pl-10 pr-4 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
          />
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-[#20201f] p-1 rounded-xl border border-[#4d4635]/30">
          {[
            { id: "all", label: t.all },
            { id: "my-groups", label: t.myGroups },
            { id: "popular", label: t.popular },
            { id: "new", label: t.newGroups },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#f2ca50] text-[#3c2f00] shadow-sm"
                  : "text-[#d0c5af] hover:text-[#e5e2e1]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            id={`study-group-card-${group.id}`}
            className="bg-[#1b1b1b] rounded-2xl border border-[#4d4635]/25 p-5 hover:border-[#f2ca50]/50 transition-all flex flex-col justify-between shadow-xl group hover:shadow-[#f2ca50]/5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#f2ca50] bg-[#20201f] px-2.5 py-0.5 rounded border border-[#4d4635]/30">
                  {group.category}
                </span>
                <span className="text-xs text-[#99907c] flex items-center gap-1">
                  <Users size={13} /> {group.membersCount.toLocaleString()} {t.members}
                </span>
              </div>

              <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug">
                {group.name}
              </h3>

              <p className="text-xs text-[#d0c5af] mt-2 line-clamp-3 leading-relaxed">
                {group.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {group.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#20201f] text-[#d0c5af]/80 px-2 py-0.5 rounded-md border border-[#4d4635]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#4d4635]/20 flex items-center gap-2">
              <button
                onClick={() => onToggleJoinGroup(group.id)}
                className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  group.isJoined
                    ? "bg-[#20201f] text-[#f2ca50] border border-[#d4af37]/30 hover:bg-[#2a2a2a]"
                    : "bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] shadow-md"
                }`}
              >
                {group.isJoined ? <Check size={14} /> : <Plus size={14} />}
                <span>{group.isJoined ? t.joined : t.joinGroup}</span>
              </button>

              <button
                onClick={() => setActiveChatGroup(group)}
                className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#e5e2e1] p-2.5 rounded-xl border border-[#4d4635]/30 hover:text-[#f2ca50] transition-colors"
                title="Open Group Discussions"
              >
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Group Discussion Drawer / Chat Modal */}
      {activeChatGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="group-chat-modal"
            className="bg-[#1b1b1b] border border-[#d4af37]/40 w-full max-w-2xl rounded-3xl p-6 shadow-2xl flex flex-col h-[650px] relative animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#4d4635]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20201f] border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50]">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1]">
                    {activeChatGroup.name}
                  </h3>
                  <p className="text-[11px] text-[#99907c]">
                    {activeChatGroup.membersCount.toLocaleString()} {t.members} &bull; {activeChatGroup.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatGroup(null)}
                className="text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(groupMessages[activeChatGroup.id] || []).map((msg, index) => (
                <div key={index} className="flex items-start gap-3">
                  <img
                    src={msg.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/30"
                  />
                  <div className="flex-1 bg-[#20201f] p-3 rounded-2xl rounded-tl-none border border-[#4d4635]/25">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#f2ca50]">{msg.sender}</span>
                      <span className="text-[10px] text-[#99907c]">{msg.time}</span>
                    </div>
                    <p className="text-xs text-[#e5e2e1] leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#4d4635]/30 flex gap-2">
              <input
                type="text"
                placeholder={`Post to #${activeChatGroup.name}...`}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
              />
              <button
                type="submit"
                className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] px-4 py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="create-group-modal"
            className="bg-[#1b1b1b] border border-[#d4af37]/40 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif-title text-2xl font-bold text-[#e5e2e1] mb-2">
              {t.createGroup}
            </h2>
            <p className="text-xs text-[#d0c5af] mb-6">
              Establish a peer cohort for research, exam prep, or cross-border innovation.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1.5">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Renewable Energy Innovators"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1.5">Category</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
                >
                  <option>Engineering & Architecture</option>
                  <option>Computer Science & AI</option>
                  <option>Pure & Applied Mathematics</option>
                  <option>Product & UI/UX Design</option>
                  <option>Sustainability & CleanTech</option>
                  <option>Ventures & Startups</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1.5">Description & Mission</label>
                <textarea
                  rows={3}
                  placeholder="State the core objective, meeting schedule, and collaboration goals..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl p-3 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0c5af] mb-1.5">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Solar, Batteries, IoT"
                  value={newGroupTags}
                  onChange={(e) => setNewGroupTags(e.target.value)}
                  className="w-full bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs text-[#d0c5af] hover:text-[#e5e2e1]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {t.createGroup}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
