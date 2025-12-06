import { Team, Venue, Match } from '../types';

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

// --- Group Stage Schedule (Official Schedule) ---

// Day 1: June 11
createMatch(1, '2026-06-11', '19:00', 'A', 0, 1, 'v1'); // MEX vs RSA (Azteca)
createMatch(2, '2026-06-11', '21:00', 'A', 2, 3, 'v5'); // KOR vs TBD (Guadalajara)

// Day 2: June 12
createMatch(3, '2026-06-12', '15:00', 'B', 0, 1, 'v3'); // CAN vs TBD (Toronto)
createMatch(4, '2026-06-12', '18:00', 'D', 0, 1, 'v2'); // USA vs PAR (LA)

// Day 3: June 13
createMatch(5, '2026-06-13', '12:00', 'C', 0, 1, 'v11'); // BRA vs MAR (Boston)
createMatch(6, '2026-06-13', '15:00', 'D', 2, 3, 'v4'); // AUS vs TBD (Vancouver)
createMatch(7, '2026-06-13', '18:00', 'C', 2, 3, 'v7'); // HAI vs SCO (NY/NJ)
createMatch(8, '2026-06-13', '21:00', 'B', 2, 3, 'v16'); // QAT vs SUI (SF)

// Day 4: June 14
createMatch(9, '2026-06-14', '12:00', 'E', 0, 1, 'v12'); // GER vs CUW (Philly)
createMatch(10, '2026-06-14', '15:00', 'E', 2, 3, 'v13'); // CIV vs ECU (Houston)
createMatch(11, '2026-06-14', '18:00', 'F', 0, 1, 'v8'); // NED vs JPN (Dallas)
createMatch(12, '2026-06-14', '21:00', 'F', 2, 3, 'v6'); // TBD vs TUN (Monterrey)

// Day 5: June 15
createMatch(13, '2026-06-15', '12:00', 'H', 0, 1, 'v10'); // ESP vs CPV (Miami)
createMatch(14, '2026-06-15', '15:00', 'H', 2, 3, 'v9'); // KSA vs URU (Atlanta)
createMatch(15, '2026-06-15', '18:00', 'G', 0, 1, 'v2'); // BEL vs EGY (LA)
createMatch(16, '2026-06-15', '21:00', 'G', 2, 3, 'v15'); // IRN vs NZL (Seattle)

// Day 6: June 16
createMatch(17, '2026-06-16', '12:00', 'I', 0, 1, 'v7'); // FRA vs SEN (NY/NJ)
createMatch(18, '2026-06-16', '15:00', 'I', 2, 3, 'v11'); // TBD vs NOR (Boston)
createMatch(19, '2026-06-16', '18:00', 'J', 0, 1, 'v14'); // ARG vs ALG (KC)
createMatch(20, '2026-06-16', '21:00', 'J', 2, 3, 'v16'); // AUT vs JOR (SF)

// Day 7: June 17
createMatch(21, '2026-06-17', '12:00', 'L', 0, 1, 'v3'); // ENG vs CRO (Toronto)
createMatch(22, '2026-06-17', '15:00', 'L', 2, 3, 'v8'); // GHA vs PAN (Dallas)
createMatch(23, '2026-06-17', '18:00', 'K', 0, 1, 'v13'); // POR vs TBD (Houston)
createMatch(24, '2026-06-17', '21:00', 'K', 2, 3, 'v1'); // UZB vs COL (Azteca)

// Day 8: June 18
createMatch(25, '2026-06-18', '15:00', 'A', 3, 1, 'v9'); // TBD vs RSA (Atlanta)
createMatch(26, '2026-06-18', '18:00', 'B', 3, 1, 'v2'); // SUI vs TBD (LA)
createMatch(27, '2026-06-18', '21:00', 'B', 0, 2, 'v4'); // CAN vs QAT (Vancouver)
createMatch(28, '2026-06-18', '21:00', 'A', 0, 2, 'v5'); // MEX vs KOR (Guadalajara)

// Day 9: June 19
createMatch(29, '2026-06-19', '12:00', 'C', 0, 2, 'v12'); // BRA vs HAI (Philly)
createMatch(30, '2026-06-19', '15:00', 'C', 3, 1, 'v11'); // SCO vs MAR (Boston)
createMatch(31, '2026-06-19', '18:00', 'D', 3, 1, 'v16'); // TBD vs PAR (SF)
createMatch(32, '2026-06-19', '21:00', 'D', 0, 2, 'v15'); // USA vs AUS (Seattle)

// Day 10: June 20
createMatch(33, '2026-06-20', '12:00', 'E', 0, 2, 'v3'); // GER vs CIV (Toronto)
createMatch(34, '2026-06-20', '15:00', 'E', 3, 1, 'v14'); // ECU vs CUW (KC)
createMatch(35, '2026-06-20', '18:00', 'F', 0, 2, 'v13'); // NED vs TBD (Houston)
createMatch(36, '2026-06-20', '21:00', 'F', 3, 1, 'v6'); // TUN vs JPN (Monterrey)

// Day 11: June 21
createMatch(37, '2026-06-21', '12:00', 'H', 0, 2, 'v10'); // ESP vs KSA (Miami)
createMatch(38, '2026-06-21', '15:00', 'H', 3, 1, 'v9'); // URU vs CPV (Atlanta)
createMatch(39, '2026-06-21', '18:00', 'G', 0, 2, 'v2'); // BEL vs IRN (LA)
createMatch(40, '2026-06-21', '21:00', 'G', 3, 1, 'v4'); // NZL vs EGY (Vancouver)

// Day 12: June 22
createMatch(41, '2026-06-22', '12:00', 'I', 0, 2, 'v7'); // FRA vs TBD (NY/NJ)
createMatch(42, '2026-06-22', '15:00', 'I', 3, 1, 'v12'); // NOR vs SEN (Philly)
createMatch(43, '2026-06-22', '18:00', 'J', 0, 2, 'v14'); // ARG vs AUT (KC)
createMatch(44, '2026-06-22', '21:00', 'J', 3, 1, 'v16'); // JOR vs ALG (SF)

// Day 13: June 23
createMatch(45, '2026-06-23', '12:00', 'L', 0, 2, 'v11'); // ENG vs GHA (Boston)
createMatch(46, '2026-06-23', '15:00', 'L', 3, 1, 'v3'); // PAN vs CRO (Toronto)
createMatch(47, '2026-06-23', '18:00', 'K', 0, 2, 'v13'); // POR vs UZB (Houston)
createMatch(48, '2026-06-23', '21:00', 'K', 3, 1, 'v1'); // COL vs TBD (Azteca)

// Day 14: June 24
createMatch(49, '2026-06-24', '16:00', 'C', 3, 0, 'v10'); // SCO vs BRA (Miami)
createMatch(50, '2026-06-24', '16:00', 'C', 1, 2, 'v9'); // MAR vs HAI (Atlanta)
createMatch(51, '2026-06-24', '21:00', 'B', 3, 0, 'v4'); // SUI vs CAN (Vancouver)
createMatch(52, '2026-06-24', '21:00', 'B', 1, 2, 'v15'); // TBD vs QAT (Seattle)
createMatch(53, '2026-06-24', '19:00', 'A', 3, 0, 'v1'); // TBD vs MEX (Azteca)
createMatch(54, '2026-06-24', '19:00', 'A', 1, 2, 'v6'); // RSA vs KOR (Monterrey)

// Day 15: June 25
createMatch(55, '2026-06-25', '18:00', 'E', 3, 0, 'v12'); // ECU vs GER (Philly)
createMatch(56, '2026-06-25', '18:00', 'E', 1, 2, 'v7'); // CUW vs CIV (NY/NJ)
createMatch(57, '2026-06-25', '15:00', 'F', 3, 0, 'v8'); // TUN vs NED (Dallas)
createMatch(58, '2026-06-25', '15:00', 'F', 1, 2, 'v14'); // JPN vs TBD (KC)
createMatch(59, '2026-06-25', '21:00', 'D', 3, 0, 'v2'); // TBD vs USA (LA)
createMatch(60, '2026-06-25', '21:00', 'D', 1, 2, 'v16'); // PAR vs AUS (SF)

// Day 16: June 26
createMatch(61, '2026-06-26', '12:00', 'I', 3, 0, 'v11'); // NOR vs FRA (Boston)
createMatch(62, '2026-06-26', '12:00', 'I', 1, 2, 'v3'); // SEN vs TBD (Toronto)
createMatch(63, '2026-06-26', '18:00', 'G', 3, 0, 'v15'); // NZL vs BEL (Seattle)
createMatch(64, '2026-06-26', '18:00', 'G', 1, 2, 'v4'); // EGY vs IRN (Vancouver)
createMatch(65, '2026-06-26', '15:00', 'H', 3, 0, 'v13'); // URU vs ESP (Houston)
createMatch(66, '2026-06-26', '15:00', 'H', 1, 2, 'v5'); // CPV vs KSA (Guadalajara)

// Day 17: June 27
createMatch(67, '2026-06-27', '12:00', 'L', 3, 0, 'v7'); // PAN vs ENG (NY/NJ)
createMatch(68, '2026-06-27', '12:00', 'L', 1, 2, 'v12'); // CRO vs GHA (Philly)
createMatch(69, '2026-06-27', '15:00', 'J', 3, 0, 'v14'); // JOR vs ARG (KC)
createMatch(70, '2026-06-27', '15:00', 'J', 1, 2, 'v8'); // ALG vs AUT (Dallas)
createMatch(71, '2026-06-27', '18:00', 'K', 3, 0, 'v10'); // COL vs POR (Miami)
createMatch(72, '2026-06-27', '18:00', 'K', 1, 2, 'v9'); // TBD vs UZB (Atlanta)

// --- Knockout Stage ---
// Round of 32 (June 28 - July 3)
const r32Matches = [
  { id: 'm73', date: '2026-06-28T15:00:00', venue: 'v2' }, // LA
  { id: 'm74', date: '2026-06-29T12:00:00', venue: 'v11' }, // Boston
  { id: 'm75', date: '2026-06-29T15:00:00', venue: 'v6' }, // Monterrey
  { id: 'm76', date: '2026-06-30T12:00:00', venue: 'v13' }, // Houston
  { id: 'm77', date: '2026-06-30T15:00:00', venue: 'v7' }, // NY/NJ
  { id: 'm78', date: '2026-06-30T18:00:00', venue: 'v8' }, // Dallas
  { id: 'm79', date: '2026-07-01T12:00:00', venue: 'v1' }, // Mexico City
  { id: 'm80', date: '2026-07-01T15:00:00', venue: 'v9' }, // Atlanta
  { id: 'm81', date: '2026-07-01T18:00:00', venue: 'v16' }, // SF
  { id: 'm82', date: '2026-07-01T21:00:00', venue: 'v15' }, // Seattle
  { id: 'm83', date: '2026-07-02T12:00:00', venue: 'v3' }, // Toronto
  { id: 'm84', date: '2026-07-02T15:00:00', venue: 'v2' }, // LA
  { id: 'm85', date: '2026-07-03T12:00:00', venue: 'v4' }, // Vancouver
  { id: 'm86', date: '2026-07-03T15:00:00', venue: 'v10' }, // Miami
  { id: 'm87', date: '2026-07-03T18:00:00', venue: 'v14' }, // KC
  { id: 'm88', date: '2026-07-03T21:00:00', venue: 'v8' }, // Dallas
];

r32Matches.forEach(m => {
  matches.push({
    id: m.id,
    date: new Date(m.date).toISOString(),
    stage: 'Round of 32',
    homeTeamId: 'TBD',
    awayTeamId: 'TBD',
    venueId: m.venue,
    status: 'scheduled'
  });
});

// Round of 16 (July 4 - July 7)
const r16Matches = [
  { id: 'm89', date: '2026-07-04T12:00:00', venue: 'v12' }, // Philly
  { id: 'm90', date: '2026-07-04T15:00:00', venue: 'v13' }, // Houston
  { id: 'm91', date: '2026-07-05T12:00:00', venue: 'v7' }, // NY/NJ
  { id: 'm92', date: '2026-07-05T15:00:00', venue: 'v1' }, // Mexico City
  { id: 'm93', date: '2026-07-06T15:00:00', venue: 'v8' }, // Dallas
  { id: 'm94', date: '2026-07-06T18:00:00', venue: 'v15' }, // Seattle
  { id: 'm95', date: '2026-07-07T15:00:00', venue: 'v9' }, // Atlanta
  { id: 'm96', date: '2026-07-07T18:00:00', venue: 'v4' }, // Vancouver
];

r16Matches.forEach(m => {
  matches.push({
    id: m.id,
    date: new Date(m.date).toISOString(),
    stage: 'Round of 16',
    homeTeamId: 'TBD',
    awayTeamId: 'TBD',
    venueId: m.venue,
    status: 'scheduled'
  });
});

// Quarter-finals (July 9 - 11)
const qfMatches = [
  { id: 'm97', date: '2026-07-09T15:00:00', venue: 'v11' }, // Boston
  { id: 'm98', date: '2026-07-10T15:00:00', venue: 'v2' }, // LA
  { id: 'm99', date: '2026-07-11T15:00:00', venue: 'v10' }, // Miami
  { id: 'm100', date: '2026-07-11T18:00:00', venue: 'v14' }, // KC
];

qfMatches.forEach(m => {
  matches.push({
    id: m.id,
    date: new Date(m.date).toISOString(),
    stage: 'Quarter-finals',
    homeTeamId: 'TBD',
    awayTeamId: 'TBD',
    venueId: m.venue,
    status: 'scheduled'
  });
});

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
