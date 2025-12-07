'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useStore } from '../store/useStore';
import { teams } from '../data/worldCupData';
import { teamColors } from '../data/teamColors';

export const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeTeamId, setThemeTeamId, themeMode, setThemeMode, language } = useStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (teamId: string | null) => {
    setThemeTeamId(teamId);
    setIsOpen(false);
  };

  // Filter teams that have colors defined
  const availableTeams = teams.filter(team => teamColors[team.id]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
        title={language === 'zh' ? '切换主题' : 'Change Theme'}
      >
        <Palette className="w-5 h-5 md:w-5 md:h-5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Appearance Mode */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
              {language === 'zh' ? '外观模式' : 'Appearance'}
            </h3>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setThemeMode('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  themeMode === 'light'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                {language === 'zh' ? '浅色' : 'Light'}
              </button>
              <button
                onClick={() => setThemeMode('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  themeMode === 'dark'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                {language === 'zh' ? '深色' : 'Dark'}
              </button>
              <button
                onClick={() => setThemeMode('system')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  themeMode === 'system'
                    ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                {language === 'zh' ? '跟随系统' : 'System'}
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {language === 'zh' ? '选择球队主题' : 'Select Team Theme'}
            </h3>
            <button 
              onClick={() => handleSelect(null)}
              className="text-xs text-gray-500 hover:text-primary dark:hover:text-primary"
            >
              {language === 'zh' ? '恢复默认' : 'Reset Default'}
            </button>
          </div>
          
          <div className="p-2 max-h-[400px] overflow-y-auto grid grid-cols-4 gap-2 custom-scrollbar">
            {availableTeams.map(team => (
              <button
                key={team.id}
                onClick={() => handleSelect(team.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  themeTeamId === team.id 
                    ? 'bg-linear-to-r from-primary to-accent text-white shadow-md shadow-primary/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                title={team.name}
              >
                <span className="text-2xl mb-1">{team.flag}</span>
                <span className={`text-[10px] font-bold ${themeTeamId === team.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>{team.code}</span>
                <div className="flex gap-1 mt-1">
                  <div 
                    className="w-2 h-2 rounded-full border border-gray-200 dark:border-gray-700" 
                    style={{ backgroundColor: teamColors[team.id].primary }} 
                  />
                  <div 
                    className="w-2 h-2 rounded-full border border-gray-200 dark:border-gray-700" 
                    style={{ backgroundColor: teamColors[team.id].secondary }} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
