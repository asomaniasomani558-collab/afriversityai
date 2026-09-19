export type AppTheme = "deep-night" | "light-academic";

export type NavigationTab =
  | "lobby"
  | "dashboard"
  | "community"
  | "stem-sandbox"
  | "research-radar"
  | "my-courses"
  | "study-groups"
  | "scholarships"
  | "universities"
  | "ai-assistant"
  | "calendar"
  | "projects"
  | "messages"
  | "bookmarks"
  | "profile"
  | "login";

export interface Course {
  id: string;
  title: string;
  code: string;
  category: "Computer Science" | "Engineering" | "Design" | "Mathematics" | "Business" | "Humanities";
  progress: number;
  totalLessons: number;
  completedLessons: number;
  instructor: string;
  institution: string;
  timeLeft: string;
  description: string;
  iconName: string;
  status: "in-progress" | "completed" | "wishlist";
  rating: number;
  enrolledStudents: number;
  modules: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

export interface StudyGroup {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  description: string;
  iconName: string;
  accentColor?: string;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
  activeDiscussions: number;
  isJoined?: boolean;
  tags: string[];
}

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: string;
  type: "Full Ride" | "Merit-Based" | "Research" | "Partial" | "Fellowship";
  level: "Undergraduate" | "Postgraduate" | "Doctoral" | "All Levels";
  field: string;
  location: string;
  deadline: string;
  daysLeft?: number;
  description: string;
  eligibility: string[];
  benefits: string[];
  iconName: string;
  featured?: boolean;
}

export interface University {
  id: string;
  shortName: string;
  fullName: string;
  location: string;
  country: string;
  region: "West Africa" | "East Africa" | "Southern Africa" | "North Africa" | "Central Africa";
  established: number;
  studentsCount: string;
  rankBadge?: string;
  description: string;
  focusAreas: string[];
  imageUrl: string;
  website: string;
  acceptanceRate?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EventItem {
  id: string;
  title: string;
  dateDay: string;
  dateMonth: string;
  fullDate: string;
  time: string;
  location: string;
  isVirtual: boolean;
  attendeesCount: number;
  attendeeAvatars: string[];
  category: "Workshop" | "Hackathon" | "Conference" | "Seminar" | "Career" | "Symposium" | "Milestone" | "Deadline";
  description: string;
  speaker?: string;
  isRegistered?: boolean;
  registrationUrl?: string;
  registrationPlatform?: string;
  prizePool?: string;
  deadline?: string;
  tag?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  lead: string;
  university: string;
  category: string;
  description: string;
  status: "Active" | "Recruiting" | "Completed";
  membersCount: number;
  tags: string[];
  stars: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: string[];
    };
  };
}

export interface AIMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  isTyping?: boolean;
  model?: string;
  role?: "mentor" | "guide" | "researcher" | "engineer";
  groundingChunks?: GroundingChunk[];
  webSearchQueries?: string[];
  reaction?: "thumbs-up" | "thumbs-down" | null;
  feedbackReason?: string;
  savedToNotes?: boolean;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  title: string;
  role: string;
  university: string;
  location: string;
  country?: string;
  email: string;
  joinedDate: string;
  bio: string;
  heritageScore: number;
  heritageTier: "Gold Member" | "Elite Scholar" | "Heritage Pioneer";
  stats: {
    courses: number;
    groups: number;
    projects: number;
    badges: number;
  };
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    dateEarned: string;
  }[];
  recentActivity: {
    id: string;
    type: "completed" | "joined" | "submitted" | "commented";
    actionText: string;
    targetTitle: string;
    timeAgo: string;
  }[];
}

export type SupportedLanguage =
  | "English"
  | "Swahili"
  | "Yoruba"
  | "Twi"
  | "Amharic"
  | "Zulu"
  | "Hausa"
  | "French"
  | "Portuguese"
  | "Arabic";

export interface CareerPathway {
  id: string;
  title: string;
  discipline: string;
  category:
    | "Business & Finance"
    | "Law & Public Policy"
    | "Medicine & Healthcare"
    | "AI & Data"
    | "Software & Cloud"
    | "Cybersecurity & Fintech"
    | "Creative Arts & Design"
    | "Education & Social Sciences"
    | "Clean Energy & Power"
    | "Biomedical & Health"
    | "Robotics & Hardware"
    | "Civil & Infrastructure"
    | "Aerospace & Telecom"
    | "Agritech & Environmental"
    | "Mining & Materials";
  shortDescription: string;
  growthDemand: "Exponential" | "High" | "Critical";
  salaryRange: {
    africanHubs: string;
    globalRemoteUSD: string;
  };
  shortTermMilestones: {
    period: "0–6 Months";
    foundations: string[];
    certifications: string[];
    portfolioProject: string;
    targetJobTitles: string[];
  };
  midTermMilestones: {
    period: "1–3 Years";
    advancedSkills: string[];
    certifications: string[];
    portfolioProject: string;
    targetJobTitles: string[];
  };
  longTermMilestones: {
    period: "3–5+ Years";
    leadershipFocus: string[];
    fellowshipsAndScholarships: string[];
    targetJobTitles: string[];
  };
  keyToolsAndTech: string[];
  topHiringCompanies: string[];
  africanRealWorldImpact: string;
  recommendedSearchQuery: string;
}

export type ActivityType = "auth" | "course" | "community" | "profile" | "research" | "navigation";

export interface UserActivityRecord {
  id: string;
  userId: string;
  userName: string;
  action: string;
  actionType: ActivityType;
  targetTitle: string;
  details?: string;
  createdAt: string;
  timestamp: number;
}

export interface VoiceCommandRecord {
  id: string;
  userId: string;
  command: string;
  response: string;
  source: "ai-assistant" | "gemini-live" | "wake-word";
  discipline?: string;
  createdAt: string;
  timestamp: number;
}

export interface CourseModuleProgress {
  completed: boolean;
  completedAt?: string;
}

export interface CourseProgressDetail {
  courseId: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  completedModules: string[];
  status: "in-progress" | "completed" | "wishlist";
  lastAccessedAt: string;
}

export interface UserProgression {
  userId: string;
  email?: string;
  displayName?: string;
  heritageScore: number;
  heritageTier: "Gold Member" | "Elite Scholar" | "Heritage Pioneer";
  completedCoursesCount: number;
  enrolledCoursesCount: number;
  studyGroupsJoinedCount: number;
  badgesCount: number;
  courseProgress: Record<string, CourseProgressDetail>;
  joinedGroupIds: string[];
  bookmarkedCourseIds: string[];
  savedScholarshipIds: string[];
  lastActiveTab?: string;
  updatedAt: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface WorkspaceFolder {
  id: string;
  name: string;
  createdAt: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  folderId?: string;
  size: string;
  createdAt: string;
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  createdAt: string;
}

