import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
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
  Search,
} from "lucide-react";
import { StudentProfile } from "../../types/community";

export interface P2PPeer {
  id: string;
  name: string;
  avatar: string;
  country: string;
  flag: string;
  university: string;
  field: string;
  status: "online" | "away" | "offline";
  lastMessage: string;
  time: string;
  unread: number;
}

export interface P2PMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
  status: "sent" | "delivered" | "read";
  attachment?: {
    type: "image" | "file" | "code";
    name: string;
    url?: string;
  };
}

interface LinkedInChatDockProps {
  initialPeer?: StudentProfile | null;
  onCloseDirectChat?: () => void;
  onViewProfile?: (student: StudentProfile) => void;
}

const defaultPeers: P2PPeer[] = [
  {
    id: "aisha-m",
    name: "Aisha Mohammed",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    country: "Nigeria",
    flag: "🇳🇬",
    university: "University of Ibadan",
    field: "Computer Science • UI",
    status: "online",
    lastMessage: "Hey Kojo! Would love to team up on the Pan-African AI Hackathon! 🚀",
    time: "2m ago",
    unread: 2,
  },
  {
    id: "ama-s",
    name: "Ama Serwaa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "Ghana",
    flag: "🇬🇭",
    university: "University of Ghana",
    field: "Computer Science",
    status: "online",
    lastMessage: "Thanks for sharing those NLP lecture slides!",
    time: "1h ago",
    unread: 0,
  },
  {
    id: "kwame-m",
    name: "Kwame Mensah",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "Ghana",
    flag: "🇬🇭",
    university: "KNUST",
    field: "Engineering",
    status: "online",
    lastMessage: "Are you free tonight at 7 PM for DSA practice?",
    time: "3h ago",
    unread: 1,
  },
  {
    id: "grace-n",
    name: "Grace Ndlovu",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    country: "South Africa",
    flag: "🇿🇦",
    university: "University of Cape Town",
    field: "Business • UCT",
    status: "away",
    lastMessage: "Let's review the AfCFTA FinTech submission draft.",
    time: "Yesterday",
    unread: 0,
  },
];

export const LinkedInChatDock: React.FC<LinkedInChatDockProps> = ({
  initialPeer,
  onCloseDirectChat,
  onViewProfile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePeer, setActivePeer] = useState<P2PPeer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCalling, setIsCalling] = useState<"audio" | "video" | null>(null);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCallVideoOff, setIsCallVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [messages, setMessages] = useState<Record<string, P2PMessage[]>>({
    "aisha-m": [
      {
        id: "m1",
        senderId: "aisha-m",
        senderName: "Aisha Mohammed",
        text: "Hi Kojo! Saw your profile and your work on solar IoT grids in Ghana. Truly inspiring!",
        time: "10:14 AM",
        isMe: false,
        status: "read",
      },
      {
        id: "m2",
        senderId: "me",
        senderName: "Kojo Boateng",
        text: "Thank you Aisha! Great to connect with fellow builders from Nigeria. Are you preparing for the May Hackathon?",
        time: "10:18 AM",
        isMe: true,
        status: "read",
      },
      {
        id: "m3",
        senderId: "aisha-m",
        senderName: "Aisha Mohammed",
        text: "Hey Kojo! Would love to team up on the Pan-African AI Hackathon! 🚀",
        time: "10:20 AM",
        isMe: false,
        status: "read",
      },
    ],
    "ama-s": [
      {
        id: "m4",
        senderId: "ama-s",
        senderName: "Ama Serwaa",
        text: "The AI for Social Good workshop was so insightful! Did you catch the Masakhane NLP dataset session?",
        time: "8:30 AM",
        isMe: false,
        status: "read",
      },
      {
        id: "m5",
        senderId: "me",
        senderName: "Kojo Boateng",
        text: "Yes, I downloaded the Twi-English transformer tokenizer. I can share the notebooks if you'd like!",
        time: "8:45 AM",
        isMe: true,
        status: "read",
      },
      {
        id: "m6",
        senderId: "ama-s",
        senderName: "Ama Serwaa",
        text: "Thanks for sharing those NLP lecture slides!",
        time: "9:02 AM",
        isMe: false,
        status: "read",
      },
    ],
    "kwame-m": [
      {
        id: "m7",
        senderId: "kwame-m",
        senderName: "Kwame Mensah",
        text: "Looking for study partners for Data Structures and Algorithms. Anyone interested? Let's build together! 💪",
        time: "Yesterday",
        isMe: false,
        status: "read",
      },
      {
        id: "m8",
        senderId: "me",
        senderName: "Kojo Boateng",
        text: "Count me in! I've been reviewing graph algorithms and dynamic programming.",
        time: "Yesterday",
        isMe: true,
        status: "read",
      },
      {
        id: "m9",
        senderId: "kwame-m",
        senderName: "Kwame Mensah",
        text: "Are you free tonight at 7 PM for DSA practice?",
        time: "4h ago",
        isMe: false,
        status: "read",
      },
    ],
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // If initialPeer provided, open chat directly
  useEffect(() => {
    if (initialPeer) {
      const match = defaultPeers.find((p) => p.name.toLowerCase() === initialPeer.name.toLowerCase()) || {
        id: initialPeer.id,
        name: initialPeer.name,
        avatar: initialPeer.avatar,
        country: initialPeer.country,
        flag: initialPeer.countryFlag || "🌍",
        university: initialPeer.university,
        field: initialPeer.fieldOfStudy,
        status: initialPeer.presenceStatus || "online",
        lastMessage: "Connected on Afriversity",
        time: "Just now",
        unread: 0,
      };
      setActivePeer(match);
      setIsOpen(true);
    }
  }, [initialPeer]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activePeer, isTyping]);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activePeer) return;

    const newMsg: P2PMessage = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: "Kojo Boateng",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      status: "delivered",
    };

    const peerId = activePeer.id;
    setMessages((prev) => ({
      ...prev,
      [peerId]: [...(prev[peerId] || []), newMsg],
    }));
    setInputText("");

    // Simulate realistic peer-to-peer real-time response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses: Record<string, string[]> = {
        "aisha-m": [
          "That sounds amazing! I'll put together the Figma wireframe for our ML dashboard tonight.",
          "Awesome! Let's connect over the IndabaX portal too. We've got a strong shot at the regional finals!",
          "Great point! I'll push the repository link to GitHub so we can start collaborating.",
        ],
        "ama-s": [
          "Perfect, I've got the validation scripts ready. Let's sync up after the lab session!",
          "Agreed! Pan-African AI research is moving so fast right now. Excited to build this together.",
        ],
        "kwame-m": [
          "Sounds like a plan! Let's solve the LeetCode Hard problem on Dijkstra's shortest path at 7 PM.",
          "Awesome, I'll send the live WebRTC room link in 10 minutes!",
        ],
      };

      const defaultResponses = [
        "Received loud and clear! Looking forward to working together on this.",
        "That's great! Let's make sure to submit our progress before the deadline.",
      ];

      const pool = responses[peerId] || defaultResponses;
      const replyText = pool[Math.floor(Math.random() * pool.length)];

      const peerReply: P2PMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: peerId,
        senderName: activePeer.name,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
        status: "read",
      };

      setMessages((prev) => ({
        ...prev,
        [peerId]: [...(prev[peerId] || []), peerReply],
      }));
    }, 2000);
  };

  const currentMessages = activePeer ? messages[activePeer.id] || [] : [];

  return (
    <>
      {/* Floating LinkedIn-Style Messaging Bar in Bottom Right */}
      <div
        id="linkedin-p2p-chat-dock"
        className="fixed bottom-0 right-4 sm:right-6 z-50 flex items-end gap-3 font-sans-body pointer-events-auto"
      >
        {/* Active Open Chat Window */}
        {isOpen && activePeer && (
          <div className="w-[340px] sm:w-[380px] h-[480px] bg-[#14120e] border border-[#d4af37]/40 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
            {/* Chat Window Header */}
            <div className="bg-[#1c1813] px-3.5 py-2.5 border-b border-[#3d311c] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={activePeer.avatar}
                    alt={activePeer.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#f2ca50]"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#14120e] ${
                      activePeer.status === "online" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#f5f5f4] truncate">
                      {activePeer.name}
                    </span>
                    <span className="text-xs">{activePeer.flag}</span>
                  </div>
                  <div className="text-[10px] text-[#a8a29e] truncate">
                    {activePeer.university}
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 text-[#d0c5af]">
                <button
                  onClick={() => setIsCalling("video")}
                  className="p-1.5 rounded-lg hover:bg-[#2c2417] text-[#f2ca50] hover:text-white transition-colors cursor-pointer"
                  title="P2P WebRTC Video Call"
                >
                  <Video size={15} />
                </button>
                <button
                  onClick={() => setIsCalling("audio")}
                  className="p-1.5 rounded-lg hover:bg-[#2c2417] text-[#f2ca50] hover:text-white transition-colors cursor-pointer"
                  title="P2P Audio Call"
                >
                  <Phone size={15} />
                </button>
                <button
                  onClick={() => setActivePeer(null)}
                  className="p-1.5 rounded-lg hover:bg-[#2c2417] hover:text-white transition-colors cursor-pointer"
                  title="Back to peer list"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onCloseDirectChat) onCloseDirectChat();
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#2c2417] hover:text-white transition-colors cursor-pointer"
                  title="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Sub-header Peer Banner */}
            <div className="bg-[#181510] px-3 py-1.5 border-b border-[#2d2417] flex items-center justify-between text-[10px] text-[#a8a29e]">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] font-bold">
                  <Sparkles size={10} /> Real-Time P2P Mesh Active
                </span>
              </div>
              <span className="text-emerald-400 font-semibold">98ms Latency</span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0f0e0c]/90">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.isMe
                        ? "bg-gradient-to-r from-[#b38f28] to-[#d4af37] text-[#0c0a09] font-medium rounded-br-none shadow-md"
                        : "bg-[#1f1a14] text-[#f5f5f4] border border-[#3d311c] rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-[#8c827a] px-1">
                    <span>{msg.time}</span>
                    {msg.isMe && (
                      <CheckCheck size={11} className="text-[#f2ca50]" />
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#d0c5af] italic animate-pulse px-2">
                  <img
                    src={activePeer.avatar}
                    alt={activePeer.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>{activePeer.name} is typing...</span>
                </div>
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-2.5 bg-[#181510] border-t border-[#3d311c] flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activePeer.name.split(" ")[0]}...`}
                  className="flex-1 bg-[#100e0b] border border-[#3d311c] focus:border-[#f2ca50] rounded-full py-1.5 px-3.5 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    inputText.trim()
                      ? "bg-[#f2ca50] text-[#0c0a09] shadow-md hover:scale-105 active:scale-95"
                      : "bg-[#2c2417] text-[#8c827a] cursor-not-allowed"
                  }`}
                >
                  <Send size={13} />
                </button>
              </div>

              {/* Bottom Quick Tools */}
              <div className="flex items-center justify-between text-[#8c827a] px-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInputText((prev) => prev + " 🤝 Let's collaborate!")}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#241f18] hover:bg-[#332b20] text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                  >
                    🤝 Collaborate
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputText((prev) => prev + " 🚀 Hackathon team up?")}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#241f18] hover:bg-[#332b20] text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                  >
                    🚀 Hackathon
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <Paperclip size={13} className="hover:text-[#f2ca50] cursor-pointer" />
                  <Smile size={13} className="hover:text-[#f2ca50] cursor-pointer" />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Primary LinkedIn Collapsible Messaging Dock */}
        <div
          className={`w-72 sm:w-80 bg-[#14120e] border border-[#d4af37]/35 rounded-t-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isOpen && !activePeer ? "h-[420px]" : "h-12"
          }`}
        >
          {/* Dock Header Bar */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="h-12 bg-[#1c1813] hover:bg-[#241f18] px-4 flex items-center justify-between cursor-pointer border-b border-[#3d311c] transition-colors select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Kojo Boateng"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#f2ca50]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#14120e]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#f5f5f4] tracking-wide">
                  Messaging
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#f2ca50] text-[#0c0a09] text-[10px] font-extrabold shadow-sm">
                  3
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[#d0c5af]">
              <MoreVertical size={14} className="hover:text-white" />
              {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>
          </div>

          {/* Peer List inside Collapsed Dock */}
          {isOpen && !activePeer && (
            <div className="h-[372px] flex flex-col bg-[#100e0b]">
              {/* Search Peers Input */}
              <div className="p-2.5 border-b border-[#2d2417]">
                <div className="relative flex items-center">
                  <Search size={13} className="absolute left-3 text-[#8c827a]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search connected scholars..."
                    className="w-full bg-[#181510] border border-[#332a19] rounded-xl py-1.5 pl-8 pr-3 text-xs text-[#f5f5f4] placeholder:text-[#8c827a] focus:outline-none focus:border-[#f2ca50]"
                  />
                </div>
              </div>

              {/* Peers List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#241d13]">
                {defaultPeers
                  .filter((p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.university.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((peer) => (
                    <div
                      key={peer.id}
                      onClick={() => setActivePeer(peer)}
                      className="p-3 hover:bg-[#1a1611] transition-colors cursor-pointer flex items-center gap-3 group"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-[#3d311c] group-hover:ring-[#f2ca50] transition-all"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#100e0b] ${
                            peer.status === "online" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-xs font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors truncate">
                              {peer.name}
                            </span>
                            <span className="text-xs">{peer.flag}</span>
                          </div>
                          <span className="text-[10px] text-[#8c827a] shrink-0">
                            {peer.time}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#a8a29e] truncate mt-0.5">
                          {peer.lastMessage}
                        </p>
                      </div>

                      {peer.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#f2ca50] text-[#0c0a09] text-[9px] font-extrabold flex items-center justify-center shrink-0">
                          {peer.unread}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time WebRTC P2P Video / Audio Call Overlay Simulation */}
      {isCalling && activePeer && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl text-center space-y-6 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

            {/* Call Header */}
            <div className="flex items-center justify-between text-xs text-[#a8a29e]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>P2P {isCalling === "video" ? "Video" : "Audio"} Stream Connected</span>
              </div>
              <span className="font-mono text-[#f2ca50] font-bold">
                {formatCallTime(callDuration)}
              </span>
            </div>

            {/* Caller Display */}
            <div className="space-y-3">
              <div className="relative w-28 h-28 mx-auto">
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-full h-full rounded-full object-cover ring-4 ring-[#f2ca50] shadow-2xl"
                />
                <span className="absolute bottom-1 right-1 text-xl">{activePeer.flag}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif-title text-[#f5f5f4]">
                  {activePeer.name}
                </h3>
                <p className="text-xs text-[#d0c5af]">{activePeer.university}</p>
                <p className="text-[11px] text-[#8c827a] mt-0.5">{activePeer.field}</p>
              </div>
            </div>

            {/* Audio Waveform Graphic */}
            <div className="flex items-center justify-center gap-1 h-10 px-6">
              {[40, 70, 90, 60, 100, 75, 45, 80, 95, 55, 30, 85, 65, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-[#d4af37] to-[#f2ca50] rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(i * 0.1).toFixed(1)}s`,
                  }}
                />
              ))}
            </div>

            {/* Call Action Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`p-4 rounded-full transition-all cursor-pointer ${
                  isCallMuted
                    ? "bg-red-900/50 text-red-300 border border-red-500/40"
                    : "bg-[#241f18] text-[#d0c5af] hover:text-[#f2ca50] border border-[#3d311c]"
                }`}
                title={isCallMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isCallMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={() => setIsCallVideoOff(!isCallVideoOff)}
                className={`p-4 rounded-full transition-all cursor-pointer ${
                  isCallVideoOff
                    ? "bg-red-900/50 text-red-300 border border-red-500/40"
                    : "bg-[#241f18] text-[#d0c5af] hover:text-[#f2ca50] border border-[#3d311c]"
                }`}
                title={isCallVideoOff ? "Turn Video On" : "Turn Video Off"}
              >
                {isCallVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button
                onClick={() => setIsCalling(null)}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="End Call"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
