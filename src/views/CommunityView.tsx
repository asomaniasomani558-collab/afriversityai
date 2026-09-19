import React, { useState } from "react";
import { useCommunity } from "../context/CommunityContext";
import { StudentProfile, CommunityGroup } from "../types/community";
import { LinkedInCommunityView } from "../components/community/LinkedInCommunityView";
import { RealtimeChatView } from "../components/community/RealtimeChatView";
import { CommunitiesList } from "../components/community/CommunitiesList";
import { MentorsSection } from "../components/community/MentorsSection";
import { StudyGroupsSection } from "../components/community/StudyGroupsSection";
import { StudentProfileModal } from "../components/community/StudentProfileModal";
import { CommunityDetailModal } from "../components/community/CommunityDetailModal";
import { FriendRequestsModal } from "../components/community/FriendRequestsModal";
import { AISocialAssistantModal } from "../components/community/AISocialAssistantModal";
import { PrivacySettingsModal } from "../components/community/PrivacySettingsModal";
import { ReportModal } from "../components/community/ReportModal";
import { AdminModerationModal } from "../components/community/AdminModerationModal";
import { FriendRequestsPanel } from "../components/community/FriendRequestsPanel";
import { PrivacySettingsPanel } from "../components/community/PrivacySettingsPanel";
import { MyNetworkModal } from "../components/community/MyNetworkModal";

export const CommunityView: React.FC = () => {
  const {
    activeCommunityTab,
    setActiveCommunityTab,
    friendRequests,
    unreadTotalMessages,
    friends,
    students,
  } = useCommunity();

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityGroup | null>(null);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showAdminModeration, setShowAdminModeration] = useState(false);
  const [showMyNetwork, setShowMyNetwork] = useState(false);
  const [reportTargetStudent, setReportTargetStudent] = useState<StudentProfile | null>(null);

  return (
    <div className="min-h-screen bg-[#0c0a08] text-[#f5f5f4]">
      {/* Primary LinkedIn-Style Social Feed & P2P Connection View */}
      {activeCommunityTab === "discover" ? (
        <LinkedInCommunityView
          onViewProfile={(stu) => setSelectedStudent(stu)}
          onOpenDirectChat={(stu) => setSelectedStudent(stu)}
          onNavigateTab={(tab) => {
            if (tab === "profile") {
              // open profile or student
            } else if (tab === "network") {
              setShowMyNetwork(true);
            } else if (tab === "study-groups") {
              setActiveCommunityTab("communities");
            }
          }}
        />
      ) : activeCommunityTab === "messages" ? (
        <div className="max-w-7xl mx-auto py-4">
          <RealtimeChatView
            onViewProfile={(stu) => setSelectedStudent(stu)}
            onOpenReport={(stu) => setReportTargetStudent(stu)}
          />
        </div>
      ) : activeCommunityTab === "communities" ? (
        <div className="max-w-7xl mx-auto py-4">
          <CommunitiesList
            onOpenCommunityDetail={(comm) => setSelectedCommunity(comm)}
          />
        </div>
      ) : activeCommunityTab === "study-groups" ? (
        <div className="max-w-7xl mx-auto py-4">
          <StudyGroupsSection />
        </div>
      ) : activeCommunityTab === "mentors" ? (
        <div className="max-w-7xl mx-auto py-4">
          <MentorsSection />
        </div>
      ) : activeCommunityTab === "requests" ? (
        <div className="max-w-7xl mx-auto py-4">
          <FriendRequestsPanel
            onViewProfile={(stu) => setSelectedStudent(stu)}
            onOpenDirectChat={() => setActiveCommunityTab("messages")}
          />
        </div>
      ) : activeCommunityTab === "privacy" ? (
        <div className="max-w-7xl mx-auto py-4">
          <PrivacySettingsPanel />
        </div>
      ) : (
        <LinkedInCommunityView
          onViewProfile={(stu) => setSelectedStudent(stu)}
          onOpenDirectChat={(stu) => setSelectedStudent(stu)}
        />
      )}

      {/* ALL MODALS */}
      {/* 1. Student Passport & Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        onOpenReport={(stu) => setReportTargetStudent(stu)}
      />

      {/* 2. Community Hub Detail Modal */}
      <CommunityDetailModal
        community={selectedCommunity}
        isOpen={Boolean(selectedCommunity)}
        onClose={() => setSelectedCommunity(null)}
        onViewProfile={(stu) => setSelectedStudent(stu)}
      />

      {/* 3. Friend Requests Modal */}
      <FriendRequestsModal
        isOpen={showFriendRequests}
        onClose={() => setShowFriendRequests(false)}
        onViewProfile={(stu) => setSelectedStudent(stu)}
      />

      {/* 4. AI Match Assistant Modal */}
      <AISocialAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onViewProfile={(stu) => setSelectedStudent(stu)}
      />

      {/* 5. Privacy & Safety Settings Modal */}
      <PrivacySettingsModal
        isOpen={showPrivacySettings}
        onClose={() => setShowPrivacySettings(false)}
      />

      {/* 6. Report Content / User Modal */}
      <ReportModal
        student={reportTargetStudent}
        isOpen={Boolean(reportTargetStudent)}
        onClose={() => setReportTargetStudent(null)}
      />

      {/* 7. Admin Moderation Dashboard Modal */}
      <AdminModerationModal
        isOpen={showAdminModeration}
        onClose={() => setShowAdminModeration(false)}
      />

      {/* 8. My Network Modal */}
      <MyNetworkModal
        isOpen={showMyNetwork}
        onClose={() => setShowMyNetwork(false)}
        onViewProfile={(stu) => setSelectedStudent(stu)}
      />
    </div>
  );
};
