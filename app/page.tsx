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
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-6 bg-black/70 backdrop-blur-xl p-6 rounded-3xl border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
          <div className="flex justify-between items-start md:items-center">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-2xl text-black shadow-lg shadow-yellow-500/50 transform hover:scale-105 transition-transform duration-300">
                <Trophy size={40} strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-yellow-400">
                  {t.title}
                </h1>
                <p className="text-yellow-500/80 font-medium mt-1">{t.subtitle}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-yellow-500/20">
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
          <div className="sticky top-4 z-40 bg-black/80 backdrop-blur-md py-3 px-4 rounded-2xl border border-yellow-500/30 shadow-lg shadow-yellow-500/10 overflow-x-auto">
              <FilterBar />
          </div>
        )}

        {/* Content */}
        <div className="min-h-[500px] bg-black/60 backdrop-blur-sm rounded-3xl p-1 md:p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
          {viewMode === 'list' && <ScheduleMatrix matches={filteredMatches} />}
          {viewMode === 'calendar' && <CalendarView matches={filteredMatches} />}
          {viewMode === 'bracket' && <BracketView matches={matches} />}
          {viewMode === 'standings' && <StandingsView matches={matches} />}
        </div>
        
        <footer className="text-center text-sm text-yellow-500/70 py-8">
          <p>{t.footer}</p>
        </footer>
      </div>
    </main>
  );
}
