import React, { useState } from "react";
import { useCommunity } from "../../context/CommunityContext";
import { ReportItem } from "../../types/community";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  Trash2,
} from "lucide-react";

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { reports, resolveReport, dismissReport } = useCommunity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-5 text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2d271f]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={22} className="text-[#f2ca50]" />
            <div>
              <h3 className="text-base font-bold font-serif-title">
                Afriversity Trust & Safety Moderation Dashboard
              </h3>
              <p className="text-[11px] text-[#a8a29e]">
                Pan-African Academic Integrity & Anti-Harassment Queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c827a] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reports.length > 0 ? (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-[#191510] border border-[#2d271f] flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold uppercase text-[10px]">
                      {rep.reason}
                    </span>
                    <span className="text-[#a8a29e] text-[11px]">
                      Target: {rep.targetType} ({rep.targetId})
                    </span>
                  </div>

                  <p className="text-[#d6d3d1] mt-1">{rep.details || "No additional text provided."}</p>

                  <div className="text-[10px] text-[#8c827a]">
                    Reported on {rep.createdAt} • Status: {rep.status}
                  </div>
                </div>

                {rep.status === "pending" ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => dismissReport(rep.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#241f19] hover:bg-[#2e261d] text-[#a8a29e] text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-bold"
                    >
                      Enforce Action
                    </button>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-bold">
                    Resolved
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-[#191510] text-center text-xs text-[#8c827a]">
              No flagged reports in queue. The community is healthy and safe!
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#241f19] text-[#f5f5f4] text-xs font-semibold hover:bg-[#2d251a]"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
