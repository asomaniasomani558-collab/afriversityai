import React, { useState } from "react";
import { StudentProfile } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  X,
  Flag,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ReportModalProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { reportContent } = useCommunity();

  const [reason, setReason] = useState<"harassment" | "spam" | "impersonation" | "inappropriate" | "other">("harassment");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportContent({
      targetType: "user",
      targetId: student.id,
      reason,
      details,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setDetails("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#14120e] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2d271f]">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert size={20} />
            <h4 className="text-base font-bold font-serif-title">
              Afriversity Trust & Safety Report
            </h4>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c827a] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle size={36} className="text-emerald-400 mx-auto" />
            <h5 className="text-base font-bold">Report Filed to Trust Team</h5>
            <p className="text-xs text-[#a8a29e]">
              Thank you for keeping our Pan-African academic network safe and respectful.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#1c1813] border border-[#2d271f] flex items-center gap-3">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-[#f5f5f4]">
                  {student.name} ({student.country})
                </div>
                <div className="text-[11px] text-[#a8a29e]">{student.university}</div>
              </div>
            </div>

            <div>
              <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none"
              >
                <option value="harassment">Harassment or Unwelcome Contact</option>
                <option value="spam">Academic Spam or Commercial Pitching</option>
                <option value="impersonation">Fake Credentials or Impersonation</option>
                <option value="inappropriate">Inappropriate Conduct</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                Additional Details or Context
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe what occurred..."
                rows={3}
                className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-[#a8a29e] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0c0a09] font-bold"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
