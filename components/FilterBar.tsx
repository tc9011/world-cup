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
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
            selectedGroup === group
              ? "bg-linear-to-r from-primary to-accent text-primary-foreground shadow-md shadow-primary/20"
              : "bg-white/50 dark:bg-transparent text-gray-600 dark:text-primary hover:bg-white dark:hover:bg-primary/10 border border-gray-200/50 dark:border-primary/30"
          )}
        >
          {group === 'All' ? t.allMatches : `${t.group} ${group}`}
        </button>
      ))}
    </div>
  );
};
