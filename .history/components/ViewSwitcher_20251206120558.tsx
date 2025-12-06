import React from 'react';
import { useStore } from '../store/useStore';
import { LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import clsx from 'clsx';

export const ViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode } = useStore();

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => setViewMode('list')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all",
          viewMode === 'list'
            ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        )}
      >
        <LayoutList size={16} className="mr-2" />
        List View
      </button>
      <button
        onClick={() => setViewMode('calendar')}
        className={clsx(
          "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all",
          viewMode === 'calendar'
            ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        )}
      >
        <CalendarIcon size={16} className="mr-2" />
        Calendar View
      </button>
    </div>
  );
};
