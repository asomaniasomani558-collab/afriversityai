import React, { useState } from "react";
import { CommunityGroup, CommunityPost, StudentProfile } from "../../types/community";
import { useCommunity } from "../../context/CommunityContext";
import {
  X,
  Users,
  MessageSquare,
  Globe2,
  Building2,
  Plus,
  ThumbsUp,
  Share2,
  Calendar,
  BookOpen,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  Tag,
  ExternalLink,
  Flame,
  Award,
} from "lucide-react";

interface CommunityDetailModalProps {
  community: CommunityGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (student: StudentProfile) => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  community,
  isOpen,
  onClose,
  onViewProfile,
}) => {
  const {
    joinCommunity,
    leaveCommunity,
    activeCommunityPosts,
    createCommunityPost,
    likeCommunityPost,
    communityChatMessages,
    sendCommunityChatMessage,
    mySocialProfile,
    students,
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<"discussions" | "group-chat" | "members" | "events" | "resources">("discussions");
  
  // Post Creator State
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTag, setNewPostTag] = useState("Research");

  // Group Chat Message state
  const [chatInput, setChatInput] = useState("");

  if (!isOpen || !community) return null;

  const posts = activeCommunityPosts.filter((p) => p.communityId === community.id);
  const chatMessages = communityChatMessages[community.id] || [];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    createCommunityPost(community.id, newPostTitle.trim(), newPostContent.trim(), [newPostTag, community.category]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowCreatePost(false);
  };

  const handleSendGroupChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendCommunityChatMessage(community.id, chatInput.trim());
    setChatInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#12100d] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh] text-[#f5f5f4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#241f19] shrink-0">
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12100d] via-black/40 to-black/60" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-[#d4af37]/30 text-[#d6d3d1] hover:text-white transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            {community.type === "university" ? (
              <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-200 text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Building2 size={13} /> Official Campus Hub
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Globe2 size={13} /> Pan-African Network
              </span>
            )}
          </div>

          {/* Community Info Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-end gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#d4af37] overflow-hidden bg-[#1e1a14] shadow-xl shrink-0">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-[#f5f5f4] flex items-center gap-2">
                  <span>{community.name}</span>
                  {community.isVerifiedUniversity && (
                    <ShieldCheck size={18} className="text-[#f2ca50]" />
                  )}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#d0c5af] mt-1">
                  <span>{community.category}</span>
                  <span>•</span>
                  <span>{community.memberCount.toLocaleString()} African Scholars</span>
                </div>
              </div>
            </div>

            {/* Join Action */}
            <div className="shrink-0">
              {community.isJoined ? (
                <button
                  onClick={() => leaveCommunity(community.id)}
                  className="py-2 px-4 rounded-xl bg-emerald-950/80 hover:bg-red-950/70 border border-emerald-500/40 hover:border-red-500/40 text-emerald-300 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Check size={14} />
                  <span>Joined Community</span>
                </button>
              ) : (
                <button
                  onClick={() => joinCommunity(community.id)}
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#e5bd3b] hover:to-[#d97706] text-[#0c0a09] text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform active:scale-95"
                >
                  <Plus size={14} />
                  <span>Join Community</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#2d271f] bg-[#16130f] flex items-center gap-4 sm:gap-6 text-xs sm:text-sm overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab("discussions")}
            className={`py-3.5 border-b-2 font-semibold transition-all whitespace-nowrap ${
              activeTab === "discussions"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#a8a29e] hover:text-[#f5f5f4]"
            }`}
          >
            Discussions & Feed ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("group-chat")}
            className={`py-3.5 border-b-2 font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "group-chat"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#a8a29e] hover:text-[#f5f5f4]"
            }`}
          >
            <MessageSquare size={14} />
            <span>Live Group Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`py-3.5 border-b-2 font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "members"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#a8a29e] hover:text-[#f5f5f4]"
            }`}
          >
            <Users size={14} />
            <span>Scholars Directory</span>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`py-3.5 border-b-2 font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "events"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#a8a29e] hover:text-[#f5f5f4]"
            }`}
          >
            <Calendar size={14} />
            <span>Events & Sprints</span>
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`py-3.5 border-b-2 font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "resources"
                ? "border-[#f2ca50] text-[#f2ca50]"
                : "border-transparent text-[#a8a29e] hover:text-[#f5f5f4]"
            }`}
          >
            <BookOpen size={14} />
            <span>Shared Resources</span>
          </button>
        </div>

        {/* Modal Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#12100d]">
          {/* TAB 1: Discussions & Feed */}
          {activeTab === "discussions" && (
            <div className="space-y-5">
              {/* Post Creation Prompt */}
              <div className="bg-[#191510] border border-[#3c3427] rounded-2xl p-4 shadow-md">
                {!showCreatePost ? (
                  <div
                    onClick={() => setShowCreatePost(true)}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-[#241f18] transition-colors"
                  >
                    <img
                      src={mySocialProfile.avatar}
                      alt={mySocialProfile.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#d4af37]/30"
                    />
                    <div className="flex-1 bg-[#1e1a14] text-[#8c827a] text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#2d271f]">
                      Share a research breakthrough, question, or opportunity with {community.name}...
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCreatePost} className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#2d271f]">
                      <span className="text-xs font-bold text-[#f2ca50] uppercase">
                        Create Discussion Post
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCreatePost(false)}
                        className="text-[#8c827a] hover:text-[#f5f5f4]"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Title of research finding, topic, or opportunity..."
                      className="w-full bg-[#1e1a14] border border-[#3c3427] focus:border-[#f2ca50] rounded-xl p-2.5 text-xs sm:text-sm text-[#f5f5f4] focus:outline-none"
                    />

                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share details, methodology, code links, or discussion questions..."
                      rows={3}
                      className="w-full bg-[#1e1a14] border border-[#3c3427] focus:border-[#f2ca50] rounded-xl p-2.5 text-xs sm:text-sm text-[#f5f5f4] focus:outline-none"
                    />

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <select
                        value={newPostTag}
                        onChange={(e) => setNewPostTag(e.target.value)}
                        className="bg-[#1e1a14] border border-[#3c3427] text-xs text-[#d6d3d1] rounded-lg p-2 focus:outline-none"
                      >
                        <option value="Research">Research & Papers</option>
                        <option value="Scholarships">Scholarships & Grants</option>
                        <option value="Hackathon">Hackathon / Sprint</option>
                        <option value="StudyGroup">Study Group</option>
                        <option value="General">General Discussion</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCreatePost(false)}
                          className="px-3 py-1.5 rounded-xl text-xs text-[#a8a29e] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!newPostTitle.trim() || !newPostContent.trim()}
                          className="px-4 py-1.5 rounded-xl bg-[#f2ca50] text-[#0c0a09] font-bold text-xs hover:bg-[#d97706] disabled:opacity-40"
                        >
                          Publish Post
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Discussions List */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#191510] border border-[#3c3427] rounded-2xl p-5 shadow-lg space-y-3"
                  >
                    {/* Author row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-[#d4af37]/40"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#f5f5f4] flex items-center gap-1.5">
                            <span>{post.authorName}</span>
                            <span>{post.authorFlag}</span>
                          </div>
                          <div className="text-[11px] text-[#a8a29e]">
                            {post.authorUniversity} • {post.createdAt}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-[#241f18] text-[#f2ca50] text-[10px] font-semibold border border-[#d4af37]/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Title & Body */}
                    <div>
                      <h3 className="text-base font-bold text-[#f5f5f4] leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#d6d3d1] mt-2 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>

                    {/* Post Footer: Likes, Comments */}
                    <div className="pt-3 border-t border-[#2d271f] flex items-center justify-between text-xs text-[#8c827a]">
                      <button
                        onClick={() => likeCommunityPost(community.id, post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                          post.likedBy.includes(mySocialProfile.id)
                            ? "bg-[#f2ca50]/15 border-[#f2ca50]/40 text-[#f2ca50] font-bold"
                            : "bg-[#1f1a14] border-[#3c3427] text-[#a8a29e] hover:text-[#f5f5f4]"
                        }`}
                      >
                        <ThumbsUp size={14} />
                        <span>{post.likesCount} Helpful</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs text-[#a8a29e]">
                        <MessageSquare size={14} />
                        <span>{post.commentsCount || 0} Comments</span>
                      </div>
                    </div>

                    {/* Comments Stream if any */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#262017] space-y-2 pl-3 border-l-2 border-[#d4af37]/30">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="text-xs space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#f5f5f4]">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-[#8c827a]">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-[#d0c5af]/90">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Live Group Chat */}
          {activeTab === "group-chat" && (
            <div className="h-[480px] flex flex-col bg-[#16130f] rounded-2xl border border-[#3c3427] overflow-hidden">
              {/* Chat Header */}
              <div className="p-3 bg-[#1c1813] border-b border-[#2d271f] flex items-center justify-between text-xs text-[#a8a29e]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#f5f5f4] font-bold">
                    {community.name} Live Room
                  </span>
                </div>
                <span>Active discussions across all African timezones</span>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => {
                  const isMe = msg.senderId === mySocialProfile.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#d4af37]/30 shrink-0"
                      />
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                          isMe
                            ? "bg-[#9333ea]/80 text-white rounded-tr-none"
                            : "bg-[#241f19] text-[#f5f5f4] rounded-tl-none border border-[#3c3427]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-[11px] text-[#f2ca50]">
                            {msg.senderName} {msg.senderFlag}
                          </span>
                          <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat input form */}
              <form
                onSubmit={handleSendGroupChat}
                className="p-3 bg-[#1a1510] border-t border-[#2d271f] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Send live group message in ${community.name}...`}
                  className="flex-1 bg-[#12100d] border border-[#3c3427] rounded-xl py-2 px-3 text-xs text-[#f5f5f4] focus:outline-none focus:border-[#f2ca50]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-[#f2ca50] text-[#0c0a09] font-bold disabled:opacity-40 cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Scholars Directory */}
          {activeTab === "members" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {students.slice(0, 8).map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => onViewProfile(stu)}
                  className="p-3 rounded-xl bg-[#191510] hover:bg-[#241f18] border border-[#3c3427] flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#d4af37]/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#f5f5f4] truncate flex items-center gap-1">
                      <span>{stu.name}</span>
                      <span>{stu.countryFlag}</span>
                    </div>
                    <div className="text-[11px] text-[#a8a29e] truncate">
                      {stu.universityShort || stu.university}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Events & Sprints */}
          {activeTab === "events" && (
            <div className="space-y-3">
              {community.upcomingEvents && community.upcomingEvents.length > 0 ? (
                community.upcomingEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#191510] border border-[#3c3427] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#f5f5f4]">{evt.title}</div>
                      <div className="text-xs text-[#a8a29e] mt-1 flex items-center gap-2">
                        <Calendar size={13} className="text-[#f2ca50]" />
                        <span>{evt.date}</span>
                        <span>•</span>
                        <span>{evt.location}</span>
                      </div>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-xl bg-[#f2ca50] text-[#0c0a09] text-xs font-bold hover:bg-[#d97706] shadow">
                      RSVP / Join Room
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-xs text-[#8c827a]">
                  No live events scheduled this week. Check back for upcoming hackathon sprints!
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Resources & Guides */}
          {activeTab === "resources" && (
            <div className="space-y-3">
              {community.featuredResources && community.featuredResources.length > 0 ? (
                community.featuredResources.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#191510] border border-[#3c3427] flex items-center justify-between gap-3 hover:border-[#f2ca50]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#f2ca50]/15 text-[#f2ca50]">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#f5f5f4]">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-[#a8a29e] mt-0.5">{res.type}</div>
                      </div>
                    </div>

                    <a
                      href={res.url}
                      className="px-3 py-1.5 rounded-xl bg-[#241f19] border border-[#3c3427] hover:border-[#f2ca50] text-[#f2ca50] text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Access</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-xs text-[#8c827a]">
                  Curated academic papers, study notes, and datasets will be listed here.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
