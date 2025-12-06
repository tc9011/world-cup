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

// 48 Teams, 12 Groups (A-L)
// Hosts: Mexico (A1), Canada (B1), USA (D1)
export const teams: Team[] = [
  // Group A (Mexico based)
  { id: 'MEX', name: 'Mexico', code: 'MEX', flag: '🇲🇽', group: 'A' },
  { id: 'RSA', name: 'South Africa', code: 'RSA', flag: '🇿🇦', group: 'A' },
  { id: 'KOR', name: 'Korea Republic', code: 'KOR', flag: '🇰🇷', group: 'A' },
  { id: 'TBD_D', name: 'Winner Play-off D', code: 'TBD', flag: '🏳️', group: 'A' },
  
  // Group B (Canada based)
  { id: 'CAN', name: 'Canada', code: 'CAN', flag: '🇨🇦', group: 'B' },
  { id: 'TBD_A', name: 'Winner Play-off A', code: 'TBD', flag: '🏳️', group: 'B' },
  { id: 'QAT', name: 'Qatar', code: 'QAT', flag: '🇶🇦', group: 'B' },
  { id: 'SUI', name: 'Switzerland', code: 'SUI', flag: '🇨🇭', group: 'B' },
  
  // Group C
  { id: 'BRA', name: 'Brazil', code: 'BRA', flag: '🇧🇷', group: 'C' },
  { id: 'MAR', name: 'Morocco', code: 'MAR', flag: '🇲🇦', group: 'C' },
  { id: 'HAI', name: 'Haiti', code: 'HAI', flag: '🇭🇹', group: 'C' },
  { id: 'SCO', name: 'Scotland', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  
  // Group D (USA based)
  { id: 'USA', name: 'USA', code: 'USA', flag: '🇺🇸', group: 'D' },
  { id: 'PAR', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', group: 'D' },
  { id: 'AUS', name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'D' },
  { id: 'TBD_C', name: 'Winner Play-off C', code: 'TBD', flag: '🏳️', group: 'D' },
  
  // Group E
  { id: 'GER', name: 'Germany', code: 'GER', flag: '🇩🇪', group: 'E' },
  { id: 'CUW', name: 'Curaçao', code: 'CUW', flag: '🇨🇼', group: 'E' },
  { id: 'CIV', name: 'Côte d\'Ivoire', code: 'CIV', flag: '🇨🇮', group: 'E' },
  { id: 'ECU', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', group: 'E' },
  
  // Group F
  { id: 'NED', name: 'Netherlands', code: 'NED', flag: '🇳🇱', group: 'F' },
  { id: 'JPN', name: 'Japan', code: 'JPN', flag: '🇯🇵', group: 'F' },
  { id: 'TBD_B', name: 'Winner Play-off B', code: 'TBD', flag: '🏳️', group: 'F' },
  { id: 'TUN', name: 'Tunisia', code: 'TUN', flag: '🇹🇳', group: 'F' },
  
  // Group G
  { id: 'BEL', name: 'Belgium', code: 'BEL', flag: '🇧🇪', group: 'G' },
  { id: 'EGY', name: 'Egypt', code: 'EGY', flag: '🇪🇬', group: 'G' },
  { id: 'IRN', name: 'IR Iran', code: 'IRN', flag: '🇮🇷', group: 'G' },
  { id: 'NZL', name: 'New Zealand', code: 'NZL', flag: '🇳🇿', group: 'G' },
  
  // Group H
  { id: 'ESP', name: 'Spain', code: 'ESP', flag: '🇪🇸', group: 'H' },
  { id: 'CPV', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', group: 'H' },
  { id: 'KSA', name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', group: 'H' },
  { id: 'URU', name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'H' },
  
  // Group I
  { id: 'FRA', name: 'France', code: 'FRA', flag: '🇫🇷', group: 'I' },
  { id: 'SEN', name: 'Senegal', code: 'SEN', flag: '🇸🇳', group: 'I' },
  { id: 'TBD_2', name: 'Winner Play-off 2', code: 'TBD', flag: '🏳️', group: 'I' },
  { id: 'NOR', name: 'Norway', code: 'NOR', flag: '🇳🇴', group: 'I' },
  
  // Group J
  { id: 'ARG', name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'J' },
  { id: 'ALG', name: 'Algeria', code: 'ALG', flag: '🇩🇿', group: 'J' },
  { id: 'AUT', name: 'Austria', code: 'AUT', flag: '🇦🇹', group: 'J' },
  { id: 'JOR', name: 'Jordan', code: 'JOR', flag: '🇯🇴', group: 'J' },
  
  // Group K
  { id: 'POR', name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'K' },
  { id: 'TBD_1', name: 'Winner Play-off 1', code: 'TBD', flag: '🏳️', group: 'K' },
  { id: 'UZB', name: 'Uzbekistan', code: 'UZB', flag: '🇺🇿', group: 'K' },
  { id: 'COL', name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'K' },
  
  // Group L
  { id: 'ENG', name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  { id: 'CRO', name: 'Croatia', code: 'CRO', flag: '🇭🇷', group: 'L' },
  { id: 'GHA', name: 'Ghana', code: 'GHA', flag: '🇬🇭', group: 'L' },
  { id: 'PAN', name: 'Panama', code: 'PAN', flag: '🇵🇦', group: 'L' },
];

export const matches: Match[] = [];

// Helper to create match
const createMatch = (
  id: number, 
  dateStr: string, 
  timeStr: string, 
  group: string, 
  team1Idx: number, 
  team2Idx: number, 
  venueId: string
) => {
  const groupTeams = teams.filter(t => t.group === group);
  const date = new Date(`${dateStr}T${timeStr}:00`);
  
  matches.push({
    id: `m${id}`,
    date: date.toISOString(),
    group,
    stage: 'Group Stage',
    homeTeamId: groupTeams[team1Idx].id,
    awayTeamId: groupTeams[team2Idx].id,
    venueId,
    status: 'scheduled'
  });
};

// --- Group Stage Schedule (Simulated based on Official Structure) ---

// Day 1: June 11 (Mexico Opener)
createMatch(1, '2026-06-11', '19:00', 'A', 0, 1, 'v1'); // MEX vs POL (Azteca)
createMatch(2, '2026-06-11', '21:00', 'A', 2, 3, 'v5'); // KOR vs SEN (Guadalajara)

// Day 2: June 12 (Canada & USA Openers)
createMatch(3, '2026-06-12', '15:00', 'B', 0, 1, 'v3'); // CAN vs FRA (Toronto)
createMatch(4, '2026-06-12', '18:00', 'D', 0, 1, 'v2'); // USA vs NED (LA)
createMatch(5, '2026-06-12', '21:00', 'B', 2, 3, 'v4'); // EGY vs AUS (Vancouver)

// Day 3: June 13
createMatch(6, '2026-06-13', '12:00', 'C', 0, 1, 'v7'); // ENG vs URU (NY/NJ)
createMatch(7, '2026-06-13', '15:00', 'C', 2, 3, 'v11'); // KSA vs NGA (Boston)
createMatch(8, '2026-06-13', '18:00', 'D', 2, 3, 'v15'); // MAR vs JPN (Seattle)
createMatch(9, '2026-06-13', '21:00', 'E', 0, 1, 'v13'); // BRA vs SUI (Houston)

// Day 4: June 14
createMatch(10, '2026-06-14', '12:00', 'E', 2, 3, 'v8'); // IRN vs CMR (Dallas)
createMatch(11, '2026-06-14', '15:00', 'F', 0, 1, 'v9'); // ESP vs COL (Atlanta)
createMatch(12, '2026-06-14', '18:00', 'F', 2, 3, 'v10'); // SWE vs NZL (Miami)
createMatch(13, '2026-06-14', '21:00', 'G', 0, 1, 'v12'); // GER vs CHI (Philly)

// Day 5: June 15
createMatch(14, '2026-06-15', '12:00', 'G', 2, 3, 'v14'); // GHA vs QAT (KC)
createMatch(15, '2026-06-15', '15:00', 'H', 0, 1, 'v16'); // ARG vs UKR (SF)
createMatch(16, '2026-06-15', '18:00', 'H', 2, 3, 'v6'); // TUN vs CRC (Monterrey)
createMatch(17, '2026-06-15', '21:00', 'I', 0, 1, 'v13'); // ITA vs CRO (Houston)

// Day 6: June 16
createMatch(18, '2026-06-16', '12:00', 'I', 2, 3, 'v9'); // CIV vs ECU (Atlanta)
createMatch(19, '2026-06-16', '15:00', 'J', 0, 1, 'v7'); // BEL vs PER (NY/NJ)
createMatch(20, '2026-06-16', '18:00', 'J', 2, 3, 'v11'); // ALG vs JAM (Boston)
createMatch(21, '2026-06-16', '21:00', 'K', 0, 1, 'v3'); // POR vs DEN (Toronto)

// Day 7: June 17
createMatch(22, '2026-06-17', '12:00', 'K', 2, 3, 'v12'); // PAR vs MLI (Philly)
createMatch(23, '2026-06-17', '15:00', 'L', 0, 1, 'v8'); // RSA vs TUR (Dallas)
createMatch(24, '2026-06-17', '18:00', 'L', 2, 3, 'v10'); // GRE vs PAN (Miami)
createMatch(25, '2026-06-17', '21:00', 'A', 0, 2, 'v5'); // MEX vs KOR (Guadalajara)

// Day 8: June 18
createMatch(26, '2026-06-18', '15:00', 'A', 1, 3, 'v6'); // POL vs SEN (Monterrey)
createMatch(27, '2026-06-18', '18:00', 'B', 0, 2, 'v4'); // CAN vs EGY (Vancouver)
createMatch(28, '2026-06-18', '21:00', 'B', 1, 3, 'v15'); // FRA vs AUS (Seattle)

// Day 9: June 19
createMatch(29, '2026-06-19', '12:00', 'C', 0, 2, 'v12'); // ENG vs KSA (Philly)
createMatch(30, '2026-06-19', '15:00', 'C', 1, 3, 'v7'); // URU vs NGA (NY/NJ)
createMatch(31, '2026-06-19', '18:00', 'D', 0, 2, 'v16'); // USA vs MAR (SF)
createMatch(32, '2026-06-19', '21:00', 'D', 1, 3, 'v2'); // NED vs JPN (LA)

// Day 10: June 20
createMatch(33, '2026-06-20', '12:00', 'E', 0, 2, 'v11'); // BRA vs IRN (Boston)
createMatch(34, '2026-06-20', '15:00', 'E', 1, 3, 'v14'); // SUI vs CMR (KC)
createMatch(35, '2026-06-20', '18:00', 'F', 0, 2, 'v13'); // ESP vs SWE (Houston)
createMatch(36, '2026-06-20', '21:00', 'F', 1, 3, 'v8'); // COL vs NZL (Dallas)

// Day 11: June 21
createMatch(37, '2026-06-21', '12:00', 'G', 0, 2, 'v9'); // GER vs GHA (Atlanta)
createMatch(38, '2026-06-21', '15:00', 'G', 1, 3, 'v10'); // CHI vs QAT (Miami)
createMatch(39, '2026-06-21', '18:00', 'H', 0, 2, 'v2'); // ARG vs TUN (LA)
createMatch(40, '2026-06-21', '21:00', 'H', 1, 3, 'v15'); // UKR vs CRC (Seattle)

// Day 12: June 22
createMatch(41, '2026-06-22', '12:00', 'I', 0, 2, 'v7'); // ITA vs CIV (NY/NJ)
createMatch(42, '2026-06-22', '15:00', 'I', 1, 3, 'v12'); // CRO vs ECU (Philly)
createMatch(43, '2026-06-22', '18:00', 'J', 0, 2, 'v3'); // BEL vs ALG (Toronto)
createMatch(44, '2026-06-22', '21:00', 'J', 1, 3, 'v4'); // PER vs JAM (Vancouver)

// Day 13: June 23
createMatch(45, '2026-06-23', '12:00', 'K', 0, 2, 'v11'); // POR vs PAR (Boston)
createMatch(46, '2026-06-23', '15:00', 'K', 1, 3, 'v9'); // DEN vs MLI (Atlanta)
createMatch(47, '2026-06-23', '18:00', 'L', 0, 2, 'v14'); // RSA vs GRE (KC)
createMatch(48, '2026-06-23', '21:00', 'L', 1, 3, 'v13'); // TUR vs PAN (Houston)

// Day 14: June 24 (Final Group Matches A, B, C)
createMatch(49, '2026-06-24', '19:00', 'A', 0, 3, 'v1'); // MEX vs SEN (Azteca)
createMatch(50, '2026-06-24', '19:00', 'A', 1, 2, 'v5'); // POL vs KOR (Guadalajara)
createMatch(51, '2026-06-24', '21:00', 'B', 0, 3, 'v4'); // CAN vs AUS (Vancouver)
createMatch(52, '2026-06-24', '21:00', 'B', 1, 2, 'v15'); // FRA vs EGY (Seattle)
createMatch(53, '2026-06-24', '16:00', 'C', 0, 3, 'v10'); // ENG vs NGA (Miami)
createMatch(54, '2026-06-24', '16:00', 'C', 1, 2, 'v9'); // URU vs KSA (Atlanta)

// Day 15: June 25 (Final Group Matches D, E, F)
createMatch(55, '2026-06-25', '18:00', 'D', 0, 3, 'v2'); // USA vs JPN (LA)
createMatch(56, '2026-06-25', '18:00', 'D', 1, 2, 'v16'); // NED vs MAR (SF)
createMatch(57, '2026-06-25', '21:00', 'E', 0, 3, 'v8'); // BRA vs CMR (Dallas)
createMatch(58, '2026-06-25', '21:00', 'E', 1, 2, 'v13'); // SUI vs IRN (Houston)
createMatch(59, '2026-06-25', '15:00', 'F', 0, 3, 'v14'); // ESP vs NZL (KC)
createMatch(60, '2026-06-25', '15:00', 'F', 1, 2, 'v6'); // COL vs SWE (Monterrey)

// Day 16: June 26 (Final Group Matches G, H, I)
createMatch(61, '2026-06-26', '12:00', 'G', 0, 3, 'v2'); // GER vs QAT (LA)
createMatch(62, '2026-06-26', '12:00', 'G', 1, 2, 'v15'); // CHI vs GHA (Seattle)
createMatch(63, '2026-06-26', '15:00', 'H', 0, 3, 'v13'); // ARG vs CRC (Houston)
createMatch(64, '2026-06-26', '15:00', 'H', 1, 2, 'v8'); // UKR vs TUN (Dallas)
createMatch(65, '2026-06-26', '18:00', 'I', 0, 3, 'v10'); // ITA vs ECU (Miami)
createMatch(66, '2026-06-26', '18:00', 'I', 1, 2, 'v9'); // CRO vs CIV (Atlanta)

// Day 17: June 27 (Final Group Matches J, K, L)
createMatch(67, '2026-06-27', '12:00', 'J', 0, 3, 'v11'); // BEL vs JAM (Boston)
createMatch(68, '2026-06-27', '12:00', 'J', 1, 2, 'v12'); // PER vs ALG (Philly)
createMatch(69, '2026-06-27', '15:00', 'K', 0, 3, 'v7'); // POR vs MLI (NY/NJ)
createMatch(70, '2026-06-27', '15:00', 'K', 1, 2, 'v3'); // DEN vs PAR (Toronto)
createMatch(71, '2026-06-27', '18:00', 'L', 0, 3, 'v16'); // RSA vs PAN (SF)
createMatch(72, '2026-06-27', '18:00', 'L', 1, 2, 'v4'); // TUR vs GRE (Vancouver)

// --- Knockout Stage (Simplified) ---
// Round of 32 (June 28 - July 3)
const r32Venues = ['v2', 'v11', 'v7', 'v13', 'v8', 'v1', 'v9', 'v15', 'v10', 'v14', 'v4', 'v12', 'v16', 'v3', 'v6', 'v5'];
for (let i = 0; i < 16; i++) {
  const date = addDays(new Date('2026-06-28'), Math.floor(i/3));
  matches.push({
    id: `m${73+i}`,
    date: setMinutes(setHours(date, 15 + (i%2)*3), 0).toISOString(),
    stage: 'Round of 32',
    homeTeamId: 'TBD',
    awayTeamId: 'TBD',
    venueId: r32Venues[i],
    status: 'scheduled'
  });
}

// Round of 16 (July 4 - July 7)
const r16Venues = ['v12', 'v13', 'v1', 'v4', 'v9', 'v15', 'v7', 'v8'];
for (let i = 0; i < 8; i++) {
  const date = addDays(new Date('2026-07-04'), Math.floor(i/2));
  matches.push({
    id: `m${89+i}`,
    date: setMinutes(setHours(date, 18), 0).toISOString(),
    stage: 'Round of 16',
    homeTeamId: 'TBD',
    awayTeamId: 'TBD',
    venueId: r16Venues[i],
    status: 'scheduled'
  });
}

// Quarter-finals (July 9 - 11)
const qfVenues = ['v11', 'v2', 'v10', 'v14']; // Boston, LA, Miami, KC
for (let i = 0; i < 4; i++) {
  const date = addDays(new Date('2026-07-09'), Math.floor(i/2));
  matches.push({
    id: `m${97+i}`,
    date: setMinutes(setHours(date, 20), 0).toISOString(),
    stage: 'Quarter-finals',
    homeTeamId: 'TBD',
    awayTeamId: 'TBD',
    venueId: qfVenues[i],
    status: 'scheduled'
  });
}

// Semi-finals (July 14, 15)
matches.push({
  id: 'm101',
  date: '2026-07-14T20:00:00.000Z',
  stage: 'Semi-finals',
  homeTeamId: 'TBD',
  awayTeamId: 'TBD',
  venueId: 'v8', // Dallas
  status: 'scheduled'
});
matches.push({
  id: 'm102',
  date: '2026-07-15T20:00:00.000Z',
  stage: 'Semi-finals',
  homeTeamId: 'TBD',
  awayTeamId: 'TBD',
  venueId: 'v9', // Atlanta
  status: 'scheduled'
});

// Third Place (July 18)
matches.push({
  id: 'm103',
  date: '2026-07-18T20:00:00.000Z',
  stage: 'Third place',
  homeTeamId: 'TBD',
  awayTeamId: 'TBD',
  venueId: 'v10', // Miami
  status: 'scheduled'
});

// Final (July 19)
matches.push({
  id: 'm104',
  date: '2026-07-19T15:00:00.000Z',
  stage: 'Final',
  homeTeamId: 'TBD',
  awayTeamId: 'TBD',
  venueId: 'v7', // NY/NJ
  status: 'scheduled'
});
