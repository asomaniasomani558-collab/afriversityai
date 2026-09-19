export type PresenceStatus = "online" | "away" | "offline";

export interface PrivacySettings {
  whoCanMessage: "everyone" | "friends" | "none";
  whoCanFriendRequest: "everyone" | "friends-of-friends" | "none";
  whoCanSeeProfile: "everyone" | "students" | "friends";
  showOnlineStatus: boolean;
  allowMessagesFrom?: "everyone" | "friends-only" | "friends" | "none";
  allowFriendRequestsFrom?: "everyone" | "friends-of-friends" | "none";
  whoCanSeeOnlineStatus?: "everyone" | "friends" | "none";
}

export interface StudentPassportItem {
  id: string;
  type: "badge" | "certificate" | "hackathon" | "olympiad" | "publication";
  title: string;
  issuer: string;
  date: string;
  icon: string;
  verificationCode?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  country: string;
  countryFlag: string;
  university: string;
  universityShort?: string;
  fieldOfStudy: string;
  careerGoal: string;
  graduationYear: string;
  bio: string;
  skills: string[];
  interests: string[];
  languages: string[];
  opportunityInterests: string[];
  competitionInterests: string[];
  presenceStatus: PresenceStatus;
  lastActive: string;
  mutualFriendsCount: number;
  compatibilityScore: number; // e.g. 92
  matchReason?: string;
  friendsCount: number;
  joinedCommunitiesCount: number;
  projectsCount: number;
  isVerifiedMentor?: boolean;
  isVerifiedUniversity?: boolean;
  role?: string;
  privacySettings: PrivacySettings;
  passportItems: StudentPassportItem[];
  achievements: string[];
  certificates: string[];
}

export type CommunityTabType =
  | "discover"
  | "friends"
  | "requests"
  | "messages"
  | "communities"
  | "study-groups"
  | "mentors"
  | "privacy";

export interface FriendRequest {
  id: string;
  type?: "received" | "sent";
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserUniversity: string;
  fromUserCountry: string;
  fromUserFlag: string;
  fromUserField: string;
  toUserId: string;
  toUserName?: string;
  toUserAvatar?: string;
  toUserUniversity?: string;
  toUserCountry?: string;
  toUserFlag?: string;
  student?: StudentProfile;
  status: "pending" | "accepted" | "declined" | "canceled";
  createdAt: string;
  createdAtTimestamp?: number;
  updatedAt?: string;
  note?: string;
  mutualFriendsCount?: number;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  friendProfile?: StudentProfile;
  status: "active" | "blocked";
  blockedBy?: string;
  createdAt: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: "image" | "document" | "code" | "link";
  url: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  readBy?: string[];
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  } | null;
  attachments?: MessageAttachment[];
  isDeleted?: boolean;
  reactions?: Record<string, string[]>; // emoji -> [userIds]
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  otherUser: StudentProfile;
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: string;
    status: "sent" | "delivered" | "read";
  };
  unreadCount: number;
  isTyping?: boolean;
  typingUserName?: string;
  isMuted?: boolean;
  isBlocked?: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCountry: string;
  authorFlag: string;
  authorUniversity: string;
  title: string;
  content: string;
  tags: string[];
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  comments?: {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
  }[];
  attachments?: string[];
  createdAt: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  type: "pan-african" | "university";
  category: string;
  description: string;
  coverImage: string;
  avatar: string;
  memberCount: number;
  countryDistribution: { country: string; percentage: number; flag: string }[];
  moderators: { id: string; name: string; avatar: string; role: string }[];
  isVerifiedUniversity: boolean;
  universityId?: string;
  isJoined?: boolean;
  tags: string[];
  rules: string[];
  activeDiscussionsCount: number;
  upcomingEvents?: {
    title: string;
    date: string;
    location: string;
    attendees: number;
  }[];
  featuredResources?: {
    title: string;
    type: string;
    url: string;
  }[];
  createdAt: string;
}

export interface CommunityChatMessage {
  id: string;
  communityId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderFlag: string;
  text: string;
  timestamp: string;
  attachments?: MessageAttachment[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type:
    | "friend_request"
    | "friend_accepted"
    | "new_message"
    | "community_invite"
    | "community_activity"
    | "mentor_response"
    | "scholarship_alert"
    | "competition_deadline"
    | "ai_connection";
  title: string;
  message: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  targetId?: string;
  targetType?: "student" | "chat" | "community" | "scholarship" | "competition" | "mentor";
  isRead: boolean;
  createdAt: string;
  timeAgo?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  role?: string;
  organization: string;
  country: string;
  countryFlag: string;
  expertise: string[];
  bio: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  availableDays: string[];
  sessionsCompleted: number;
  hourlyRate: string;
  languages: string[];
  matchReason?: string;
}

export interface StudyGroupCircle {
  id: string;
  title: string;
  subject: string;
  description: string;
  membersCount: number;
  members?: string[];
  targetGoal: string;
  meetingSchedule: string;
  nextSessionDate?: string;
  platform: string;
  isPrivate: boolean;
  tags: string[];
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  goal: string;
  message: string;
  proposedDate?: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: "user" | "message" | "community" | "post";
  targetId: string;
  targetName?: string;
  reason: "spam" | "harassment" | "inappropriate" | "impersonation" | "hate_speech" | "other";
  details: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
}

export interface AISuggestion {
  student: StudentProfile;
  matchScore: number;
  sharedInterests: string[];
  commonGoal: string;
  aiExplanation: string;
}

export interface StudentFilterState {
  searchQuery: string;
  country: string;
  university: string;
  fieldOfStudy: string;
  careerGoal: string;
  skill: string;
  interest: string;
  language: string;
  graduationYear: string;
  opportunityInterest: string;
  competitionInterest: string;
  onlineOnly: boolean;
  matchThreshold: number;
}
