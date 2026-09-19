import React, { useEffect } from "react";
import { LogOut, X, AlertTriangle, Shield } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
  isSubmitting?: boolean;
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  userName,
  isSubmitting = false,
}) => {
  const { isLightMode } = useTheme();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      id="logout-modal-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        id="logout-modal-card"
        className={`relative w-full max-w-md rounded-2xl sm:rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all scale-100 ${
          isLightMode
            ? "bg-[#ffffff] border-[#d4af37]/40 text-[#18120a] shadow-[0_20px_60px_rgba(180,140,40,0.2)]"
            : "bg-[#14120e] border-[#d4af37]/35 text-[#f5f2eb] shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
        }`}
      >
        {/* Close "X" Button */}
        <button
          type="button"
          id="logout-modal-close-btn"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
            isLightMode
              ? "text-[#6b5536] hover:bg-[#f2ece1] hover:text-[#18120a]"
              : "text-[#a39783] hover:bg-[#201c15] hover:text-[#f5f2eb]"
          }`}
        >
          <X size={18} />
        </button>

        {/* Modal Header with Icon */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isLightMode
                ? "bg-[#fff8e6] border-[#eab308]/40 text-[#b45309]"
                : "bg-[#241e12] border-[#eab308]/40 text-[#facc15]"
            }`}
          >
            <LogOut size={22} className="stroke-[2.2]" />
          </div>

          <div className="flex-1 pr-6">
            <h2
              id="logout-modal-title"
              className={`font-serif-title text-xl sm:text-2xl font-bold tracking-tight ${
                isLightMode ? "text-[#18120a]" : "text-[#f8f5ee]"
              }`}
            >
              Sign Out Confirmation
            </h2>
            <p
              className={`text-xs mt-1 font-sans-body leading-relaxed ${
                isLightMode ? "text-[#6b5945]" : "text-[#b0a490]"
              }`}
            >
              Preventing accidental session termination
            </p>
          </div>
        </div>

        {/* Modal Body / Explanation */}
        <div
          className={`p-4 rounded-xl border mb-6 text-xs sm:text-sm leading-relaxed ${
            isLightMode
              ? "bg-[#faf7f0] border-[#d4af37]/25 text-[#453725]"
              : "bg-[#1b1712] border-[#d4af37]/20 text-[#d4c8b4]"
          }`}
        >
          <p>
            {userName ? (
              <span>
                Scholar <strong className="text-[#d97706] font-semibold">{userName}</strong>, are you sure you want to end your active session?
              </span>
            ) : (
              <span>Are you sure you want to end your current session?</span>
            )}
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs opacity-90">
            <Shield size={14} className="text-[#eab308] shrink-0" />
            <span>Your research notes, courses, and activities are safely saved in your database.</span>
          </div>
        </div>

        {/* Modal Actions: Cancel vs Confirm */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#d4af37]/15">
          <button
            type="button"
            id="logout-modal-cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              isLightMode
                ? "bg-[#f5efe2] hover:bg-[#ede3d0] border-[#d4af37]/40 text-[#453725]"
                : "bg-[#1f1a14] hover:bg-[#2b241c] border-[#d4af37]/30 text-[#d4c8b4]"
            }`}
          >
            Stay Signed In
          </button>

          <button
            type="button"
            id="logout-modal-confirm-btn"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] via-[#b91c1c] to-[#991b1b] hover:from-[#ef4444] hover:to-[#b91c1c] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <LogOut size={15} />
            <span>{isSubmitting ? "Signing Out..." : "Yes, Log Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
