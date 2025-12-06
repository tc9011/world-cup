import React from 'react';
import { Match } from '../types';
import { MatchCard } from './MatchCard';

interface GroupViewProps {
  matches: Match[];
  selectedGroup: string | 'All';
}

export const GroupView: React.FC<GroupViewProps> = ({ matches, selectedGroup }) => {
  // Group matches by stage/group
  const groupedMatches = matches.reduce((acc, match) => {
    const key = match.group ? `Group ${match.group}` : match.stage;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // Filter keys based on selection
  const keys = Object.keys(groupedMatches).filter(key => {
    if (selectedGroup === 'All') return true;
    if (selectedGroup.startsWith('Group')) {
      return key === `Group ${selectedGroup}`;
    }
    return key === selectedGroup; // For knockout stages if we add them to filter
  });

  // Sort keys to ensure Groups A-L come first, then Knockouts
  const sortedKeys = keys.sort((a, b) => {
    if (a.startsWith('Group') && b.startsWith('Group')) {
      return a.localeCompare(b);
    }
    if (a.startsWith('Group')) return -1;
    if (b.startsWith('Group')) return 1;
    // Custom order for knockouts
    const order = ['Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Third place', 'Final'];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="space-y-8">
      {sortedKeys.map(key => (
        <div key={key} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            {key}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedMatches[key].map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
