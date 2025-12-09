import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { teams } from '../data/worldCupData';
import { translations, teamNames } from '../data/locales';
import { ChevronDown, Check } from 'lucide-react';

export const TeamSelector: React.FC = () => {
  const { selectedTeam, setSelectedTeam, language } = useStore();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTeamName = (team: typeof teams[0]) => {
    return language === 'zh' ? (teamNames[team.code] || team.name) : team.name;
  };

  // Sort teams alphabetically
  const sortedTeams = [...teams].sort((a, b) => {
    const nameA = getTeamName(a);
    const nameB = getTeamName(b);
    return nameA.localeCompare(nameB, language === 'zh' ? 'zh-CN' : 'en');
  });

  const currentTeam = teams.find(t => t.id === selectedTeam);

  const handleSelect = (value: string) => {
    setSelectedTeam(value);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:inline">{t.filterByTeam}</span>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-40 sm:w-48 md:w-60 px-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 rounded-xl shadow-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <span className="flex-1 flex items-center truncate text-left text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            {selectedTeam === 'All' ? (
              <span>{t.allTeams}</span>
            ) : (
              <>
                <span className="mr-2 text-lg">{currentTeam?.flag}</span>
                <span className="truncate">{currentTeam ? getTeamName(currentTeam) : selectedTeam}</span>
              </>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 md:left-auto md:right-0 z-50 w-64 mt-2 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top-left md:origin-top-right">
            <div className="max-h-64 overflow-y-auto p-1">
              <button
                onClick={() => handleSelect('All')}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedTeam === 'All'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex-1 text-left">{t.allTeams}</span>
                {selectedTeam === 'All' && <Check className="w-4 h-4 ml-2" />}
              </button>
              
              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
              
              {sortedTeams.map((team) => {
                const isSelected = selectedTeam === team.id;
                return (
                  <button
                    key={team.id}
                    onClick={() => handleSelect(team.id)}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2 text-lg">{team.flag}</span>
                    <span className="flex-1 text-left truncate">{getTeamName(team)}</span>
                    {isSelected && <Check className="w-4 h-4 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
