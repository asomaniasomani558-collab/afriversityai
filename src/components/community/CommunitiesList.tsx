import React, { useState } from "react";
import { CommunityGroup } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  Users,
  Building2,
  Globe2,
  Check,
  Plus,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface CommunitiesListProps {
  onOpenCommunityDetail: (community: CommunityGroup) => void;
}

export const CommunitiesList: React.FC<CommunitiesListProps> = ({
  onOpenCommunityDetail,
}) => {
  const { communities, joinCommunity, leaveCommunity } = useCommunity();
  const [activeTab, setActiveTab] = useState<"all" | "pan-african" | "university">("all");

  const filtered = communities.filter((c) => {
    if (activeTab === "all") return true;
    return c.type === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d271f]">
        <div>
          <h3 className="text-xl font-bold font-serif-title text-[#f5f5f4]">
            Pan-African Communities & University Hubs
          </h3>
          <p className="text-xs text-[#a8a29e] mt-1">
            Join cross-border research working groups, verified campus networks, and study cohorts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-[#191510] p-1 rounded-xl border border-[#3c3427] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-[#f2ca50] text-[#0c0a09] font-bold shadow"
                : "text-[#d6d3d1] hover:text-[#f2ca50]"
            }`}
          >
            All Hubs ({communities.length})
          </button>
          <button
            onClick={() => setActiveTab("pan-african")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "pan-african"
                ? "bg-[#f2ca50] text-[#0c0a09] font-bold shadow"
                : "text-[#d6d3d1] hover:text-[#f2ca50]"
            }`}
          >
            <Globe2 size={13} />
            <span>Pan-African</span>
          </button>
          <button
            onClick={() => setActiveTab("university")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "university"
                ? "bg-[#f2ca50] text-[#0c0a09] font-bold shadow"
                : "text-[#d6d3d1] hover:text-[#f2ca50]"
            }`}
          >
            <Building2 size={13} />
            <span>Universities</span>
          </button>
        </div>
      </div>

      {/* Grid of Community Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((comm) => {
          return (
            <div
              key={comm.id}
              onClick={() => onOpenCommunityDetail(comm)}
              className="group bg-[#14120e] hover:bg-[#1a1612] border border-[#d4af37]/25 hover:border-[#f2ca50]/70 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Cover Banner */}
                <div className="relative h-28 w-full overflow-hidden bg-[#241f19]">
                  <img
                    src={comm.coverImage}
                    alt={comm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14120e] via-transparent to-black/40" />

                  {/* Type Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    {comm.type === "university" ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[10px] font-bold flex items-center gap-1 shadow">
                        <Building2 size={10} /> Verified Campus
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-bold flex items-center gap-1 shadow">
                        <Globe2 size={10} /> Pan-African
                      </span>
                    )}
                  </div>

                  {/* Avatar Icon */}
                  <div className="absolute -bottom-3 left-4 w-12 h-12 rounded-xl border-2 border-[#14120e] overflow-hidden bg-[#1e1a14] shadow-lg">
                    <img
                      src={comm.avatar}
                      alt={comm.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Body Content */}
                <div className="pt-5 px-4 pb-3">
                  <h4 className="text-base font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors leading-tight">
                    {comm.name}
                  </h4>
                  <div className="text-[11px] text-[#f59e0b] font-medium mt-0.5">
                    {comm.category}
                  </div>

                  <p className="text-xs text-[#a8a29e] mt-2 line-clamp-2 leading-relaxed">
                    {comm.description}
                  </p>

                  {/* Distribution Pills / Stats */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#8c827a] pt-2 border-t border-[#241f19]">
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-[#d4af37]" />
                      <span className="font-semibold text-[#d0c5af]">
                        {comm.memberCount.toLocaleString()}
                      </span>
                      <span>members</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-purple-400" />
                      <span>{comm.activeDiscussionsCount} active threads</span>
                    </div>
                  </div>

                  {/* Country Flag distribution snippet */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#8c827a]">
                    <span className="text-[10px] uppercase font-bold text-[#a8a29e]">Top:</span>
                    {comm.countryDistribution.slice(0, 4).map((d) => (
                      <span
                        key={d.country}
                        className="px-1.5 py-0.5 rounded bg-[#1e1a14] text-[#d6d3d1] text-[10px] flex items-center gap-1"
                        title={`${d.country}: ${d.percentage}%`}
                      >
                        <span>{d.flag}</span>
                        <span>{d.percentage}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-[#181510] border-t border-[#262017] flex items-center gap-2">
                {comm.isJoined ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      leaveCommunity(comm.id);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-red-950/50 border border-emerald-500/30 hover:border-red-500/40 text-emerald-300 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check size={13} className="text-emerald-400" />
                    <span>Member (Joined)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      joinCommunity(comm.id);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-[#241f19] hover:bg-[#f2ca50] border border-[#3c3427] hover:border-[#f2ca50] text-[#d6d3d1] hover:text-[#0c0a09] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <Plus size={13} />
                    <span>Join Community</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenCommunityDetail(comm)}
                  className="p-1.5 rounded-xl bg-[#241f19] hover:bg-[#2d251a] text-[#f2ca50] border border-[#3c3427] hover:border-[#f2ca50]/40 transition-colors"
                  title="Open community feed & chat"
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
