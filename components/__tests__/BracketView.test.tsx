import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BracketView } from '../BracketView';
import { Match } from '../../types';

vi.mock('../../store/useStore', () => ({
  useStore: () => ({
    language: 'en',
    timezoneMode: 'local',
  }),
}));

vi.mock('../../data/worldCupData', () => ({
  teams: [
    { id: 'PAR', name: 'Paraguay', code: 'PAR', flag: '🇵🇾' },
    { id: 'FRA', name: 'France', code: 'FRA', flag: '🇫🇷' },
    { id: 'CAN', name: 'Canada', code: 'CAN', flag: '🇨🇦' },
    { id: 'MAR', name: 'Morocco', code: 'MAR', flag: '🇲🇦' },
    { id: 'BRA', name: 'Brazil', code: 'BRA', flag: '🇧🇷' },
    { id: 'NOR', name: 'Norway', code: 'NOR', flag: '🇳🇴' },
    { id: 'MEX', name: 'Mexico', code: 'MEX', flag: '🇲🇽' },
    { id: 'ENG', name: 'England', code: 'ENG', flag: '🏴' },
    { id: 'POR', name: 'Portugal', code: 'POR', flag: '🇵🇹' },
    { id: 'ESP', name: 'Spain', code: 'ESP', flag: '🇪🇸' },
    { id: 'USA', name: 'United States', code: 'USA', flag: '🇺🇸' },
    { id: 'BEL', name: 'Belgium', code: 'BEL', flag: '🇧🇪' },
    { id: 'ARG', name: 'Argentina', code: 'ARG', flag: '🇦🇷' },
    { id: 'EGY', name: 'Egypt', code: 'EGY', flag: '🇪🇬' },
    { id: 'SUI', name: 'Switzerland', code: 'SUI', flag: '🇨🇭' },
    { id: 'COL', name: 'Colombia', code: 'COL', flag: '🇨🇴' },
    { id: 'GER', name: 'Germany', code: 'GER', flag: '🇩🇪' },
    { id: 'NED', name: 'Netherlands', code: 'NED', flag: '🇳🇱' },
    { id: 'JPN', name: 'Japan', code: 'JPN', flag: '🇯🇵' },
    { id: 'CIV', name: 'Ivory Coast', code: 'CIV', flag: '🇨🇮' },
    { id: 'ECU', name: 'Ecuador', code: 'ECU', flag: '🇪🇨' },
    { id: 'AUS', name: 'Australia', code: 'AUS', flag: '🇦🇺' },
    { id: 'RSA', name: 'South Africa', code: 'RSA', flag: '🇿🇦' },
    { id: 'SWE', name: 'Sweden', code: 'SWE', flag: '🇸🇪' },
    { id: 'BIH', name: 'Bosnia and Herzegovina', code: 'BIH', flag: '🇧🇦' },
    { id: 'SEN', name: 'Senegal', code: 'SEN', flag: '🇸🇳' },
    { id: 'CRO', name: 'Croatia', code: 'CRO', flag: '🇭🇷' },
    { id: 'AUT', name: 'Austria', code: 'AUT', flag: '🇦🇹' },
    { id: 'ALG', name: 'Algeria', code: 'ALG', flag: '🇩🇿' },
    { id: 'CPV', name: 'Cape Verde', code: 'CPV', flag: '🇨🇻' },
    { id: 'GHA', name: 'Ghana', code: 'GHA', flag: '🇬🇭' },
    { id: 'COD', name: 'DR Congo', code: 'COD', flag: '🇨🇩' },
  ],
  venues: [{ id: 'v1', name: 'Venue', city: 'City', timezone: 'UTC' }],
}));

vi.mock('../../data/locales', () => ({
  translations: {
    en: {
      tbd: 'TBD',
      bracket: {
        winnerOf: 'Winner of {round} Match {matchNumber}',
        loserOf: 'Loser of {round} Match {matchNumber}',
      },
      stages: {
        'Round of 32': 'Round of 32',
        'Round of 16': 'Round of 16',
        'Quarter-finals': 'Quarter-finals',
        'Semi-finals': 'Semi-finals',
        'Third place': 'Third place',
        Final: 'Final',
      },
    },
  },
  teamNames: {},
  cityNames: {},
}));

const makeMatch = (
  id: string,
  stage: Match['stage'],
  homeTeamId: string,
  awayTeamId: string,
  status: Match['status'] = 'scheduled',
  homeScore: number | null = null,
  awayScore: number | null = null,
  homePenaltyScore: number | null = null,
  awayPenaltyScore: number | null = null,
): Match => ({
  id,
  stage,
  homeTeamId,
  awayTeamId,
  status,
  homeScore,
  awayScore,
  homePenaltyScore,
  awayPenaltyScore,
  date: '2026-07-01T20:00:00Z',
  venueId: 'v1',
});

const knockoutMatches: Match[] = [
  makeMatch('m73', 'Round of 32', 'RSA', 'CAN', 'finished', 0, 1),
  makeMatch('m74', 'Round of 32', 'GER', 'PAR', 'finished', 1, 1, 3, 4),
  makeMatch('m75', 'Round of 32', 'NED', 'MAR', 'finished', 1, 1, 2, 3),
  makeMatch('m76', 'Round of 32', 'BRA', 'JPN', 'finished', 2, 1),
  makeMatch('m77', 'Round of 32', 'FRA', 'SWE', 'finished', 3, 0),
  makeMatch('m78', 'Round of 32', 'CIV', 'NOR', 'finished', 1, 2),
  makeMatch('m79', 'Round of 32', 'MEX', 'ECU', 'finished', 2, 0),
  makeMatch('m80', 'Round of 32', 'AUS', 'EGY', 'finished', 1, 1, 2, 4),
  makeMatch('m81', 'Round of 32', 'USA', 'BIH', 'finished', 2, 0),
  makeMatch('m82', 'Round of 32', 'BEL', 'SEN', 'finished', 3, 2),
  makeMatch('m83', 'Round of 32', 'POR', 'CRO', 'finished', 2, 1),
  makeMatch('m84', 'Round of 32', 'ESP', 'AUT', 'finished', 3, 0),
  makeMatch('m85', 'Round of 32', 'SUI', 'ALG', 'finished', 2, 0),
  makeMatch('m86', 'Round of 32', 'ARG', 'CPV', 'finished', 3, 2),
  makeMatch('m87', 'Round of 32', 'COL', 'GHA', 'finished', 1, 0),
  makeMatch('m88', 'Round of 32', 'ENG', 'COD', 'finished', 2, 1),
  makeMatch('m89', 'Round of 16', 'PAR', 'FRA', 'finished', 0, 1),
  makeMatch('m90', 'Round of 16', 'CAN', 'MAR', 'finished', 0, 3),
  makeMatch('m91', 'Round of 16', 'BRA', 'NOR', 'finished', 1, 2),
  makeMatch('m92', 'Round of 16', 'MEX', 'ENG'),
  makeMatch('m93', 'Round of 16', 'POR', 'ESP'),
  makeMatch('m94', 'Round of 16', 'USA', 'BEL'),
  makeMatch('m95', 'Round of 16', 'ARG', 'EGY'),
  makeMatch('m96', 'Round of 16', 'SUI', 'COL'),
  makeMatch('m97', 'Quarter-finals', 'FRA', 'MAR'),
  makeMatch('m98', 'Quarter-finals', 'W93', 'W94'),
  makeMatch('m99', 'Quarter-finals', 'NOR', 'W92'),
  makeMatch('m100', 'Quarter-finals', 'W95', 'W96'),
  makeMatch('m101', 'Semi-finals', 'W97', 'W98'),
  makeMatch('m102', 'Semi-finals', 'W99', 'W100'),
  makeMatch('m103', 'Third place', 'L101', 'L102'),
  makeMatch('m104', 'Final', 'W101', 'W102'),
];

describe('BracketView', () => {
  it('orders the left desktop half by feeder topology, not by array index', () => {
    const { container } = render(<BracketView matches={knockoutMatches} />);

    const leftDesktop = container.querySelector('[data-testid="desktop-left-bracket"]');
    expect(leftDesktop).toBeInTheDocument();

    const text = leftDesktop?.textContent ?? '';
    expect(text.indexOf('M74')).toBeLessThan(text.indexOf('M77'));
    expect(text.indexOf('M77')).toBeLessThan(text.indexOf('M73'));
    expect(text.indexOf('M73')).toBeLessThan(text.indexOf('M75'));
    expect(text.indexOf('M89')).toBeLessThan(text.indexOf('M90'));
    expect(text.indexOf('M90')).toBeLessThan(text.indexOf('M93'));
    expect(text.indexOf('M93')).toBeLessThan(text.indexOf('M94'));
    expect(text).not.toContain('M91');
  });

  it('renders derived gray winner placeholders for unresolved feeder references', () => {
    render(<BracketView matches={knockoutMatches} />);

    expect(screen.getAllByText('Winner of Quarter-finals Match 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Winner of Semi-finals Match 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Loser of Semi-finals Match 1').length).toBeGreaterThan(0);
  });

  it('does not use hardcoded desktop gap or padding magic classes', () => {
    const { container } = render(<BracketView matches={knockoutMatches} />);

    expect(container.innerHTML).not.toContain('gap-22');
    expect(container.innerHTML).not.toContain('gap-62');
    expect(container.innerHTML).not.toContain('pt-15');
    expect(container.innerHTML).not.toContain('pt-42');
    expect(container.innerHTML).not.toContain('pt-86');
  });

  it('renders straight orthogonal connector paths without bezier curves', async () => {
    const { container } = render(<BracketView matches={knockoutMatches} />);

    await waitFor(() => expect(container.querySelector('[data-connector-path="true"]')).toBeInTheDocument());

    const pathData = Array.from(container.querySelectorAll('[data-connector-path="true"]')).map(path => path.getAttribute('d') ?? '');
    expect(pathData.length).toBeGreaterThan(0);
    expect(pathData.every(d => d.includes(' H ') && d.includes(' V ') && !d.includes(' C '))).toBe(true);
  });

  it('renders a mobile funnel instead of a flat round list', () => {
    const { container } = render(<BracketView matches={knockoutMatches} />);

    expect(container.querySelector('[data-testid="mobile-top-half-funnel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="mobile-bottom-half-funnel"]')).toBeInTheDocument();
  });

  it('renders two compact mobile half-funnels with R32 split into two rows of four', () => {
    const { container } = render(<BracketView matches={knockoutMatches} />);

    const topHalf = container.querySelector('[data-testid="mobile-top-half-funnel"]');
    const bottomHalf = container.querySelector('[data-testid="mobile-bottom-half-funnel"]');

    expect(topHalf).toBeInTheDocument();
    expect(bottomHalf).toBeInTheDocument();
    expect(container.querySelector('[data-testid="mobile-funnel-bracket"]')).not.toBeInTheDocument();

    const topRows = Array.from(topHalf?.querySelectorAll('[data-mobile-half-row]') ?? []).map(row => row.textContent ?? '');
    expect(topRows).toHaveLength(5);
    expect(topRows[0]).toContain('M74');
    expect(topRows[0]).toContain('M73');
    expect(topRows[0]).toContain('M83');
    expect(topRows[0]).toContain('M81');
    expect(topRows[1]).toContain('M77');
    expect(topRows[1]).toContain('M75');
    expect(topRows[1]).toContain('M84');
    expect(topRows[1]).toContain('M82');
    expect(topRows[2]).toContain('M89');
    expect(topRows[2]).toContain('M90');
    expect(topRows[2]).toContain('M93');
    expect(topRows[2]).toContain('M94');
    expect(topRows[3]).toContain('M97');
    expect(topRows[3]).toContain('M98');
    expect(topRows[4]).toContain('M101');
  });

  it('renders the mobile bottom half as the vertical mirror of the top half', () => {
    const { container } = render(<BracketView matches={knockoutMatches} />);

    const bottomHalf = container.querySelector('[data-testid="mobile-bottom-half-funnel"]');
    const bottomRows = Array.from(bottomHalf?.querySelectorAll('[data-mobile-half-row]') ?? []).map(row => row.textContent ?? '');

    expect(bottomRows).toHaveLength(5);
    expect(bottomRows[0]).toContain('M102');
    expect(bottomRows[1]).toContain('M99');
    expect(bottomRows[1]).toContain('M100');
    expect(bottomRows[2]).toContain('M91');
    expect(bottomRows[2]).toContain('M92');
    expect(bottomRows[2]).toContain('M95');
    expect(bottomRows[2]).toContain('M96');
    expect(bottomRows[3]).toContain('M76');
    expect(bottomRows[3]).toContain('M79');
    expect(bottomRows[3]).toContain('M86');
    expect(bottomRows[3]).toContain('M85');
    expect(bottomRows[4]).toContain('M78');
    expect(bottomRows[4]).toContain('M88');
    expect(bottomRows[4]).toContain('M80');
    expect(bottomRows[4]).toContain('M87');
  });
});
