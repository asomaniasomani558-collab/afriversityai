import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { LobbyView } from "./components/LobbyView";
import { DashboardView } from "./components/DashboardView";
import { CoursesView } from "./components/CoursesView";
import { StudyGroupsView } from "./components/StudyGroupsView";
import { ScholarshipsView } from "./components/ScholarshipsView";
import { UniversitiesView } from "./components/UniversitiesView";
import { EventsView } from "./components/EventsView";
import { AIAssistantView } from "./components/AIAssistantView";
import { ProfileView } from "./components/ProfileView";
import { ProjectsView } from "./components/ProjectsView";
import { STEMSandboxView } from "./components/STEMSandboxView";
import { ResearchRadarView } from "./components/ResearchRadarView";
import { MessagesModal } from "./components/MessagesModal";
import { BookmarksModal } from "./components/BookmarksModal";

import {
  NavigationTab,
  UserProfile,
  Course,
  StudyGroup,
  Scholarship,
  University,
  EventItem,
  ProjectItem,
} from "./types";

import {
  initialUserProfile,
  initialCourses,
  initialStudyGroups,
  initialScholarships,
  initialUniversities,
  initialEvents,
  initialProjects,
} from "./data/mockData";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CommunityProvider } from "./context/CommunityContext";
import { VoiceActivationProvider } from "./context/VoiceActivationContext";
import { updateCourseProgression } from "./services/progressionService";
import { CommunityView } from "./views/CommunityView";
import { AuthModal } from "./components/AuthModal";
import { SignInEntrancePage } from "./components/SignInEntrancePage";
import { AfriEmblem } from "./components/AfriEmblem";
import { GlobalActivationAssistant } from "./components/GlobalActivationAssistant";
import { GeminiLiveVoiceModal } from "./components/GeminiLiveVoiceModal";
import { useVoiceActivation } from "./context/VoiceActivationContext";

const AppContent: React.FC = () => {
  const { theme, isLightMode } = useTheme();
  const {
    isLiveConversationOpen,
    closeLiveConversation,
    livePrompt,
    liveTopic,
  } = useVoiceActivation();
  const {
    currentUser,
    isGuest,
    isLoading,
    userData,
    updateUserData,
    showLoginScreen,
    setShowLoginScreen,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>("lobby");
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("afriversty_user_profile");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return initialUserProfile;
  });

  // Sync user state with Firestore Auth profile if logged in
  React.useEffect(() => {
    if (userData) {
      setUser((prev) => ({
        ...prev,
        name: userData.displayName || prev.name,
        email: userData.email || prev.email,
        role: userData.role || prev.role,
        university: userData.university || prev.university,
        location: userData.location || prev.location,
        bio: userData.bio || prev.bio,
        avatar: userData.avatar || prev.avatar,
        heritageScore: userData.heritageScore || prev.heritageScore,
        heritageTier: userData.heritageTier || prev.heritageTier,
      }));
    }
  }, [userData]);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(initialStudyGroups);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [universities] = useState<University[]>(initialUniversities);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Toggle study group join
  const handleToggleJoinGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newJoined = !g.isJoined;
          return {
            ...g,
            isJoined: newJoined,
            membersCount: newJoined ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
  };

  // Create new group
  const handleCreateGroup = (newGroupData: Partial<StudyGroup>) => {
    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: newGroupData.name || "New Study Circle",
      category: newGroupData.category || "General",
      membersCount: 1,
      description: newGroupData.description || "Active peer cohort.",
      iconName: "groups",
      activeDiscussions: 1,
      isJoined: true,
      tags: newGroupData.tags || ["Academic", "Innovation"],
      members: [
        {
          id: "u-kofi",
          name: user.name,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          role: "Lead",
        },
      ],
    };
    setStudyGroups([newGroup, ...studyGroups]);
  };

  // Course progress completion
  const handleUpdateCourseProgress = (courseId: string, moduleId: string) => {
    let allCompletedModuleIds: string[] = [];
    let totalLessonsCount = 1;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedModules = c.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: true } : m
          );
          allCompletedModuleIds = updatedModules.filter((m) => m.completed).map((m) => m.id);
          totalLessonsCount = updatedModules.length;
          const completedCount = allCompletedModuleIds.length;
          const newProgress = Math.round((completedCount / updatedModules.length) * 100);
          return {
            ...c,
            modules: updatedModules,
            completedLessons: completedCount,
            progress: newProgress,
            status: newProgress === 100 ? "completed" : c.status,
          };
        }
        return c;
      })
    );

    // Persist to Firestore database
    const targetUserId = currentUser?.uid || "guest";
    if (allCompletedModuleIds.length > 0) {
      updateCourseProgression(
        targetUserId,
        courseId,
        moduleId,
        totalLessonsCount,
        allCompletedModuleIds
      ).catch(() => {});
    }

    if (selectedCourse && selectedCourse.id === courseId) {
      const updatedModules = selectedCourse.modules.map((m) =>
        m.id === moduleId ? { ...m, completed: true } : m
      );
      const completedCount = updatedModules.filter((m) => m.completed).length;
      setSelectedCourse({
        ...selectedCourse,
        modules: updatedModules,
        completedLessons: completedCount,
        progress: Math.round((completedCount / updatedModules.length) * 100),
      });
    }
  };

  // Event registration toggle
  const handleToggleRegister = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              isRegistered: !e.isRegistered,
              attendeesCount: !e.isRegistered ? e.attendeesCount + 1 : e.attendeesCount - 1,
            }
          : e
      )
    );
  };

  // Profile update
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem("afriversty_user_profile", JSON.stringify(next));
      } catch {
        // storage fallback
      }
      return next;
    });

    if (userData) {
      updateUserData({
        displayName: updated.name ?? userData.displayName,
        bio: updated.bio ?? userData.bio,
        location: updated.location ?? userData.location,
        university: updated.university ?? userData.university,
        avatar: updated.avatar ?? userData.avatar,
      });
    }
  };

  // If loading Firebase authentication state
  if (isLoading) {
    return (
      <div
        id="app-auth-loading"
        className={`min-h-screen w-full flex flex-col items-center justify-center transition-colors ${
          isLightMode ? "bg-[#fcfbfa] text-[#8c6204]" : "bg-[#0c0a09] text-[#f2ca50]"
        }`}
      >
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <AfriEmblem size="lg" className="animate-pulse" />
          <div className="flex items-center gap-2 font-serif-title font-bold text-base sm:text-lg tracking-wider">
            <span>Connecting to Pan-African Academic Network...</span>
          </div>
        </div>
      </div>
    );
  }

  // Dedicated Signing In & Onboarding Page:
  // Shown when opening the app, when not authenticated, or when switched to login view
  if (showLoginScreen || (!currentUser && !isGuest) || activeTab === "login") {
    return <SignInEntrancePage />;
  }

  return (
    <div
      id="app-root"
      className={`min-h-screen font-sans-body flex flex-col relative transition-colors duration-300 ${
        isLightMode
          ? "bg-[#f7f5f0] text-[#1c1915] selection:bg-[#d4af37]/40 selection:text-[#8c6204]"
          : "bg-[#0f0e0c] text-[#e5e2e1] selection:bg-[#d4af37]/30 selection:text-[#f2ca50]"
      }`}
    >
      {/* Immersive Blended African Heritage Background (Adaptive for Deep Night & Light Academic) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* The Adaptive Background Image: African Folk Art Pattern in Light Mode, Sunset Silhouette in Deep Night */}
        <img
          src={isLightMode ? "/african_light_pattern.jpg" : "/african_sunset_bg.jpg"}
          alt={isLightMode ? "African Folk Art Textile Pattern" : "African Savannah Horizon"}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transform scale-[1.02] transition-all duration-700 ${
            isLightMode
              ? "filter brightness-[1.03] contrast-[1.05] saturate-[1.10] opacity-[0.20] mix-blend-multiply"
              : "filter brightness-[0.75] contrast-[1.12] saturate-[1.15] opacity-[0.35]"
          }`}
        />

        {/* Adaptive Dynamic CSS Overlay Layer with Tuned Opacity & Blur for Perfect Contrast */}
        <div className="bg-adaptive-overlay" />

        {/* Golden Solar Radial Bloom */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isLightMode
              ? "bg-[radial-gradient(ellipse_at_50%_25%,rgba(212,175,55,0.12)_0%,rgba(247,245,240,0.45)_50%,transparent_80%)]"
              : "bg-[radial-gradient(ellipse_at_62%_38%,rgba(242,202,80,0.18)_0%,rgba(224,114,30,0.08)_35%,transparent_70%)] mix-blend-screen"
          }`}
        />

        {/* African Geometric Mesh Accent */}
        <div
          className={`absolute inset-0 african-kente-pattern pointer-events-none transition-opacity duration-500 ${
            isLightMode ? "opacity-[0.03]" : "opacity-10"
          }`}
        />

        {/* Vignette in Dark Mode */}
        {!isLightMode && (
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] pointer-events-none" />
        )}
      </div>

      {/* Desktop Navigation Sidebar (Fixed left) */}
      <div className="hidden lg:block relative z-30">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          user={user}
        />
      </div>

      {/* Main App Bar Header */}
      <div className={`relative z-30 ${activeTab === "ai-assistant" ? "hidden lg:block" : ""}`}>
        <Header
          user={user}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      {/* Main Content Area */}
      <main
        id="app-main-content"
        className={`main-container flex-1 lg:pl-72 w-full mx-auto relative z-10 transition-all ${
          activeTab === "ai-assistant"
            ? "max-w-[1680px] p-0 lg:px-6 lg:pt-24 lg:pb-12 h-[100dvh] lg:h-auto overflow-hidden lg:overflow-visible"
            : "max-w-7xl pt-24 pb-24 lg:pb-12 px-3 sm:px-6 lg:px-8"
        }`}
      >
        {activeTab === "lobby" && (
          <LobbyView setActiveTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === "community" && <CommunityView />}

        {activeTab === "dashboard" && (
          <DashboardView
            user={user}
            courses={courses}
            setActiveTab={setActiveTab}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setActiveTab("my-courses");
            }}
          />
        )}

        {activeTab === "my-courses" && (
          <CoursesView
            courses={courses}
            selectedCourse={selectedCourse}
            onSelectCourse={setSelectedCourse}
            onUpdateCourseProgress={handleUpdateCourseProgress}
          />
        )}

        {activeTab === "study-groups" && (
          <StudyGroupsView
            studyGroups={studyGroups}
            onToggleJoinGroup={handleToggleJoinGroup}
            onCreateGroup={handleCreateGroup}
          />
        )}

        {activeTab === "scholarships" && (
          <ScholarshipsView scholarships={scholarships} />
        )}

        {activeTab === "universities" && (
          <UniversitiesView universities={universities} />
        )}

        {activeTab === "calendar" && (
          <EventsView events={events} onToggleRegister={handleToggleRegister} />
        )}

        {activeTab === "ai-assistant" && (
          <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto lg:static lg:inset-auto lg:z-auto w-full h-full lg:h-auto">
            <AIAssistantView
              onBack={() => setActiveTab("dashboard")}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileView user={user} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeTab === "projects" && <ProjectsView projects={projects} />}

        {activeTab === "stem-sandbox" && <STEMSandboxView />}

        {activeTab === "research-radar" && <ResearchRadarView />}

        {activeTab === "messages" && <MessagesModal />}

        {activeTab === "bookmarks" && (
          <BookmarksModal
            scholarships={scholarships}
            courses={courses}
            setActiveTab={setActiveTab}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setActiveTab("my-courses");
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className={activeTab === "ai-assistant" ? "hidden lg:block" : ""}>
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* Global Voice & Activation Word Assistant (Accessible anywhere in the webapp) */}
      <GlobalActivationAssistant
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Global Gemini Live Voice Chatbot Modal (Triggered by wake-word or live voice controls) */}
      <GeminiLiveVoiceModal
        isOpen={isLiveConversationOpen}
        onClose={closeLiveConversation}
        initialPrompt={livePrompt}
        initialTopic={liveTopic}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CommunityProvider>
            <VoiceActivationProvider>
              <AppContent />
            </VoiceActivationProvider>
          </CommunityProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
