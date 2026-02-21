/**
 * Type definitions for useFileManager hook
 */

export interface FileData {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FileManagerState {
  files: FileData[];
  currentFileId: string | null;
  currentFile: FileData | null;
  loading: boolean;
  error: string | null;
  hasUnsavedFiles: boolean;
}

export interface FileManagerActions {
  createFile: (name: string, language?: string, content?: string) => Promise<FileData>;
  updateFile: (fileId: string, content: string, persist?: boolean) => Promise<void>;
  saveFile: (fileId: string, content: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  switchFile: (fileId: string) => void;
  loadFiles: () => Promise<void>;
  saveAll: () => Promise<void>;
  getCurrentFile: () => FileData | null;
  hasUnsavedChanges: (fileId: string) => boolean;
}

export type UseFileManager = FileManagerState & FileManagerActions;

export function useFileManager(): UseFileManager;
