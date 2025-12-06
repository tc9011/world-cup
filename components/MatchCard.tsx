import React from 'react';
import { Match } from '../types';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { teams, venues } from '../data/worldCupData';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const homeTeam = teams.find(t => t.id === match.homeTeamId);
  const awayTeam = teams.find(t => t.id === match.awayTeamId);
  const venue = venues.find(v => v.id === match.venueId);
  const matchDate = new Date(match.date);

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-xl shadow-lg border border-yellow-500/30 p-4 hover:shadow-yellow-500/20 hover:border-yellow-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 text-sm text-yellow-500/70">
          <span className="font-semibold text-yellow-400">{match.stage}</span>
          {match.group && <span>• Group {match.group}</span>}
        </div>
        <div className="flex items-center space-x-1 text-xs text-yellow-500/50">
          <MapPin size={12} />
          <span>{venue?.city}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        {/* Home Team */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-4xl mb-2">{homeTeam?.flag || '🏳️'}</div>
          <span className="font-bold text-center text-yellow-400">{homeTeam?.name || 'TBD'}</span>
        </div>

        {/* VS / Score */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-2xl font-bold text-yellow-500/50">VS</div>
          <div className="flex items-center mt-2 text-xs text-yellow-500/70 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/30">
            <Clock size={12} className="mr-1" />
            {format(matchDate, 'HH:mm')}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center w-1/3">
          <div className="text-4xl mb-2">{awayTeam?.flag || '🏳️'}</div>
          <span className="font-bold text-center text-yellow-400">{awayTeam?.name || 'TBD'}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-yellow-500/20 flex justify-between items-center text-sm text-yellow-500/70">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {format(matchDate, 'EEE, MMM d, yyyy')}
        </div>
        <div className="text-xs text-yellow-500/50">
          {venue?.name}
        </div>
      </div>
    </div>
  );
};
