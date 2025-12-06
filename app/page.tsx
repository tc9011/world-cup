'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { matches } from '../data/worldCupData';
import { CalendarView } from '../components/CalendarView';
import { ScheduleMatrix } from '../components/ScheduleMatrix';
import { BracketView } from '../components/BracketView';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { FilterBar } from '../components/FilterBar';
import { TeamSelector } from '../components/TeamSelector';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Trophy } from 'lucide-react';
import { translations } from '../data/locales';

export default function Home() {
  const { viewMode, selectedGroup, selectedTeam, language } = useStore();
  const t = translations[language];

  // Filter matches based on Group OR Team
  const filteredMatches = matches.filter(m => {
    // 1. Filter by Group
    if (selectedGroup !== 'All') {
      if (m.group !== selectedGroup) return false;
    }
    // 2. Filter by Team
    if (selectedTeam !== 'All') {
      if (m.homeTeamId !== selectedTeam && m.awayTeamId !== selectedTeam) return false;
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <div className="max-w-[95%] mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <TeamSelector />
            <ViewSwitcher />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Filters - Show for both views now */}
        <div className="sticky top-0 z-40 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            <FilterBar />
        </div>

        {/* Content */}
        <div className="min-h-[500px]">
          {viewMode === 'list' && <ScheduleMatrix matches={filteredMatches} />}
          {viewMode === 'calendar' && <CalendarView matches={filteredMatches} />}
          {viewMode === 'bracket' && <BracketView matches={matches} />}
        </div>
        
        <footer className="text-center text-sm text-gray-400 py-8 border-t border-gray-200 dark:border-gray-800">
          <p>{t.footer}</p>
        </footer>
      </div>
    </main>
  );
}
