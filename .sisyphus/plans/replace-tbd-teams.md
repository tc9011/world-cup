# Replace TBD Placeholder Teams with Confirmed World Cup Teams

## TL;DR

> **Quick Summary**: Replace 6 TBD/play-off placeholder team entries across all data files with the confirmed 2026 World Cup teams (Czechia, Bosnia & Herzegovina, Turkey, Sweden, Iraq, DR Congo).
> 
> **Deliverables**:
> - Updated `data/teams.json` with real team entries
> - Updated `data/matches.json` with correct team IDs
> - Updated `data/fotmob-mapping.json` with new team mappings
> - Updated `data/teamColors.ts` with new team colors
> - Updated `data/locales.ts` with Chinese team names
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: YES - 1 wave (all tasks independent)
> **Critical Path**: All tasks → Build verification

---

## Context

### Original Request
User provided the confirmed 2026 FIFA World Cup group assignments and asked to replace all TBD (待定) placeholder entries with the actual teams.

### TBD Mapping

| TBD ID | New ID | New Code | Group | Team Name (EN) | Team Name (ZH) | Flag |
|--------|--------|----------|-------|----------------|-----------------|------|
| `TBD_D` | `CZE` | `CZE` | A | Czechia | 捷克 | 🇨🇿 |
| `TBD_A` | `BIH` | `BIH` | B | Bosnia and Herzegovina | 波黑 | 🇧🇦 |
| `TBD_C` | `TUR` | `TUR` | D | Turkey | 土耳其 | 🇹🇷 |
| `TBD_B` | `SWE` | `SWE` | F | Sweden | 瑞典 | 🇸🇪 |
| `TBD_2` | `IRQ` | `IRQ` | I | Iraq | 伊拉克 | 🇮🇶 |
| `TBD_1` | `COD` | `COD` | K | DR Congo | 刚果（金） | 🇨🇩 |

---

## Work Objectives

### Core Objective
Replace all 6 TBD placeholder team entries with confirmed teams across every data file in the project.

### Definition of Done
- [ ] `pnpm build` passes with zero errors
- [ ] No remaining `TBD_` references in data files (except backup files)
- [ ] All 48 teams have proper entries in teams.json, teamColors.ts, locales.ts

### Must Have
- Correct FIFA team codes (CZE, BIH, TUR, SWE, IRQ, COD)
- Correct flag emoji for each team
- Chinese translations for all 6 new teams
- Team theme colors for all 6 new teams

### Must NOT Have (Guardrails)
- Do NOT modify knockout stage match references (W74, 1A, 2B etc.)
- Do NOT change match dates, venues, or any other match data
- Do NOT modify `data/matches.backup.json` (keep as historical reference)
- Do NOT change the `scripts/update-bracket.ts` TBD check logic (it handles knockout stage placeholders, not group stage)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (Next.js build)
- **Automated tests**: Build verification only
- **Framework**: `pnpm build` + `pnpm lint`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (All tasks run in parallel — pure data file edits):
├── Task 1: Update teams.json [quick]
├── Task 2: Update matches.json [quick]
├── Task 3: Update fotmob-mapping.json [quick]
├── Task 4: Update teamColors.ts [quick]
└── Task 5: Update locales.ts [quick]

Wave FINAL (After ALL tasks):
└── Task 6: Build verification [quick]
```

### Dependency Matrix
- **1-5**: None — all independent data file edits
- **6**: Depends on 1-5 completing

### Agent Dispatch Summary
- **Wave 1**: **5** — T1-T5 → `quick`
- **Wave FINAL**: **1** — T6 → `quick`

---

## TODOs

- [ ] 1. Update `data/teams.json` — Replace 6 TBD team entries

  **What to do**:
  - Replace `TBD_D` entry (lines 23-29) with: `{ "id": "CZE", "name": "Czechia", "code": "CZE", "flag": "🇨🇿", "group": "A" }`
  - Replace `TBD_A` entry (lines 37-43) with: `{ "id": "BIH", "name": "Bosnia and Herzegovina", "code": "BIH", "flag": "🇧🇦", "group": "B" }`
  - Replace `TBD_C` entry (lines 107-113) with: `{ "id": "TUR", "name": "Turkey", "code": "TUR", "flag": "🇹🇷", "group": "D" }`
  - Replace `TBD_B` entry (lines 156-162) with: `{ "id": "SWE", "name": "Sweden", "code": "SWE", "flag": "🇸🇪", "group": "F" }`
  - Replace `TBD_2` entry (lines 240-246) with: `{ "id": "IRQ", "name": "Iraq", "code": "IRQ", "flag": "🇮🇶", "group": "I" }`
  - Replace `TBD_1` entry (lines 289-295) with: `{ "id": "COD", "name": "DR Congo", "code": "COD", "flag": "🇨🇩", "group": "K" }`

  **Must NOT do**:
  - Do NOT change any other team entries
  - Do NOT change the order of teams in the array

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `data/teams.json` — Current file with TBD entries at lines 23-29, 37-43, 107-113, 156-162, 240-246, 289-295

  **Acceptance Criteria**:
  - [ ] All 6 TBD entries replaced with correct team data
  - [ ] JSON is valid (no syntax errors)
  - [ ] Total of 48 team entries maintained

  **QA Scenarios**:

  ```
  Scenario: All TBD entries replaced
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "TBD" data/teams.json
    Expected Result: 0 matches (no TBD remaining)
    Evidence: .sisyphus/evidence/task-1-no-tbd.txt

  Scenario: JSON validity
    Tool: Bash (node)
    Steps:
      1. Run: node -e "JSON.parse(require('fs').readFileSync('data/teams.json','utf8')); console.log('VALID')"
    Expected Result: Prints "VALID"
    Evidence: .sisyphus/evidence/task-1-json-valid.txt

  Scenario: Correct team count
    Tool: Bash (node)
    Steps:
      1. Run: node -e "const t=JSON.parse(require('fs').readFileSync('data/teams.json','utf8')); console.log(t.length)"
    Expected Result: 48
    Evidence: .sisyphus/evidence/task-1-team-count.txt
  ```

  **Commit**: YES (groups with 2, 3, 4, 5)
  - Message: `data: replace TBD playoff placeholders with confirmed teams`
  - Files: `data/teams.json`, `data/matches.json`, `data/fotmob-mapping.json`, `data/teamColors.ts`, `data/locales.ts`

---

- [ ] 2. Update `data/matches.json` — Replace all TBD team ID references

  **What to do**:
  - Replace all `"TBD_D"` → `"CZE"` (appears in matches: m2, m25, m53)
  - Replace all `"TBD_A"` → `"BIH"` (appears in matches: m3, m26, m52)
  - Replace all `"TBD_C"` → `"TUR"` (appears in matches: m6, m31, m59)
  - Replace all `"TBD_B"` → `"SWE"` (appears in matches: m12, m35, m58)
  - Replace all `"TBD_2"` → `"IRQ"` (appears in matches: m18, m41, m62)
  - Replace all `"TBD_1"` → `"COD"` (appears in matches: m23, m48, m72)

  **Must NOT do**:
  - Do NOT modify knockout stage match references (W74, L101, 1A, 2B, 3ABCD etc.)
  - Do NOT change dates, venues, scores, or status
  - Do NOT modify `data/matches.backup.json`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `data/matches.json` — 18 TBD references across group stage matches (3 per TBD team × 6 teams)

  **Acceptance Criteria**:
  - [ ] All 18 TBD references replaced (6 teams × 3 matches each)
  - [ ] JSON is valid
  - [ ] Knockout stage references unchanged

  **QA Scenarios**:

  ```
  Scenario: No TBD references in group stage matches
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "TBD_" data/matches.json
    Expected Result: 0 matches
    Evidence: .sisyphus/evidence/task-2-no-tbd.txt

  Scenario: Knockout references preserved
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c '"W[0-9]' data/matches.json
    Expected Result: Should be >0 (knockout refs intact)
    Evidence: .sisyphus/evidence/task-2-knockout-intact.txt

  Scenario: JSON validity
    Tool: Bash (node)
    Steps:
      1. Run: node -e "JSON.parse(require('fs').readFileSync('data/matches.json','utf8')); console.log('VALID')"
    Expected Result: Prints "VALID"
    Evidence: .sisyphus/evidence/task-2-json-valid.txt
  ```

  **Commit**: YES (groups with 1, 3, 4, 5)

---

- [ ] 3. Update `data/fotmob-mapping.json` — Replace TBD team mappings

  **What to do**:
  - Replace `"TBD_D": { "fotmobId": 1862057, "name": "European Play-Off D" }` → `"CZE": { "fotmobId": 1862057, "name": "Czechia" }`
  - Replace `"TBD_A": { "fotmobId": 1862054, "name": "European Play-Off A" }` → `"BIH": { "fotmobId": 1862054, "name": "Bosnia and Herzegovina" }`
  - Replace `"TBD_C": { "fotmobId": 1862056, "name": "European Play-Off C" }` → `"TUR": { "fotmobId": 1862056, "name": "Turkey" }`
  - Replace `"TBD_B": { "fotmobId": 1862055, "name": "European Play-Off B" }` → `"SWE": { "fotmobId": 1862055, "name": "Sweden" }`
  - Replace `"TBD_2": { "fotmobId": 1862058, "name": "FIFA Play-Off Tournament 2" }` → `"IRQ": { "fotmobId": 1862058, "name": "Iraq" }`
  - Replace `"TBD_1": { "fotmobId": 1862059, "name": "FIFA Play-Off Tournament 1" }` → `"COD": { "fotmobId": 1862059, "name": "DR Congo" }`

  **Note**: Keep the existing `fotmobId` values — they are the FotMob match tracking IDs and may update once FotMob confirms the actual team IDs. For now, keep them as-is.

  **Must NOT do**:
  - Do NOT change fotmobId values
  - Do NOT change other team mappings

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `data/fotmob-mapping.json` — Lines 8, 12, 20, 28, 40, 48

  **Acceptance Criteria**:
  - [ ] All 6 TBD keys replaced with real team codes
  - [ ] fotmobId values unchanged
  - [ ] JSON is valid

  **QA Scenarios**:

  ```
  Scenario: No TBD keys remaining
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "TBD" data/fotmob-mapping.json
    Expected Result: 0 matches
    Evidence: .sisyphus/evidence/task-3-no-tbd.txt

  Scenario: JSON validity
    Tool: Bash (node)
    Steps:
      1. Run: node -e "JSON.parse(require('fs').readFileSync('data/fotmob-mapping.json','utf8')); console.log('VALID')"
    Expected Result: Prints "VALID"
    Evidence: .sisyphus/evidence/task-3-json-valid.txt
  ```

  **Commit**: YES (groups with 1, 2, 4, 5)

---

- [ ] 4. Update `data/teamColors.ts` — Add 6 new team colors

  **What to do**:
  Add color entries for the 6 new teams. Insert them in the correct position to maintain group order:
  - After `'KOR'` line: `'CZE': { primary: '#11457E', secondary: '#D7141A' }, // Czechia`
  - After `'CAN'` line: `'BIH': { primary: '#002395', secondary: '#FECB00' }, // Bosnia and Herzegovina`
  - After `'AUS'` line: `'TUR': { primary: '#E30A17', secondary: '#FFFFFF' }, // Turkey`
  - After `'JPN'` line: `'SWE': { primary: '#006AA7', secondary: '#FECC02' }, // Sweden`
  - After `'SEN'` line: `'IRQ': { primary: '#007A3D', secondary: '#FFFFFF' }, // Iraq`
  - After `'POR'` line: `'COD': { primary: '#0080FF', secondary: '#CE1021' }, // DR Congo`

  **Must NOT do**:
  - Do NOT change existing team color values
  - Do NOT remove any existing entries

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `data/teamColors.ts` — Current 44-line file with 38 team colors (no TBD entries exist here)
  - Team colors sourced from official FIFA/national team brand colors

  **Acceptance Criteria**:
  - [ ] 6 new color entries added
  - [ ] Total 44 entries in teamColors object (was 38 teams, now 44 = 48 teams minus ~4 that might have been missing... actually verify count)
  - [ ] TypeScript compiles without errors

  **QA Scenarios**:

  ```
  Scenario: New team codes present
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "'CZE'\|'BIH'\|'TUR'\|'SWE'\|'IRQ'\|'COD'" data/teamColors.ts
    Expected Result: 6
    Evidence: .sisyphus/evidence/task-4-new-teams.txt

  Scenario: No syntax errors
    Tool: Bash
    Steps:
      1. Run: npx tsc --noEmit data/teamColors.ts 2>&1 || echo "check via build"
    Expected Result: No errors (or verify via pnpm build in Task 6)
    Evidence: .sisyphus/evidence/task-4-syntax.txt
  ```

  **Commit**: YES (groups with 1, 2, 3, 5)

---

- [ ] 5. Update `data/locales.ts` — Add Chinese names for new teams

  **What to do**:
  - In the `teamNames` record (line 127+), remove `'TBD': '待定'` from the first line
  - Add new team name entries:
    - `'CZE': '捷克'` (add to Group A line with MEX, RSA, KOR)
    - `'BIH': '波黑'` (add to Group B line with CAN, QAT, SUI)
    - `'TUR': '土耳其'` (add to Group D line with USA, PAR, AUS)
    - `'SWE': '瑞典'` (add to Group F line with NED, JPN, TUN)
    - `'IRQ': '伊拉克'` (add to Group I line with FRA, SEN, NOR)
    - `'COD': '刚果（金）'` (add to Group K line with POR, UZB, COL)

  **Must NOT do**:
  - Do NOT change existing Chinese team names
  - Do NOT modify translation strings outside teamNames

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `data/locales.ts:126-139` — teamNames record

  **Acceptance Criteria**:
  - [ ] 6 new Chinese team names added
  - [ ] `'TBD': '待定'` removed
  - [ ] TypeScript compiles without errors

  **QA Scenarios**:

  ```
  Scenario: New team names present
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "'CZE'\|'BIH'\|'TUR'\|'SWE'\|'IRQ'\|'COD'" data/locales.ts
    Expected Result: 6
    Evidence: .sisyphus/evidence/task-5-new-names.txt

  Scenario: TBD removed
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "'TBD'" data/locales.ts
    Expected Result: 0
    Evidence: .sisyphus/evidence/task-5-no-tbd.txt
  ```

  **Commit**: YES (groups with 1, 2, 3, 4)

---

- [ ] 6. Build Verification

  **What to do**:
  - Run `pnpm build` to verify the entire application compiles
  - Run `pnpm lint` to check for any linting issues

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Wave 1)
  - **Blocks**: None
  - **Blocked By**: Tasks 1-5

  **References**:
  - `package.json` — build and lint scripts

  **Acceptance Criteria**:
  - [ ] `pnpm build` exits with code 0
  - [ ] `pnpm lint` exits with code 0

  **QA Scenarios**:

  ```
  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. Run: pnpm build
    Expected Result: Exit code 0, no errors
    Evidence: .sisyphus/evidence/task-6-build.txt

  Scenario: Lint passes
    Tool: Bash
    Steps:
      1. Run: pnpm lint
    Expected Result: Exit code 0, no errors
    Evidence: .sisyphus/evidence/task-6-lint.txt
  ```

  **Commit**: NO

---

## Commit Strategy

- **Single commit after all 5 data tasks**: `data: replace TBD playoff placeholders with confirmed teams (CZE, BIH, TUR, SWE, IRQ, COD)` — teams.json, matches.json, fotmob-mapping.json, teamColors.ts, locales.ts

---

## Success Criteria

### Verification Commands
```bash
# No TBD_ references in data files (except backup)
grep -r "TBD_" data/ --include="*.json" --include="*.ts" | grep -v backup  # Expected: 0 results

# Build passes
pnpm build  # Expected: exit 0

# Lint passes  
pnpm lint   # Expected: exit 0
```

### Final Checklist
- [ ] All 6 TBD teams replaced across all data files
- [ ] No `TBD_` references remain in active data files
- [ ] All 48 teams have entries in teams.json, teamColors.ts, locales.ts
- [ ] Build passes
- [ ] Lint passes
