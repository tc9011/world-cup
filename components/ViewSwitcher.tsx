import React from 'react';
import { useStore } from '../store/useStore';
import { LayoutList, Calendar as CalendarIcon, GitMerge, Table2 } from 'lucide-react';
import clsx from 'clsx';
import { translations } from '../data/locales';

export const ViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode, language } = useStore();
  const t = translations[language];

  return (
    <div className="flex bg-black/50 backdrop-blur-sm p-1 rounded-xl border border-yellow-500/30 overflow-x-auto">
      <button
        onClick={() => setViewMode('list')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
          viewMode === 'list'
            ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
            : "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10"
        )}
      >
        <LayoutList size={16} className="mr-2" />
        {t.listView}
      </button>
      <button
        onClick={() => setViewMode('calendar')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
          viewMode === 'calendar'
            ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
            : "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10"
        )}
      >
        <CalendarIcon size={16} className="mr-2" />
        {t.calendarView}
      </button>
      <button
        onClick={() => setViewMode('bracket')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
          viewMode === 'bracket'
            ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
            : "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10"
        )}
      >
        <GitMerge size={16} className="mr-2" />
        {t.bracketView}
      </button>
      <button
        onClick={() => setViewMode('standings')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
          viewMode === 'standings'
            ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
            : "text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10"
        )}
      >
        <Table2 size={16} className="mr-2" />
        {t.standingsView}
      </button>
    </div>
  );
};
