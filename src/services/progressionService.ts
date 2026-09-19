import {
  db,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "../lib/firebase";
import { UserProgression, CourseProgressDetail } from "../types";

const LOCAL_STORAGE_KEY = "afriversty_user_progression";

/**
 * Reads local cached progression
 */
export function getCachedProgression(userId?: string): UserProgression | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const data: UserProgression = JSON.parse(raw);
    if (userId && data.userId !== userId) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Saves progression to local storage cache
 */
function cacheProgression(progression: UserProgression): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progression));
  } catch {}
}

/**
 * Creates default progression record for newly signed-up or guest scholars
 */
export function createDefaultProgression(userId: string, email?: string, displayName?: string): UserProgression {
  const now = new Date().toISOString();
  return {
    userId,
    email: email || "",
    displayName: displayName || "Scholar",
    heritageScore: 75,
    heritageTier: "Gold Member",
    completedCoursesCount: 1,
    enrolledCoursesCount: 3,
    studyGroupsJoinedCount: 2,
    badgesCount: 4,
    courseProgress: {
      c1: {
        courseId: "c1",
        progressPercentage: 65,
        completedLessons: 4,
        totalLessons: 6,
        completedModules: ["m1", "m2", "m3", "m4"],
        status: "in-progress",
        lastAccessedAt: now,
      },
      c2: {
        courseId: "c2",
        progressPercentage: 30,
        completedLessons: 2,
        totalLessons: 8,
        completedModules: ["m1", "m2"],
        status: "in-progress",
        lastAccessedAt: now,
      },
    },
    joinedGroupIds: ["g1", "g2"],
    bookmarkedCourseIds: ["c3"],
    savedScholarshipIds: ["s1"],
    lastActiveTab: "dashboard",
    updatedAt: now,
    lastLoginAt: now,
    createdAt: now,
  };
}

/**
 * Initializes or updates progression on sign up or login.
 * Guarantees that every user who signs up or logs in has their progression
 * saved into Firestore under `/progressions/{userId}` and `/users/{userId}/progression/current`.
 */
export async function initializeOrSyncUserProgression(params: {
  userId: string;
  email?: string;
  displayName?: string;
  heritageScore?: number;
  heritageTier?: "Gold Member" | "Elite Scholar" | "Heritage Pioneer";
}): Promise<UserProgression> {
  const now = new Date().toISOString();

  // Try to load existing progression from Firestore
  let existingProgression: UserProgression | null = null;

  if (params.userId && params.userId !== "guest") {
    try {
      const docRef = doc(db, "progressions", params.userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        existingProgression = snap.data() as UserProgression;
      }
    } catch (err) {
      console.warn("Could not fetch remote progression on login:", err);
    }
  }

  // Fallback to cache if remote not found
  if (!existingProgression) {
    existingProgression = getCachedProgression(params.userId);
  }

  let finalProgression: UserProgression;

  if (existingProgression) {
    finalProgression = {
      ...existingProgression,
      userId: params.userId,
      email: params.email || existingProgression.email,
      displayName: params.displayName || existingProgression.displayName,
      heritageScore: params.heritageScore ?? existingProgression.heritageScore,
      heritageTier: params.heritageTier ?? existingProgression.heritageTier,
      lastLoginAt: now,
      updatedAt: now,
    };
  } else {
    finalProgression = {
      ...createDefaultProgression(params.userId, params.email, params.displayName),
      heritageScore: params.heritageScore ?? 75,
      heritageTier: params.heritageTier ?? "Gold Member",
      lastLoginAt: now,
      updatedAt: now,
    };
  }

  // 1. Cache immediately
  cacheProgression(finalProgression);

  // 2. Persist to Firestore database
  if (params.userId && params.userId !== "guest") {
    try {
      const progDocRef = doc(db, "progressions", params.userId);
      await setDoc(
        progDocRef,
        {
          ...finalProgression,
          serverTimestamp: serverTimestamp(),
        },
        { merge: true }
      );

      // Also mirror to user subcollection
      try {
        const subDocRef = doc(db, "users", params.userId, "progression", "current");
        await setDoc(
          subDocRef,
          {
            ...finalProgression,
            serverTimestamp: serverTimestamp(),
          },
          { merge: true }
        );
      } catch {}
    } catch (error) {
      console.warn("Could not write progression to Firestore on login:", error);
    }
  }

  return finalProgression;
}

/**
 * Updates a specific course's progress in the persistent database
 */
export async function updateCourseProgression(
  userId: string,
  courseId: string,
  moduleId: string,
  totalLessons: number,
  allCompletedModuleIds: string[]
): Promise<UserProgression | null> {
  const current = getCachedProgression(userId) || createDefaultProgression(userId);
  const now = new Date().toISOString();

  const completedCount = allCompletedModuleIds.length;
  const progressPercentage = Math.min(100, Math.round((completedCount / Math.max(1, totalLessons)) * 100));
  const isCompleted = progressPercentage >= 100;

  const updatedCourseDetail: CourseProgressDetail = {
    courseId,
    progressPercentage,
    completedLessons: completedCount,
    totalLessons,
    completedModules: allCompletedModuleIds,
    status: isCompleted ? "completed" : "in-progress",
    lastAccessedAt: now,
  };

  const updatedCourseMap = {
    ...current.courseProgress,
    [courseId]: updatedCourseDetail,
  };

  const completedCoursesCount = Object.values(updatedCourseMap).filter(
    (c) => c.status === "completed"
  ).length;

  const updatedProgression: UserProgression = {
    ...current,
    courseProgress: updatedCourseMap,
    completedCoursesCount,
    heritageScore: Math.min(100, current.heritageScore + 2), // Milestone reward
    updatedAt: now,
  };

  cacheProgression(updatedProgression);

  if (userId && userId !== "guest") {
    try {
      const progRef = doc(db, "progressions", userId);
      await setDoc(
        progRef,
        {
          ...updatedProgression,
          serverTimestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Could not sync course progression to Firestore:", err);
    }
  }

  return updatedProgression;
}

/**
 * Subscribes to live progression changes for a user
 */
export function subscribeUserProgression(
  userId: string,
  callback: (progression: UserProgression) => void
): () => void {
  const cached = getCachedProgression(userId);
  if (cached) {
    callback(cached);
  }

  if (!userId || userId === "guest") {
    return () => {};
  }

  try {
    const progRef = doc(db, "progressions", userId);
    const unsubscribe = onSnapshot(
      progRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProgression;
          cacheProgression(data);
          callback(data);
        }
      },
      (err) => {
        console.warn("Progression snapshot listener error:", err);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
}
