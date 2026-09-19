/**
 * Local Firestore Adapter for Afriversty
 * 
 * Provides an offline-first, client-safe local storage persistence layer conforming to
 * the Firebase Firestore API surface. Prevents network [code=unavailable] and "Failed to fetch"
 * errors when connecting to Firebase projects configured for Authentication only.
 */

export class Timestamp {
  seconds: number;
  nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1000000);
  }

  toMillis(): number {
    return this.seconds * 1000 + Math.floor(this.nanoseconds / 1000000);
  }

  static now(): Timestamp {
    const ms = Date.now();
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }

  static fromDate(date: Date): Timestamp {
    const ms = date.getTime();
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }

  static fromMillis(ms: number): Timestamp {
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }
}

export const serverTimestamp = () => new Date().toISOString();

export interface LocalDocumentRef {
  __type: "doc";
  path: string;
  id: string;
  parentPath: string;
}

export interface LocalCollectionRef {
  __type: "collection";
  path: string;
  id: string;
}

export type QueryConstraintType = "where" | "orderBy" | "limit";

export interface QueryConstraint {
  type: QueryConstraintType;
  apply: (docs: any[]) => any[];
}

export interface LocalQuery {
  __type: "query";
  collectionPath: string;
  constraints: QueryConstraint[];
}

export interface DocumentSnapshot<T = any> {
  id: string;
  ref: LocalDocumentRef;
  exists: () => boolean;
  data: () => T | undefined;
}

export interface QuerySnapshot<T = any> {
  empty: boolean;
  size: number;
  docs: DocumentSnapshot<T>[];
  forEach: (callback: (result: DocumentSnapshot<T>) => void) => void;
}

// In-memory cache synced with localStorage
const STORAGE_PREFIX = "afriversty_db_";
const docStore: Map<string, any> = new Map();

// Initialize store from localStorage
function initStore() {
  if (typeof window === "undefined") return;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const path = key.slice(STORAGE_PREFIX.length);
        const raw = localStorage.getItem(key);
        if (raw) {
          docStore.set(path, JSON.parse(raw));
        }
      }
    }
  } catch (err) {
    console.warn("Local storage initialization notice:", err);
  }
}

initStore();

function saveToDisk(path: string, data: any | null) {
  if (typeof window === "undefined") return;
  try {
    const key = STORAGE_PREFIX + path;
    if (data === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {
    // Quota reached or private mode
  }
}

// Listeners tracking for real-time reactivity
type ListenerCallback = () => void;
const listeners: Set<ListenerCallback> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn("Error in local firestore listener:", e);
    }
  });
}

function normalizePath(parts: any[]): string {
  const segments: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (typeof part === "string") {
      segments.push(...part.split("/").filter(Boolean));
    } else if (typeof part === "object") {
      if (part.path) {
        segments.push(...part.path.split("/").filter(Boolean));
      }
    }
  }
  return segments.join("/");
}

/**
 * Local Firestore DB instance handle
 */
export const localDb = {
  __type: "local_firestore_db",
  name: "afriversity_local_db",
};

/**
 * Create a DocumentReference
 */
export function doc(...args: any[]): LocalDocumentRef {
  // Can be doc(db, path, ...segments) or doc(collectionRef, docId)
  let path = "";
  if (args.length === 1 && args[0]?.__type === "collection") {
    // auto-generate id
    const colPath = args[0].path;
    const autoId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    path = `${colPath}/${autoId}`;
  } else {
    // Filter out db instance if passed first
    const pathArgs = args.filter((a) => a && a.__type !== "local_firestore_db" && typeof a !== "function");
    path = normalizePath(pathArgs);
  }

  const segments = path.split("/");
  const id = segments[segments.length - 1];
  const parentPath = segments.slice(0, -1).join("/");

  return {
    __type: "doc",
    path,
    id,
    parentPath,
  };
}

/**
 * Create a CollectionReference
 */
export function collection(...args: any[]): LocalCollectionRef {
  const pathArgs = args.filter((a) => a && a.__type !== "local_firestore_db");
  const path = normalizePath(pathArgs);
  const segments = path.split("/");
  const id = segments[segments.length - 1] || "";

  return {
    __type: "collection",
    path,
    id,
  };
}

/**
 * Set a document
 */
export async function setDoc(
  docRef: LocalDocumentRef,
  data: any,
  options?: { merge?: boolean }
): Promise<void> {
  const existing = docStore.get(docRef.path);
  let finalData = data;
  if (options?.merge && existing && typeof existing === "object") {
    finalData = { ...existing, ...data };
  }
  docStore.set(docRef.path, finalData);
  saveToDisk(docRef.path, finalData);
  notifyListeners();
}

/**
 * Update a document
 */
export async function updateDoc(docRef: LocalDocumentRef, data: any): Promise<void> {
  const existing = docStore.get(docRef.path) || {};
  const finalData = { ...existing, ...data };
  docStore.set(docRef.path, finalData);
  saveToDisk(docRef.path, finalData);
  notifyListeners();
}

/**
 * Delete a document
 */
export async function deleteDoc(docRef: LocalDocumentRef): Promise<void> {
  docStore.delete(docRef.path);
  saveToDisk(docRef.path, null);
  notifyListeners();
}

/**
 * Get a document snapshot
 */
export async function getDoc(docRef: LocalDocumentRef): Promise<DocumentSnapshot> {
  const data = docStore.get(docRef.path);
  return {
    id: docRef.id,
    ref: docRef,
    exists: () => data !== undefined,
    data: () => (data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined),
  };
}

function getCollectionDocs(collectionPath: string): { id: string; data: any; path: string }[] {
  const results: { id: string; data: any; path: string }[] = [];
  const prefix = collectionPath.endsWith("/") ? collectionPath : collectionPath + "/";

  docStore.forEach((data, path) => {
    if (path.startsWith(prefix)) {
      const rest = path.slice(prefix.length);
      // Only immediate children, not deeper subcollections
      if (!rest.includes("/")) {
        results.push({
          id: rest,
          data: JSON.parse(JSON.stringify(data)),
          path,
        });
      }
    }
  });

  return results;
}

/**
 * Query builder
 */
export function query(colOrQuery: LocalCollectionRef | LocalQuery, ...constraints: QueryConstraint[]): LocalQuery {
  const collectionPath = colOrQuery.__type === "collection" ? colOrQuery.path : colOrQuery.collectionPath;
  const existingConstraints = colOrQuery.__type === "query" ? colOrQuery.constraints : [];
  return {
    __type: "query",
    collectionPath,
    constraints: [...existingConstraints, ...constraints],
  };
}

/**
 * Where filter constraint
 */
export function where(field: string, op: string, val: any): QueryConstraint {
  return {
    type: "where",
    apply: (docs: any[]) => {
      return docs.filter((d) => {
        const itemVal = d.data?.[field];
        switch (op) {
          case "==":
            return itemVal === val;
          case "!=":
            return itemVal !== val;
          case ">":
            return itemVal > val;
          case ">=":
            return itemVal >= val;
          case "<":
            return itemVal < val;
          case "<=":
            return itemVal <= val;
          case "array-contains":
            return Array.isArray(itemVal) && itemVal.includes(val);
          case "in":
            return Array.isArray(val) && val.includes(itemVal);
          default:
            return true;
        }
      });
    },
  };
}

/**
 * OrderBy sort constraint
 */
export function orderBy(field: string, direction: "asc" | "desc" = "asc"): QueryConstraint {
  return {
    type: "orderBy",
    apply: (docs: any[]) => {
      return [...docs].sort((a, b) => {
        const valA = a.data?.[field];
        const valB = b.data?.[field];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return direction === "asc" ? -1 : 1;
      });
    },
  };
}

/**
 * Limit constraint
 */
export function limit(count: number): QueryConstraint {
  return {
    type: "limit",
    apply: (docs: any[]) => docs.slice(0, count),
  };
}

function executeQuery(q: LocalQuery | LocalCollectionRef): { id: string; data: any; path: string }[] {
  const collectionPath = q.__type === "collection" ? q.path : q.collectionPath;
  let docs = getCollectionDocs(collectionPath);
  if (q.__type === "query" && q.constraints) {
    for (const c of q.constraints) {
      docs = c.apply(docs);
    }
  }
  return docs;
}

/**
 * Get multiple documents from collection or query
 */
export async function getDocs(target: LocalCollectionRef | LocalQuery): Promise<QuerySnapshot> {
  const rawDocs = executeQuery(target);
  const docs: DocumentSnapshot[] = rawDocs.map((item) => ({
    id: item.id,
    ref: doc(collection(item.path.slice(0, item.path.lastIndexOf("/"))), item.id),
    exists: () => true,
    data: () => item.data,
  }));

  return {
    empty: docs.length === 0,
    size: docs.length,
    docs,
    forEach: (cb) => docs.forEach(cb),
  };
}

/**
 * Real-time listener for document or collection/query
 */
export function onSnapshot(
  target: LocalDocumentRef | LocalCollectionRef | LocalQuery,
  onNext: (snap: any) => void,
  onError?: (err: any) => void
): () => void {
  const emit = () => {
    try {
      if (target.__type === "doc") {
        const data = docStore.get(target.path);
        const snap: DocumentSnapshot = {
          id: target.id,
          ref: target,
          exists: () => data !== undefined,
          data: () => (data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined),
        };
        onNext(snap);
      } else {
        const rawDocs = executeQuery(target);
        const docs: DocumentSnapshot[] = rawDocs.map((item) => ({
          id: item.id,
          ref: doc(collection(item.path.slice(0, item.path.lastIndexOf("/"))), item.id),
          exists: () => true,
          data: () => item.data,
        }));
        const querySnap: QuerySnapshot = {
          empty: docs.length === 0,
          size: docs.length,
          docs,
          forEach: (cb) => docs.forEach(cb),
        };
        onNext(querySnap);
      }
    } catch (err) {
      if (onError) onError(err);
    }
  };

  // Immediate invocation on subscription
  setTimeout(emit, 0);

  // Register listener
  listeners.add(emit);

  return () => {
    listeners.delete(emit);
  };
}
