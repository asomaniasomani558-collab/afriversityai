import React, { useState } from "react";
import { useCommunity } from "../../context/CommunityContext";
import {
  Shield,
  Lock,
  Eye,
  Bell,
  Ban,
  Unlock,
  CheckCircle,
  Radio,
  UserCheck,
  Globe,
  Users,
  EyeOff,
  Sparkles,
  Check,
} from "lucide-react";

export const PrivacySettingsPanel: React.FC = () => {
  const {
    privacySettings,
    updatePrivacySettings,
    blockedUsers,
    unblockUser,
    mySocialProfile,
  } = useCommunity();

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const showFeedback = (text: string) => {
    setSavedNotice(text);
    setTimeout(() => {
      setSavedNotice(null);
    }, 2500);
  };

  return (
    <div id="privacy-settings-panel" className="space-y-6">
      {/* Panel Header */}
      <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f2ca50] to-[#b45309] text-[#0c0a09]">
                <Shield size={20} className="text-[#0c0a09]" />
              </div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#e5e2e1]">
                Privacy & Visibility Controls
              </h2>
            </div>
            <p className="text-xs text-[#a8a29e] max-w-xl">
              Configure your academic presence, choose who can view your profile credentials, and restrict who can send you direct messages or friend requests.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {savedNotice ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-bold animate-in fade-in">
                <Check size={14} />
                <span>{savedNotice}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firestore Synced</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Online Presence Status */}
        <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#262018]">
            <Radio size={16} className="text-[#f2ca50]" />
            <h3 className="text-sm font-bold text-[#f5f5f4]">
              Online Presence & Activity Dot
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Master Online Toggle */}
            <div className="p-3.5 rounded-xl bg-[#201d18] border border-[#383126] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-semibold text-[#f5f5f4]">
                  Show Live Online Status
                </div>
                <p className="text-[#a8a29e] text-[11px]">
                  Show an active green indicator dot next to your avatar in campus rosters
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={privacySettings.showOnlineStatus}
                  onChange={(e) => {
                    updatePrivacySettings({ showOnlineStatus: e.target.checked });
                    showFeedback(e.target.checked ? "Online status visible" : "Online status hidden");
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#383126] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2ca50]"></div>
              </label>
            </div>

            {/* Who can see your online status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#d0c5af] uppercase tracking-wider">
                Who can see when you are active
              </label>
              <select
                value={privacySettings.whoCanSeeOnlineStatus || "everyone"}
                disabled={!privacySettings.showOnlineStatus}
                onChange={(e) => {
                  updatePrivacySettings({ whoCanSeeOnlineStatus: e.target.value as any });
                  showFeedback("Presence visibility updated");
                }}
                className="w-full bg-[#201d18] border border-[#383126] text-xs text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50] disabled:opacity-40 cursor-pointer"
              >
                <option value="everyone">Everyone on Afriversity</option>
                <option value="friends">Connected Friends Only</option>
                <option value="none">Nobody (Stealth Mode)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Profile Information Visibility */}
        <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#262018]">
            <Eye size={16} className="text-[#f2ca50]" />
            <h3 className="text-sm font-bold text-[#f5f5f4]">
              Profile & Credential Visibility
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-[#a8a29e] text-[11px]">
              Control which scholars can view your full bio, GPA achievements, published projects, and student passport certifications.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#d0c5af] uppercase tracking-wider">
                Profile Visibility Scope
              </label>
              <select
                value={privacySettings.whoCanSeeProfile || "everyone"}
                onChange={(e) => {
                  updatePrivacySettings({ whoCanSeeProfile: e.target.value as any });
                  showFeedback("Profile visibility updated");
                }}
                className="w-full bg-[#201d18] border border-[#383126] text-xs text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
              >
                <option value="everyone">Public across Afriversity (Recommended)</option>
                <option value="students">Verified Enrolled Students Only</option>
                <option value="friends">Connected Friends Only</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#201d18]/60 border border-[#2d271f] text-[11px] text-[#a8a29e] flex items-center gap-2">
              <Globe size={14} className="text-[#f2ca50] shrink-0" />
              <span>
                Your university affiliation and name will remain visible in course forums and study circles.
              </span>
            </div>
          </div>
        </div>

        {/* 3. Friend Connection Requests */}
        <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#262018]">
            <Users size={16} className="text-[#f2ca50]" />
            <h3 className="text-sm font-bold text-[#f5f5f4]">
              Friend Requests Permission
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-[#a8a29e] text-[11px]">
              Define who is allowed to send you incoming connection and friend requests.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#d0c5af] uppercase tracking-wider">
                Allowed Connection Inquirers
              </label>
              <select
                value={
                  privacySettings.allowFriendRequestsFrom ||
                  privacySettings.whoCanFriendRequest ||
                  "everyone"
                }
                onChange={(e) => {
                  const val = e.target.value as any;
                  updatePrivacySettings({
                    allowFriendRequestsFrom: val,
                    whoCanFriendRequest: val,
                  });
                  showFeedback("Friend request permissions updated");
                }}
                className="w-full bg-[#201d18] border border-[#383126] text-xs text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
              >
                <option value="everyone">Anyone on Afriversity</option>
                <option value="friends-of-friends">Friends of Existing Friends Only</option>
                <option value="none">Nobody (Temporarily Pause Inbound Requests)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Direct Messages Permission */}
        <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#262018]">
            <Lock size={16} className="text-[#f2ca50]" />
            <h3 className="text-sm font-bold text-[#f5f5f4]">
              Direct Message Requests Permission
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-[#a8a29e] text-[11px]">
              Prevent unsolicited spam by choosing who can initiate 1-on-1 direct message conversations with you.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#d0c5af] uppercase tracking-wider">
                Allowed Messengers
              </label>
              <select
                value={
                  privacySettings.allowMessagesFrom ||
                  privacySettings.whoCanMessage ||
                  "everyone"
                }
                onChange={(e) => {
                  const val = e.target.value as any;
                  updatePrivacySettings({
                    allowMessagesFrom: val,
                    whoCanMessage: val === "friends-only" ? "friends" : val,
                  });
                  showFeedback("Messaging permissions updated");
                }}
                className="w-full bg-[#201d18] border border-[#383126] text-xs text-[#f5f5f4] rounded-xl p-2.5 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
              >
                <option value="everyone">All Verified Scholars</option>
                <option value="friends-only">Connected Friends Only</option>
                <option value="none">Nobody (Disable Inbound DMs)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Blocked Accounts Section */}
      <div className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-[#262018]">
          <div className="flex items-center gap-2">
            <Ban size={16} className="text-red-400" />
            <h3 className="text-sm font-bold text-[#f5f5f4]">
              Blocked Accounts ({blockedUsers.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#8c827a]">
            Blocked users cannot view your profile or contact you
          </span>
        </div>

        {blockedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
            {blockedUsers.map((item: any) => {
              const uid = typeof item === "string" ? item : item.id;
              const name = typeof item === "string" ? `User ${item}` : item.name;
              const univ = typeof item === "object" ? item.university : "University Scholar";

              return (
                <div
                  key={uid}
                  className="p-3 rounded-xl bg-[#201d18] border border-[#383126] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#f5f5f4] truncate">
                      {name}
                    </div>
                    <div className="text-[10px] text-[#a8a29e] truncate">{univ}</div>
                  </div>

                  <button
                    onClick={() => {
                      unblockUser(uid);
                      showFeedback(`Unblocked ${name}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#2d271f] hover:bg-[#3d3429] text-xs font-semibold text-[#f5f5f4] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Unlock size={12} />
                    <span>Unblock</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#a8a29e]">
            You have not blocked any accounts. If you encounter harassment or inappropriate conduct, you can block scholars from their profile.
          </p>
        )}
      </div>
    </div>
  );
};
