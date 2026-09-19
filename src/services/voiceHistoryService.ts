import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "../lib/firebase";
import { VoiceCommandRecord } from "../types";

const LOCAL_STORAGE_KEY = "afriversty_voice_command_history";

/**
 * Get locally cached voice command history
 */
export function getCachedVoiceCommands(userId?: string): VoiceCommandRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list: VoiceCommandRecord[] = JSON.parse(raw);
    if (userId && userId !== "guest") {
      return list.filter((item) => item.userId === userId);
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Cache a voice command locally
 */
function cacheVoiceCommand(record: VoiceCommandRecord): void {
  try {
    const current = getCachedVoiceCommands();
    const updated = [record, ...current.filter((r) => r.id !== record.id)].slice(0, 60);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota
  }
}

/**
 * Logs a voice command and its corresponding AI response to Firestore
 * in `/voiceCommands` and user subcollection `/users/{userId}/voiceCommands/{id}`.
 */
export async function logVoiceCommandInteraction(params: {
  userId: string;
  command: string;
  response: string;
  source?: "ai-assistant" | "gemini-live" | "wake-word";
  discipline?: string;
}): Promise<VoiceCommandRecord> {
  const timestamp = Date.now();
  const id = `vc_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  const record: VoiceCommandRecord = {
    id,
    userId: params.userId,
    command: params.command.trim(),
    response: params.response.trim(),
    source: params.source || "ai-assistant",
    discipline: params.discipline || "General STEM",
    createdAt,
    timestamp,
  };

  // 1. Cache locally for instant UI update & offline capability
  cacheVoiceCommand(record);

  // 2. Persist to Firestore if user has a valid ID
  if (params.userId && params.userId !== "guest") {
    try {
      const docRef = doc(db, "voiceCommands", id);
      await setDoc(docRef, {
        ...record,
        serverTime: serverTimestamp(),
      });

      // Subcollection mirror for complete user data isolation
      try {
        const subRef = doc(db, "users", params.userId, "voiceCommands", id);
        await setDoc(subRef, {
          ...record,
          serverTime: serverTimestamp(),
        });
      } catch {
        // Non-critical subcollection write
      }
    } catch (err) {
      console.warn("Could not save voice command to remote Firestore, retained in cache:", err);
    }
  }

  return record;
}

/**
 * Subscribes to real-time voice commands for the specified user
 */
export function subscribeVoiceCommands(
  userId: string,
  callback: (records: VoiceCommandRecord[]) => void
): () => void {
  // Emit locally cached entries first
  const localItems = getCachedVoiceCommands(userId);
  if (localItems.length > 0) {
    callback(localItems);
  }

  if (!userId || userId === "guest") {
    return () => {};
  }

  try {
    const q = query(
      collection(db, "voiceCommands"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(30)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: VoiceCommandRecord[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId || userId,
              command: data.command || "",
              response: data.response || "",
              source: data.source || "ai-assistant",
              discipline: data.discipline || "General STEM",
              createdAt: data.createdAt || new Date().toISOString(),
              timestamp: typeof data.timestamp === "number" ? data.timestamp : Date.now(),
            };
          });

          // Merge with any cached items not yet indexed
          const merged = [...fetched];
          for (const item of localItems) {
            if (!merged.some((m) => m.id === item.id)) {
              merged.push(item);
            }
          }
          merged.sort((a, b) => b.timestamp - a.timestamp);

          callback(merged);
        } else {
          callback(localItems);
        }
      },
      (error) => {
        console.warn("Firestore voice command history subscription fallback:", error);
        callback(getCachedVoiceCommands(userId));
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Failed to attach voice commands listener:", err);
    return () => {};
  }
}

/**
 * Delete a single voice command item from history
 */
export async function deleteVoiceCommand(userId: string, commandId: string): Promise<void> {
  // Update local cache
  try {
    const list = getCachedVoiceCommands();
    const filtered = list.filter((item) => item.id !== commandId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch {}

  // Delete from Firestore
  if (userId && userId !== "guest") {
    try {
      await deleteDoc(doc(db, "voiceCommands", commandId));
      try {
        await deleteDoc(doc(db, "users", userId, "voiceCommands", commandId));
      } catch {}
    } catch (err) {
      console.warn("Error deleting voice command from Firestore:", err);
    }
  }
}

/**
 * Clear all voice command history for a user
 */
export async function clearVoiceCommandHistory(userId: string): Promise<void> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list: VoiceCommandRecord[] = JSON.parse(raw);
      const filtered = list.filter((item) => item.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch {}

  if (userId && userId !== "guest") {
    try {
      const q = query(collection(db, "voiceCommands"), where("userId", "==", userId));
      const snap = await getDocs(q);
      const promises = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(promises);
    } catch (err) {
      console.warn("Error clearing voice commands in Firestore:", err);
    }
  }
}
