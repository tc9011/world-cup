'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { matches, venues } from '../data/worldCupData';
import { CalendarView } from '../components/CalendarView';
import { ScheduleMatrix } from '../components/ScheduleMatrix';
import { BracketView } from '../components/BracketView';
import { StandingsView } from '../components/StandingsView';
import { MapView } from '../components/MapView';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { FilterBar } from '../components/FilterBar';
import { DateFilter } from '../components/DateFilter';
import { TeamSelector } from '../components/TeamSelector';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TimezoneSwitcher } from '../components/TimezoneSwitcher';
import { ThemeSelector } from '../components/ThemeSelector';
import { ExportButton } from '../components/ExportButton';
import Image from 'next/image';
import { translations } from '../data/locales';
import { useRef, useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function Home() {
  const { viewMode, selectedGroup, selectedTeam, dateRange, language, timezoneMode } = useStore();
  const t = translations[language];
  const contentRef = useRef<HTMLDivElement>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Helper to get match date timestamp based on timezone mode
  const getMatchDateTimestamp = (match: typeof matches[0]) => {
    if (timezoneMode === 'venue') {
      const venue = venues.find(v => v.id === match.venueId);
      if (venue) {
        // Get date parts in venue timezone
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: venue.timezone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }).formatToParts(new Date(match.date));
        
        const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
        const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
        const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
        
        return new Date(year, month, day).getTime();
      }
    }
    // Local time fallback
    const date = new Date(match.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  };

  // Filter matches based on Group OR Team OR Date
  const filteredMatches = matches.filter(m => {
    // 1. Filter by Group
    if (selectedGroup !== 'All') {
      if (m.group !== selectedGroup) return false;
    }
    // 2. Filter by Team
    if (selectedTeam !== 'All') {
      if (m.homeTeamId !== selectedTeam && m.awayTeamId !== selectedTeam) return false;
    }
    // 3. Filter by Date Range
    if (dateRange.start) {
      const matchTimestamp = getMatchDateTimestamp(m);
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = startDate.getTime();
      
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(0, 0, 0, 0);
        const endTimestamp = endDate.getTime();
        
        if (matchTimestamp < startTimestamp || matchTimestamp > endTimestamp) {
          return false;
        }
      } else {
        // Only start date selected - exact match
        if (matchTimestamp !== startTimestamp) {
          return false;
        }
      }
    }
    return true;
  });

  // Get available dates from matches for date filter
  const availableDates = Array.from(new Set(
    matches.map(m => getMatchDateTimestamp(m))
  )).sort((a, b) => a - b).map(time => new Date(time));

  return (
    <main className="min-h-screen p-2 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <header className="relative z-50 space-y-4 md:space-y-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/20 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex items-center space-x-3 md:space-x-4 w-full md:w-auto">
              <div className="p-2 md:p-4 bg-linear-to-br from-primary to-cyan-500 dark:to-accent rounded-2xl text-white shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-300">
                <Image src="/2026_FIFA_World_Cup_emblem.svg" alt="Trophy" width={32} height={32} className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-primary">
                  {t.title}
                </h1>
                <p className="text-xs md:text-base text-gray-500 dark:text-primary/80 font-medium mt-0.5 md:mt-1">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <ExportButton targetRef={contentRef} />
              <ThemeSelector />
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <TimezoneSwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="w-full md:w-auto overflow-x-auto">
              <ViewSwitcher />
            </div>
          </div>
        </header>

        {/* Filters - Show for list, calendar and map views */}
        {viewMode !== 'bracket' && viewMode !== 'standings' && (
          <div className="sticky top-4 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800 shadow-sm transition-all duration-300">
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                <span>{language === 'zh' ? '筛选比赛' : 'Filter Matches'}</span>
                {(selectedGroup !== 'All' || selectedTeam !== 'All' || dateRange.start) && (
                  <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                )}
              </div>
              {isFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isFiltersOpen && (
              <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="overflow-x-auto pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                  <FilterBar />
                </div>
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-3 flex flex-col md:flex-row gap-4 md:items-center">
                  <DateFilter availableDates={availableDates} />
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />
                  <TeamSelector />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div ref={contentRef} className="min-h-[500px] bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-3xl p-1 md:p-6 border border-white/20 dark:border-gray-800">
          {viewMode === 'list' && <ScheduleMatrix matches={filteredMatches} />}
          {viewMode === 'calendar' && <CalendarView matches={filteredMatches} />}
          {viewMode === 'bracket' && <BracketView matches={matches} />}
          {viewMode === 'standings' && <StandingsView matches={matches} />}
          {viewMode === 'map' && <MapView matches={filteredMatches} />}
        </div>

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
          <p>{t.footer}</p>
        </footer>
      </div>
    </main>
  );
}
