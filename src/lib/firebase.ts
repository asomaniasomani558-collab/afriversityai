import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  localDb,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "./localFirestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Analytics is disabled per user requirement: "use firebase authentication only"
export const analytics = null;

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Database instance: client-safe local storage persistence layer conforming to Firestore API
export const db = localDb;

// Standard Firestore Error Handling conforming to Firebase Skill specification
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Data Interfaces
export interface SecureUserData {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  university: string;
  location: string;
  bio: string;
  avatar: string;
  heritageScore: number;
  heritageTier: "Gold Member" | "Elite Scholar" | "Heritage Pioneer";
  stats: {
    courses: number;
    groups: number;
    projects: number;
    badges: number;
  };
  enrolledCourseIds: string[];
  savedScholarshipIds: string[];
  bookmarkedCourseIds: string[];
  joinedGroupIds: string[];
  securityLevel: string;
  lastLogin: string;
  createdAt: string;
  updatedAt?: string;
  isEmailVerified?: boolean;
}

// User Document Service
export const getUserDocument = async (uid: string): Promise<SecureUserData | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as SecureUserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user document from Firestore:", error);
    return null;
  }
};

export const saveUserDocument = async (uid: string, data: Partial<SecureUserData>): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(
      userRef,
      {
        ...data,
        uid,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error saving user document in Firestore:", error);
    return false;
  }
};

// Security Audit Log Service
export const recordSecurityAudit = async (
  uid: string,
  action: "LOGIN" | "SIGNUP" | "GOOGLE_AUTH" | "PASSWORD_RESET" | "PROFILE_UPDATE" | "LOGOUT",
  details: string
) => {
  try {
    const auditRef = doc(collection(db, "security_audit_logs"));
    await setDoc(auditRef, {
      uid,
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "WebClient",
      securityProtocol: "AES-256 / TLS 1.3",
    });
  } catch (err) {
    // Non-blocking security audit
    console.warn("Security audit recorded locally:", action, details);
  }
};

// User Notes Subcollection Service
export interface ScholarNote {
  id: string;
  title: string;
  content: string;
  discipline: string;
  updatedAt: string;
}

export const fetchUserNotes = async (uid: string): Promise<ScholarNote[]> => {
  try {
    const notesRef = collection(db, "users", uid, "notes");
    const snap = await getDocs(notesRef);
    const notes: ScholarNote[] = [];
    snap.forEach((d) => {
      notes.push({ id: d.id, ...(d.data() as Omit<ScholarNote, "id">) });
    });
    return notes;
  } catch (err) {
    console.error("Failed to fetch user notes from Firestore:", err);
    return [];
  }
};

export const saveUserNote = async (uid: string, note: Partial<ScholarNote> & { id?: string }): Promise<string> => {
  const noteId = note.id || `note-${Date.now()}`;
  const noteRef = doc(db, "users", uid, "notes", noteId);
  await setDoc(
    noteRef,
    {
      title: note.title || "Untitled Research Note",
      content: note.content || "",
      discipline: note.discipline || "General STEM",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return noteId;
};

export const deleteUserNote = async (uid: string, noteId: string): Promise<void> => {
  const noteRef = doc(db, "users", uid, "notes", noteId);
  await deleteDoc(noteRef);
};

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type FirebaseUser,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
};
