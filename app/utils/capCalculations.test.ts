/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import {
  getCapSpace,
  getActivePayroll,
  getDeadCapSum,
  getCapHit,
  getPositionalSum,
} from './capCalculations';

const makePlayer = (yearlyContract: Array<number | null | undefined>) => ({
  yearlyContract,
});

const makeDeadCapEntry = (yearlyCapHit: Array<number | null | undefined>) => ({
  yearlyCapHit,
});

const makeTeam = (options: {
  salaryCap?: number;
  activePlayers?: any[] | null;
  deadCapHits?: any[] | null;
}) => ({
  salaryCap: options.salaryCap ?? 200,
  activePlayers: options.activePlayers ?? [],
  deadCapHits: options.deadCapHits ?? [],
});

describe('getPositionalSum', () => {
  it('returns 0 when players is null or undefined or not an array', () => {
    
    expect(getPositionalSum(null, 2026)).toBe(0);
    
    expect(getPositionalSum(undefined, 2026)).toBe(0);
    
    expect(getPositionalSum({} as any, 2026)).toBe(0);
  });

  it('sums numeric contract values for the given year index', () => {
    // index = year - 2026, so for 2027 we use index 1
    const players = [
      makePlayer([10, 20, 30]),
      makePlayer([5, 15, 25]),
      makePlayer([0, 0, 0]),
    ];

    expect(getPositionalSum(players as any, 2026)).toBe(15); // 10 + 5
    expect(getPositionalSum(players as any, 2027)).toBe(35); // 20 + 15
  });

  it('ignores non-numeric contract entries', () => {
    const players = [
      makePlayer([10, null, 30]),
      makePlayer([undefined, 5 as any, 'not-a-number' as any]),
    ];

    expect(getPositionalSum(players as any, 2026)).toBe(10);
    expect(getPositionalSum(players as any, 2028)).toBe(30);
  });
});

describe('getDeadCapSum', () => {
  it('returns 0 when deadCapHits is missing or not an array', () => {
    const teamWithoutDeadCap = makeTeam({ deadCapHits: null });
    
    const teamWithNonArrayDeadCap = makeTeam({ deadCapHits: {} as any });

    expect(getDeadCapSum(teamWithoutDeadCap as any, 2026)).toBe(0);
    expect(getDeadCapSum(teamWithNonArrayDeadCap as any, 2026)).toBe(0);
  });

  it('sums numeric dead cap hits for the given year index', () => {
    const deadCapHits = [
      makeDeadCapEntry([10, 20, 30]),
      makeDeadCapEntry([5, 15, 25]),
    ];
    const team = makeTeam({ deadCapHits });

    expect(getDeadCapSum(team as any, 2026)).toBe(15); // 10 + 5
    expect(getDeadCapSum(team as any, 2027)).toBe(35); // 20 + 15
  });

  it('ignores non-numeric dead cap entries', () => {
    const deadCapHits = [
      makeDeadCapEntry([10, null, 30]),
      makeDeadCapEntry([undefined, 5 as any, 'x' as any]),
    ];
    const team = makeTeam({ deadCapHits });

    expect(getDeadCapSum(team as any, 2026)).toBe(10);
    expect(getDeadCapSum(team as any, 2028)).toBe(30);
  });
});

describe('getActivePayroll', () => {
  it('uses getPositionalSum over activePlayers', () => {
    const activePlayers = [makePlayer([10, 20]), makePlayer([5, 15])];
    const team = makeTeam({ activePlayers });

    expect(getActivePayroll(team as any, 2026)).toBe(15);
    expect(getActivePayroll(team as any, 2027)).toBe(35);
  });

  it('returns 0 if activePlayers is missing or invalid', () => {
    const team = makeTeam({ activePlayers: null });
    
    const teamWithInvalid = makeTeam({ activePlayers: {} as any });

    expect(getActivePayroll(team as any, 2026)).toBe(0);
    expect(getActivePayroll(teamWithInvalid as any, 2026)).toBe(0);
  });
});

describe('getCapHit', () => {
  it('returns sum of active payroll and dead cap', () => {
    const activePlayers = [makePlayer([10, 20]), makePlayer([5, 15])];
    const deadCapHits = [makeDeadCapEntry([3, 4])];
    const team = makeTeam({ activePlayers, deadCapHits });

    // For 2026: active = 15, dead = 3
    expect(getCapHit(team as any, 2026)).toBe(18);
    // For 2027: active = 35, dead = 4
    expect(getCapHit(team as any, 2027)).toBe(39);
  });
});

describe('getCapSpace', () => {
  it('returns salaryCap minus cap hit', () => {
    const activePlayers = [makePlayer([10, 20]), makePlayer([5, 15])];
    const deadCapHits = [makeDeadCapEntry([3, 4])];
    const team = makeTeam({ salaryCap: 100, activePlayers, deadCapHits });

    // For 2026: cap hit = 18
    expect(getCapSpace(team as any, 2026)).toBe(82);
  });

  it('handles zero cap hit correctly', () => {
    const team = makeTeam({
      salaryCap: 150,
      activePlayers: [],
      deadCapHits: [],
    });

    expect(getCapSpace(team as any, 2026)).toBe(150);
  });
});

