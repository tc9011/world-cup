import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ViewMode } from '../types';

interface WorldCupState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedGroup: string | 'All';
  setSelectedGroup: (group: string | 'All') => void;
  selectedTeam: string | 'All';
  setSelectedTeam: (teamId: string | 'All') => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  favorites: string[];
  toggleFavorite: (teamId: string) => void;
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  timezoneMode: 'local' | 'venue';
  setTimezoneMode: (mode: 'local' | 'venue') => void;
  themeTeamId: string | null;
  setThemeTeamId: (teamId: string | null) => void;
}

export const useStore = create<WorldCupState>()(
  persist(
    (set) => ({
      viewMode: 'list',
      setViewMode: (mode) => set({ viewMode: mode }),
      selectedGroup: 'All',
      setSelectedGroup: (group) => set({ selectedGroup: group, selectedTeam: 'All' }), // Reset team when group changes
      selectedTeam: 'All',
      setSelectedTeam: (teamId) => set({ selectedTeam: teamId, selectedGroup: 'All' }), // Reset group when team changes
      selectedDate: null,
      setSelectedDate: (date) => set({ selectedDate: date }),
      favorites: [],
      toggleFavorite: (teamId) => set((state) => {
        if (state.favorites.includes(teamId)) {
          return { favorites: state.favorites.filter(id => id !== teamId) };
        }
        return { favorites: [...state.favorites, teamId] };
      }),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      timezoneMode: 'local',
      setTimezoneMode: (mode) => set({ timezoneMode: mode }),
      themeTeamId: null,
      setThemeTeamId: (teamId) => set({ themeTeamId: teamId }),
    }),
    {
      name: 'world-cup-storage',
      partialize: (state) => ({ language: state.language, timezoneMode: state.timezoneMode, themeTeamId: state.themeTeamId }),
    }
  )
);
