import { Team, Venue, Match } from '../types';
import venuesData from './venues.json';
import teamsData from './teams.json';
import matchesData from './matches.json';

export const venues: Venue[] = venuesData as Venue[];
export const teams: Team[] = teamsData as Team[];
export const matches: Match[] = matchesData as Match[];
