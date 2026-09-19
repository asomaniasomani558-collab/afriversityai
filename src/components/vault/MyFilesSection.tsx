import React, { useState, useEffect } from "react";
import { Folder, FileText, Plus, Loader2, HardDrive, Trash2 } from "lucide-react";
import { WorkspaceFolder, WorkspaceFile } from "../../types";
import { fetchFolders, fetchFiles, createFolder, createFile } from "../../services/vaultWorkspaceService";
import { NewFolderModal, AddFileModal } from "./WorkspaceModals";
import { useAuth } from "../../context/AuthContext";

export const MyFilesSection: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest_scholar";

  const [folders, setFolders] = useState<WorkspaceFolder[]>([]);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [loading, setLoading] = useState(true);

  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [fList, fileList] = await Promise.all([
          fetchFolders(userId),
          fetchFiles(userId),
        ]);
        if (mounted) {
          setFolders(fList);
          setFiles(fileList);
        }
      } catch (err) {
        console.warn("Error loading files & folders:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, [userId]);

  const handleCreateFolder = async (name: string) => {
    const newFolder = await createFolder(userId, name);
    setFolders((prev) => [newFolder, ...prev]);
  };

  const handleCreateFile = async (name: string, folderId?: string, size?: string) => {
    const newFile = await createFile(userId, name, folderId, size);
    setFiles((prev) => [newFile, ...prev]);
  };

  return (
    <div className="safari-glass rounded-2xl p-6 shadow-xl border border-[#d4af37]/25 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-title text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
            <HardDrive className="text-[#f2ca50]" size={22} />
            <span>My Files & Vault</span>
          </h3>
          <p className="text-xs text-[#d0c5af] mt-0.5">
            Manage your folders, research documents, and project blueprints securely in Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewFolderOpen(true)}
            className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#f2ca50] border border-[#d4af37]/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => setIsAddFileOpen(true)}
            className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add File</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-[#f2ca50]">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Folders Grid */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#99907c] mb-3">
              Folders ({folders.length})
            </h4>
            {folders.length === 0 ? (
              <p className="text-xs text-[#99907c] italic">No folders created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {folders.map((f) => (
                  <div
                    key={f.id}
                    className="safari-glass rounded-xl p-3.5 border border-[#d4af37]/20 flex items-center justify-between hover:border-[#f2ca50]/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f2ca50]/15 flex items-center justify-center text-[#f2ca50]">
                        <Folder size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors">
                          {f.name}
                        </p>
                        <p className="text-[10px] text-[#99907c]">
                          {files.filter((file) => file.folderId === f.id).length} files
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Files List */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#99907c] mb-3">
              Files ({files.length})
            </h4>
            {files.length === 0 ? (
              <div className="text-center py-10 safari-glass rounded-xl border border-dashed border-[#d4af37]/20">
                <FileText size={32} className="mx-auto text-[#99907c] mb-2" />
                <p className="text-xs text-[#ded8cb] font-semibold">Your vault is empty</p>
                <p className="text-[11px] text-[#99907c] mt-0.5">Click "Add File" to register metadata.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => {
                  const parentFolder = folders.find((fol) => fol.id === file.folderId);
                  return (
                    <div
                      key={file.id}
                      className="safari-glass rounded-xl px-4 py-3 border border-[#d4af37]/15 flex items-center justify-between hover:border-[#f2ca50]/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#28231c] border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50]">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#e5e2e1]">{file.name}</p>
                          <p className="text-[10px] text-[#99907c] flex items-center gap-2 mt-0.5">
                            <span>Size: {file.size}</span>
                            {parentFolder && (
                              <>
                                <span>&bull;</span>
                                <span className="text-[#f2ca50]">Folder: {parentFolder.name}</span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-[#99907c] bg-[#24201a] px-2.5 py-1 rounded-lg border border-[#d4af37]/20">
                        Secured
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewFolderModal
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        onSubmit={handleCreateFolder}
      />
      <AddFileModal
        isOpen={isAddFileOpen}
        onClose={() => setIsAddFileOpen(false)}
        folders={folders}
        onSubmit={handleCreateFile}
      />
    </div>
  );
};
