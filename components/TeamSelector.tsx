import React from 'react';
import { useStore } from '../store/useStore';
import { teams } from '../data/worldCupData';
import { translations, teamNames } from '../data/locales';

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
      <span className="text-sm font-medium text-yellow-500/70 whitespace-nowrap">{t.filterByTeam}</span>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 text-sm rounded-xl focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 shadow-lg shadow-yellow-500/10 transition-all hover:bg-black/70"
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
