# 2026 World Cup Guide - Project Documentation

## 1. Project Overview
A comprehensive, interactive guide for the 2026 FIFA World Cup (United States, Mexico, Canada). The application provides multiple views to explore the match schedule, team standings, and knockout brackets, featuring a modern, responsive design with internationalization support.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (with custom "Glassmorphism" theme)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Language**: TypeScript

## 3. Project Structure
```
/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles, Tailwind theme, CSS variables
│   ├── layout.tsx          # Root layout, Font setup (Geist)
│   ├── page.tsx            # Main application entry, layout composition
│   └── icon.tsx            # Dynamic Favicon generation (ImageResponse)
├── components/             # UI Components
│   ├── BracketView.tsx     # Knockout stage visualization (Tree structure)
│   ├── CalendarView.tsx    # Monthly calendar grid view
│   ├── FilterBar.tsx       # Group selection filter
│   ├── ScheduleMatrix.tsx  # Venue x Date matrix view (List View)
│   ├── StandingsView.tsx   # Group stage tables
│   ├── TeamSelector.tsx    # Team filtering dropdown
│   ├── ViewSwitcher.tsx    # Navigation between different views
│   └── LanguageSwitcher.tsx # EN/ZH toggle
├── data/                   # Static Data
│   ├── worldCupData.ts     # Teams, Venues, Matches (48 teams, 104 matches)
│   └── locales.ts          # Translation strings (en, zh)
├── store/                  # State Management
│   └── useStore.ts         # Zustand store (viewMode, filters, language)
└── types/                  # TypeScript Definitions
    └── index.ts            # Match, Team, Venue interfaces
```

## 4. Key Features & Requirements

### 4.1. Views
- **List View (Schedule Matrix)**:
  - Displays matches in a matrix format: Venues (Rows) x Dates (Columns).
  - Grouped by Region (Western, Central, Eastern).
  - Sticky headers for easy navigation.
- **Calendar View**:
  - Traditional monthly calendar layout (June & July 2026).
  - Shows matches per day with time, teams, and venue location.
- **Bracket View**:
  - Visualizes the knockout stage from Round of 32 to the Final.
  - Shows match pairings, dates, and venue locations.
  - Highlighted path for the Final match.
- **Standings View**:
  - Tables for all 12 Groups (A-L).
  - Calculates and displays: Played, Won, Drawn, Lost, GF, GA, GD, Points.

### 4.2. Functionality
- **Filtering**:
  - **By Team**: Select a specific team to highlight/filter their matches.
  - **By Group**: Filter the schedule or standings by specific groups (A-L).
- **Internationalization (i18n)**:
  - Full support for English and Chinese (Simplified).
  - Translates UI elements, team names, city names, and date formats.
- **Responsive Design**:
  - Mobile-optimized with horizontal scrolling for complex tables.
  - Adaptive layouts for header and controls.

### 4.3. Design & UI
- **Theme**: "World Cup Atmosphere"
  - **Glassmorphism**: Semi-transparent backgrounds with blur effects (`backdrop-blur`).
  - **Color Palette**: Blue/Cyan/Teal gradients representing the host branding.
  - **Dark Mode**: Fully supported via Tailwind's `dark:` modifiers.
- **Visual Polish**:
  - Radial gradient backgrounds.
  - Hover effects on match cards and rows.
  - Dynamic Favicon (🏆).

## 5. Data Model
- **Teams**: 48 teams, categorized by Group (A-L).
- **Venues**: 16 Host Cities across US, Canada, Mexico.
- **Matches**: 104 matches total.
  - Group Stage
  - Round of 32
  - Round of 16
  - Quarter-finals
  - Semi-finals
  - Third Place
  - Final

## 6. Recent Updates
- **Architecture**: Refactored Header layout to separate View Switcher and Team Selector.
- **Features**: Added Venue location to Calendar and Bracket views.
- **UI**: Implemented global "Glass" theme and updated Favicon.
