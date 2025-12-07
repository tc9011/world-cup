'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { matches } from '../data/worldCupData';
import { CalendarView } from '../components/CalendarView';
import { ScheduleMatrix } from '../components/ScheduleMatrix';
import { BracketView } from '../components/BracketView';
import { StandingsView } from '../components/StandingsView';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { FilterBar } from '../components/FilterBar';
import { TeamSelector } from '../components/TeamSelector';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TimezoneSwitcher } from '../components/TimezoneSwitcher';
import { ThemeSelector } from '../components/ThemeSelector';
import Image from 'next/image';
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
    <main className="min-h-screen p-2 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <header className="relative z-50 space-y-4 md:space-y-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/20 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-start md:items-center">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="p-2 md:p-4 bg-linear-to-br from-primary to-cyan-500 rounded-2xl text-white shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-300">
                <Image src="/2026_FIFA_World_Cup_emblem.svg" alt="Trophy" width={32} height={32} className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                  {t.title}
                </h1>
                <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 font-medium mt-0.5 md:mt-1">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
              <ThemeSelector />
              <TimezoneSwitcher />
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="w-full md:w-auto overflow-x-auto">
              <ViewSwitcher />
            </div>
            <div className="w-full md:w-auto">
              <TeamSelector />
            </div>
          </div>
        </header>

        {/* Filters - Show for list and calendar views */}
        {viewMode !== 'bracket' && (
          <div className="sticky top-4 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 px-4 rounded-2xl border border-gray-200/50 dark:border-gray-800 shadow-sm overflow-x-auto">
              <FilterBar />
          </div>
        )}

        {/* Content */}
        <div className="min-h-[500px] bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-3xl p-1 md:p-6 border border-white/20 dark:border-gray-800">
          {viewMode === 'list' && <ScheduleMatrix matches={filteredMatches} />}
          {viewMode === 'calendar' && <CalendarView matches={filteredMatches} />}
          {viewMode === 'bracket' && <BracketView matches={matches} />}
          {viewMode === 'standings' && <StandingsView matches={matches} />}
        </div>

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          <p>{t.footer}</p>
        </footer>
      </div>
    </main>
  );
}
