'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { matches } from '../data/worldCupData';
import { GroupView } from '../components/GroupView';
import { CalendarView } from '../components/CalendarView';
import { ScheduleMatrix } from '../components/ScheduleMatrix';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { FilterBar } from '../components/FilterBar';
import { Trophy } from 'lucide-react';

export default function Home() {
  const { viewMode, selectedGroup } = useStore();

  // Filter matches for Matrix view if needed, or pass all
  const filteredMatches = selectedGroup === 'All' 
    ? matches 
    : matches.filter(m => m.group === selectedGroup || (selectedGroup === 'All' && !m.group));

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
              <h1 className="text-3xl font-bold tracking-tight">World Cup 2026</h1>
              <p className="text-gray-500 dark:text-gray-400">Official Match Schedule & Guide</p>
            </div>
          </div>
          <ViewSwitcher />
        </header>

        {/* Filters - Only show for Matrix if you want filtering there too, but usually Matrix shows all */}
        {viewMode === 'list' && (
          <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
             {/* Optional: Keep filter bar if user wants to highlight specific groups in matrix */}
             <FilterBar />
          </div>
        )}

        {/* Content */}
        <div className="min-h-[500px]">
          {viewMode === 'list' ? (
            <ScheduleMatrix matches={filteredMatches} />
          ) : (
            <CalendarView matches={matches} />
          )}
        </div>
        
        <footer className="text-center text-sm text-gray-400 py-8 border-t border-gray-200 dark:border-gray-800">
          <p>© 2026 World Cup Viewing Guide. Unofficial Demo.</p>
        </footer>
      </div>
    </main>
  );
}
