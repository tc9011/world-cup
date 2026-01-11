# 2026 World Cup Bracket Update Script Design
Date: 2026-01-11

## 1. Overview
A script to automatically calculate group standings and propagate knockout stage teams based on match results in `data/matches.json`.

- **Script Location**: `scripts/update-bracket.ts`
- **Execution**: `tsx` (via `pnpm update-bracket`)
- **Data Source**: `data/matches.json`

## 2. Architecture
1. **Read**: Load `matches.json`.
2. **Calculate**: Determine group rankings (FIFA rules).
3. **Qualify**: Identify top 2 per group + 8 best 3rd place.
4. **Map**: Assign specific 3rd place teams to R32 slots using the 48-team assignment grid.
5. **Propagate**: Carry winners forward to subsequent rounds.
6. **Write**: Save updated `matches.json` (with backup).

## 3. Detailed Logic
### Group Ranking (FIFA)
1. Points (3 for win, 1 for draw)
2. Goal Difference
3. Goals Scored
4. Head-to-Head (Points, GD, GF among tied teams)
5. Fair Play (random/manual if needed - simplified to random/alphabetical for script if data missing)

### Third Place Logic
- Rank all 3rd place teams by Points, GD, GF.
- Top 8 advance.
- Use lookup table to map the *set* of qualifying groups (e.g. ACDEFGHJ) to specific match placements.

### Output
- Updates `homeTeamId` and `awayTeamId` for matches with `stage !== 'Group Stage'`.
- Preserves existing scores.

## 4. Implementation Plan
1. Install `tsx`.
2. Update `package.json`.
3. Create `scripts/update-bracket.ts`.
4. Verify with test run.
