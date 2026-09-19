import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  checkWakeWord,
  playActivationChime,
  speakResponse,
  stopSpeaking,
  ACTIVATION_WORDS,
} from "../services/wakeWordService";
import { useAuth } from "./AuthContext";

interface VoiceActivationContextType {
  // Wake Word Listener State
  isListening: boolean;
  isSupported: boolean;
  isMicrophoneAllowed: boolean;
  toggleListening: () => void;
  startListening: () => void;
  stopListening: () => void;
  lastMatchedWord: string | null;

  // Live Conversation State (Gemini Live Audio Chatbot)
  isLiveConversationOpen: boolean;
  openLiveConversation: (initialPrompt?: string, topic?: string) => void;
  closeLiveConversation: () => void;
  livePrompt: string;
  liveTopic: string;

  // Quick Assistant Overlay
  isAssistantOpen: boolean;
  openAssistant: (initialPrompt?: string, spokenTrigger?: string) => void;
  closeAssistant: () => void;
  initialPrompt: string;
  spokenTrigger: string;

  // Manual & Text activation triggers
  triggerActivationWord: (wordOrPhrase: string, remainderQuery?: string) => void;

  // Audio speech synthesis
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeech: () => void;

  // Direct access to supported activation words
  activationWords: readonly string[];
}

const VoiceActivationContext = createContext<VoiceActivationContextType | undefined>(undefined);

export const VoiceActivationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData, currentUser } = useAuth();
  const userName = userData?.displayName || currentUser?.displayName || "Scholar";

  const [isListening, setIsListening] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("afriversty_wakeword_active");
      return stored !== null ? stored === "true" : true; // Default ON for seamless wake-word experience
    } catch {
      return true;
    }
  });

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isMicrophoneAllowed, setIsMicrophoneAllowed] = useState<boolean>(false);
  const [lastMatchedWord, setLastMatchedWord] = useState<string | null>(null);

  // Live Conversation State
  const [isLiveConversationOpen, setIsLiveConversationOpen] = useState<boolean>(false);
  const [livePrompt, setLivePrompt] = useState<string>("");
  const [liveTopic, setLiveTopic] = useState<string>("Pan-African Higher Education & STEM");

  // Fallback Assistant overlay
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [initialPrompt, setInitialPrompt] = useState<string>("");
  const [spokenTrigger, setSpokenTrigger] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(isListening);
  const shouldRestartRef = useRef<boolean>(isListening);
  const isRestartingRef = useRef<boolean>(false);
  const isLiveActiveRef = useRef<boolean>(false);

  useEffect(() => {
    isListeningRef.current = isListening;
    shouldRestartRef.current = isListening && !isLiveActiveRef.current;
    try {
      localStorage.setItem("afriversty_wakeword_active", isListening ? "true" : "false");
    } catch {}
  }, [isListening]);

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setIsSupported(hasSpeech);
    }
  }, []);

  const speak = useCallback((text: string) => {
    setIsSpeaking(true);
    speakResponse(text, () => {
      setIsSpeaking(false);
    });
  }, []);

  const stopSpeech = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Open Live Conversation with Gemini Live Audio Chatbot
  const openLiveConversation = useCallback(
    (prompt: string = "", topic: string = "Pan-African Higher Education & STEM") => {
      // Pause speech synthesis and background speech recognition
      stopSpeech();
      isLiveActiveRef.current = true;
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      setLivePrompt(prompt);
      setLiveTopic(topic);
      setIsLiveConversationOpen(true);
      setIsAssistantOpen(false);
    },
    [stopSpeech]
  );

  // Close Live Conversation and resume background listening
  const closeLiveConversation = useCallback(() => {
    setIsLiveConversationOpen(false);
    isLiveActiveRef.current = false;
    setLivePrompt("");

    // Resume background listening if enabled
    if (isListeningRef.current && recognitionRef.current) {
      shouldRestartRef.current = true;
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch {}
      }, 500);
    }
  }, []);

  // Respond whenever an activation word is detected:
  // Immediately activates the AI chatbot for a live conversation!
  const handleActivationTrigger = useCallback(
    (matchedWord: string, remainderQuery: string = "") => {
      console.log(`[AfriVersty Wake Word] Activated by "${matchedWord}" with query: "${remainderQuery}"`);
      // 1. Play Golden Activation Chime
      playActivationChime();

      setLastMatchedWord(matchedWord);
      setSpokenTrigger(matchedWord);

      // 2. Open Live Conversation with the query
      openLiveConversation(remainderQuery);
    },
    [openLiveConversation]
  );

  // Manual trigger (e.g. from search bar or buttons)
  const triggerActivationWord = useCallback(
    (wordOrPhrase: string, remainderQuery: string = "") => {
      const match = checkWakeWord(wordOrPhrase);
      if (match.isMatch) {
        handleActivationTrigger(match.matchedWord || wordOrPhrase, remainderQuery || match.remainderQuery);
      } else {
        // Direct invocation
        handleActivationTrigger(wordOrPhrase, remainderQuery);
      }
    },
    [handleActivationTrigger]
  );

  // Setup Continuous SpeechRecognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    let recognition: any = null;

    try {
      recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsMicrophoneAllowed(true);
        isRestartingRef.current = false;
      };

      recognition.onresult = (event: any) => {
        // Ignore wake-word recognition if live conversation modal is already active
        if (isLiveActiveRef.current) return;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (!result) continue;

          for (let alt = 0; alt < result.length; alt++) {
            const transcript = result[alt]?.transcript || "";
            if (transcript.trim()) {
              const check = checkWakeWord(transcript);
              if (check.isMatch) {
                handleActivationTrigger(check.matchedWord || "hello", check.remainderQuery);
                return;
              }
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setIsMicrophoneAllowed(false);
          // don't disable isListening, allow retry on user gesture
          shouldRestartRef.current = false;
        } else if (event.error === "no-speech") {
          // Normal when silent, keep running
        } else {
          console.debug("WakeWord Recognition notice:", event.error);
        }
      };

      recognition.onend = () => {
        // If wake-word listening is enabled and live modal not open, restart seamlessly
        if (shouldRestartRef.current && !isRestartingRef.current && !isLiveActiveRef.current) {
          isRestartingRef.current = true;
          setTimeout(() => {
            if (shouldRestartRef.current && !isLiveActiveRef.current) {
              try {
                recognition.start();
              } catch {
                isRestartingRef.current = false;
              }
            }
          }, 300);
        }
      };

      recognitionRef.current = recognition;

      // Auto-start listening if enabled
      if (isListening && !isLiveActiveRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    } catch (e) {
      console.debug("WakeWord initialization notice:", e);
    }

    // Auto-resume recognition on first user interaction anywhere on the page
    const handleFirstUserInteraction = () => {
      if (isListeningRef.current && !isLiveActiveRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    };
    window.addEventListener("pointerdown", handleFirstUserInteraction, { once: true });
    window.addEventListener("keydown", handleFirstUserInteraction, { once: true });

    return () => {
      shouldRestartRef.current = false;
      window.removeEventListener("pointerdown", handleFirstUserInteraction);
      window.removeEventListener("keydown", handleFirstUserInteraction);
      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }
    };
  }, [handleActivationTrigger]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldRestartRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // already started
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const openAssistant = useCallback((prompt: string = "", trigger: string = "hello") => {
    setInitialPrompt(prompt);
    setSpokenTrigger(trigger);
    setIsAssistantOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsAssistantOpen(false);
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Global Keyboard listener: press Alt+A or Ctrl+Space to activate live conversation instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "a") || (e.ctrlKey && e.code === "Space")) {
        e.preventDefault();
        handleActivationTrigger("hello", "");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleActivationTrigger]);

  return (
    <VoiceActivationContext.Provider
      value={{
        isListening,
        isSupported,
        isMicrophoneAllowed,
        toggleListening,
        startListening,
        stopListening,
        lastMatchedWord,
        isLiveConversationOpen,
        openLiveConversation,
        closeLiveConversation,
        livePrompt,
        liveTopic,
        isAssistantOpen,
        openAssistant,
        closeAssistant,
        initialPrompt,
        spokenTrigger,
        triggerActivationWord,
        isSpeaking,
        speak,
        stopSpeech,
        activationWords: ACTIVATION_WORDS,
      }}
    >
      {children}
    </VoiceActivationContext.Provider>
  );
};

export const useVoiceActivation = () => {
  const context = useContext(VoiceActivationContext);
  if (!context) {
    throw new Error("useVoiceActivation must be used within a VoiceActivationProvider");
  }
  return context;
};
