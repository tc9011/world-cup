import React from 'react';
import { useStore } from '../store/useStore';
import { teams } from '../data/worldCupData';
import { translations, teamNames } from '../data/locales';
import clsx from 'clsx';

export const TeamSelector: React.FC = () => {
  const { selectedTeam, setSelectedTeam, language } = useStore();
  const t = translations[language];

  // Sort teams alphabetically
  const sortedTeams = [...teams].sort((a, b) => {
    const nameA = language === 'zh' ? (teamNames[a.code] || a.name) : a.name;
    const nameB = language === 'zh' ? (teamNames[b.code] || b.name) : b.name;
    return nameA.localeCompare(nameB, language === 'zh' ? 'zh-CN' : 'en');
  });

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.filterByTeam}</span>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="All">{t.allTeams}</option>
        {sortedTeams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.flag} {language === 'zh' ? (teamNames[team.code] || team.name) : team.name}
          </option>
        ))}
      </select>
    </div>
  );
};
