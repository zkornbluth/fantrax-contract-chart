/**
 * @fileoverview Contains helper functions for cap calculations
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import type { ActivePlayer, TeamCapInfo } from '../types';

/**
 * Calculates remaining cap space for a team in a given year.
 * @param selectedTeam - The team whose cap space to calculate
 * @param year - The contract year (2026–2031)
 * @returns Cap ceiling minus total cap hit for that year
 */
export function getCapSpace(selectedTeam: TeamCapInfo, year: number): number {
  let ceiling = selectedTeam.salaryCap;
  return ceiling - getCapHit(selectedTeam, year);
}

/**
 * Calculates the total active payroll for a team in a given year.
 * @param selectedTeam - The team whose payroll to sum
 * @param year - The contract year (2026–2031)
 * @returns Sum of all active player salaries for that year
 */
export function getActivePayroll(selectedTeam: TeamCapInfo, year: number): number {
  return getPositionalSum(selectedTeam.activePlayers, year);
}

/**
 * Calculates the total dead cap obligation for a team in a given year.
 * @param selectedTeam - The team whose dead cap to sum
 * @param year - The contract year (2026–2031)
 * @returns Sum of all dead cap hits for that year
 */
export function getDeadCapSum(selectedTeam: TeamCapInfo, year: number): number {
  let capHit = 0;
  let index = year - 2026;

  if (!selectedTeam.deadCapHits || !Array.isArray(selectedTeam.deadCapHits)) {
    return capHit;
  }

  for (let deadCap of selectedTeam.deadCapHits) {
    if (typeof(deadCap.yearlyCapHit[index]) === "number") {
      capHit += deadCap.yearlyCapHit[index] as number;
    }
  }

  return capHit;
}

/**
 * Calculates the total cap hit (active payroll + dead cap) for a team in a given year.
 * @param selectedTeam - The team whose cap hit to calculate
 * @param year - The contract year (2026–2031)
 * @returns Total cap hit for that year
 */
export function getCapHit(selectedTeam: TeamCapInfo, year: number): number {
  return getActivePayroll(selectedTeam, year) + getDeadCapSum(selectedTeam, year);
}

/**
 * Counts non-injured players on a team's active roster (majors + minors).
 * @param selectedTeam - The team whose roster to count
 * @returns Number of active players not marked as injured
 */
export function getRosterCount(selectedTeam: TeamCapInfo): number {
  if (!selectedTeam.activePlayers || !Array.isArray(selectedTeam.activePlayers)) {
    return 0;
  }
  return selectedTeam.activePlayers.filter(player => !player.injured).length;
}

/**
 * Counts non-injured major league players on a team's active roster.
 * @param selectedTeam - The team whose roster to count
 * @returns Number of active players not in the minors and not injured
 */
export function getMajorLeagueCount(selectedTeam: TeamCapInfo): number {
  if (!selectedTeam.activePlayers || !Array.isArray(selectedTeam.activePlayers)) {
    return 0;
  }
  return selectedTeam.activePlayers.filter(player => !player.minors && !player.injured).length;
}

/**
 * Counts minor league players on a team's active roster.
 * @param selectedTeam - The team whose roster to count
 * @returns Number of active players marked as minors
 */
export function getMinorLeagueCount(selectedTeam: TeamCapInfo): number {
  if (!selectedTeam.activePlayers || !Array.isArray(selectedTeam.activePlayers)) {
    return 0;
  }
  return selectedTeam.activePlayers.filter(player => player.minors).length;
}

/**
 * Counts injured players on a team's active roster.
 * @param selectedTeam - The team whose roster to count
 * @returns Number of active players marked as injured
 */
export function getInjuredCount(selectedTeam: TeamCapInfo): number {
  if (!selectedTeam.activePlayers || !Array.isArray(selectedTeam.activePlayers)) {
    return 0;
  }
  return selectedTeam.activePlayers.filter(player => player.injured).length;
}

/**
 * Derives a player's primary position from their full eligibility string.
 * SP+RP eligible pitchers are treated as relievers; batters with multiple eligible
 * positions (even including incidental RP eligibility) use the first listed position.
 * @param posStr - Comma-separated position eligibility string
 * @returns The primary position abbreviation, or '' if none
 */
export function getPrimaryPosition(posStr: string | undefined): string {
  if (!posStr || !posStr.trim()) return '';
  const posList = posStr.split(',').map(p => p.trim()).filter(Boolean);
  if (posList.length === 1) return posList[0];
  if (posList[0] === 'SP') return posList[posList.length - 1]; // reliever: use RP
  return posList[0]; // batter with multiple: use first
}

/**
 * Maps a player's position eligibility string to a display position group.
 * @param posStr - Comma-separated position eligibility string
 * @returns One of the position group names, or 'Unknown' if unrecognized
 */
export function getPosGroup(posStr: string | undefined): string {
  const primary = getPrimaryPosition(posStr);
  switch (primary) {
    case 'SP': return 'Starting Pitcher';
    case 'RP': return 'Relief Pitcher';
    case 'C': return 'Catcher';
    case '1B':
    case '2B':
    case 'SS':
    case '3B': return 'Infielder';
    case 'OF':
    case 'LF':
    case 'CF':
    case 'RF': return 'Outfielder';
    case 'UT':
    case 'DH': return 'Designated Hitter';
    default: return 'Unknown';
  }
}

/**
 * Calculates the total salary for a group of players in a given year.
 * Position filtering is the caller's responsibility; `getActivePayroll` passes all players.
 * @param players - The players whose salaries to sum
 * @param year - The contract year (2026–2031)
 * @returns Sum of all numeric salary values for that year
 */
export function getPositionalSum(players: ActivePlayer[], year: number): number {
  let sum = 0;
  let index = year - 2026;

  if (!players || !Array.isArray(players)) {
    return sum;
  }

  for (let player of players) {
    if (typeof(player.yearlyContract[index]) === "number") {
      sum += player.yearlyContract[index] as number;
    }
  }

  return sum;
}