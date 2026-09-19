import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Radio,
  Sparkles,
  Zap,
  Activity,
  RotateCcw,
  Settings,
  HelpCircle,
  MessageSquare,
  Globe,
  Sliders,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logVoiceCommandInteraction } from "../services/voiceHistoryService";

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialPrompt?: string;
  autoGreeting?: boolean;
}

export type LiveVoiceName = "Puck" | "Charon" | "Kore" | "Fenrir" | "Zephyr" | "Aoede";

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  initialTopic = "General STEM & Higher Education Mentorship",
  initialPrompt = "",
  autoGreeting = true,
}) => {
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micWarning, setMicWarning] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<LiveVoiceName>("Puck");
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcriptHistory, setTranscriptHistory] = useState<
    Array<{ role: "user" | "model"; text: string; timestamp: string }>
  >(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (initialPrompt) {
      return [
        { role: "user", text: initialPrompt, timestamp: timeStr },
        { role: "model", text: `Hello! I am your AfriVersty Live AI Companion. Let's explore your question about "${initialPrompt}".`, timestamp: timeStr }
      ];
    }
    return [
      {
        role: "model",
        text: "Hello! I am your AfriVersty Live AI Voice Companion. How can I assist you with your academic journey, scholarships, or universities today?",
        timestamp: timeStr,
      },
    ];
  });
  const transcriptHistoryRef = useRef<
    Array<{ role: "user" | "model"; text: string; timestamp: string }>
  >([]);
  const { currentUser } = useAuth();
  const currentUserIdRef = useRef<string>("guest");

  useEffect(() => {
    transcriptHistoryRef.current = transcriptHistory;
  }, [transcriptHistory]);

  useEffect(() => {
    currentUserIdRef.current = currentUser?.uid || "guest";
  }, [currentUser]);

  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<"continuous" | "push-to-talk">("continuous");
  const [isPushPressed, setIsPushPressed] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Audio Context and Stream References
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const isMutedRef = useRef(isMuted);
  const modeRef = useRef(mode);
  const isPushPressedRef = useRef(isPushPressed);
  const initialPromptRef = useRef(initialPrompt);

  useEffect(() => {
    initialPromptRef.current = initialPrompt;
  }, [initialPrompt]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    isPushPressedRef.current = isPushPressed;
  }, [isPushPressed]);

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      cleanupLiveSession();
    }
    return () => {
      cleanupLiveSession();
    };
  }, [isOpen, selectedVoice]);

  const pcmToBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    let binary = "";
    const bytes = new Uint8Array(int16Array.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playAudioChunk = (base64Pcm: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const audioCtx = outputAudioCtxRef.current;
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const binaryString = atob(base64Pcm);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const sourceNode = audioCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }
      sourceNode.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      audioSourcesRef.current.push(sourceNode);
      setIsSpeaking(true);

      sourceNode.onended = () => {
        audioSourcesRef.current = audioSourcesRef.current.filter((s) => s !== sourceNode);
        if (audioSourcesRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const stopAllAudioPlayback = () => {
    audioSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    audioSourcesRef.current = [];
    setIsSpeaking(false);
    nextStartTimeRef.current = 0;
  };

  const handleSendTextTurn = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || textInput.trim();
    if (!query) return;

    const timeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTranscriptHistory((prev) => [
      ...prev,
      { role: "user", text: query, timestamp: timeStr },
    ]);
    setTextInput("");

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: query }));
    } else {
      // Fallback to /api/gemini/chat if WebSocket is not connected
      try {
        setConnectionStatus("connected");
        const res = await fetch("/api/gemini/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            history: transcriptHistory.map(h => ({ role: h.role, text: h.text })),
            context: initialTopic,
            role: "African academic mentor",
          }),
        });
        const data = await res.json();
        const replyText = data.response || "I am here to help you navigate AfriVersty universities, scholarships, and academic pathways. Let's discuss your goals!";
        
        const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setTranscriptHistory((prev) => [
          ...prev,
          { role: "model", text: replyText, timestamp: replyTime },
        ]);

        // Speak using Web Speech API
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(replyText);
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.error("Fallback chat error:", err);
      }
    }
  };

  const startLiveSession = async () => {
    cleanupLiveSession();
    setConnectionStatus("connecting");
    setErrorMessage(null);
    setMicWarning(null);

    // If initialPrompt is set, trigger an initial conversation turn after a moment
    if (initialPromptRef.current) {
      setTimeout(() => {
        if (transcriptHistoryRef.current.length <= 1) {
          handleSendTextTurn(undefined, initialPromptRef.current);
        }
      }, 500);
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(
        selectedVoice
      )}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        setErrorMessage(null);
        if (initialPromptRef.current) {
          ws.send(JSON.stringify({ text: initialPromptRef.current }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio) {
            playAudioChunk(data.audio);
          }
          if (data.interrupted) {
            stopAllAudioPlayback();
          }
          if (data.transcription) {
            setTranscriptHistory((prev) => {
              const last = prev[prev.length - 1];
              const timeStr = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              if (last && last.role === data.role) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + " " + data.transcription },
                ];
              } else {
                return [
                  ...prev,
                  { role: data.role, text: data.transcription, timestamp: timeStr },
                ];
              }
            });
          }
          if (data.error) {
            setErrorMessage(data.error);
          }
        } catch (err) {
          console.error("Error decoding server message:", err);
        }
      };

      ws.onerror = () => {
        setConnectionStatus("connected"); // Fallback active mode
        setErrorMessage(null);
      };

      ws.onclose = () => {
        setConnectionStatus("connected");
      };
    } catch (wsErr) {
      setConnectionStatus("connected");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true },
      });
      mediaStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputCtx;
      const sourceNode = inputCtx.createMediaStreamSource(stream);

      const analyzer = inputCtx.createAnalyser();
      analyzer.fftSize = 64;
      sourceNode.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const updateVisualizer = () => {
        analyzer.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        setIsUserTalking(avg > 15);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;
      sourceNode.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) return;
        if (modeRef.current === "push-to-talk" && !isPushPressedRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const base64Audio = pcmToBase64(inputData);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ audio: base64Audio }));
        }
      };
    } catch (micErr: any) {
      setMicWarning("Microphone stream unavailable or blocked. You can type questions below or use quick action pills.");
    }
  };

  const cleanupLiveSession = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    stopAllAudioPlayback();
    if (processorNodeRef.current) {
      try { processorNodeRef.current.disconnect(); } catch {}
      processorNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== "closed") {
      try { inputAudioCtxRef.current.close(); } catch {}
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== "closed") {
      try { outputAudioCtxRef.current.close(); } catch {}
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
    setConnectionStatus("disconnected");
    setIsSpeaking(false);
    setIsUserTalking(false);
    setAudioLevel(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[96vh] bg-[#0c0a08] border border-[#d4af37]/45 rounded-none sm:rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        
        {/* Top Header matching user screenshot */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d261b] bg-[#12100d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37]/30 to-[#f2ca50]/10 border border-[#d4af37]/50 flex items-center justify-center text-[#f2ca50] shadow-sm">
              <Sparkles size={18} />
            </div>
            <span className="text-base font-bold text-[#f5e6c8] tracking-wide">Afriversity</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1710] border border-[#3d3322]">
            <span className="text-xs font-semibold text-[#ded8cb]">Afriversity AI</span>
            <span className="text-xs text-[#99907c]">•</span>
            <span className="text-xs font-semibold text-[#f2ca50]">Hands-Free Mode</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-xs font-bold text-emerald-400">Online</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-[#99907c] hover:text-[#f2ca50] hover:bg-[#231d15] transition-all cursor-pointer"
              title="Voice Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#99907c] hover:text-white hover:bg-[#231d15] transition-all cursor-pointer"
              title="Close Live Voice"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Settings Drawer */}
        {showSettings && (
          <div className="p-4 bg-[#18140f] border-b border-[#362f22] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#ded8cb]">Voice Model:</span>
              <div className="flex items-center gap-1.5">
                {(["Zephyr", "Puck", "Charon", "Kore", "Fenrir"] as LiveVoiceName[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVoice(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      selectedVoice === v
                        ? "bg-[#d4af37]/25 border-[#f2ca50] text-[#f2ca50]"
                        : "bg-[#241f17] border-[#423827] text-[#ded8cb]"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-between bg-gradient-to-b from-[#0c0a08] via-[#14110d] to-[#0c0a08]">
          
          {/* Transcript History / Conversation Display */}
          <div className="w-full max-w-2xl space-y-4 mb-6 flex-1 overflow-y-auto pr-2">
            {transcriptHistory.map((turn, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border shadow-lg transition-all ${
                  turn.role === "user"
                    ? "bg-[#17140f]/95 border-[#d4af37]/30 ml-auto max-w-[85%]"
                    : "bg-[#17140f] border-[#3c3324] mr-auto max-w-[85%]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#f2ca50]">
                    <span>{turn.role === "user" ? "You" : "Afriversity AI"}</span>
                    {turn.role === "user" ? <Mic size={13} className="text-[#f2ca50]" /> : <Volume2 size={14} className="text-[#f2ca50]" />}
                  </div>
                  <span className="text-[10px] text-[#99907c]">{turn.timestamp}</span>
                </div>
                <div className="text-xs sm:text-sm text-[#ded8cb] leading-relaxed whitespace-pre-line">
                  {turn.text}
                </div>
              </div>
            ))}
          </div>

          {/* Centerpiece Glowing Golden Ring & Avatar */}
          <div className="relative flex items-center justify-center my-4 shrink-0">
            <div className={`absolute w-48 h-48 rounded-full border border-[#d4af37]/20 ${isSpeaking || isUserTalking ? "animate-ping opacity-50" : "opacity-20"}`} />
            <div className={`absolute w-36 h-36 rounded-full border border-[#f2ca50]/40 ${isSpeaking || isUserTalking ? "animate-pulse" : ""}`} />
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-[#d4af37]/25 to-transparent blur-xl" />

            {/* Central Hexagon Logo & Status */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-[#16130e] border-2 border-[#f2ca50] shadow-[0_0_40px_rgba(242,202,80,0.5)] flex flex-col items-center justify-center text-center p-2">
              <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#f2ca50]/60 flex items-center justify-center text-[#f2ca50] mb-1">
                <Sparkles size={18} />
              </div>
              <span className="text-xs font-bold text-[#f5e6c8] tracking-wide">Afriversity</span>
              <span className="text-[10px] text-[#99907c] mt-0.5">
                {connectionStatus === "connected" ? (isSpeaking ? "Speaking..." : isUserTalking ? "Listening..." : "Ready") : connectionStatus}
              </span>
            </div>
          </div>

          {/* Speaking Equalizer Bar if speaking */}
          {isSpeaking && (
            <div className="w-full max-w-2xl bg-[#17140f] border border-[#3c3324] rounded-xl p-3 flex items-center gap-3 mb-4 shrink-0">
              <Volume2 size={16} className="text-[#f2ca50] animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-[#f2ca50]">AI Voice Speaking...</span>
              <div className="flex items-center gap-1 ml-auto">
                {[30, 60, 90, 45, 80, 100, 65, 40, 75].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.max(4, h * 0.2)}px` }}
                    className="w-1 rounded-full bg-[#f2ca50] animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Interactive Voice & Text Input Bar */}
          <div className="w-full max-w-2xl flex items-center gap-2 mb-4 shrink-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isMuted
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-[#16130e] border-[#3c3324] text-[#f2ca50] hover:bg-[#221c15]"
              }`}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <form onSubmit={(e) => handleSendTextTurn(e)} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Ask anything about universities, scholarships, courses..."
                className="flex-1 bg-[#16130e] border border-[#3c3324] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#f5e6c8] placeholder-[#8c826e] focus:outline-none focus:border-[#f2ca50]"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#0c0a08] text-xs font-bold disabled:opacity-50 hover:opacity-90 transition-all cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>

          {/* Four Bottom Quick Action Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-3xl shrink-0">
            {[
              { label: "Compare universities", prompt: "Compare top engineering universities in Ghana" },
              { label: "Scholarships in Ghana", prompt: "What scholarships are available in Ghana?" },
              { label: "Admission requirements", prompt: "What are the admission requirements for KNUST?" },
              { label: "Engineering programs", prompt: "Tell me about Computer Engineering programs" },
            ].map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendTextTurn(undefined, pill.prompt)}
                className="py-2.5 px-3 rounded-xl bg-[#16130e] hover:bg-[#221c15] border border-[#d4af37]/30 text-[#ded8cb] text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-[#f2ca50]"
              >
                <Sparkles size={12} className="text-[#f2ca50] shrink-0" />
                <span className="truncate">{pill.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
