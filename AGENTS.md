# 2026 World Cup Guide - Agent Instructions

## Quick Reference

### Commands
```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint (eslint-config-next)
pnpm test             # Run all tests (Vitest)
pnpm test <pattern>   # Run single test: pnpm test ExportButton
pnpm update-bracket   # Update bracket data (tsx scripts/update-bracket.ts)
pnpm sync-fotmob      # Sync match scores from FotMob API
```

### Environment
- **Mapbox**: Requires `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` for MapView

---

## Project Overview

Interactive guide for 2026 FIFA World Cup (US/Mexico/Canada). Multiple views (List, Calendar, Map, Bracket, Standings), i18n (en/zh), team theming, timezone handling.

### Tech Stack
- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4 (glassmorphism theme)
- **State**: Zustand (persisted to localStorage)
- **Testing**: Vitest + Testing Library + jsdom
- **Maps**: Mapbox GL JS, React Map GL
- **Icons**: Lucide React
- **Dates**: date-fns

---

## Architecture

```
app/                  # Next.js App Router (all pages are client components)
  layout.tsx          # Root layout, fonts (Geist), ThemeProvider
  page.tsx            # Main app, view routing, filtering logic
  globals.css         # Tailwind v4 config, CSS variables, utilities
components/           # Feature components (18 files)
  __tests__/          # Vitest tests (4 files)
data/                 # Static JSON + loaders
  worldCupData.ts     # Exports: teams, venues, matches
  locales.ts          # translations object (en/zh), teamNames, cityNames
  teamColors.ts       # Team primary/secondary colors for theming
store/
  useStore.ts         # Zustand store (viewMode, filters, theme, i18n)
types/
  index.ts            # Core types: Team, Match, Venue, ViewMode
```

---

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** - no implicit any
- **Path aliases**: Use `@/*` for imports (e.g., `@/types`, `@/store/useStore`)
- **Never suppress errors**: No `as any`, `@ts-ignore`, `@ts-expect-error`
- **Explicit types for component props**: Always define interfaces

```typescript
// Good
interface MatchCardProps {
  match: Match;
}
export const MatchCard: React.FC<MatchCardProps> = ({ match }) => { ... };

// Bad
export const MatchCard = ({ match }: any) => { ... };
```

### React Components
- **Named exports** for components (no default exports except page.tsx)
- **Functional components only** with React.FC type
- **Hooks at top** of component body
- **Client components**: Add `'use client'` directive when using hooks/interactivity

```typescript
'use client';
import React from 'react';
import { useStore } from '@/store/useStore';

export const MyComponent: React.FC = () => {
  const { language } = useStore();
  // ...
};
```

### Imports Order
1. `'use client'` directive (if needed)
2. React imports
3. External libraries (date-fns, clsx, lucide-react)
4. Internal types (`@/types`)
5. Data/store imports (`@/data/*`, `@/store/*`)
6. Components (`@/components/*`)

### Styling (Tailwind CSS v4)
- **CSS variables** for theming: `--primary`, `--accent`, `--background`, `--foreground`
- **Glassmorphism pattern**: `bg-white/80 dark:bg-gray-900/80 backdrop-blur-md`
- **Dark mode**: Use `dark:` variants, toggle via `.dark` class on root
- **Utility classes** defined in globals.css: `.glass-panel`, `.no-scrollbar`
- **clsx** for conditional classes (not classnames)

```typescript
import clsx from 'clsx';

<button className={clsx(
  "px-4 py-2 rounded-full",
  isActive 
    ? "bg-linear-to-r from-primary to-accent text-primary-foreground"
    : "bg-white/50 dark:bg-transparent text-gray-600"
)}>
```

### State Management (Zustand)
- Single store in `store/useStore.ts`
- Access via hook: `const { viewMode, setViewMode } = useStore();`
- Persisted fields: `language`, `timezoneMode`, `themeTeamId`, `themeMode`

### Internationalization
- Translations in `data/locales.ts`
- Access pattern: `const t = translations[language];` then `t.title`
- Always support both `en` and `zh` keys

### Error Handling
- **Never empty catch blocks**
- Log errors for debugging in development
- Provide user-friendly fallbacks

---

## Testing

### Framework: Vitest + Testing Library
- Tests in `components/__tests__/*.test.tsx`
- Setup file: `setupTests.ts` (imports jest-dom matchers)

### Running Tests
```bash
pnpm test                    # All tests
pnpm test ExportButton       # Single file by name
pnpm test --watch            # Watch mode
```

### Test Patterns
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock store
vi.mock('@/store/useStore', () => ({
  useStore: () => ({ language: 'en', timezoneMode: 'local' }),
}));

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('describes expected behavior', async () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Key Patterns

### Timezone Handling
Two modes: `local` (browser) and `venue` (stadium location).
```typescript
const getDisplayDate = (date: Date, venueId: string) => {
  if (timezoneMode === 'local') return date;
  const venue = venues.find(v => v.id === venueId);
  // Use Intl.DateTimeFormat with venue.timezone
};
```

### Team Theming
CSS variables updated dynamically via ThemeProvider based on `themeTeamId`.

### View Routing
No React Router - controlled via `viewMode` state in Zustand.

---

## Data Types

```typescript
interface Team {
  id: string; name: string; code: string; flag: string; group: string;
}

interface Venue {
  id: string; name: string; city: string; timezone: string;
  region: 'Western' | 'Central' | 'Eastern';
  coordinates?: { lat: number; lng: number };
}

interface Match {
  id: string; date: string; stage: MatchStage;
  homeTeamId: string; awayTeamId: string; venueId: string;
  group?: string; homeScore?: number; awayScore?: number;
  status: 'scheduled' | 'live' | 'finished';
}

type ViewMode = 'list' | 'calendar' | 'bracket' | 'standings' | 'map';
```

---

## Common Tasks

### Add New Component
1. Create `components/NewComponent.tsx`
2. Use named export with `React.FC<Props>` type
3. Import store/data as needed
4. Add test in `components/__tests__/NewComponent.test.tsx`

### Add Translation
1. Edit `data/locales.ts`
2. Add key to both `en` and `zh` objects
3. Access via `translations[language].newKey`

### Add New Match Stage
1. Update `types/index.ts` - add to `stage` union type
2. Update `data/locales.ts` - add to `stages` object in both languages

---

## Pre-commit
Husky is configured but no hooks are currently active. ESLint runs via `pnpm lint`.

## Don't
- Commit `.env.local` or secrets
- Use default exports (except `app/page.tsx`)
- Skip TypeScript types
- Use inline styles (use Tailwind)
- Mutate Zustand state directly (use setters)

---

## Mandatory Rules

### Date/Time Handling
- **Always use date-fns** for all date/time operations
- Never use native `Date` methods like `getFullYear()`, `getMonth()`, `setDate()` for formatting or manipulation
- Preferred functions: `format`, `parse`, `isSameDay`, `addDays`, `subDays`, `isWithinInterval`, etc.

```typescript
// Good
import { format, parse, isSameDay, subDays } from 'date-fns';
const formatted = format(date, 'yyyyMMdd');
const yesterday = subDays(today, 1);

// Bad
const year = date.getFullYear();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
```

### Git Commits
- **Never commit without explicit user permission**
- Always wait for user to explicitly request a commit
- Staged changes and diffs should be reviewed by user before committing
