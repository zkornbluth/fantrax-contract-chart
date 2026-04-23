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