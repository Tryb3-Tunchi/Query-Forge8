import { create } from 'zustand';

interface UIStore {
  theme: 'dark' | 'light';
  activePanel: 'builder' | 'preview' | 'results';
  previewFormat: 'sql' | 'mongo' | 'json';
  isExecuting: boolean;
  showHistory: boolean;
  showPresets: boolean;
  toggleTheme: () => void;
  setActivePanel: (panel: 'builder' | 'preview' | 'results') => void;
  setPreviewFormat: (format: 'sql' | 'mongo' | 'json') => void;
  setExecuting: (val: boolean) => void;
  setShowHistory: (val: boolean) => void;
  setShowPresets: (val: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'dark',
  activePanel: 'builder',
  previewFormat: 'sql',
  isExecuting: false,
  showHistory: false,
  showPresets: false,

  toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setPreviewFormat: (format) => set({ previewFormat: format }),
  setExecuting: (val) => set({ isExecuting: val }),
  setShowHistory: (val) => set({ showHistory: val }),
  setShowPresets: (val) => set({ showPresets: val }),
}));