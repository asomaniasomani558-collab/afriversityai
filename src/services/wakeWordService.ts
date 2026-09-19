// Wake Word & Voice Activation Service for AfriVersty
// Supported Activation Words: "hey", "hello", "hi", "afriversity" (and common variations)

export const ACTIVATION_WORDS = [
  "hey",
  "hello",
  "hi",
  "afriversity",
  "afriversty",
  "hello afriversity",
  "hey afriversity",
  "hi afriversity",
  "hello afriversty",
  "hey afriversty",
  "hi afriversty",
  "afri versity",
] as const;

export interface WakeWordMatchResult {
  isMatch: boolean;
  matchedWord: string | null;
  remainderQuery: string;
}

/**
 * Checks if a given text starts with or contains any of the activation words:
 * "hey", "hello", "hi", "afriversity", "afriversty" (case-insensitive)
 */
export function checkWakeWord(rawText: string): WakeWordMatchResult {
  if (!rawText) {
    return { isMatch: false, matchedWord: null, remainderQuery: "" };
  }

  // Normalize: lower case, remove excess spacing and common leading symbols
  const text = rawText.toLowerCase().replace(/^[>@#*\\/]+/, "").trim();

  // 1. Check longer phrases first ("hello afriversity", "hey afriversity", "hi afriversity", etc.)
  const longPhrases = [
    "hello afriversity",
    "hey afriversity",
    "hi afriversity",
    "hello afriversty",
    "hey afriversty",
    "hi afriversty",
    "afri university",
    "africa university",
    "afri versity",
    "every versity",
  ];

  for (const phrase of longPhrases) {
    if (text === phrase) {
      return { isMatch: true, matchedWord: phrase, remainderQuery: "" };
    }
    if (text.startsWith(phrase + " ") || text.startsWith(phrase + ",") || text.startsWith(phrase + "!")) {
      const remainder = text.slice(phrase.length).replace(/^[,!.\s]+/, "").trim();
      return { isMatch: true, matchedWord: phrase, remainderQuery: remainder };
    }
    const phraseIndex = text.indexOf(phrase);
    if (phraseIndex !== -1) {
      const before = text.slice(0, phraseIndex).trim();
      const after = text.slice(phraseIndex + phrase.length).replace(/^[,!.\s]+/, "").trim();
      const remainder = [before, after].filter(Boolean).join(" ");
      return { isMatch: true, matchedWord: phrase, remainderQuery: remainder };
    }
  }

  // 2. Check primary single-word activation triggers: "hey", "hello", "hi", "afriversity", "afriversty"
  const primaryTriggers = ["afriversity", "afriversty", "afriuniversity", "hello", "hey", "hi"];

  for (const word of primaryTriggers) {
    // Exact match
    if (text === word) {
      return { isMatch: true, matchedWord: word, remainderQuery: "" };
    }
    // Starts with word followed by space, comma, or punctuation
    const startsWithRegex = new RegExp(`^${word}[\\s,!.?]+`, "i");
    if (startsWithRegex.test(text)) {
      const remainder = text.replace(startsWithRegex, "").trim();
      return { isMatch: true, matchedWord: word, remainderQuery: remainder };
    }
    // Standalone word in the sentence (boundary match)
    const wordRegex = new RegExp(`\\b${word}\\b`, "i");
    if (wordRegex.test(text)) {
      const remainder = text.replace(wordRegex, "").replace(/^[,!.\s]+/, "").trim();
      return { isMatch: true, matchedWord: word, remainderQuery: remainder };
    }
  }

  return { isMatch: false, matchedWord: null, remainderQuery: "" };
}

/**
 * Plays a pleasant, harmonic golden audio chime using Web Audio API synthesizer
 * Confirms activation without needing external MP3 assets
 */
export function playActivationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Harmonic sequence: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.18 },
      { freq: 659.25, time: 0.10, duration: 0.20 },
      { freq: 783.99, time: 0.22, duration: 0.35 },
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + time);

      // Smooth attack and exponential decay
      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.12, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });

    // Close audio context after chime finishes
    setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 800);
  } catch (err) {
    console.debug("Chime playback notice:", err);
  }
}

/**
 * Text-to-Speech output via window.speechSynthesis
 */
export function speakResponse(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/[*_#`~[\]()<>]/g, "")
      .replace(/\n+/g, ". ")
      .slice(0, 300); // Speak first couple sentences naturally

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium"))) ||
        v.lang === "en-US" ||
        v.lang === "en-GB"
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.debug("TTS notice:", e);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
