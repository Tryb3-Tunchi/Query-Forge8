import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QueryHistoryEntry, QueryPreset, QueryState } from '@/types/query';
import { generateId } from '@/lib/utils';

interface HistoryStore {
  history: QueryHistoryEntry[];
  presets: QueryPreset[];
  addToHistory: (state: QueryState, resultCount: number) => void;
  clearHistory: () => void;
  savePreset: (name: string, description: string, tags: string[], state: QueryState) => void;
  deletePreset: (id: string) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      presets: [],

      addToHistory: (state, resultCount) => set(prev => ({
        history: [
          {
            id: generateId(),
            timestamp: Date.now(),
            state,
            resultCount,
          },
          ...prev.history.slice(0, 19),
        ],
      })),

      clearHistory: () => set({ history: [] }),

      savePreset: (name, description, tags, state) => set(prev => ({
        presets: [
          ...prev.presets,
          { id: generateId(), name, description, tags, state },
        ],
      })),

      deletePreset: (id) => set(prev => ({
        presets: prev.presets.filter(p => p.id !== id),
      })),
    }),
    { name: 'query-forge-storage' }
  )
);