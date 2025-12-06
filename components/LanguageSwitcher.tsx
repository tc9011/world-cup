import React from 'react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useStore();

  return (
    <div className="flex items-center bg-black/50 rounded-lg p-1 border border-yellow-500/30">
      <Globe size={16} className="ml-2 mr-1 text-yellow-500" />
      <button
        onClick={() => setLanguage('en')}
        className={clsx(
          "px-2 py-1 text-xs font-medium rounded-md transition-all",
          language === 'en'
            ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/50"
            : "text-yellow-500/70 hover:text-yellow-400"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={clsx(
          "px-2 py-1 text-xs font-medium rounded-md transition-all",
          language === 'zh'
            ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/50"
            : "text-yellow-500/70 hover:text-yellow-400"
        )}
      >
        中
      </button>
    </div>
  );
};
