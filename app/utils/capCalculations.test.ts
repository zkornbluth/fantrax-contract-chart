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
  getRosterCount,
  getMajorLeagueCount,
  getMinorLeagueCount,
  getInjuredCount,
  getPrimaryPosition,
  getPosGroup,
} from './capCalculations';

const makePlayer = (
  yearlyContract: Array<number | null | undefined>,
  options: { minors?: boolean; injured?: boolean } = {}
) => ({
  yearlyContract,
  minors: options.minors ?? false,
  injured: options.injured ?? false,
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

describe('roster count functions', () => {
  const activePlayers = [
    makePlayer([10], { minors: false, injured: false }), // MLB, healthy
    makePlayer([5], { minors: false, injured: true }), // MLB, injured
    makePlayer([1], { minors: true, injured: false }), // minors, healthy
    makePlayer([1], { minors: true, injured: true }), // minors, injured
  ];
  const team = makeTeam({ activePlayers });

  it('getRosterCount counts non-injured players', () => {
    expect(getRosterCount(team as any)).toBe(2);
  });

  it('getMajorLeagueCount counts non-minors, non-injured players', () => {
    expect(getMajorLeagueCount(team as any)).toBe(1);
  });

  it('getMinorLeagueCount counts players marked as minors', () => {
    expect(getMinorLeagueCount(team as any)).toBe(2);
  });

  it('getInjuredCount counts players marked as injured', () => {
    expect(getInjuredCount(team as any)).toBe(2);
  });

  it('all count functions return 0 when activePlayers is missing or invalid', () => {
    const teamWithoutPlayers = makeTeam({ activePlayers: null });
    const teamWithInvalidPlayers = makeTeam({ activePlayers: {} as any });

    expect(getRosterCount(teamWithoutPlayers as any)).toBe(0);
    expect(getMajorLeagueCount(teamWithoutPlayers as any)).toBe(0);
    expect(getMinorLeagueCount(teamWithoutPlayers as any)).toBe(0);
    expect(getInjuredCount(teamWithoutPlayers as any)).toBe(0);

    expect(getRosterCount(teamWithInvalidPlayers as any)).toBe(0);
    expect(getMajorLeagueCount(teamWithInvalidPlayers as any)).toBe(0);
    expect(getMinorLeagueCount(teamWithInvalidPlayers as any)).toBe(0);
    expect(getInjuredCount(teamWithInvalidPlayers as any)).toBe(0);
  });
});

describe('getPrimaryPosition', () => {
  it('returns the single position when only one is listed', () => {
    expect(getPrimaryPosition('SS')).toBe('SS');
  });

  it('returns empty string for missing or blank input', () => {
    expect(getPrimaryPosition(undefined)).toBe('');
    expect(getPrimaryPosition('')).toBe('');
    expect(getPrimaryPosition('   ')).toBe('');
  });

  it('treats SP-first pitchers as relievers (last listed position)', () => {
    expect(getPrimaryPosition('SP,RP')).toBe('RP');
  });

  it('uses the first listed position for batters, even with incidental RP eligibility', () => {
    expect(getPrimaryPosition('OF,RP')).toBe('OF');
    expect(getPrimaryPosition('1B,2B')).toBe('1B');
  });
});

describe('getPosGroup', () => {
  it('maps pitcher positions to their groups', () => {
    expect(getPosGroup('SP')).toBe('Starting Pitcher');
    expect(getPosGroup('RP')).toBe('Relief Pitcher');
    expect(getPosGroup('SP,RP')).toBe('Relief Pitcher');
  });

  it('maps infield positions to Infielder', () => {
    expect(getPosGroup('1B')).toBe('Infielder');
    expect(getPosGroup('2B')).toBe('Infielder');
    expect(getPosGroup('3B')).toBe('Infielder');
    expect(getPosGroup('SS')).toBe('Infielder');
  });

  it('maps outfield positions to Outfielder', () => {
    expect(getPosGroup('OF')).toBe('Outfielder');
    expect(getPosGroup('LF')).toBe('Outfielder');
  });

  it('maps catcher and DH/UT appropriately', () => {
    expect(getPosGroup('C')).toBe('Catcher');
    expect(getPosGroup('DH')).toBe('Designated Hitter');
    expect(getPosGroup('UT')).toBe('Designated Hitter');
  });

  it('classifies a batter with incidental RP eligibility as a hitter group, not a pitcher group', () => {
    expect(getPosGroup('OF,RP')).toBe('Outfielder');
  });

  it('returns Unknown for unrecognized positions', () => {
    expect(getPosGroup('XX')).toBe('Unknown');
    expect(getPosGroup(undefined)).toBe('Unknown');
  });
});

