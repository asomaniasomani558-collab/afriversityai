import React, { useState } from "react";
import { X, FolderPlus, FilePlus, StickyNote, UserPlus, Loader2 } from "lucide-react";
import { WorkspaceFolder } from "../../types";

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Folder name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(name);
      setName("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md safari-glass rounded-2xl border border-[#d4af37]/35 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#99907c] hover:text-[#e5e2e1] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50]">
            <FolderPlus size={20} />
          </div>
          <div>
            <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1]">Create New Folder</h3>
            <p className="text-xs text-[#d0c5af]">Organize your research papers and project files.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Folder Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Quantum Algorithms & AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4af37]/15">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ded8cb] hover:bg-[#2a261f] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Create Folder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: WorkspaceFolder[];
  onSubmit: (name: string, folderId?: string, size?: string) => Promise<void>;
}

export const AddFileModal: React.FC<AddFileModalProps> = ({ isOpen, onClose, folders, onSubmit }) => {
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState("");
  const [size, setSize] = useState("2.4 MB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("File name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(name, folderId || undefined, size);
      setName("");
      setFolderId("");
      setSize("2.4 MB");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md safari-glass rounded-2xl border border-[#d4af37]/35 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#99907c] hover:text-[#e5e2e1] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50]">
            <FilePlus size={20} />
          </div>
          <div>
            <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1]">Add File Metadata</h3>
            <p className="text-xs text-[#d0c5af]">Register a new document or schematic in your vault.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">File Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Research_Analysis_Final.pdf"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Select Folder (Optional)</label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none transition-all"
            >
              <option value="">(Root Vault - No Folder)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Estimated Size</label>
            <input
              type="text"
              placeholder="e.g. 4.8 MB"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4af37]/15">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ded8cb] hover:bg-[#2a261f] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Add File</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content?: string) => Promise<void>;
}

export const NewNoteModal: React.FC<NewNoteModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Note title is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(title, content);
      setTitle("");
      setContent("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg safari-glass rounded-2xl border border-[#d4af37]/35 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#99907c] hover:text-[#e5e2e1] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50]">
            <StickyNote size={20} />
          </div>
          <div>
            <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1]">Create New Note</h3>
            <p className="text-xs text-[#d0c5af]">Capture academic insights, reminders, or lab notes.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Note Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Solar Microgrid Experiment Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Content (Optional)</label>
            <textarea
              rows={4}
              placeholder="Write your note thoughts, equations, or research points here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl p-4 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4af37]/15">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ded8cb] hover:bg-[#2a261f] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, role?: string) => Promise<void>;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Member name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(name, role);
      setName("");
      setRole("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add team member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md safari-glass rounded-2xl border border-[#d4af37]/35 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#99907c] hover:text-[#e5e2e1] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50]">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1]">Add Team Member</h3>
            <p className="text-xs text-[#d0c5af]">Collaborate with researchers or project co-founders.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Member Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Kwame Osei"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#ded8cb] mb-1.5">Role / Title (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Co-Researcher / Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#1e1a14] border border-[#d4af37]/30 focus:border-[#f2ca50] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4af37]/15">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#ded8cb] hover:bg-[#2a261f] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>Add Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
