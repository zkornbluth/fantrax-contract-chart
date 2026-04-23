/**
 * @fileoverview Shared TypeScript type definitions for the Fantrax contract chart
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

export interface ActivePlayer {
  name: string;
  age: number;
  team: string;
  pos: string;
  minors: boolean;
  injured: boolean;
  yearsRemaining: number;
  yearlyContract: (number | string)[];
}

export interface DeadCapHit {
  name: string;
  yearsRemaining: number;
  yearlyCapHit: (number | string)[];
}

export interface TeamCapInfo {
  teamName: string;
  salaryCap: number;
  activePlayers: ActivePlayer[];
  deadCapHits: DeadCapHit[];
}

export interface LeagueCapInfo {
  name: string;
  teams: TeamCapInfo[];
  timestamp: string;
}

export type SortKey = 'default' | 'age' | 'position' | 'team' | 'name';
export type SortDirection = 'asc' | 'desc' | null;
