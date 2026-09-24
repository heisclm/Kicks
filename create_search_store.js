const fs = require('fs');

let content = `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from './secureStorage';

interface SearchHistoryState {
  recentSearches: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      recentSearches: [],
      addSearch: (query) => set((state) => {
        const cleanedQuery = query.trim();
        if (!cleanedQuery) return state;
        const newHistory = [cleanedQuery, ...state.recentSearches.filter(q => q.toLowerCase() !== cleanedQuery.toLowerCase())].slice(0, 10);
        return { recentSearches: newHistory };
      }),
      clearHistory: () => set({ recentSearches: [] }),
    }),
    {
      name: 'search-history',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
`;

fs.writeFileSync('mobile/src/store/useSearchHistoryStore.ts', content, 'utf8');
