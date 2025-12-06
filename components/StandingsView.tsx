import React from 'react';
import { Match, Team } from '../types';
import { teams } from '../data/worldCupData';
import { useStore } from '../store/useStore';
import { translations, teamNames } from '../data/locales';

interface StandingsViewProps {
  matches: Match[];
}

interface TeamStats {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

export const StandingsView: React.FC<StandingsViewProps> = ({ matches }) => {
  const { language, selectedGroup } = useStore();
  const t = translations[language];
  const allGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  const groups = selectedGroup === 'All' ? allGroups : [selectedGroup];

  const getGroupStandings = (group: string): TeamStats[] => {
    const groupTeams = teams.filter(t => t.group === group);
    const groupMatches = matches.filter(m => m.group === group && m.stage === 'Group Stage');

    const stats: Record<string, TeamStats> = {};

    // Initialize stats
    groupTeams.forEach(team => {
      stats[team.id] = {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        points: 0
      };
    });

    // Calculate stats from matches
    groupMatches.forEach(match => {
      if (match.status === 'finished' && match.score) {
        const home = stats[match.homeTeamId];
        const away = stats[match.awayTeamId];

        if (home && away) {
          home.played++;
          away.played++;
          home.gf += match.score.home;
          home.ga += match.score.away;
          away.gf += match.score.away;
          away.ga += match.score.home;

          if (match.score.home > match.score.away) {
            home.won++;
            home.points += 3;
            away.lost++;
          } else if (match.score.home < match.score.away) {
            away.won++;
            away.points += 3;
            home.lost++;
          } else {
            home.drawn++;
            away.drawn++;
            home.points += 1;
            away.points += 1;
          }
        }
      }
    });

    return Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
      {groups.map(group => (
        <div key={group} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 dark:text-white">{t.group} {group}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-3 py-2 w-10 text-center">{t.standings.rank}</th>
                  <th className="px-3 py-2">{t.standings.team}</th>
                  <th className="px-2 py-2 text-center w-8">{t.standings.played}</th>
                  <th className="px-2 py-2 text-center w-8">{t.standings.won}</th>
                  <th className="px-2 py-2 text-center w-8">{t.standings.drawn}</th>
                  <th className="px-2 py-2 text-center w-8">{t.standings.lost}</th>
                  <th className="px-2 py-2 text-center w-8 hidden sm:table-cell">{t.standings.gf}</th>
                  <th className="px-2 py-2 text-center w-8 hidden sm:table-cell">{t.standings.ga}</th>
                  <th className="px-2 py-2 text-center w-10">{t.standings.gd}</th>
                  <th className="px-3 py-2 text-center w-10 font-bold">{t.standings.points}</th>
                </tr>
              </thead>
              <tbody>
                {getGroupStandings(group).map((stat, index) => {
                  const teamName = language === 'zh' ? (teamNames[stat.team.code] || stat.team.name) : stat.team.name;
                  return (
                    <tr key={stat.team.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-2 text-center text-gray-500">{index + 1}</td>
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="text-lg">{stat.team.flag}</span>
                        <span className="truncate max-w-[100px]">{teamName}</span>
                      </td>
                      <td className="px-2 py-2 text-center">{stat.played}</td>
                      <td className="px-2 py-2 text-center text-gray-500">{stat.won}</td>
                      <td className="px-2 py-2 text-center text-gray-500">{stat.drawn}</td>
                      <td className="px-2 py-2 text-center text-gray-500">{stat.lost}</td>
                      <td className="px-2 py-2 text-center text-gray-500 hidden sm:table-cell">{stat.gf}</td>
                      <td className="px-2 py-2 text-center text-gray-500 hidden sm:table-cell">{stat.ga}</td>
                      <td className="px-2 py-2 text-center font-medium">{stat.gf - stat.ga}</td>
                      <td className="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">{stat.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
