import React from 'react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useStore();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <Globe size={16} className="ml-2 mr-1 text-gray-500 hidden md:block" />
      <button
        onClick={() => setLanguage('en')}
        className={clsx(
          "px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all",
          language === 'en'
            ? "bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={clsx(
          "px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all",
          language === 'zh'
            ? "bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        )}
      >
        中文
      </button>
    </div>
  );
};
