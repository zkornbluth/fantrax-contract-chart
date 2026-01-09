/** 
 * @fileoverview Contains helper functions for cap calculations
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

export function getCapSpace(selectedTeam, year: number) { // Gets cap space given scraped cap ceiling
  let ceiling = selectedTeam.salaryCap; 
  return ceiling - getCapHit(selectedTeam, year);
}

export function getActivePayroll(selectedTeam, year: number) { // Gets total active payroll for specific year
  return getPositionalSum(selectedTeam.activePlayers, year);
}

export function getDeadCapSum(selectedTeam, year: number) { // Gets total dead cap hits for specific year
  let capHit = 0;
  let index = year - 2026;

  if (!selectedTeam.deadCapHits || !Array.isArray(selectedTeam.deadCapHits)) {
    return capHit;
  }

  for (let deadCap of selectedTeam.deadCapHits) {
    if (typeof(deadCap.yearlyCapHit[index]) === "number") {
      capHit += deadCap.yearlyCapHit[index];
    }
  }

  return capHit;
}

export function getCapHit(selectedTeam, year) {
  return getActivePayroll(selectedTeam, year) + getDeadCapSum(selectedTeam, year);
}

export function getPositionalSum(players, year) { 
  // Get sum of all salaries for group of players and specific year
  // Position determined before calling this
  // getActivePayroll passes in all players
  let sum = 0;
  let index = year - 2026;

  if (!players || !Array.isArray(players)) {
    return sum;
  }

  for (let player of players) {
    if (typeof(player.yearlyContract[index]) === "number") {
      sum += player.yearlyContract[index];
    }
  }

  return sum;
}