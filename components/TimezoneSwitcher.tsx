import React from 'react';
import { useStore } from '../store/useStore';
import { translations } from '../data/locales';
import { Clock, Globe } from 'lucide-react';

export const TimezoneSwitcher: React.FC = () => {
  const { language, timezoneMode, setTimezoneMode } = useStore();
  const t = translations[language];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTimezoneMode('local')}
        className={`flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
          timezoneMode === 'local'
            ? 'bg-linear-to-r from-primary to-accent text-primary-foreground shadow-md shadow-primary/20'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <Clock size={14} className="mr-1 md:mr-1.5" />
        {t.timezone.local}
      </button>
      <button
        onClick={() => setTimezoneMode('venue')}
        className={`flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
          timezoneMode === 'venue'
            ? 'bg-linear-to-r from-primary to-accent text-primary-foreground shadow-md shadow-primary/20'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        <Globe size={14} className="mr-1 md:mr-1.5" />
        {t.timezone.venue}
      </button>
    </div>
  );
};
