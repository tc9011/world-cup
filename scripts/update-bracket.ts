import fs from 'fs';
import path from 'path';

interface Match {
  id: string;
  date: string;
  group?: string;
  stage: string;
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  homePenaltyScore: number | null;
  awayPenaltyScore: number | null;
}

interface TeamStats {
  id: string;
  group: string;
  points: number;
  goalDiff: number;
  goalsFor: number;
  matchesPlayed: number;
  won: number;
  drawn: number;
  lost: number;
  goalsAgainst: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const MATCHES_FILE = path.join(DATA_DIR, 'matches.json');
const BACKUP_FILE = path.join(DATA_DIR, 'matches.backup.json');

async function main() {
  console.log('Reading matches...');
  const matchesRaw = fs.readFileSync(MATCHES_FILE, 'utf-8');
  const matches: Match[] = JSON.parse(matchesRaw);

  let statusUpdates = 0;
  matches.forEach(m => {
    if (m.status !== 'finished' && m.homeScore !== null && m.awayScore !== null) {
      m.status = 'finished';
      statusUpdates++;
    }
  });
  if (statusUpdates > 0) {
    console.log(`Auto-updated ${statusUpdates} matches to 'finished' status`);
  }

  fs.writeFileSync(BACKUP_FILE, matchesRaw);
  console.log(`Backup created at ${BACKUP_FILE}`);

  const teams: Record<string, TeamStats> = {};
  const groups: Record<string, string[]> = {};
  const groupStatus: Record<string, boolean> = {};

  const groupMatches = matches.filter(m => m.stage === 'Group Stage');
  
  groupMatches.forEach(m => {
    if (!m.group) return;
    
    if (groupStatus[m.group] === undefined) {
      groupStatus[m.group] = true;
    }
    if (m.status !== 'finished') {
      groupStatus[m.group] = false;
    }

    [m.homeTeamId, m.awayTeamId].forEach(tid => {
      if (tid.startsWith('TBD')) return;
      
      if (!teams[tid]) {
        teams[tid] = {
          id: tid,
          group: m.group!,
          points: 0,
          goalDiff: 0,
          goalsFor: 0,
          matchesPlayed: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsAgainst: 0
        };
      }
      if (!groups[m.group!]) groups[m.group!] = [];
      if (!groups[m.group!].includes(tid)) groups[m.group!].push(tid);
    });

    if (m.status === 'finished' && m.homeScore !== null && m.awayScore !== null) {
      updateTeamStats(teams[m.homeTeamId], m.homeScore, m.awayScore);
      updateTeamStats(teams[m.awayTeamId], m.awayScore, m.homeScore);
    }
  });

  const groupRankings: Record<string, TeamStats[]> = {};
  const thirdPlaceTeams: TeamStats[] = [];

  Object.keys(groups).forEach(group => {
    const groupTeams = groups[group].map(tid => teams[tid]);
    
    groupTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return 0;
    });
    
    groupRankings[group] = groupTeams;
    if (groupTeams.length >= 3) {
      thirdPlaceTeams.push(groupTeams[2]);
    }
  });

  thirdPlaceTeams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0; 
  });
  
  const qualifiedThirds = thirdPlaceTeams.slice(0, 8);
  const qualifiedThirdGroups = qualifiedThirds.map(t => t.group).sort();
  console.log('Qualified 3rd Place Groups:', qualifiedThirdGroups.join(''));

  const teamMapping: Record<string, string> = {};
  const allGroupsFinished = Object.values(groupStatus).every(status => status);

  Object.keys(groupRankings).forEach(group => {
    if (groupStatus[group]) {
      const ranking = groupRankings[group];
      if (ranking[0]) teamMapping[`1${group}`] = ranking[0].id;
      if (ranking[1]) teamMapping[`2${group}`] = ranking[1].id;
    }
  });

  const thirdPool = [...qualifiedThirds];
  
  if (allGroupsFinished) {
    const r32Matches = matches.filter(m => m.stage === 'Round of 32');
    const thirdPlaceholders = r32Matches
      .flatMap(m => [m.homeTeamId, m.awayTeamId])
      .filter(id => id.startsWith('3') && id.length > 2)
      .map(id => ({
        id,
        allowedGroups: id.substring(1).split('')
      }));

    const usedThirds = new Set<string>();
    
    thirdPlaceholders.forEach(ph => {
      const candidate = thirdPool.find(t => 
        !usedThirds.has(t.id) && ph.allowedGroups.includes(t.group)
      );
      
      if (candidate) {
        teamMapping[ph.id] = candidate.id;
        usedThirds.add(candidate.id);
      } else {
        console.warn(`Could not find a 3rd place team for ${ph.id}`);
      }
    });
  } else {
    console.log('Group stage not fully complete. Skipping 3rd place assignments.');
  }

  let changes = 0;
  
  matches.forEach(m => {
    if (m.stage === 'Group Stage') return;
    
    if (teamMapping[m.homeTeamId]) {
      m.homeTeamId = teamMapping[m.homeTeamId];
      changes++;
    }
    if (teamMapping[m.awayTeamId]) {
      m.awayTeamId = teamMapping[m.awayTeamId];
      changes++;
    }
  });

  const rounds = ['Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Third place', 'Final'];
  
  rounds.forEach(stage => {
    const stageMatches = matches.filter(m => m.stage === stage);
    stageMatches.forEach(m => {
      if (m.status === 'finished') {
        const winnerId = getWinner(m);
        const loserId = getLoser(m);
        if (winnerId) {
          const nextMatchId = `W${m.id.replace('m', '')}`;
          matches.forEach(nextM => {
            if (nextM.homeTeamId === nextMatchId) nextM.homeTeamId = winnerId;
            if (nextM.awayTeamId === nextMatchId) nextM.awayTeamId = winnerId;
          });
        }
        if (loserId) {
            const nextMatchId = `L${m.id.replace('m', '')}`;
            matches.forEach(nextM => {
                if (nextM.homeTeamId === nextMatchId) nextM.homeTeamId = loserId;
                if (nextM.awayTeamId === nextMatchId) nextM.awayTeamId = loserId;
            });
        }
      }
    });
  });

  fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));
  console.log(`Updated matches.json. ${changes} placeholders resolved.`);
}

function updateTeamStats(stats: TeamStats, goalsFor: number, goalsAgainst: number) {
  stats.matchesPlayed++;
  stats.goalsFor += goalsFor;
  stats.goalsAgainst += goalsAgainst;
  stats.goalDiff = stats.goalsFor - stats.goalsAgainst;
  
  if (goalsFor > goalsAgainst) {
    stats.won++;
    stats.points += 3;
  } else if (goalsFor === goalsAgainst) {
    stats.drawn++;
    stats.points += 1;
  } else {
    stats.lost++;
  }
}

function getWinner(m: Match): string | null {
  if (m.homeScore === null || m.awayScore === null) return null;
  if (m.homeScore > m.awayScore) return m.homeTeamId;
  if (m.awayScore > m.homeScore) return m.awayTeamId;
  if (m.homePenaltyScore !== null && m.awayPenaltyScore !== null) {
    return m.homePenaltyScore > m.awayPenaltyScore ? m.homeTeamId : m.awayTeamId;
  }
  return null;
}

function getLoser(m: Match): string | null {
    if (m.homeScore === null || m.awayScore === null) return null;
    if (m.homeScore < m.awayScore) return m.homeTeamId;
    if (m.awayScore < m.homeScore) return m.awayTeamId;
    if (m.homePenaltyScore !== null && m.awayPenaltyScore !== null) {
      return m.homePenaltyScore < m.awayPenaltyScore ? m.homeTeamId : m.awayTeamId;
    }
    return null;
  }

main().catch(console.error);
