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
  Timestamp,
} from "../lib/firebase";
import { UserActivityRecord, ActivityType } from "../types";

// Local cache key for offline/fallback persistence
const LOCAL_STORAGE_KEY = "afriversty_user_activities";

/**
 * Helper to get cached activities from localStorage
 */
function getCachedActivities(userId?: string): UserActivityRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const list: UserActivityRecord[] = JSON.parse(raw);
    if (userId) {
      return list.filter((item) => item.userId === userId);
    }
    return list;
  } catch {
    return [];
  }
}

/**
 * Helper to cache activity to localStorage
 */
function cacheActivity(activity: UserActivityRecord): void {
  try {
    const current = getCachedActivities();
    const updated = [activity, ...current.filter((a) => a.id !== activity.id)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore quota errors
  }
}

/**
 * Logs a user activity into the Firestore database collection `/activities`
 * and user subcollection `/users/{userId}/activities` for complete persistence.
 */
export async function logUserActivity(params: {
  userId: string;
  userName?: string;
  action: string;
  actionType: ActivityType;
  targetTitle: string;
  details?: string;
}): Promise<UserActivityRecord> {
  const timestamp = Date.now();
  const id = `act_${timestamp}_${Math.random().toString(36).substring(2, 8)}`;
  const createdAt = new Date().toISOString();

  const record: UserActivityRecord = {
    id,
    userId: params.userId,
    userName: params.userName || "Scholar",
    action: params.action,
    actionType: params.actionType,
    targetTitle: params.targetTitle,
    details: params.details || "",
    createdAt,
    timestamp,
  };

  // Cache locally first for instant UI response and offline safety
  cacheActivity(record);

  try {
    // Top-level activities document
    const activityDocRef = doc(db, "activities", id);
    const docPayload = {
      ...record,
      serverTime: serverTimestamp(),
    };

    await setDoc(activityDocRef, docPayload);

    // Also persist to user subcollection if authenticated
    try {
      const userSubRef = doc(db, "users", params.userId, "activities", id);
      await setDoc(userSubRef, docPayload);
    } catch {
      // Non-critical if subcollection writes fail
    }
  } catch (error) {
    console.warn("Could not sync activity to remote Firestore, cached locally:", error);
  }

  return record;
}

/**
 * Subscribes in real-time to the current user's activity logs in Firestore.
 * Falls back to local cached activities if offline or permission is pending.
 */
export function subscribeUserActivities(
  userId: string,
  callback: (activities: UserActivityRecord[]) => void
): () => void {
  // Emit locally cached items immediately
  const localItems = getCachedActivities(userId);
  if (localItems.length > 0) {
    callback(localItems);
  }

  if (!userId || userId === "guest") {
    return () => {};
  }

  try {
    const q = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(40)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: UserActivityRecord[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId || userId,
              userName: data.userName || "Scholar",
              action: data.action || "",
              actionType: (data.actionType as ActivityType) || "navigation",
              targetTitle: data.targetTitle || "",
              details: data.details || "",
              createdAt: data.createdAt || new Date().toISOString(),
              timestamp: typeof data.timestamp === "number" ? data.timestamp : Date.now(),
            };
          });

          // Merge with any offline cached items
          const merged = [...fetched];
          for (const local of localItems) {
            if (!merged.some((m) => m.id === local.id)) {
              merged.push(local);
            }
          }
          merged.sort((a, b) => b.timestamp - a.timestamp);

          callback(merged);
        } else {
          // If Firestore is empty, still present local activities if any
          callback(localItems);
        }
      },
      (error) => {
        console.warn("Firestore activity subscription error (using local cache):", error);
        callback(getCachedActivities(userId));
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Failed to attach activity listener:", err);
    return () => {};
  }
}

/**
 * One-time fetch of user activities
 */
export async function fetchUserActivities(userId: string): Promise<UserActivityRecord[]> {
  const localItems = getCachedActivities(userId);
  if (!userId || userId === "guest") {
    return localItems;
  }

  try {
    const q = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const records: UserActivityRecord[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId || userId,
          userName: data.userName || "Scholar",
          action: data.action || "",
          actionType: (data.actionType as ActivityType) || "navigation",
          targetTitle: data.targetTitle || "",
          details: data.details || "",
          createdAt: data.createdAt || new Date().toISOString(),
          timestamp: typeof data.timestamp === "number" ? data.timestamp : Date.now(),
        };
      });
      return records;
    }
  } catch (err) {
    console.warn("Failed to fetch activities from Firestore:", err);
  }

  return localItems;
}

/**
 * Clear all activities for a user
 */
export async function clearUserActivities(userId: string): Promise<void> {
  try {
    const q = query(collection(db, "activities"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const promises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(promises);
  } catch (err) {
    console.warn("Could not delete all activities from Firestore:", err);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const list: UserActivityRecord[] = JSON.parse(raw);
      const filtered = list.filter((item) => item.userId !== userId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch {}
}
