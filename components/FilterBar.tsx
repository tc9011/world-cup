import React from 'react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { translations } from '../data/locales';

export const FilterBar: React.FC = () => {
  const { selectedGroup, setSelectedGroup, language } = useStore();
  const t = translations[language];
  const groups = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="flex overflow-x-auto pb-2 no-scrollbar space-x-2">
      {groups.map(group => (
        <button
          key={group}
          onClick={() => setSelectedGroup(group)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedGroup === group
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          {group === 'All' ? t.allMatches : `${t.group} ${group}`}
        </button>
      ))}
    </div>
  );
};
