import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Circle,
  Sparkles,
  PhoneOff,
  MicOff,
  VideoOff,
  Users,
  UserPlus,
  Minimize2,
  Maximize2,
  Volume2,
  FileText,
  Code,
  Image as ImageIcon,
  Pin,
  ExternalLink,
  Bot,
  Filter,
} from "lucide-react";
import { StudentProfile } from "../../types/community";

export interface P2PChatThread {
  id: string;
  peer: {
    id: string;
    name: string;
    avatar: string;
    university: string;
    field: string;
    country: string;
    countryFlag: string;
    status: "online" | "away" | "offline";
    lastActive: string;
  };
  lastMessage: {
    text: string;
    time: string;
    isMe: boolean;
    unread: boolean;
  };
  unreadCount: number;
  isPinned?: boolean;
  category: "peer" | "group" | "mentor";
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    time: string;
    isMe: boolean;
    status: "sent" | "delivered" | "read";
    attachment?: {
      type: "image" | "file" | "code" | "audio";
      name: string;
      url?: string;
      size?: string;
    };
  }[];
}

interface PersistentChatSidebarProps {
  onViewProfile?: (student: StudentProfile) => void;
  activePeerOverride?: StudentProfile | null;
  onClearActivePeerOverride?: () => void;
}

export const PersistentChatSidebar: React.FC<PersistentChatSidebarProps> = ({
  onViewProfile,
  activePeerOverride,
  onClearActivePeerOverride,
}) => {
  // Sidebar visibility & display state
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | "unread" | "peers" | "mentors">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Initial rich peer threads
  const [threads, setThreads] = useState<P2PChatThread[]>([
    {
      id: "thread-aisha",
      peer: {
        id: "rec-aisha",
        name: "Aisha Mohammed",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        university: "University of Ibadan",
        field: "Computer Science • UI",
        country: "Nigeria",
        countryFlag: "🇳🇬",
        status: "online",
        lastActive: "Active now",
      },
      lastMessage: {
        text: "Hey Kojo! Would love to team up on the Pan-African AI Hackathon! 🚀",
        time: "2m ago",
        isMe: false,
        unread: true,
      },
      unreadCount: 2,
      isPinned: true,
      category: "peer",
      messages: [
        {
          id: "m-1",
          senderId: "rec-aisha",
          senderName: "Aisha Mohammed",
          text: "Hi Kojo! Saw your post about the smart agricultural AI model.",
          time: "10:14 AM",
          isMe: false,
          status: "read",
        },
        {
          id: "m-2",
          senderId: "me",
          senderName: "Kojo Boateng",
          text: "Hey Aisha! Yes, we just finalized the dataset for Ghanaian & Nigerian soil classification!",
          time: "10:16 AM",
          isMe: true,
          status: "read",
        },
        {
          id: "m-3",
          senderId: "rec-aisha",
          senderName: "Aisha Mohammed",
          text: "That's incredible! I can help with the PyTorch model optimization.",
          time: "10:18 AM",
          isMe: false,
          status: "read",
        },
        {
          id: "m-4",
          senderId: "rec-aisha",
          senderName: "Aisha Mohammed",
          text: "Hey Kojo! Would love to team up on the Pan-African AI Hackathon! 🚀",
          time: "10:20 AM",
          isMe: false,
          status: "read",
        },
      ],
    },
    {
      id: "thread-kwame",
      peer: {
        id: "stu-kwame",
        name: "Kwame Mensah",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        university: "KNUST",
        field: "Engineering",
        country: "Ghana",
        countryFlag: "🇬🇭",
        status: "online",
        lastActive: "Active now",
      },
      lastMessage: {
        text: "Are you free tonight at 7 PM for DSA practice?",
        time: "1h ago",
        isMe: false,
        unread: true,
      },
      unreadCount: 1,
      isPinned: true,
      category: "peer",
      messages: [
        {
          id: "km-1",
          senderId: "stu-kwame",
          senderName: "Kwame Mensah",
          text: "Yo Kojo! Did you finish the LeetCode Trees & Graphs set?",
          time: "09:00 AM",
          isMe: false,
          status: "read",
        },
        {
          id: "km-2",
          senderId: "me",
          senderName: "Kojo Boateng",
          text: "Almost done with the Trie tree implementation. Let's compare code.",
          time: "09:15 AM",
          isMe: true,
          status: "read",
        },
        {
          id: "km-3",
          senderId: "stu-kwame",
          senderName: "Kwame Mensah",
          text: "Are you free tonight at 7 PM for DSA practice?",
          time: "1h ago",
          isMe: false,
          status: "read",
        },
      ],
    },
    {
      id: "thread-ama",
      peer: {
        id: "stu-ama",
        name: "Ama Serwaa",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        university: "University of Ghana",
        field: "Computer Science",
        country: "Ghana",
        countryFlag: "🇬🇭",
        status: "online",
        lastActive: "Active 5m ago",
      },
      lastMessage: {
        text: "Thanks for sharing those NLP lecture slides! 🙌",
        time: "3h ago",
        isMe: false,
        unread: false,
      },
      unreadCount: 0,
      category: "peer",
      messages: [
        {
          id: "am-1",
          senderId: "me",
          senderName: "Kojo Boateng",
          text: "Sent you the Twi and Yoruba language NLP transformers repository!",
          time: "Yesterday",
          isMe: true,
          status: "read",
        },
        {
          id: "am-2",
          senderId: "stu-ama",
          senderName: "Ama Serwaa",
          text: "Thanks for sharing those NLP lecture slides! 🙌",
          time: "3h ago",
          isMe: false,
          status: "read",
        },
      ],
    },
    {
      id: "thread-grace",
      peer: {
        id: "stu-grace",
        name: "Grace Ndlovu",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
        university: "University of Cape Town",
        field: "Business • UCT",
        country: "South Africa",
        countryFlag: "🇿🇦",
        status: "away",
        lastActive: "Active 2h ago",
      },
      lastMessage: {
        text: "Let's review the AfCFTA FinTech submission draft.",
        time: "Yesterday",
        isMe: false,
        unread: false,
      },
      unreadCount: 0,
      category: "peer",
      messages: [
        {
          id: "gn-1",
          senderId: "stu-grace",
          senderName: "Grace Ndlovu",
          text: "Let's review the AfCFTA FinTech submission draft.",
          time: "Yesterday",
          isMe: false,
          status: "read",
        },
      ],
    },
    {
      id: "thread-chinedu",
      peer: {
        id: "stu-chinedu",
        name: "Chinedu Okafor",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        university: "University of Lagos",
        field: "Data Science & AI",
        country: "Nigeria",
        countryFlag: "🇳🇬",
        status: "offline",
        lastActive: "Active 1d ago",
      },
      lastMessage: {
        text: "The IoT solar tracker schematics look solid!",
        time: "2d ago",
        isMe: false,
        unread: false,
      },
      unreadCount: 0,
      category: "peer",
      messages: [
        {
          id: "co-1",
          senderId: "stu-chinedu",
          senderName: "Chinedu Okafor",
          text: "The IoT solar tracker schematics look solid!",
          time: "2d ago",
          isMe: false,
          status: "read",
        },
      ],
    },
    {
      id: "thread-mentor-samir",
      peer: {
        id: "mentor-samir",
        name: "Dr. Amina Touré",
        avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80",
        university: "Cheikh Anta Diop Univ",
        field: "Senior AI Researcher & Mentor",
        country: "Senegal",
        countryFlag: "🇸🇳",
        status: "online",
        lastActive: "Active now",
      },
      lastMessage: {
        text: "Your research abstract for the Pan-African Conference is approved!",
        time: "3d ago",
        isMe: false,
        unread: false,
      },
      unreadCount: 0,
      category: "mentor",
      messages: [
        {
          id: "at-1",
          senderId: "mentor-samir",
          senderName: "Dr. Amina Touré",
          text: "Your research abstract for the Pan-African Conference is approved!",
          time: "3d ago",
          isMe: false,
          status: "read",
        },
      ],
    },
  ]);

  // Active Selected Thread
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>("thread-aisha");
  const [messageInput, setMessageInput] = useState("");
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");

  // WebRTC Call Simulation State
  const [activeCall, setActiveCall] = useState<{
    type: "audio" | "video";
    peerName: string;
    peerAvatar: string;
    duration: number;
    isMuted: boolean;
    isVideoOff: boolean;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (selectedThreadId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedThreadId, threads, isPeerTyping]);

  // Handle external peer override
  useEffect(() => {
    if (activePeerOverride) {
      // Check if thread exists
      const existingThread = threads.find((t) => t.peer.id === activePeerOverride.id || t.peer.name === activePeerOverride.name);
      if (existingThread) {
        setSelectedThreadId(existingThread.id);
        setIsOpen(true);
        setIsMinimized(false);
      } else {
        // Create new thread
        const newThread: P2PChatThread = {
          id: `thread-${Date.now()}`,
          peer: {
            id: activePeerOverride.id,
            name: activePeerOverride.name,
            avatar: activePeerOverride.avatar,
            university: activePeerOverride.university,
            field: activePeerOverride.fieldOfStudy,
            country: activePeerOverride.country,
            countryFlag: activePeerOverride.countryFlag,
            status: "online",
            lastActive: "Active now",
          },
          lastMessage: {
            text: "Started new conversation",
            time: "Just now",
            isMe: true,
            unread: false,
          },
          unreadCount: 0,
          category: "peer",
          messages: [
            {
              id: `m-init-${Date.now()}`,
              senderId: "system",
              senderName: "Afriversty P2P Mesh",
              text: `Direct peer-to-peer encrypted connection established with ${activePeerOverride.name} (${activePeerOverride.university}).`,
              time: "Just now",
              isMe: false,
              status: "read",
            },
          ],
        };
        setThreads((prev) => [newThread, ...prev]);
        setSelectedThreadId(newThread.id);
        setIsOpen(true);
        setIsMinimized(false);
      }
      if (onClearActivePeerOverride) {
        onClearActivePeerOverride();
      }
    }
  }, [activePeerOverride]);

  // Call timer simulation
  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const activeThread = threads.find((t) => t.id === selectedThreadId);

  // Mark thread as read when selected
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0, lastMessage: { ...t.lastMessage, unread: false } } : t))
    );
  };

  // Send message
  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || messageInput).trim();
    if (!content || !selectedThreadId || !activeThread) return;

    const newMessageId = `msg-${Date.now()}`;
    const newMsg = {
      id: newMessageId,
      senderId: "me",
      senderName: "Kojo Boateng",
      text: content,
      time: "Just now",
      isMe: true,
      status: "sent" as const,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThreadId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: {
                text: content,
                time: "Just now",
                isMe: true,
                unread: false,
              },
            }
          : t
      )
    );

    setMessageInput("");
    setShowEmojiPicker(false);

    // Simulate delivery
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedThreadId
            ? {
                ...t,
                messages: t.messages.map((m) => (m.id === newMessageId ? { ...m, status: "delivered" } : m)),
              }
            : t
        )
      );
    }, 800);

    // Simulate peer typing & response
    setTimeout(() => {
      setIsPeerTyping(true);
    }, 1500);

    setTimeout(() => {
      setIsPeerTyping(false);
      const replies = [
        "Sounds like a great plan! Let's connect on this and build together! 🚀",
        "Awesome! I'll review the materials and get back to you shortly.",
        "Count me in! What time works best for you to sync?",
        "Brilliant idea! African tech innovation is moving at lightning speed. 🌍⚡",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const peerMsg = {
        id: `peer-${Date.now()}`,
        senderId: activeThread.peer.id,
        senderName: activeThread.peer.name,
        text: randomReply,
        time: "Just now",
        isMe: false,
        status: "read" as const,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedThreadId
            ? {
                ...t,
                messages: [...t.messages, peerMsg],
                lastMessage: {
                  text: randomReply,
                  time: "Just now",
                  isMe: false,
                  unread: false,
                },
              }
            : t
        )
      );
    }, 3500);
  };

  // Filtered threads list
  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.peer.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTabFilter === "unread") return t.unreadCount > 0;
    if (activeTabFilter === "mentors") return t.category === "mentor";
    if (activeTabFilter === "peers") return t.category === "peer";
    return true;
  });

  const totalUnreadCount = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  // If completely hidden, show floating launcher pill
  if (!isOpen) {
    return (
      <button
        id="open-persistent-chat-sidebar-btn"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#0c0a09] px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(212,175,55,0.4)] flex items-center gap-2.5 font-bold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#ffe088]"
      >
        <div className="relative">
          <MessageSquare size={16} />
          {totalUnreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[8px] font-extrabold flex items-center justify-center animate-pulse">
              {totalUnreadCount}
            </span>
          )}
        </div>
        <span>Messaging ({threads.length})</span>
        <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
      </button>
    );
  }

  return (
    <>
      {/* Persistent Chat Sidebar Container */}
      <div
        id="persistent-community-chat-sidebar"
        className={`fixed right-3 sm:right-6 bottom-4 sm:bottom-6 z-40 bg-[#12100d] border border-[#d4af37]/40 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.9)] flex flex-col transition-all duration-300 overflow-hidden ${
          isMinimized
            ? "w-80 h-14"
            : "w-[92vw] sm:w-[410px] md:w-[440px] h-[580px] max-h-[85vh]"
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#1a1611] px-4 py-3 border-b border-[#332a19] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#241f18] border border-[#d4af37]/50 flex items-center justify-center text-[#f2ca50]">
                <MessageSquare size={15} />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1a1611]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#f5f5f4] font-serif-title">
                  Pan-African P2P Chat
                </h3>
                {totalUnreadCount > 0 && (
                  <span className="bg-red-600/90 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {totalUnreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#a8a29e]">
                {activeThread ? `Chatting with ${activeThread.peer.name}` : `${threads.length} active peer threads`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#a8a29e]">
            {/* New Message Composer */}
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 rounded-lg hover:bg-[#262017] hover:text-[#f2ca50] transition-colors cursor-pointer"
              title="New Message"
            >
              <UserPlus size={14} />
            </button>

            {/* Minimize / Maximize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg hover:bg-[#262017] hover:text-[#f2ca50] transition-colors cursor-pointer"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[#262017] hover:text-[#f2ca50] transition-colors cursor-pointer"
              title="Close Sidebar"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Minimized Quick Preview */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#0e0c0a]">
            {/* If a thread is selected, show Active Chat View with quick back button */}
            {selectedThreadId && activeThread ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Active Peer Sub-Header */}
                <div className="bg-[#16130f] px-4 py-2.5 border-b border-[#2d2417] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => setSelectedThreadId(null)}
                      className="p-1 rounded-lg bg-[#241f18] hover:bg-[#332a19] text-[#f2ca50] text-xs font-bold transition-colors cursor-pointer flex items-center gap-0.5 shrink-0"
                      title="Back to all threads"
                    >
                      <ChevronRight size={14} className="rotate-180" />
                      <span className="text-[10px] hidden sm:inline">Threads</span>
                    </button>

                    <div className="relative shrink-0">
                      <img
                        src={activeThread.peer.avatar}
                        alt={activeThread.peer.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#d4af37]"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-1 ring-[#16130f] ${
                          activeThread.peer.status === "online"
                            ? "bg-emerald-500"
                            : activeThread.peer.status === "away"
                            ? "bg-amber-500"
                            : "bg-stone-500"
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#f5f5f4] truncate">
                          {activeThread.peer.name}
                        </span>
                        <span className="text-xs">{activeThread.peer.countryFlag}</span>
                      </div>
                      <p className="text-[10px] text-[#a8a29e] truncate">
                        {activeThread.peer.university} &bull; {activeThread.peer.lastActive}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Audio Call + Video Call + Profile */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() =>
                        setActiveCall({
                          type: "audio",
                          peerName: activeThread.peer.name,
                          peerAvatar: activeThread.peer.avatar,
                          duration: 0,
                          isMuted: false,
                          isVideoOff: false,
                        })
                      }
                      className="p-1.5 rounded-lg bg-[#241f18] hover:bg-[#332a19] text-[#f2ca50] transition-colors"
                      title="Audio Call"
                    >
                      <Phone size={13} />
                    </button>

                    <button
                      onClick={() =>
                        setActiveCall({
                          type: "video",
                          peerName: activeThread.peer.name,
                          peerAvatar: activeThread.peer.avatar,
                          duration: 0,
                          isMuted: false,
                          isVideoOff: false,
                        })
                      }
                      className="p-1.5 rounded-lg bg-[#241f18] hover:bg-[#332a19] text-[#f2ca50] transition-colors"
                      title="Video Call"
                    >
                      <Video size={13} />
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0d0b09]">
                  {/* Encryption Badge */}
                  <div className="text-center my-1">
                    <span className="inline-flex items-center gap-1 text-[9px] text-[#8c827a] bg-[#1a1611] px-2.5 py-0.5 rounded-full border border-[#2d2417]">
                      🔒 End-to-end encrypted &bull; Pan-African Node
                    </span>
                  </div>

                  {activeThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.isMe ? "items-end" : "items-start"
                      } max-w-[88%] ${msg.isMe ? "ml-auto" : "mr-auto"}`}
                    >
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-md ${
                          msg.isMe
                            ? "bg-gradient-to-r from-[#d4af37] to-[#e6be44] text-[#0c0a09] font-medium rounded-br-xs"
                            : "bg-[#1c1813] text-[#f5f5f4] border border-[#332a19] rounded-bl-xs"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[9px] text-[#8c827a]">{msg.time}</span>
                        {msg.isMe && (
                          <span>
                            {msg.status === "read" ? (
                              <CheckCheck size={11} className="text-[#f2ca50]" />
                            ) : msg.status === "delivered" ? (
                              <CheckCheck size={11} className="text-[#8c827a]" />
                            ) : (
                              <Check size={11} className="text-[#8c827a]" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isPeerTyping && (
                    <div className="flex items-center gap-2 text-xs text-[#a8a29e] bg-[#1c1813] border border-[#332a19] px-3 py-1.5 rounded-2xl w-fit animate-pulse">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#f2ca50] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[#f2ca50] rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-[#f2ca50] rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-[10px] text-[#d0c5af]">{activeThread.peer.name} is typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* AI Quick Reply Suggestions */}
                <div className="px-3 py-1.5 bg-[#14110e] border-t border-[#261f14] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {[
                    "Let's sync up! 🚀",
                    "Sounds awesome!",
                    "Can you share the GitHub link?",
                    "Let's win this together 🏆",
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-2.5 py-1 rounded-full bg-[#201a13] hover:bg-[#2d2417] text-[#f2ca50] border border-[#3d311c] text-[10px] whitespace-nowrap transition-all cursor-pointer shrink-0"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Message Input Bar */}
                <div className="p-2.5 bg-[#181510] border-t border-[#2d2417] flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-[#a8a29e]">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 rounded-lg hover:bg-[#241f18] hover:text-[#f2ca50] transition-colors"
                      title="Emoji"
                    >
                      <Smile size={15} />
                    </button>

                    <button
                      onClick={() => handleSendMessage("Shared a research document: [Pan-Africa-AI-Whitepaper.pdf] 📄")}
                      className="p-1.5 rounded-lg hover:bg-[#241f18] hover:text-[#f2ca50] transition-colors"
                      title="Attach File"
                    >
                      <Paperclip size={15} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Message ${activeThread.peer.name.split(" ")[0]}...`}
                    className="flex-1 bg-[#100e0b] border border-[#332a19] focus:border-[#f2ca50] rounded-full py-1.5 px-3.5 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none"
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!messageInput.trim()}
                    className={`p-2 rounded-full transition-all cursor-pointer ${
                      messageInput.trim()
                        ? "bg-[#f2ca50] text-[#0c0a09] hover:scale-105 shadow-md"
                        : "bg-[#241f18] text-[#8c827a] cursor-not-allowed"
                    }`}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            ) : (
              /* Threads List & Directory */
              <div className="flex-1 flex flex-col min-h-0">
                {/* Search Bar */}
                <div className="p-3 border-b border-[#261f14] bg-[#14110e]">
                  <div className="relative flex items-center">
                    <Search size={13} className="absolute left-3 text-[#8c827a]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search chats, scholars, messages..."
                      className="w-full bg-[#0e0c0a] border border-[#2d2417] focus:border-[#f2ca50] rounded-full py-1.5 pl-8 pr-3 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto scrollbar-none">
                    {[
                      { id: "all", label: "All Chats" },
                      { id: "unread", label: `Unread (${totalUnreadCount})` },
                      { id: "peers", label: "Study Peers" },
                      { id: "mentors", label: "Mentors" },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setActiveTabFilter(pill.id as any)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                          activeTabFilter === pill.id
                            ? "bg-[#f2ca50] text-[#0c0a09]"
                            : "bg-[#201a13] text-[#d0c5af] hover:text-[#f2ca50] border border-[#332a19]"
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Threads Scrollable List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-[#221c13]">
                  {filteredThreads.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#8c827a]">
                      No messages matching "{searchQuery}"
                    </div>
                  ) : (
                    filteredThreads.map((thread) => {
                      const isSelected = thread.id === selectedThreadId;

                      return (
                        <div
                          key={thread.id}
                          onClick={() => handleSelectThread(thread.id)}
                          className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#221c14] border border-[#f2ca50]/40 shadow-md"
                              : "hover:bg-[#18140f] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar with Online Badge */}
                            <div className="relative shrink-0">
                              <img
                                src={thread.peer.avatar}
                                alt={thread.peer.name}
                                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3d311c]"
                              />
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#12100d] ${
                                  thread.peer.status === "online"
                                    ? "bg-emerald-500"
                                    : thread.peer.status === "away"
                                    ? "bg-amber-500"
                                    : "bg-stone-500"
                                }`}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#f5f5f4] truncate">
                                  {thread.peer.name}
                                </span>
                                <span className="text-xs">{thread.peer.countryFlag}</span>
                                {thread.isPinned && (
                                  <Pin size={10} className="text-[#f2ca50] rotate-45" />
                                )}
                              </div>

                              <p className="text-[10px] text-[#a8a29e] truncate">
                                {thread.peer.university}
                              </p>

                              <p
                                className={`text-[11px] truncate mt-0.5 ${
                                  thread.unreadCount > 0
                                    ? "text-[#f5f5f4] font-semibold"
                                    : "text-[#8c827a]"
                                }`}
                              >
                                {thread.lastMessage.isMe && "You: "}
                                {thread.lastMessage.text}
                              </p>
                            </div>
                          </div>

                          {/* Time & Unread Badge */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[9px] text-[#8c827a]">
                              {thread.lastMessage.time}
                            </span>
                            {thread.unreadCount > 0 && (
                              <span className="w-4 h-4 rounded-full bg-[#f2ca50] text-[#0c0a09] text-[9px] font-extrabold flex items-center justify-center shadow-md">
                                {thread.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Chat Composer Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#16130f] border border-[#d4af37]/40 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <UserPlus size={18} />
                <h3 className="text-sm font-bold text-[#f5f5f4] font-serif-title">
                  New Direct Message
                </h3>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-[#a8a29e] hover:text-[#f5f5f4]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3 text-[#8c827a]" />
              <input
                type="text"
                value={newChatSearch}
                onChange={(e) => setNewChatSearch(e.target.value)}
                placeholder="Type scholar name or university..."
                className="w-full bg-[#0e0c0a] border border-[#332a19] focus:border-[#f2ca50] rounded-2xl py-2 pl-9 pr-3 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                {
                  id: "stu-tariq",
                  name: "Tariq Benali",
                  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
                  university: "UM6P",
                  country: "Morocco",
                  flag: "🇲🇦",
                  field: "Cloud & DevOps",
                },
                {
                  id: "stu-fatima",
                  name: "Fatima Al-Mansoor",
                  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                  university: "Cairo University",
                  country: "Egypt",
                  flag: "🇪🇬",
                  field: "CleanTech Engineering",
                },
                {
                  id: "stu-esther",
                  name: "Esther Adjei",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                  university: "Ashesi University",
                  country: "Ghana",
                  flag: "🇬🇭",
                  field: "EdTech & Leadership",
                },
              ]
                .filter((s) => s.name.toLowerCase().includes(newChatSearch.toLowerCase()) || s.university.toLowerCase().includes(newChatSearch.toLowerCase()))
                .map((scholar) => (
                  <div
                    key={scholar.id}
                    onClick={() => {
                      // Create thread & select
                      const newThread: P2PChatThread = {
                        id: `thread-${scholar.id}`,
                        peer: {
                          id: scholar.id,
                          name: scholar.name,
                          avatar: scholar.avatar,
                          university: scholar.university,
                          field: scholar.field,
                          country: scholar.country,
                          countryFlag: scholar.flag,
                          status: "online",
                          lastActive: "Active now",
                        },
                        lastMessage: {
                          text: "Direct peer-to-peer message thread initiated",
                          time: "Just now",
                          isMe: true,
                          unread: false,
                        },
                        unreadCount: 0,
                        category: "peer",
                        messages: [
                          {
                            id: `m-init-${Date.now()}`,
                            senderId: "system",
                            senderName: "Afriversty P2P Mesh",
                            text: `Connected with ${scholar.name} from ${scholar.university}. Say hello! 👋`,
                            time: "Just now",
                            isMe: false,
                            status: "read",
                          },
                        ],
                      };
                      setThreads((prev) => [newThread, ...prev]);
                      setSelectedThreadId(newThread.id);
                      setShowNewChatModal(false);
                      setIsMinimized(false);
                    }}
                    className="p-3 bg-[#110f0c] hover:bg-[#201a13] border border-[#2d2417] rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={scholar.avatar}
                        alt={scholar.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-[#d4af37]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#f5f5f4]">
                            {scholar.name}
                          </span>
                          <span>{scholar.flag}</span>
                        </div>
                        <p className="text-[10px] text-[#a8a29e]">
                          {scholar.university} &bull; {scholar.field}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#f2ca50] font-bold">Chat</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* WebRTC Audio/Video Simulation Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#16130f] border border-[#d4af37] rounded-3xl p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={activeCall.peerAvatar}
                alt={activeCall.peerName}
                className="w-full h-full rounded-full object-cover ring-4 ring-[#f2ca50] shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#16130f] flex items-center justify-center">
                <Volume2 size={10} className="text-white animate-ping" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#f5f5f4] font-serif-title">
                {activeCall.peerName}
              </h3>
              <p className="text-xs text-[#f2ca50] mt-1 font-mono">
                {activeCall.type === "video" ? "Pan-African HD Video Call" : "Encrypted P2P Voice Call"}
              </p>
              <p className="text-sm font-bold text-[#a8a29e] mt-2 font-mono">
                {Math.floor(activeCall.duration / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(activeCall.duration % 60).toString().padStart(2, "0")}
              </p>
            </div>

            {/* Visualizer Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[12, 24, 18, 28, 15, 32, 22, 10, 26, 16].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className="w-1 bg-[#f2ca50] rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() =>
                  setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
                }
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  activeCall.isMuted
                    ? "bg-red-600 text-white"
                    : "bg-[#241f18] text-[#f2ca50] hover:bg-[#332a19]"
                }`}
              >
                {activeCall.isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {activeCall.type === "video" && (
                <button
                  onClick={() =>
                    setActiveCall((prev) =>
                      prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null
                    )
                  }
                  className={`p-3.5 rounded-full transition-all cursor-pointer ${
                    activeCall.isVideoOff
                      ? "bg-red-600 text-white"
                      : "bg-[#241f18] text-[#f2ca50] hover:bg-[#332a19]"
                  }`}
                >
                  {activeCall.isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              )}

              <button
                onClick={() => setActiveCall(null)}
                className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all cursor-pointer"
                title="End Call"
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
