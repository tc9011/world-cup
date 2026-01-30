import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  formatDate,
  parseDate,
  isSameDay,
  createReverseFotMobMapping,
  findMatchingLocalMatch,
  WORLD_CUP_LEAGUE_ID,
  type Match,
  type FotMobMatch,
  type FotMobMappingFile,
} from '../sync-fotmob';

describe('sync-fotmob utilities', () => {
  describe('formatDate', () => {
    it('formats date as YYYYMMDD', () => {
      const date = new Date(2026, 5, 11); // June 11, 2026
      expect(formatDate(date)).toBe('20260611');
    });

    it('pads single digit month and day', () => {
      const date = new Date(2026, 0, 5); // January 5, 2026
      expect(formatDate(date)).toBe('20260105');
    });

    it('handles December correctly', () => {
      const date = new Date(2026, 11, 25); // December 25, 2026
      expect(formatDate(date)).toBe('20261225');
    });
  });

  describe('parseDate', () => {
    it('parses YYYYMMDD string to Date', () => {
      const result = parseDate('20260611');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(5); // June (0-indexed)
      expect(result.getDate()).toBe(11);
    });

    it('parses World Cup final date', () => {
      const result = parseDate('20260719');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(19);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day', () => {
      const date1 = new Date(2026, 5, 11, 10, 0);
      const date2 = new Date(2026, 5, 11, 22, 30);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date(2026, 5, 11);
      const date2 = new Date(2026, 5, 12);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for different months', () => {
      const date1 = new Date(2026, 5, 11);
      const date2 = new Date(2026, 6, 11);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('returns false for different years', () => {
      const date1 = new Date(2026, 5, 11);
      const date2 = new Date(2027, 5, 11);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });
});

describe('createReverseFotMobMapping', () => {
  it('creates reverse mapping from team ID to our ID', () => {
    const mapping: FotMobMappingFile = {
      leagueId: 77,
      leagueName: 'FIFA World Cup 2026',
      teamIdMapping: {
        'MEX': { fotmobId: 6710, name: 'Mexico' },
        'USA': { fotmobId: 6713, name: 'USA' },
        'BRA': { fotmobId: 8256, name: 'Brazil' },
      },
    };

    const reverse = createReverseFotMobMapping(mapping);

    expect(reverse.get(6710)).toBe('MEX');
    expect(reverse.get(6713)).toBe('USA');
    expect(reverse.get(8256)).toBe('BRA');
    expect(reverse.size).toBe(3);
  });

  it('handles empty mapping', () => {
    const mapping: FotMobMappingFile = {
      leagueId: 77,
      leagueName: 'FIFA World Cup 2026',
      teamIdMapping: {},
    };

    const reverse = createReverseFotMobMapping(mapping);
    expect(reverse.size).toBe(0);
  });
});

describe('findMatchingLocalMatch', () => {
  const reverseMapping = new Map<number, string>([
    [6710, 'MEX'],
    [6316, 'RSA'],
    [6713, 'USA'],
    [6724, 'PAR'],
  ]);

  const localMatches: Match[] = [
    {
      id: 'm1',
      date: '2026-06-11T19:00:00Z',
      group: 'A',
      stage: 'Group Stage',
      homeTeamId: 'MEX',
      awayTeamId: 'RSA',
      venueId: 'v1',
      status: 'scheduled',
      homeScore: null,
      awayScore: null,
      homePenaltyScore: null,
      awayPenaltyScore: null,
    },
    {
      id: 'm4',
      date: '2026-06-13T01:00:00Z',
      group: 'D',
      stage: 'Group Stage',
      homeTeamId: 'USA',
      awayTeamId: 'PAR',
      venueId: 'v2',
      status: 'scheduled',
      homeScore: null,
      awayScore: null,
      homePenaltyScore: null,
      awayPenaltyScore: null,
    },
  ];

  it('finds match by date and teams', () => {
    const fotmobMatch: FotMobMatch = {
      id: 123456,
      leagueId: 77,
      time: '11.06.2026 19:00',
      home: { id: 6710, score: 2, name: 'Mexico', longName: 'Mexico' },
      away: { id: 6316, score: 1, name: 'South Africa', longName: 'South Africa' },
      status: {
        utcTime: '2026-06-11T19:00:00.000Z',
        finished: true,
        started: true,
        cancelled: false,
        scoreStr: '2 - 1',
      },
      timeTS: 1749668400000,
    };

    const result = findMatchingLocalMatch(fotmobMatch, localMatches, reverseMapping);
    expect(result).toBeDefined();
    expect(result?.id).toBe('m1');
  });

  it('finds match by fotmobMatchId when stored', () => {
    const matchesWithFotmobId: Match[] = [
      {
        ...localMatches[0],
        fotmobMatchId: 999999,
      },
    ];

    const fotmobMatch: FotMobMatch = {
      id: 999999,
      leagueId: 77,
      time: '11.06.2026 19:00',
      home: { id: 6710, score: 2, name: 'Mexico', longName: 'Mexico' },
      away: { id: 6316, score: 1, name: 'South Africa', longName: 'South Africa' },
      status: {
        utcTime: '2026-06-11T19:00:00.000Z',
        finished: true,
        started: true,
        cancelled: false,
      },
      timeTS: 1749668400000,
    };

    const result = findMatchingLocalMatch(fotmobMatch, matchesWithFotmobId, reverseMapping);
    expect(result?.fotmobMatchId).toBe(999999);
  });

  it('handles swapped home/away teams', () => {
    const fotmobMatch: FotMobMatch = {
      id: 123456,
      leagueId: 77,
      time: '11.06.2026 19:00',
      home: { id: 6316, score: 1, name: 'South Africa', longName: 'South Africa' },
      away: { id: 6710, score: 2, name: 'Mexico', longName: 'Mexico' },
      status: {
        utcTime: '2026-06-11T19:00:00.000Z',
        finished: true,
        started: true,
        cancelled: false,
      },
      timeTS: 1749668400000,
    };

    const result = findMatchingLocalMatch(fotmobMatch, localMatches, reverseMapping);
    expect(result).toBeDefined();
    expect(result?.id).toBe('m1');
  });

  it('returns undefined for unknown team', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const fotmobMatch: FotMobMatch = {
      id: 123456,
      leagueId: 77,
      time: '11.06.2026 19:00',
      home: { id: 99999, score: 2, name: 'Unknown', longName: 'Unknown Team' },
      away: { id: 6316, score: 1, name: 'South Africa', longName: 'South Africa' },
      status: {
        utcTime: '2026-06-11T19:00:00.000Z',
        finished: true,
        started: true,
        cancelled: false,
      },
      timeTS: 1749668400000,
    };

    const result = findMatchingLocalMatch(fotmobMatch, localMatches, reverseMapping);
    expect(result).toBeUndefined();
    
    consoleSpy.mockRestore();
  });

  it('returns undefined when no match found for date', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const fotmobMatch: FotMobMatch = {
      id: 123456,
      leagueId: 77,
      time: '15.06.2026 19:00',
      home: { id: 6710, score: 2, name: 'Mexico', longName: 'Mexico' },
      away: { id: 6316, score: 1, name: 'South Africa', longName: 'South Africa' },
      status: {
        utcTime: '2026-06-15T19:00:00.000Z',
        finished: true,
        started: true,
        cancelled: false,
      },
      timeTS: 1750014000000,
    };

    const result = findMatchingLocalMatch(fotmobMatch, localMatches, reverseMapping);
    expect(result).toBeUndefined();
    
    consoleSpy.mockRestore();
  });
});

describe('WORLD_CUP_LEAGUE_ID', () => {
  it('equals 77', () => {
    expect(WORLD_CUP_LEAGUE_ID).toBe(77);
  });
});
