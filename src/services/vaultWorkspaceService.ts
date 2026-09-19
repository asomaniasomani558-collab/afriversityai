import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  onSnapshot,
  serverTimestamp,
} from "../lib/firebase";
import { WorkspaceFolder, WorkspaceFile, WorkspaceNote, TeamMember } from "../types";

// Local cache keys
const FOLDERS_KEY = "afriversty_workspace_folders";
const FILES_KEY = "afriversty_workspace_files";
const NOTES_KEY = "afriversty_workspace_notes";
const MEMBERS_KEY = "afriversty_workspace_members";

// --- Folders Service ---
export function getCachedFolders(userId: string): WorkspaceFolder[] {
  try {
    const raw = localStorage.getItem(`${FOLDERS_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default initial folders for new users
  return [
    { id: "f1", name: "Research Papers", createdAt: new Date().toISOString() },
    { id: "f2", name: "Project Blueprints", createdAt: new Date().toISOString() },
  ];
}

export function saveCachedFolders(userId: string, folders: WorkspaceFolder[]): void {
  try {
    localStorage.setItem(`${FOLDERS_KEY}_${userId}`, JSON.stringify(folders));
  } catch {}
}

export async function fetchFolders(userId: string): Promise<WorkspaceFolder[]> {
  try {
    const foldersRef = collection(db, "users", userId, "folders");
    const snap = await getDocs(query(foldersRef));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as WorkspaceFolder);
      saveCachedFolders(userId, items);
      return items;
    }
  } catch (err) {
    console.warn("Failed to fetch folders from Firestore, using cache:", err);
  }
  return getCachedFolders(userId);
}

export async function createFolder(userId: string, name: string): Promise<WorkspaceFolder> {
  const id = `folder_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newFolder: WorkspaceFolder = {
    id,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };

  const current = getCachedFolders(userId);
  saveCachedFolders(userId, [newFolder, ...current]);

  try {
    const ref = doc(db, "users", userId, "folders", id);
    await setDoc(ref, { ...newFolder, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Could not save folder to remote Firestore:", err);
  }

  return newFolder;
}

// --- Files Service ---
export function getCachedFiles(userId: string): WorkspaceFile[] {
  try {
    const raw = localStorage.getItem(`${FILES_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: "file_1", name: "Thesis_Draft_v2.pdf", folderId: "f1", size: "4.2 MB", createdAt: new Date().toISOString() },
    { id: "file_2", name: "Solar_Array_Schematic.cad", folderId: "f2", size: "18.5 MB", createdAt: new Date().toISOString() },
  ];
}

export function saveCachedFiles(userId: string, files: WorkspaceFile[]): void {
  try {
    localStorage.setItem(`${FILES_KEY}_${userId}`, JSON.stringify(files));
  } catch {}
}

export async function fetchFiles(userId: string): Promise<WorkspaceFile[]> {
  try {
    const filesRef = collection(db, "users", userId, "files");
    const snap = await getDocs(query(filesRef));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as WorkspaceFile);
      saveCachedFiles(userId, items);
      return items;
    }
  } catch (err) {
    console.warn("Failed to fetch files from Firestore, using cache:", err);
  }
  return getCachedFiles(userId);
}

export async function createFile(userId: string, name: string, folderId?: string, size: string = "1.2 MB"): Promise<WorkspaceFile> {
  const id = `file_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newFile: WorkspaceFile = {
    id,
    name: name.trim(),
    folderId: folderId && folderId !== "" ? folderId : undefined,
    size: size.trim() || "1.0 MB",
    createdAt: new Date().toISOString(),
  };

  const current = getCachedFiles(userId);
  saveCachedFiles(userId, [newFile, ...current]);

  try {
    const ref = doc(db, "users", userId, "files", id);
    await setDoc(ref, { ...newFile, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Could not save file to remote Firestore:", err);
  }

  return newFile;
}

// --- Notes Service ---
export function getCachedNotes(userId: string): WorkspaceNote[] {
  try {
    const raw = localStorage.getItem(`${NOTES_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: "note_1", title: "Quantum Computing in African AgriTech", content: "Exploring error correction algorithms for soil moisture sensor networks across semi-arid regions.", createdAt: new Date().toISOString() },
    { id: "note_2", title: "DAAD & Mastercard Scholarship Deadlines", content: "Prepare transcripts, recommendation letters, and research proposal by November 15th.", createdAt: new Date().toISOString() },
  ];
}

export function saveCachedNotes(userId: string, notes: WorkspaceNote[]): void {
  try {
    localStorage.setItem(`${NOTES_KEY}_${userId}`, JSON.stringify(notes));
  } catch {}
}

export async function fetchNotes(userId: string): Promise<WorkspaceNote[]> {
  try {
    const notesRef = collection(db, "users", userId, "notes");
    const snap = await getDocs(query(notesRef));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as WorkspaceNote);
      saveCachedNotes(userId, items);
      return items;
    }
  } catch (err) {
    console.warn("Failed to fetch notes from Firestore, using cache:", err);
  }
  return getCachedNotes(userId);
}

export async function createNote(userId: string, title: string, content?: string): Promise<WorkspaceNote> {
  const id = `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newNote: WorkspaceNote = {
    id,
    title: title.trim(),
    content: content ? content.trim() : "",
    createdAt: new Date().toISOString(),
  };

  const current = getCachedNotes(userId);
  saveCachedNotes(userId, [newNote, ...current]);

  try {
    const ref = doc(db, "users", userId, "notes", id);
    await setDoc(ref, { ...newNote, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Could not save note to remote Firestore:", err);
  }

  return newNote;
}

// --- Team Members Service ---
export function getCachedTeamMembers(userId: string): TeamMember[] {
  try {
    const raw = localStorage.getItem(`${MEMBERS_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: "mem_1", name: "Dr. Amina Bello", role: "Principal Investigator", createdAt: new Date().toISOString() },
    { id: "mem_2", name: "Kwame Mensah", role: "Lead Systems Engineer", createdAt: new Date().toISOString() },
  ];
}

export function saveCachedTeamMembers(userId: string, members: TeamMember[]): void {
  try {
    localStorage.setItem(`${MEMBERS_KEY}_${userId}`, JSON.stringify(members));
  } catch {}
}

export async function fetchTeamMembers(userId: string): Promise<TeamMember[]> {
  try {
    const membersRef = collection(db, "users", userId, "teamMembers");
    const snap = await getDocs(query(membersRef));
    if (!snap.empty) {
      const items = snap.docs.map((d) => d.data() as TeamMember);
      saveCachedTeamMembers(userId, items);
      return items;
    }
  } catch (err) {
    console.warn("Failed to fetch team members from Firestore, using cache:", err);
  }
  return getCachedTeamMembers(userId);
}

export async function createTeamMember(userId: string, name: string, role?: string): Promise<TeamMember> {
  const id = `member_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newMember: TeamMember = {
    id,
    name: name.trim(),
    role: role ? role.trim() : "Collaborator",
    createdAt: new Date().toISOString(),
  };

  const current = getCachedTeamMembers(userId);
  saveCachedTeamMembers(userId, [newMember, ...current]);

  try {
    const ref = doc(db, "users", userId, "teamMembers", id);
    await setDoc(ref, { ...newMember, serverTime: serverTimestamp() });
  } catch (err) {
    console.warn("Could not save team member to remote Firestore:", err);
  }

  return newMember;
}
