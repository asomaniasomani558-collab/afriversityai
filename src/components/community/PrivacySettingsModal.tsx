import React from "react";
import { useCommunity } from "../../context/CommunityContext";
import {
  X,
  Shield,
  Lock,
  Eye,
  Bell,
  Ban,
  Unlock,
  CheckCircle,
} from "lucide-react";

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    privacySettings,
    updatePrivacySettings,
    blockedUsers,
    unblockUser,
  } = useCommunity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-5 text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2d271f]">
          <div className="flex items-center gap-2.5">
            <Shield size={20} className="text-[#f2ca50]" />
            <h3 className="text-base font-bold font-serif-title">
              Afriversity Privacy & Safety Controls
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c827a] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Who can direct message me */}
          <div className="p-3.5 rounded-2xl bg-[#191510] border border-[#2d271f] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-[#f5f5f4] flex items-center gap-1.5">
                <Lock size={13} className="text-[#f2ca50]" />
                <span>Direct Messaging Permission</span>
              </div>
              <p className="text-[#a8a29e] mt-0.5">
                Who can initiate direct messages with you
              </p>
            </div>
            <select
              value={privacySettings.allowMessagesFrom}
              onChange={(e) =>
                updatePrivacySettings({
                  allowMessagesFrom: e.target.value as any,
                })
              }
              className="bg-[#241f19] border border-[#3c3427] text-xs text-[#f5f5f4] rounded-xl p-2 focus:outline-none"
            >
              <option value="everyone">All Verified Scholars</option>
              <option value="friends-only">Connected Friends Only</option>
              <option value="none">Nobody</option>
            </select>
          </div>

          {/* Who can send friend requests */}
          <div className="p-3.5 rounded-2xl bg-[#191510] border border-[#2d271f] flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-[#f5f5f4] flex items-center gap-1.5">
                <Eye size={13} className="text-[#f59e0b]" />
                <span>Connection Requests</span>
              </div>
              <p className="text-[#a8a29e] mt-0.5">
                Who can send you friend connection requests
              </p>
            </div>
            <select
              value={privacySettings.allowFriendRequestsFrom}
              onChange={(e) =>
                updatePrivacySettings({
                  allowFriendRequestsFrom: e.target.value as any,
                })
              }
              className="bg-[#241f19] border border-[#3c3427] text-xs text-[#f5f5f4] rounded-xl p-2 focus:outline-none"
            >
              <option value="everyone">Anyone on Afriversity</option>
              <option value="friends-of-friends">Friends of Friends</option>
              <option value="none">Nobody</option>
            </select>
          </div>

          {/* Show Online Status */}
          <div className="p-3.5 rounded-2xl bg-[#191510] border border-[#2d271f] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#f5f5f4]">Show Online Activity Dot</div>
              <p className="text-[#a8a29e] mt-0.5">
                Display your active presence status in student directory
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.showOnlineStatus}
              onChange={(e) =>
                updatePrivacySettings({ showOnlineStatus: e.target.checked })
              }
              className="w-4 h-4 accent-[#f2ca50] cursor-pointer"
            />
          </div>

          {/* Blocked Accounts Section */}
          <div className="pt-2">
            <h4 className="text-xs uppercase font-bold text-[#a8a29e] mb-2 flex items-center gap-1.5">
              <Ban size={13} className="text-red-400" />
              <span>Blocked Accounts ({blockedUsers.length})</span>
            </h4>

            {blockedUsers.length > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {blockedUsers.map((item: any) => {
                  const uid = typeof item === "string" ? item : item.id;
                  const name = typeof item === "string" ? `User ${item}` : item.name;
                  return (
                    <div
                      key={uid}
                      className="p-2.5 rounded-xl bg-[#191510] border border-[#2d271f] flex items-center justify-between"
                    >
                      <span className="font-medium text-xs text-[#d6d3d1]">{name}</span>
                      <button
                        onClick={() => unblockUser(uid)}
                        className="px-2.5 py-1 rounded-lg bg-[#241f19] hover:bg-[#2d251a] text-xs text-[#f2ca50] flex items-center gap-1"
                      >
                        <Unlock size={12} />
                        <span>Unblock</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#191510] border border-[#2d271f] text-center text-xs text-[#8c827a]">
                You have not blocked any accounts.
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#f2ca50] text-[#0c0a09] text-xs font-bold hover:bg-[#d97706]"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
