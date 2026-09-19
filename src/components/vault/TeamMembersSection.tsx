import React, { useState, useEffect } from "react";
import { Users, Plus, Loader2, Award } from "lucide-react";
import { TeamMember } from "../../types";
import { fetchTeamMembers, createTeamMember } from "../../services/vaultWorkspaceService";
import { AddMemberModal } from "./WorkspaceModals";
import { useAuth } from "../../context/AuthContext";

export const TeamMembersSection: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest_scholar";

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const list = await fetchTeamMembers(userId);
        if (mounted) setMembers(list);
      } catch (err) {
        console.warn("Error loading team members:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [userId]);

  const handleCreateMember = async (name: string, role?: string) => {
    const newMember = await createTeamMember(userId, name, role);
    setMembers((prev) => [newMember, ...prev]);
  };

  return (
    <div className="safari-glass rounded-2xl p-6 shadow-xl border border-[#d4af37]/25 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
            <Users className="text-[#f2ca50]" size={22} />
            <span>Team Members & Collaborators</span>
          </h3>
          <p className="text-xs text-[#d0c5af] mt-0.5">
            Manage your research group, lab partners, and project co-contributors.
          </p>
        </div>

        <button
          onClick={() => setIsAddMemberOpen(true)}
          className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add Member</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#f2ca50]">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 safari-glass rounded-xl border border-dashed border-[#d4af37]/20">
          <Users size={36} className="mx-auto text-[#99907c] mb-2" />
          <p className="text-xs text-[#ded8cb] font-semibold">No team members added yet</p>
          <p className="text-[11px] text-[#99907c] mt-0.5">Click "Add Member" to invite collaborators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="safari-glass rounded-xl p-4 border border-[#d4af37]/20 hover:border-[#f2ca50]/50 transition-all flex items-center gap-3.5 shadow-md"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#f2ca50]/20 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] font-bold text-sm shrink-0">
                {member.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-serif-title text-sm font-bold text-[#e5e2e1] truncate">
                  {member.name}
                </h4>
                <p className="text-[11px] text-[#f2ca50] truncate font-medium mt-0.5">
                  {member.role || "Collaborator"}
                </p>
                <p className="text-[10px] text-[#99907c] mt-0.5">
                  Added {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSubmit={handleCreateMember}
      />
    </div>
  );
};
