import { create } from 'zustand';
import { ViewMode } from '../types';

interface WorldCupState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedGroup: string | 'All';
  setSelectedGroup: (group: string | 'All') => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  favorites: string[];
  toggleFavorite: (teamId: string) => void;
}

export const useStore = create<WorldCupState>((set) => ({
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),
  selectedGroup: 'All',
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  favorites: [],
  toggleFavorite: (teamId) => set((state) => {
    if (state.favorites.includes(teamId)) {
      return { favorites: state.favorites.filter(id => id !== teamId) };
    }
    return { favorites: [...state.favorites, teamId] };
  }),
}));
