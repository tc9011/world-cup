import React from 'react';
import { useStore } from '../store/useStore';
import { LayoutList, Calendar as CalendarIcon, GitMerge, Table2 } from 'lucide-react';
import clsx from 'clsx';
import { translations } from '../data/locales';

export const ViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode, language } = useStore();
  const t = translations[language];

  return (
    <div className="flex bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto">
      <button
        onClick={() => setViewMode('list')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
          viewMode === 'list'
            ? "bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
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
            ? "bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
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
            ? "bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
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
            ? "bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
        )}
      >
        <Table2 size={16} className="mr-2" />
        {t.standingsView}
      </button>
    </div>
  );
};
