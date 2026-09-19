import React, { useState, useEffect } from "react";
import { StickyNote, Plus, Loader2, Calendar } from "lucide-react";
import { WorkspaceNote } from "../../types";
import { fetchNotes, createNote } from "../../services/vaultWorkspaceService";
import { NewNoteModal } from "./WorkspaceModals";
import { useAuth } from "../../context/AuthContext";

export const MyNotesSection: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest_scholar";

  const [notes, setNotes] = useState<WorkspaceNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const list = await fetchNotes(userId);
        if (mounted) setNotes(list);
      } catch (err) {
        console.warn("Error loading notes:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [userId]);

  const handleCreateNote = async (title: string, content?: string) => {
    const newNote = await createNote(userId, title, content);
    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <div className="safari-glass rounded-2xl p-6 shadow-xl border border-[#d4af37]/25 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
            <StickyNote className="text-[#f2ca50]" size={22} />
            <span>My Notes & Research Ideas</span>
          </h3>
          <p className="text-xs text-[#d0c5af] mt-0.5">
            Capture and organize your scholarly notes, thesis outlines, and seminar thoughts.
          </p>
        </div>

        <button
          onClick={() => setIsNewNoteOpen(true)}
          className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#f2ca50]">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 safari-glass rounded-xl border border-dashed border-[#d4af37]/20">
          <StickyNote size={36} className="mx-auto text-[#99907c] mb-2" />
          <p className="text-xs text-[#ded8cb] font-semibold">No notes recorded yet</p>
          <p className="text-[11px] text-[#99907c] mt-0.5">Click "New Note" to record your first insight.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="safari-glass rounded-xl p-5 border border-[#d4af37]/20 hover:border-[#f2ca50]/50 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#99907c] mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <span className="bg-[#24201a] text-[#f2ca50] px-2 py-0.5 rounded border border-[#d4af37]/30">
                    Scholar Note
                  </span>
                </div>
                <h4 className="font-serif-title text-base font-bold text-[#e5e2e1] leading-snug">
                  {note.title}
                </h4>
                {note.content && (
                  <p className="text-xs text-[#d0c5af]/80 mt-2 line-clamp-3 leading-relaxed">
                    {note.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewNoteModal
        isOpen={isNewNoteOpen}
        onClose={() => setIsNewNoteOpen(false)}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};
