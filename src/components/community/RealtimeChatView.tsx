import React, { useState, useRef, useEffect } from "react";
import { useCommunity } from "../../context/CommunityContext";
import { StudentProfile, ChatMessage, MessageAttachment } from "../../types/community";
import {
  Send,
  Search,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  MoreVertical,
  ArrowLeft,
  X,
  Reply,
  Copy,
  Trash2,
  Flag,
  Ban,
  User,
  Sparkles,
  GraduationCap,
  Image as ImageIcon,
  FileCode,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface RealtimeChatViewProps {
  onViewProfile: (student: StudentProfile) => void;
  onOpenReport?: (student: StudentProfile) => void;
}

export const RealtimeChatView: React.FC<RealtimeChatViewProps> = ({
  onViewProfile,
  onOpenReport,
}) => {
  const {
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    setActiveConversationId,
    sendDirectMessage,
    deleteMessage,
    markConversationAsRead,
    mySocialProfile,
    blockUser,
    students,
    openDirectChatWith,
  } = useCommunity();

  const [messageText, setMessageText] = useState("");
  const [searchInbox, setSearchInbox] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; senderName: string; text: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showPeerMenu, setShowPeerMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, activeConversation?.isTyping]);

  // Mark as read when active conversation opens
  useEffect(() => {
    if (activeConversationId) {
      markConversationAsRead(activeConversationId);
    }
  }, [activeConversationId]);

  // Handle Send
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && attachments.length === 0) return;
    if (!activeConversationId) return;

    const currentText = messageText;
    const currentAttach = [...attachments];
    const currentReply = replyTo;

    setMessageText("");
    setAttachments([]);
    setReplyTo(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    await sendDirectMessage(activeConversationId, currentText, currentAttach, currentReply);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchInbox.trim()) return true;
    const q = searchInbox.toLowerCase();
    return (
      c.otherUser?.name.toLowerCase().includes(q) ||
      c.otherUser?.university.toLowerCase().includes(q) ||
      c.lastMessage?.text.toLowerCase().includes(q)
    );
  });

  const emojis = ["🌍", "✨", "🚀", "💡", "📚", "👏", "🔥", "🤝", "🎓", "🇬🇭", "🇳🇬", "🇰🇪", "🇿🇦", "❤️", "👍"];

  const handleAddAttachment = (type: "image" | "document" | "code") => {
    const sampleAttachments: Record<string, MessageAttachment> = {
      image: {
        id: `att-${Date.now()}`,
        name: "Research_Diagram_Masakhane.png",
        type: "image",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        size: "1.2 MB",
      },
      code: {
        id: `att-${Date.now()}`,
        name: "masakhane_eval.py",
        type: "code",
        url: "#",
        size: "14 KB",
      },
      document: {
        id: `att-${Date.now()}`,
        name: "Scholarship_Statement_Draft.pdf",
        type: "document",
        url: "#",
        size: "340 KB",
      },
    };
    setAttachments((prev) => [...prev, sampleAttachments[type]]);
    setShowAttachmentMenu(false);
  };

  return (
    <div className="bg-[#12100d] border border-[#d4af37]/30 rounded-3xl shadow-2xl overflow-hidden h-[720px] flex flex-col md:flex-row backdrop-blur-xl">
      {/* 1. LEFT PANEL: Conversations & Inbox Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 bg-[#16130f] border-r border-[#2d271f] flex flex-col ${
          activeConversationId ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Inbox Header */}
        <div className="p-4 border-b border-[#2d271f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-serif-title text-[#f5f5f4]">
              Scholar Messages
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] text-xs font-bold">
              {conversations.length}
            </span>
          </div>

          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-1.5 rounded-xl bg-[#f2ca50] hover:bg-[#d97706] text-[#0c0a09] font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
            title="Start new chat with scholar"
          >
            <span>+ New</span>
          </button>
        </div>

        {/* Search Inbox */}
        <div className="p-3 border-b border-[#2d271f]">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8a29e]"
            />
            <input
              type="text"
              value={searchInbox}
              onChange={(e) => setSearchInbox(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-[#1f1a14] border border-[#3c3427] focus:border-[#f2ca50] rounded-xl py-2 pl-9 pr-8 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none"
            />
            {searchInbox && (
              <button
                onClick={() => setSearchInbox("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c827a]"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List Stream */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#241f18]">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const peer = conv.otherUser;
              const isActive = conv.id === activeConversationId;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#282117] border-l-4 border-l-[#f2ca50]"
                      : "hover:bg-[#1c1813]"
                  }`}
                >
                  {/* Avatar with Presence */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-[#7e22ce] ring-1 ring-[#d4af37]/30 overflow-hidden">
                      <img
                        src={peer?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"}
                        alt={peer?.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#16130f] ${
                        peer?.presenceStatus === "online"
                          ? "bg-emerald-500"
                          : peer?.presenceStatus === "away"
                          ? "bg-amber-500"
                          : "bg-stone-500"
                      }`}
                    />
                  </div>

                  {/* Conversation info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="text-xs font-bold text-[#f5f5f4] truncate flex items-center gap-1">
                        <span>{peer?.name}</span>
                        <span className="text-[11px]">{peer?.countryFlag}</span>
                      </div>
                      <span className="text-[10px] text-[#8c827a] shrink-0">
                        {conv.lastMessage?.timestamp}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#a8a29e] truncate mb-1">
                      {peer?.universityShort || peer?.university}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#d0c5af]/80 truncate leading-tight flex items-center gap-1">
                        {conv.isTyping ? (
                          <span className="text-[#f2ca50] italic font-medium flex items-center gap-1">
                            <Sparkles size={11} className="animate-spin" /> typing...
                          </span>
                        ) : (
                          <span>{conv.lastMessage?.text || "Started conversation"}</span>
                        )}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#f2ca50] text-[#0c0a09] text-[10px] font-bold flex items-center justify-center shrink-0 shadow">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#8c827a]">
              No conversations found. Start a new chat with an African scholar!
            </div>
          )}
        </div>
      </div>

      {/* 2. RIGHT PANEL: Active Direct Chat Stream */}
      {activeConversation ? (
        <div className="flex-1 bg-[#12100d] flex flex-col h-full">
          {/* Active Chat Header */}
          <div className="p-3.5 sm:p-4 bg-[#181511] border-b border-[#2d271f] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile Back button */}
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-1.5 rounded-lg text-[#a8a29e] hover:text-[#f5f5f4]"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Peer Avatar */}
              <div
                onClick={() => onViewProfile(activeConversation.otherUser)}
                className="relative cursor-pointer group shrink-0"
              >
                <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] to-[#7e22ce] overflow-hidden group-hover:ring-2 group-hover:ring-[#f2ca50] transition-all">
                  <img
                    src={activeConversation.otherUser.avatar}
                    alt={activeConversation.otherUser.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#181511] ${
                    activeConversation.otherUser.presenceStatus === "online"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                />
              </div>

              {/* Peer Details */}
              <div
                onClick={() => onViewProfile(activeConversation.otherUser)}
                className="cursor-pointer"
              >
                <div className="text-sm font-bold text-[#f5f5f4] flex items-center gap-1.5 hover:text-[#f2ca50] transition-colors">
                  <span>{activeConversation.otherUser.name}</span>
                  <span>{activeConversation.otherUser.countryFlag}</span>
                  <ShieldCheck size={14} className="text-[#f2ca50]" />
                </div>
                <div className="text-[11px] text-[#a8a29e] flex items-center gap-2">
                  <span>{activeConversation.otherUser.university}</span>
                  <span>•</span>
                  <span className="text-emerald-400">
                    {activeConversation.isTyping ? "typing..." : "Active in network"}
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Header Actions */}
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => onViewProfile(activeConversation.otherUser)}
                className="hidden sm:flex px-3 py-1.5 rounded-xl bg-[#241f19] hover:bg-[#2f2820] border border-[#3c3427] text-xs font-semibold text-[#d0c5af] items-center gap-1.5"
              >
                <User size={13} />
                <span>Passport</span>
              </button>

              <button
                onClick={() => setShowPeerMenu(!showPeerMenu)}
                className="p-2 rounded-xl text-[#a8a29e] hover:text-[#f5f5f4] hover:bg-[#241f19]"
              >
                <MoreVertical size={16} />
              </button>

              {showPeerMenu && (
                <div className="absolute right-0 top-10 w-44 bg-[#1f1b16] border border-[#d4af37]/30 rounded-2xl shadow-2xl py-1 z-30 text-xs animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setShowPeerMenu(false);
                      onViewProfile(activeConversation.otherUser);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#d6d3d1] hover:bg-[#2d251a] flex items-center gap-2"
                  >
                    <GraduationCap size={13} className="text-[#f2ca50]" />
                    <span>View Academic Bio</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowPeerMenu(false);
                      if (onOpenReport) onOpenReport(activeConversation.otherUser);
                    }}
                    className="w-full px-3.5 py-2 text-left text-amber-300 hover:bg-[#2d251a] flex items-center gap-2"
                  >
                    <Flag size={13} />
                    <span>Report User</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowPeerMenu(false);
                      blockUser(activeConversation.otherUser.id);
                    }}
                    className="w-full px-3.5 py-2 text-left text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                  >
                    <Ban size={13} />
                    <span>Block User</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Encryption & Heritage Banner */}
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c1813] border border-[#d4af37]/20 text-[11px] text-[#a8a29e]">
                <ShieldCheck size={12} className="text-[#f2ca50]" />
                <span>Afriversity End-to-End Encrypted Pan-African Messenger</span>
              </div>
            </div>

            {/* Render Messages */}
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === mySocialProfile.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md md:max-w-lg p-3.5 rounded-2xl shadow-md relative ${
                      isMe
                        ? "bg-gradient-to-r from-[#9333ea]/80 to-[#7e22ce]/90 text-white rounded-br-none border border-[#c084fc]/30"
                        : "bg-[#1f1a14] text-[#f5f5f4] rounded-bl-none border border-[#3c3427]"
                    }`}
                  >
                    {/* Reply To Preview */}
                    {msg.replyTo && (
                      <div className="mb-2 p-2 rounded-lg bg-black/30 border-l-2 border-[#f2ca50] text-[11px] text-[#e5e2e1]">
                        <span className="font-bold text-[#f2ca50] block">
                          {msg.replyTo.senderName}
                        </span>
                        <p className="truncate opacity-80">{msg.replyTo.text}</p>
                      </div>
                    )}

                    {/* Text */}
                    {msg.text && (
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.attachments.map((att) => (
                          <div key={att.id}>
                            {att.type === "image" ? (
                              <div className="rounded-xl overflow-hidden border border-white/20">
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="w-full max-h-48 object-cover"
                                />
                              </div>
                            ) : (
                              <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-xs">
                                {att.type === "code" ? (
                                  <FileCode size={16} className="text-[#f2ca50]" />
                                ) : (
                                  <FileText size={16} className="text-[#9333ea]" />
                                )}
                                <span className="flex-1 truncate font-mono">{att.name}</span>
                                {att.size && <span className="text-[10px] opacity-70">{att.size}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Meta: Time + Status Tick */}
                    <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <span>
                          {msg.status === "read" ? (
                            <CheckCheck size={13} className="text-[#f2ca50]" />
                          ) : msg.status === "delivered" ? (
                            <CheckCheck size={13} />
                          ) : (
                            <Check size={13} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Action Hover Bar */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-[#8c827a] mt-1 px-1">
                    <button
                      onClick={() =>
                        setReplyTo({
                          id: msg.id,
                          senderName: msg.senderName,
                          text: msg.text || "Attachment",
                        })
                      }
                      className="hover:text-[#f2ca50] p-1 flex items-center gap-0.5"
                    >
                      <Reply size={11} /> Reply
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(msg.text)}
                      className="hover:text-[#f5f5f4] p-1 flex items-center gap-0.5"
                    >
                      <Copy size={11} /> Copy
                    </button>
                    {isMe && (
                      <button
                        onClick={() => deleteMessage(activeConversation.id, msg.id)}
                        className="hover:text-red-400 p-1 flex items-center gap-0.5"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {activeConversation.isTyping && (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#1f1a14] border border-[#3c3427] max-w-xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-[#d0c5af] ml-1">
                  {activeConversation.otherUser.name} is typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quoted Reply Banner */}
          {replyTo && (
            <div className="px-4 py-2 bg-[#1a1510] border-t border-[#2d271f] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Reply size={13} className="text-[#f2ca50]" />
                <span className="text-[#a8a29e]">Replying to</span>
                <span className="font-bold text-[#f5f5f4]">{replyTo.senderName}:</span>
                <span className="text-[#d6d3d1] truncate max-w-xs">{replyTo.text}</span>
              </div>
              <button onClick={() => setReplyTo(null)} className="text-[#8c827a] hover:text-[#f5f5f4]">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Attachments Preview Row */}
          {attachments.length > 0 && (
            <div className="px-4 py-2 bg-[#1a1510] border-t border-[#2d271f] flex items-center gap-2 overflow-x-auto">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="p-1.5 rounded-xl bg-[#282117] border border-[#d4af37]/30 flex items-center gap-2 text-xs"
                >
                  <span>{att.name}</span>
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                    className="text-[#8c827a] hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Message Input Control Bar */}
          <div className="p-3 sm:p-4 bg-[#181511] border-t border-[#2d271f] relative">
            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 p-3 bg-[#1f1a14] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-30 flex flex-wrap gap-2 max-w-xs animate-in zoom-in-95 duration-150">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setMessageText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                      inputRef.current?.focus();
                    }}
                    className="text-lg p-1.5 hover:bg-[#2e261d] rounded-lg transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Attachment Menu Popover */}
            {showAttachmentMenu && (
              <div className="absolute bottom-16 left-12 p-2 bg-[#1f1a14] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-30 space-y-1 w-48 text-xs animate-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleAddAttachment("image")}
                  className="w-full p-2 text-left text-[#f5f5f4] hover:bg-[#2e261d] rounded-xl flex items-center gap-2"
                >
                  <ImageIcon size={14} className="text-[#f2ca50]" />
                  <span>Attach Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAttachment("code")}
                  className="w-full p-2 text-left text-[#f5f5f4] hover:bg-[#2e261d] rounded-xl flex items-center gap-2"
                >
                  <FileCode size={14} className="text-[#9333ea]" />
                  <span>Attach Code / Script</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAttachment("document")}
                  className="w-full p-2 text-left text-[#f5f5f4] hover:bg-[#2e261d] rounded-xl flex items-center gap-2"
                >
                  <FileText size={14} className="text-emerald-400" />
                  <span>Attach Paper / PDF</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Emoji button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-[#a8a29e] hover:text-[#f2ca50] rounded-xl hover:bg-[#241f19] transition-colors"
                title="Add emoji"
              >
                <Smile size={18} />
              </button>

              {/* Attachment button */}
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-2 text-[#a8a29e] hover:text-[#f2ca50] rounded-xl hover:bg-[#241f19] transition-colors"
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>

              {/* Main Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message ${activeConversation.otherUser.name}...`}
                className="flex-1 bg-[#1e1a14] border border-[#3c3427] focus:border-[#f2ca50] rounded-xl py-2.5 px-4 text-xs sm:text-sm text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none focus:ring-1 focus:ring-[#f2ca50]/30 shadow-inner"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!messageText.trim() && attachments.length === 0}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] hover:from-[#e5bd3b] hover:to-[#d97706] disabled:opacity-40 disabled:cursor-not-allowed text-[#0c0a09] font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Empty Chat State */
        <div className="flex-1 bg-[#12100d] hidden md:flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1f1a14] border border-[#d4af37]/30 text-[#f2ca50] flex items-center justify-center mb-4 shadow-xl">
            <Sparkles size={28} />
          </div>
          <h4 className="text-xl font-bold font-serif-title text-[#f5f5f4]">
            Select a Scholar to Start Chatting
          </h4>
          <p className="text-xs text-[#a8a29e] max-w-sm mt-2 leading-relaxed">
            Connect across 54 countries with peers, research leads, and study partners. Exchange ideas, study notes, and hackathon project updates.
          </p>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="mt-5 px-5 py-2.5 rounded-full bg-[#f2ca50] hover:bg-[#d97706] text-[#0c0a09] text-xs font-bold shadow-lg transition-transform active:scale-95"
          >
            Start New Connection Chat
          </button>
        </div>
      )}

      {/* New Chat Picker Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#16130f] border border-[#d4af37]/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d271f]">
              <h4 className="text-base font-bold text-[#f5f5f4] font-serif-title">
                Start Conversation with Scholar
              </h4>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-[#8c827a] hover:text-[#f5f5f4]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {students.map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => {
                    openDirectChatWith(stu);
                    setShowNewChatModal(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#1f1a14] hover:bg-[#2b2319] border border-[#3c3427] flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#f5f5f4] truncate flex items-center gap-1">
                      <span>{stu.name}</span>
                      <span>{stu.countryFlag}</span>
                    </div>
                    <div className="text-[11px] text-[#a8a29e] truncate">
                      {stu.university} • {stu.fieldOfStudy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
