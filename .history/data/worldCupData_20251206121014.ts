import { Team, Venue, Match } from '../types';
import { addDays, setHours, setMinutes } from 'date-fns';

export const venues: Venue[] = [
  // Western Region
  { id: 'v4', name: 'BC Place', city: 'Vancouver', timezone: 'America/Vancouver', region: 'Western' },
  { id: 'v15', name: 'Lumen Field', city: 'Seattle', timezone: 'America/Los_Angeles', region: 'Western' },
  { id: 'v16', name: 'Levi\'s Stadium', city: 'San Francisco', timezone: 'America/Los_Angeles', region: 'Western' },
  { id: 'v2', name: 'SoFi Stadium', city: 'Los Angeles', timezone: 'America/Los_Angeles', region: 'Western' },
  
  // Central Region
  { id: 'v5', name: 'Estadio Akron', city: 'Guadalajara', timezone: 'America/Mexico_City', region: 'Central' },
  { id: 'v1', name: 'Estadio Azteca', city: 'Mexico City', timezone: 'America/Mexico_City', region: 'Central' },
  { id: 'v6', name: 'Estadio BBVA', city: 'Monterrey', timezone: 'America/Mexico_City', region: 'Central' },
  { id: 'v13', name: 'NRG Stadium', city: 'Houston', timezone: 'America/Chicago', region: 'Central' },
  { id: 'v8', name: 'AT&T Stadium', city: 'Dallas', timezone: 'America/Chicago', region: 'Central' },
  { id: 'v14', name: 'Arrowhead Stadium', city: 'Kansas City', timezone: 'America/Chicago', region: 'Central' },
  
  // Eastern Region
  { id: 'v9', name: 'Mercedes-Benz Stadium', city: 'Atlanta', timezone: 'America/New_York', region: 'Eastern' },
  { id: 'v10', name: 'Hard Rock Stadium', city: 'Miami', timezone: 'America/New_York', region: 'Eastern' },
  { id: 'v3', name: 'BMO Field', city: 'Toronto', timezone: 'America/Toronto', region: 'Eastern' },
  { id: 'v11', name: 'Gillette Stadium', city: 'Boston', timezone: 'America/New_York', region: 'Eastern' },
  { id: 'v12', name: 'Lincoln Financial Field', city: 'Philadelphia', timezone: 'America/New_York', region: 'Eastern' },
  { id: 'v7', name: 'MetLife Stadium', city: 'New York/New Jersey', timezone: 'America/New_York', region: 'Eastern' },
];

// Simulated Draw Results (48 Teams, 12 Groups)
export const teams: Team[] = [
  // Group A
  { id: 'MEX', name: 'Mexico', code: 'MEX', flag: '🇲🇽', group: 'A' },
  { id: 'RSA', name: 'South Africa', code: 'RSA', flag: '🇿🇦', group: 'A' },
  { id: 'DEN', name: 'Denmark', code: 'DEN', flag: '🇩🇰', group: 'A' },
  { id: 'KOR', name: 'South Korea', code: 'KOR', flag: '🇰🇷', group: 'A' },
  // Group B
  { id: 'CAN', name: 'Canada', code: 'CAN', flag: '🇨🇦', group: 'B' },
  { id: 'FRA', name: 'France', code: 'FRA', flag: '🇫🇷', group: 'B' },
  { id: 'EGY', name: 'Egypt', code: 'EGY', flag: '🇪🇬', group: 'B' },
  { id: 'AUS', name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'B' },
  // Group C
  { id: 'USA', name: 'USA', code: 'USA', flag: '🇺🇸', group: 'C' },
  { id: 'ENG', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'C' },
  { id: 'IRN', name: 'Iran', code: 'IRN', flag: '🇮🇷', group: 'C' },
  { id: 'PER', name: 'Peru', code: 'PER', flag: '🇵🇪', group: 'C' },
  // Group D
  { id: 'BRA', name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'D' },
  { id: 'SUI', name: 'Switzerland', code: 'SUI', flag: '🇨🇭', group: 'D' },
  { id: 'JPN', name: 'Japan', code: 'JPN', flag: '🇯🇵', group: 'D' },
  { id: 'SWE', name: 'Sweden', code: 'SWE', flag: '🇸🇪', group: 'D' },
  // Group E
  { id: 'ARG', name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'E' },
  { id: 'ITA', name: 'Italy', code: 'ITA', flag: '🇮🇹', group: 'E' },
  { id: 'NGA', name: 'Nigeria', code: 'NGA', flag: '🇳🇬', group: 'E' },
  { id: 'KSA', name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', group: 'E' },
  // Group F
  { id: 'ESP', name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'F' },
  { id: 'URU', name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'F' },
  { id: 'MAR', name: 'Morocco', code: 'MAR', flag: '🇲🇦', group: 'F' },
  { id: 'NZL', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', group: 'F' },
  // Group G
  { id: 'GER', name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'G' },
  { id: 'COL', name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'G' },
  { id: 'GHA', name: 'Ghana', code: 'GHA', flag: '🇬🇭', group: 'G' },
  { id: 'QAT', name: 'Qatar', code: 'QAT', flag: '🇶🇦', group: 'G' },
  // Group H
  { id: 'NED', name: 'Netherlands', code: 'NED', flag: '🇳🇱', group: 'H' },
  { id: 'CHI', name: 'Chile', code: 'CHI', flag: '🇨🇱', group: 'H' },
  { id: 'SEN', name: 'Senegal', code: 'SEN', flag: '🇸🇳', group: 'H' },
  { id: 'POL', name: 'Poland', code: 'POL', flag: '🇵🇱', group: 'H' },
  // Group I
  { id: 'POR', name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'I' },
  { id: 'CRO', name: 'Croatia', code: 'CRO', flag: '🇭🇷', group: 'I' },
  { id: 'CIV', name: 'Ivory Coast', code: 'CIV', flag: '🇨🇮', group: 'I' },
  { id: 'CRC', name: 'Costa Rica', code: 'CRC', flag: '🇨🇷', group: 'I' },
  // Group J
  { id: 'BEL', name: 'Belgium', code: 'BEL', flag: '🇧🇪', group: 'J' },
  { id: 'ECU', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', group: 'J' },
  { id: 'CMR', name: 'Cameroon', code: 'CMR', flag: '🇨🇲', group: 'J' },
  { id: 'AUT', name: 'Austria', code: 'AUT', flag: '🇦🇹', group: 'J' },
  // Group K
  { id: 'COL2', name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'K' }, // Duplicate for demo, fixing
  { id: 'UKR', name: 'Ukraine', code: 'UKR', flag: '🇺🇦', group: 'K' },
  { id: 'ALG', name: 'Algeria', code: 'ALG', flag: '🇩🇿', group: 'K' },
  { id: 'JAM', name: 'Jamaica', code: 'JAM', flag: '🇯🇲', group: 'K' },
  // Group L
  { id: 'URU2', name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'L' }, // Duplicate for demo, fixing
  { id: 'TUR', name: 'Turkey', code: 'TUR', flag: '🇹🇷', group: 'L' },
  { id: 'MLI', name: 'Mali', code: 'MLI', flag: '🇲🇱', group: 'L' },
  { id: 'PAN', name: 'Panama', code: 'PAN', flag: '🇵🇦', group: 'L' },
];

// Fix duplicates in K and L for the demo
teams.find(t => t.group === 'K' && t.id === 'COL2')!.id = 'PAR';
teams.find(t => t.group === 'K' && t.id === 'PAR')!.name = 'Paraguay';
teams.find(t => t.group === 'K' && t.id === 'PAR')!.flag = '🇵🇾';

teams.find(t => t.group === 'L' && t.id === 'URU2')!.id = 'GRE';
teams.find(t => t.group === 'L' && t.id === 'GRE')!.name = 'Greece';
teams.find(t => t.group === 'L' && t.id === 'GRE')!.flag = '🇬🇷';


// Helper to generate matches
const startDate = new Date('2026-06-11T00:00:00');

export const matches: Match[] = [];

// Generate Group Stage Matches (Simplified logic for demo)
// 12 Groups, 6 matches each = 72 matches
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

let matchCounter = 1;

groups.forEach((group) => {
  const groupTeams = teams.filter(t => t.group === group);
  // Round-robin pairings: (0v1, 2v3), (0v2, 1v3), (0v3, 1v2)
  const pairings = [
    [0, 1], [2, 3],
    [0, 2], [1, 3],
    [0, 3], [1, 2]
  ];

  pairings.forEach((pair) => {
    // Distribute matches over the first 16 days
    const dayOffset = Math.floor((matchCounter - 1) / 4); 
    const matchDate = addDays(startDate, dayOffset);
    
    // Set times (12:00, 15:00, 18:00, 21:00)
    const hour = 12 + ((matchCounter - 1) % 4) * 3;
    const finalDate = setMinutes(setHours(matchDate, hour), 0);

    matches.push({
      id: `m${matchCounter}`,
      date: finalDate.toISOString(),
      group: group,
      stage: 'Group Stage',
      homeTeamId: groupTeams[pair[0]].id,
      awayTeamId: groupTeams[pair[1]].id,
      venueId: venues[matchCounter % venues.length].id,
      status: 'scheduled'
    });
    matchCounter++;
  });
});

// Generate Knockout Stage Placeholders
const knockoutStages: { name: Match['stage'], count: number, days: number }[] = [
  { name: 'Round of 32', count: 16, days: 5 },
  { name: 'Round of 16', count: 8, days: 4 },
  { name: 'Quarter-finals', count: 4, days: 2 },
  { name: 'Semi-finals', count: 2, days: 2 },
  { name: 'Third place', count: 1, days: 1 },
  { name: 'Final', count: 1, days: 1 },
];

let knockoutStartDate = addDays(startDate, 18); // Start after group stage

knockoutStages.forEach(stage => {
  for (let i = 0; i < stage.count; i++) {
    const dayOffset = Math.floor(i / (stage.count / stage.days || 1));
    const matchDate = addDays(knockoutStartDate, dayOffset);
    const hour = 18; // Evening matches
    const finalDate = setMinutes(setHours(matchDate, hour), 0);

    matches.push({
      id: `m${matchCounter}`,
      date: finalDate.toISOString(),
      stage: stage.name,
      homeTeamId: 'TBD',
      awayTeamId: 'TBD',
      venueId: venues[matchCounter % venues.length].id,
      status: 'scheduled'
    });
    matchCounter++;
  }
  knockoutStartDate = addDays(knockoutStartDate, stage.days + 1); // Gap between stages
});
