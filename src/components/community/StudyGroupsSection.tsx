import React, { useState } from "react";
import { StudyGroupCircle } from "../../types/community";
import { initialStudyGroupsData } from "../../data/communityDemoData";
import {
  Users,
  Calendar,
  Sparkles,
  BookOpen,
  Plus,
  Check,
  Globe2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Video,
} from "lucide-react";

export const StudyGroupsSection: React.FC = () => {
  const [studyGroups, setStudyGroups] = useState<StudyGroupCircle[]>(initialStudyGroupsData);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(["sg-1"]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const toggleJoin = (groupId: string) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter((id) => id !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    const newGroup: StudyGroupCircle = {
      id: `sg-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      description: newDesc,
      membersCount: 1,
      members: [],
      targetGoal: "Peer Study & Collaboration",
      meetingSchedule: "Weekly on Saturdays 17:00 GMT",
      nextSessionDate: "Upcoming this weekend",
      platform: "Afriversity Live Studio",
      isPrivate: false,
      tags: ["Study", newSubject],
    };

    setStudyGroups([newGroup, ...studyGroups]);
    setJoinedGroups([...joinedGroups, newGroup.id]);
    setNewTitle("");
    setNewSubject("");
    setNewDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d271f]">
        <div>
          <h3 className="text-xl font-bold font-serif-title text-[#f5f5f4]">
            Pan-African Peer Study Circles
          </h3>
          <p className="text-xs text-[#a8a29e] mt-1">
            Form collaborative study pods for Olympiads, research paper readings, coding sprints & scholarship prep.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#e5bd3b] hover:to-[#d97706] text-[#0c0a09] text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Plus size={15} />
          <span>Start a Study Circle</span>
        </button>
      </div>

      {/* Grid of Study Pods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {studyGroups.map((group) => {
          const isJoined = joinedGroups.includes(group.id);

          return (
            <div
              key={group.id}
              className="bg-[#14120e] hover:bg-[#1a1612] border border-[#d4af37]/25 hover:border-[#f2ca50]/60 rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Subject Pill & Member Count */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#241f19] border border-[#3c3427] text-xs text-[#f2ca50] font-semibold">
                    {group.subject}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#a8a29e]">
                    <Users size={13} className="text-[#d4af37]" />
                    <span>{group.membersCount + (isJoined ? 1 : 0)} scholars</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-[#f5f5f4] leading-snug">
                  {group.title}
                </h4>

                <p className="text-xs text-[#a8a29e] mt-2 line-clamp-3 leading-relaxed">
                  {group.description}
                </p>

                {/* Target Goal & Schedule */}
                <div className="mt-4 p-3 rounded-xl bg-[#1c1813] border border-[#2d271f] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#d0c5af]">
                    <Sparkles size={13} className="text-[#f59e0b] shrink-0" />
                    <span className="truncate">
                      <strong>Goal:</strong> {group.targetGoal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#a8a29e]">
                    <Clock size={13} className="text-[#9333ea] shrink-0" />
                    <span className="truncate">{group.meetingSchedule}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#262017] flex items-center justify-between">
                {group.nextSessionDate && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Video size={12} />
                    <span>{group.nextSessionDate}</span>
                  </span>
                )}

                <button
                  onClick={() => toggleJoin(group.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isJoined
                      ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
                      : "bg-[#f2ca50] hover:bg-[#d97706] text-[#0c0a09] shadow"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <Check size={13} />
                      <span>Member</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>Join Circle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-[#f5f5f4] font-serif-title pb-2 border-b border-[#2d271f]">
              Create New Peer Study Circle
            </h4>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                  Study Circle Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g. Masakhane Low-Resource African NLP Study Cohort"
                  className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:border-[#f2ca50] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                  Discipline / Subject
                </label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="E.g. Natural Language Processing, Math Olympiad, Quantum..."
                  className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:border-[#f2ca50] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                  Description & Goal
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe what papers you plan to read, hackathon preparation timeline, and who should join..."
                  rows={3}
                  className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:border-[#f2ca50] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-[#a8a29e] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newSubject.trim()}
                  className="px-5 py-2 rounded-xl bg-[#f2ca50] text-[#0c0a09] font-bold hover:bg-[#d97706] disabled:opacity-40"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
