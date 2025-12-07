'use client';

import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { teamColors } from '../data/teamColors';

export const ThemeProvider = () => {
  const { themeTeamId } = useStore();

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

  return null;
};
