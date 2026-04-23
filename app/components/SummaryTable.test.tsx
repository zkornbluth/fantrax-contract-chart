/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import SummaryTable from './SummaryTable';

const makePlayer = (yearlyContract: number[]) => ({
  name: 'Player', age: 25, team: 'BOS', pos: 'SP', minors: false, injured: false, yearsRemaining: 1, yearlyContract,
});

const selectedTeam = {
  teamName: 'Test Team',
  salaryCap: 200_000_000,
  activePlayers: [
    makePlayer([10_000_000, 12_000_000, 0, 0, 0, 0]),
    makePlayer([5_000_000, 0, 0, 0, 0, 0]),
  ],
  deadCapHits: [{ name: 'Released', yearsRemaining: 1, yearlyCapHit: [2_000_000, 1_000_000, 0, 0, 0, 0] }],
};

describe('SummaryTable', () => {
  it('renders Summary header (no "s" appended)', () => {
    const { container } = render(<SummaryTable selectedTeam={selectedTeam} />);
    expect(within(container).getByText('Summary')).toBeInTheDocument();
  });

  it('renders Cap Ceiling row', () => {
    const { container } = render(<SummaryTable selectedTeam={selectedTeam} />);
    expect(within(container).getByText('Cap Ceiling')).toBeInTheDocument();
  });

  it('renders Active Payroll, Dead Cap Hits, Total Payroll, Cap Space rows', () => {
    const { container } = render(<SummaryTable selectedTeam={selectedTeam} />);
    expect(within(container).getByText('Active Payroll')).toBeInTheDocument();
    expect(within(container).getByText('Dead Cap Hits')).toBeInTheDocument();
    expect(within(container).getByText('Total Payroll')).toBeInTheDocument();
    expect(within(container).getByText('Cap Space')).toBeInTheDocument();
  });

  it('renders year headers 2026–2031', () => {
    const { container } = render(<SummaryTable selectedTeam={selectedTeam} />);
    expect(within(container).getByText('2026')).toBeInTheDocument();
    expect(within(container).getByText('2031')).toBeInTheDocument();
  });
});
