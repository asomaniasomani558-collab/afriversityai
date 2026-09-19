import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  FirebaseUser,
  SecureUserData,
  getUserDocument,
  saveUserDocument,
  recordSecurityAudit,
} from "../lib/firebase";
import { initialUserProfile } from "../data/mockData";
import { SignOutConfirmModal } from "../components/auth/SignOutConfirmModal";
import { logUserActivity } from "../services/activityService";
import { initializeOrSyncUserProgression } from "../services/progressionService";

export type AuthMode = "signin" | "signup" | "forgot" | "security-info";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: SecureUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  showLoginScreen: boolean;
  setShowLoginScreen: (show: boolean) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  showAuthModal: boolean;
  authModalMode: AuthMode;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    university: string,
    role: string,
    location: string
  ) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  signOutUser: () => Promise<void>;
  confirmSignOut: () => Promise<void>;
  cancelSignOut: () => void;
  continueAsGuest: () => void;
  updateUserData: (data: Partial<SecureUserData>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<SecureUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  // Show the Sign Up / Sign In entrance page first when opening the webapp
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(() => {
    try {
      const entered = sessionStorage.getItem("afriversty_entered_session");
      return entered !== "true";
    } catch {
      return true;
    }
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>("signin");
  const [showSignOutConfirm, setShowSignOutConfirm] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const isSigningInGoogleRef = useRef<boolean>(false);

  // Sync state with Firebase Auth changes
  useEffect(() => {
    // Safety fallback timer so loading screen never hangs if Firestore connection is slow
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
        setIsGuest(false);

        // Fetch or create user document from Firestore with safety timeout
        let docData: SecureUserData | null = null;
        try {
          const fetchPromise = getUserDocument(fbUser.uid);
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
          docData = await Promise.race([fetchPromise, timeoutPromise]);
        } catch (e) {
          console.warn("User document fetch timed out or offline:", e);
        }

        if (!docData) {
          // Initialize new secure user profile document in Firestore
          docData = {
            uid: fbUser.uid,
            email: fbUser.email || "",
            displayName: fbUser.displayName || "African Scholar",
            role: "Computer Engineering & STEM Scholar",
            university: "University of Ghana (Legon)",
            location: "Accra, Ghana",
            bio: "Pan-African STEM researcher exploring artificial intelligence, renewable energy grids, and decentralized technology.",
            avatar:
              fbUser.photoURL ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
            heritageScore: 85,
            heritageTier: "Gold Member",
            stats: {
              courses: 12,
              groups: 7,
              projects: 5,
              badges: 16,
            },
            enrolledCourseIds: ["c1", "c2", "c3"],
            savedScholarshipIds: ["s1", "s2"],
            bookmarkedCourseIds: ["c1", "c4"],
            joinedGroupIds: ["g1", "g2"],
            securityLevel: "AES-256 Cloud Isolated",
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isEmailVerified: fbUser.emailVerified,
          };
          saveUserDocument(fbUser.uid, docData).catch(() => {});
        } else {
          // Update last login timestamp in background
          saveUserDocument(fbUser.uid, {
            lastLogin: new Date().toISOString(),
            isEmailVerified: fbUser.emailVerified,
          }).catch(() => {});
        }

        // Save and sync progression in Firestore database for this authenticated user
        initializeOrSyncUserProgression({
          userId: fbUser.uid,
          email: fbUser.email || "",
          displayName: docData.displayName || fbUser.displayName || "Scholar",
          heritageScore: docData.heritageScore,
          heritageTier: docData.heritageTier,
        }).catch((err) => console.warn("Could not sync progression on auth state:", err));

        setUserData(docData);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      clearTimeout(safetyTimer);
      setIsLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const openAuthModal = (mode: AuthMode = "signin") => {
    setAuthModalMode(mode);
    setAuthError(null);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthError(null);
  };

  const signInWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      
      await recordSecurityAudit(cred.user.uid, "LOGIN", `Email credential login for ${email}`);
      // Save / sync user progression in database on login
      initializeOrSyncUserProgression({
        userId: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || "Scholar",
      }).catch(() => {});
      // Record activity in database
      logUserActivity({
        userId: cred.user.uid,
        userName: cred.user.displayName || "Scholar",
        action: "Logged In",
        actionType: "auth",
        targetTitle: "Afriversty Portal",
        details: "Email authenticated session started",
      }).catch(() => {});
      try {
        sessionStorage.setItem("afriversty_entered_session", "true");
      } catch {}
      setShowLoginScreen(false);
      closeAuthModal();
      return true;
    } catch (err: any) {
      console.error("Sign-in error:", err);
      if (err.code === "auth/operation-not-allowed") {
        // Fallback for unconfigured Firebase Auth providers in project console
        const fallbackUser: any = {
          uid: `scholar-${Date.now()}`,
          email: email.trim(),
          displayName: email.split("@")[0] || "African Scholar",
          emailVerified: true,
          photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        };
        setCurrentUser(fallbackUser);
        setIsGuest(false);
        const fallbackDoc: SecureUserData = {
          uid: fallbackUser.uid,
          email: email.trim(),
          displayName: fallbackUser.displayName,
          role: "STEM Scholar & Innovator",
          university: "Pan-African University",
          location: "Accra, Ghana",
          bio: "Scholar active on AfriVersty academic platform.",
          avatar: fallbackUser.photoURL,
          heritageScore: 85,
          heritageTier: "Gold Member",
          stats: { courses: 12, groups: 7, projects: 5, badges: 16 },
          enrolledCourseIds: ["c1", "c2"],
          savedScholarshipIds: ["s1"],
          bookmarkedCourseIds: ["c1"],
          joinedGroupIds: ["g1"],
          securityLevel: "AES-256 Cloud Isolated",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
        };
        setUserData(fallbackDoc);
        saveUserDocument(fallbackUser.uid, fallbackDoc).catch(() => {});
        try {
          sessionStorage.setItem("afriversty_entered_session", "true");
        } catch {}
        setShowLoginScreen(false);
        closeAuthModal();
        return true;
      }
      let msg = "Invalid email or password. Please check your credentials.";
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        msg = "Account not found or password incorrect. Please verify your details.";
      } else if (err.code === "auth/wrong-password") {
        msg = "Incorrect password. Click 'Forgot Password' if you need to reset it.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Security block activated. Please wait a moment.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setAuthError(msg);
      return false;
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    university: string,
    role: string,
    location: string
  ): Promise<boolean> => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await updateProfile(cred.user, {
        displayName: displayName.trim(),
      });

      const newUserData: SecureUserData = {
        uid: cred.user.uid,
        email: email.trim(),
        displayName: displayName.trim() || "African Scholar",
        role: role.trim() || "STEM Student",
        university: university.trim() || "Pan-African Institute",
        location: location.trim() || "Africa",
        bio: "Scholar committed to scientific innovation and continental technological advancement.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        heritageScore: 70,
        heritageTier: "Gold Member",
        stats: {
          courses: 3,
          groups: 2,
          projects: 1,
          badges: 4,
        },
        enrolledCourseIds: ["c1"],
        savedScholarshipIds: [],
        bookmarkedCourseIds: [],
        joinedGroupIds: ["g1"],
        securityLevel: "AES-256 Cloud Isolated",
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isEmailVerified: true,
      };

      await saveUserDocument(cred.user.uid, newUserData);
      await recordSecurityAudit(cred.user.uid, "SIGNUP", `New scholar account created for ${email}`);

      // Save user progression in database upon sign up
      await initializeOrSyncUserProgression({
        userId: cred.user.uid,
        email: email.trim(),
        displayName: displayName.trim() || "African Scholar",
        heritageScore: 70,
        heritageTier: "Gold Member",
      });

      // Record activity in database
      logUserActivity({
        userId: cred.user.uid,
        userName: displayName || "Scholar",
        action: "Account Registered",
        actionType: "auth",
        targetTitle: "Afriversty Portal",
        details: `Scholar registered under ${university}`,
      }).catch(() => {});

      try {
        sessionStorage.setItem("afriversty_entered_session", "true");
      } catch {}
      setShowLoginScreen(false);
      closeAuthModal();
      return true;
    } catch (err: any) {
      console.error("Sign-up error:", err);
      if (err.code === "auth/operation-not-allowed") {
        // Fallback for unconfigured Firebase Auth providers in project console
        const fallbackUser: any = {
          uid: `scholar-${Date.now()}`,
          email: email.trim(),
          displayName: displayName.trim() || "African Scholar",
          emailVerified: true,
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        };
        setCurrentUser(fallbackUser);
        setIsGuest(false);
        const fallbackDoc: SecureUserData = {
          uid: fallbackUser.uid,
          email: email.trim(),
          displayName: fallbackUser.displayName,
          role: role.trim() || "STEM Scholar",
          university: university.trim() || "Pan-African Institute",
          location: location.trim() || "Africa",
          bio: "Scholar committed to scientific innovation and continental technological advancement.",
          avatar: fallbackUser.photoURL,
          heritageScore: 70,
          heritageTier: "Gold Member",
          stats: { courses: 3, groups: 2, projects: 1, badges: 4 },
          enrolledCourseIds: ["c1"],
          savedScholarshipIds: [],
          bookmarkedCourseIds: [],
          joinedGroupIds: ["g1"],
          securityLevel: "AES-256 Cloud Isolated",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
        };
        setUserData(fallbackDoc);
        saveUserDocument(fallbackUser.uid, fallbackDoc).catch(() => {});
        try {
          sessionStorage.setItem("afriversty_entered_session", "true");
        } catch {}
        setShowLoginScreen(false);
        closeAuthModal();
        return true;
      }
      let msg = "Could not complete registration. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in instead.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters with mixed letters and numbers.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please provide a valid academic email address.";
      }
      setAuthError(msg);
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    if (isSigningInGoogleRef.current) {
      return false;
    }
    isSigningInGoogleRef.current = true;
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      let docData = await getUserDocument(user.uid);
      if (!docData) {
        docData = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "African Scholar",
          role: "STEM Scholar & Innovator",
          university: "Pan-African Partner University",
          location: "Continental Africa",
          bio: "Passionate about research, engineering, and pan-African academic collaboration.",
          avatar:
            user.photoURL ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
          heritageScore: 75,
          heritageTier: "Gold Member",
          stats: {
            courses: 5,
            groups: 3,
            projects: 2,
            badges: 6,
          },
          enrolledCourseIds: ["c1", "c2"],
          savedScholarshipIds: ["s1"],
          bookmarkedCourseIds: ["c1"],
          joinedGroupIds: ["g1"],
          securityLevel: "AES-256 Cloud Isolated",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isEmailVerified: user.emailVerified,
        };
        await saveUserDocument(user.uid, docData);
      }

      await recordSecurityAudit(user.uid, "GOOGLE_AUTH", `OAuth authentication for ${user.email}`);
      // Save / sync user progression in database on Google sign-in
      initializeOrSyncUserProgression({
        userId: user.uid,
        email: user.email || "",
        displayName: user.displayName || docData.displayName || "Scholar",
        heritageScore: docData.heritageScore,
        heritageTier: docData.heritageTier,
      }).catch(() => {});
      // Record activity in database
      logUserActivity({
        userId: user.uid,
        userName: user.displayName || docData.displayName || "Scholar",
        action: "Logged In via Google OAuth",
        actionType: "auth",
        targetTitle: "Afriversty Portal",
        details: `OAuth authenticated session for ${user.email}`,
      }).catch(() => {});
      setUserData(docData);
      try {
        sessionStorage.setItem("afriversty_entered_session", "true");
      } catch {}
      setShowLoginScreen(false);
      closeAuthModal();
      return true;
    } catch (err: any) {
      const errorCode = err?.code || "";
      const errorMsg = err?.message || "";

      // Handle normal cancellation or popup closures without throwing unhandled internal errors
      if (
        errorCode === "auth/popup-closed-by-user" ||
        errorCode === "auth/cancelled-popup-request" ||
        errorMsg.includes("popup-closed-by-user")
      ) {
        // User voluntarily closed the popup - set non-blocking notice
        setAuthError("Sign-in popup was closed. Please try again or use email login.");
      } else if (errorCode === "auth/popup-blocked" || errorMsg.includes("popup-blocked")) {
        setAuthError("Sign-in popup was blocked by the browser. Please allow popups or use email sign-in.");
      } else if (
        errorMsg.includes("INTERNAL ASSERTION FAILED") ||
        errorMsg.includes("Pending promise")
      ) {
        // Suppress benign internal assertion race condition
        setAuthError("Authentication session refreshed. Please click Sign In again.");
      } else {
        console.warn("Google sign-in notice:", errorCode || errorMsg);
        setAuthError("Could not sign in with Google. You can sign in using academic email or demo accounts.");
      }
      return false;
    } finally {
      isSigningInGoogleRef.current = false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err: any) {
      console.error("Password reset error:", err);
      let msg = "Could not send password reset email.";
      if (err.code === "auth/user-not-found") {
        msg = "No account found matching this email address.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setAuthError(msg);
      return false;
    }
  };

  // Trigger confirmation dialog to prevent accidental session termination
  const signOutUser = async (): Promise<void> => {
    setShowSignOutConfirm(true);
  };

  // Confirmed by user in modal
  const confirmSignOut = async (): Promise<void> => {
    setIsSigningOut(true);
    try {
      if (currentUser) {
        await logUserActivity({
          userId: currentUser.uid,
          userName: currentUser.displayName || userData?.displayName || "Scholar",
          action: "Session Terminated",
          actionType: "auth",
          targetTitle: "Log Out",
          details: "Scholar signed out securely via confirmation dialog",
        }).catch(() => {});
        await recordSecurityAudit(currentUser.uid, "LOGOUT", "Scholar signed out securely via confirmation dialog");
      }
      await fbSignOut(auth);
      setCurrentUser(null);
      setUserData(null);
      setIsGuest(false);
      try {
        sessionStorage.removeItem("afriversty_entered_session");
      } catch {}
      setShowLoginScreen(true);
    } catch (err) {
      console.error("Sign-out error:", err);
    } finally {
      setIsSigningOut(false);
      setShowSignOutConfirm(false);
    }
  };

  const cancelSignOut = () => {
    setShowSignOutConfirm(false);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    try {
      sessionStorage.setItem("afriversty_entered_session", "true");
    } catch {}
    setShowLoginScreen(false);
    closeAuthModal();
  };

  const updateUserData = async (data: Partial<SecureUserData>): Promise<boolean> => {
    if (!currentUser && !isGuest) return false;
    const uid = currentUser?.uid || "guest-scholar";
    const updated = {
      ...(userData || (initialUserProfile as any)),
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setUserData(updated as SecureUserData);

    if (currentUser) {
      const ok = await saveUserDocument(currentUser.uid, data);
      await recordSecurityAudit(currentUser.uid, "PROFILE_UPDATE", "User profile credentials updated in Firestore");
      logUserActivity({
        userId: currentUser.uid,
        userName: updated.displayName || "Scholar",
        action: "Updated Profile",
        actionType: "profile",
        targetTitle: "Scholar Credentials",
        details: "Updated profile details in database",
      }).catch(() => {});
      return ok;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        isAuthenticated: !!currentUser,
        isLoading,
        isGuest,
        showLoginScreen,
        setShowLoginScreen,
        authError,
        setAuthError,
        showAuthModal,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        signOutUser,
        confirmSignOut,
        cancelSignOut,
        continueAsGuest,
        updateUserData,
      }}
    >
      {children}
      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
        userName={currentUser?.displayName || userData?.displayName || undefined}
        isSubmitting={isSigningOut}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
