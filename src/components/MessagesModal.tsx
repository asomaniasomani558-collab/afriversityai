import React, { useState } from "react";
import { Send, Users, Search, Check, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface PeerMessage {
  id: string;
  sender: string;
  avatar: string;
  university: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: { text: string; sender: "me" | "peer"; time: string }[];
}

export const MessagesModal: React.FC = () => {
  const { t } = useLanguage();
  const [peers, setPeers] = useState<PeerMessage[]>([
    {
      id: "p1",
      sender: "Amara Nweke",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      university: "University of Cape Town",
      lastMessage: "The Mandela Rhodes grant reviewer requested our microgrid circuit draft.",
      time: "12m ago",
      unread: true,
      messages: [
        { text: "Hey Kofi! Did you finalize the inverter calculations?", sender: "peer", time: "11:40 AM" },
        { text: "Yes! Running 94.2% peak efficiency in simulations.", sender: "me", time: "11:55 AM" },
        { text: "The Mandela Rhodes grant reviewer requested our microgrid circuit draft.", sender: "peer", time: "12:10 PM" },
      ],
    },
    {
      id: "p2",
      sender: "Tunde Adeyemi",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      university: "University of Lagos",
      lastMessage: "I pushed the updated Whisper tokenizers to the Code Africa repo.",
      time: "2h ago",
      unread: false,
      messages: [
        { text: "I pushed the updated Whisper tokenizers to the Code Africa repo.", sender: "peer", time: "10:00 AM" },
      ],
    },
    {
      id: "p3",
      sender: "Prof. Kwabena Adjei",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      university: "University of Ghana",
      lastMessage: "Your lab assignment #4 received a grade of 98%. Outstanding work.",
      time: "Yesterday",
      unread: false,
      messages: [
        { text: "Your lab assignment #4 received a grade of 98%. Outstanding work.", sender: "peer", time: "Yesterday" },
      ],
    },
  ]);

  const [activePeer, setActivePeer] = useState<PeerMessage>(peers[0]);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = { text: inputText, sender: "me" as const, time: "Just now" };

    const updated = peers.map((p) =>
      p.id === activePeer.id
        ? {
            ...p,
            lastMessage: inputText,
            messages: [...p.messages, newMsg],
          }
        : p
    );

    setPeers(updated);
    setActivePeer({
      ...activePeer,
      lastMessage: inputText,
      messages: [...activePeer.messages, newMsg],
    });
    setInputText("");
  };

  return (
    <div id="messages-container" className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Peers List */}
      <div className="w-full md:w-80 bg-[#1b1b1b] rounded-3xl border border-[#4d4635]/30 p-4 shadow-2xl flex flex-col">
        <h2 className="font-serif-title text-lg font-bold text-[#e5e2e1] mb-3">
          {t.messagesTitle}
        </h2>
        <p className="text-[11px] text-[#99907c] mb-3">{t.messagesSubtitle}</p>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {peers.map((peer) => (
            <div
              key={peer.id}
              onClick={() => setActivePeer(peer)}
              className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 border ${
                activePeer.id === peer.id
                  ? "bg-[#20201f] border-[#f2ca50]"
                  : "bg-transparent border-transparent hover:bg-[#20201f]/60"
              }`}
            >
              <img
                src={peer.avatar}
                alt={peer.sender}
                className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/30"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#e5e2e1] truncate">{peer.sender}</h4>
                  <span className="text-[10px] text-[#99907c]">{peer.time}</span>
                </div>
                <p className="text-[11px] text-[#d0c5af]/80 truncate mt-0.5">{peer.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#1b1b1b] rounded-3xl border border-[#4d4635]/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-[#20201f] border-b border-[#4d4635]/25 flex items-center gap-3">
          <img
            src={activePeer.avatar}
            alt={activePeer.sender}
            className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/30"
          />
          <div>
            <h3 className="font-serif-title text-base font-bold text-[#e5e2e1]">
              {activePeer.sender}
            </h3>
            <p className="text-[11px] text-[#f2ca50]">{activePeer.university}</p>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activePeer.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "me"
                    ? "bg-[#353535] text-[#e5e2e1] rounded-tr-none border border-[#4d4635]/40"
                    : "bg-[#20201f] text-[#e5e2e1] rounded-tl-none border border-[#d4af37]/25"
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[9px] text-[#99907c] block text-right mt-1">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 bg-[#1b1b1b] border-t border-[#4d4635]/30 flex gap-2">
          <input
            type="text"
            placeholder={t.typeMessagePlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-[#20201f] border border-[#4d4635]/40 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
          />
          <button
            type="submit"
            className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] px-4 py-2.5 rounded-xl font-bold transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
