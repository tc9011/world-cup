import React from 'react';
import { Match } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { teams, venues } from '../data/worldCupData';
import { useStore } from '../store/useStore';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { timezoneMode } = useStore();
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);
  const venue = venues.find(v => v.id === match.venueId);
  
  // Helper to get display date based on timezone mode
  const getDisplayDate = (date: Date, venueId: string) => {
    if (timezoneMode === 'local') return date;
    const venue = venues.find(v => v.id === venueId);
    if (!venue?.timezone) return date;
    
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: venue.timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    }).formatToParts(date);
    
    const part = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
    return new Date(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'));
  };

  const matchDate = getDisplayDate(new Date(match.date), match.venueId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{match.stage}</span>
          {match.group && <span>• Group {match.group}</span>}
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <MapPin size={12} />
          <span>{venue?.city}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-4xl mb-2">{homeTeam?.flag || '🏳️'}</div>
          <span className="font-bold text-center text-gray-900 dark:text-white">{homeTeam?.name || 'TBD'}</span>
        </div>

        {/* VS / Score */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-2xl font-bold text-gray-300">VS</div>
          <div className="flex items-center mt-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            <Clock size={12} className="mr-1" />
            {format(matchDate, 'HH:mm')}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-4xl mb-2">{awayTeam?.flag || '🏳️'}</div>
          <span className="font-bold text-center text-gray-900 dark:text-white">{awayTeam?.name || 'TBD'}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {format(matchDate, 'EEE, MMM d, yyyy')}
        </div>
        <div className="text-xs text-gray-400">
          {venue?.name}
        </div>
      </div>
    </div>
  );
};
