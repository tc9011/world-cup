'use client';

import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { teamColors } from '../data/teamColors';

export const ThemeProvider = () => {
  const { themeTeamId, themeMode } = useStore();

  // Handle Team Theme
  useEffect(() => {
    const root = document.documentElement;
    
    if (themeTeamId && teamColors[themeTeamId]) {
      const { primary, secondary } = teamColors[themeTeamId];
      root.style.setProperty('--primary', primary);
      root.style.setProperty('--accent', secondary);
    } else {
      // Reset to defaults
      root.style.removeProperty('--primary');
      root.style.removeProperty('--accent');
    }
  }, [themeTeamId]);

  // Handle Dark Mode
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(themeMode === 'dark');
    }
  }, [themeMode]);

  return null;
};
