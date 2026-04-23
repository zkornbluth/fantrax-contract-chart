/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import MinorLeagueTable from './MinorLeagueTable';

const basePlayer = {
  name: 'Prospect',
  team: 'BOS',
  pos: 'SP',
  age: 20,
  minors: true,
  injured: false,
  yearsRemaining: 1,
  yearlyContract: [500000, 0, 0, 0, 0, 0],
};

describe('MinorLeagueTable', () => {
  const defaultProps = {
    minorLeaguePlayers: [
      { ...basePlayer, name: 'Prospect A' },
      { ...basePlayer, name: 'Prospect B' },
    ],
    sortKey: 'default' as const,
    sortDirection: null as 'asc' | 'desc' | null,
    onSortChange: vi.fn(),
  };

  it('renders Minor Leagues header', () => {
    render(<MinorLeagueTable {...defaultProps} />);
    expect(screen.getByText('Minor Leagues')).toBeInTheDocument();
  });

  it('renders player count in column header', () => {
    const { container } = render(<MinorLeagueTable {...defaultProps} />);
    expect(within(container).getByText(/PLAYER \(2\)/)).toBeInTheDocument();
  });

  it('renders each minor league player', () => {
    const { container } = render(<MinorLeagueTable {...defaultProps} />);
    expect(within(container).getByText('Prospect A')).toBeInTheDocument();
    expect(within(container).getByText('Prospect B')).toBeInTheDocument();
  });

  it('count only includes players with yearsRemaining > 0', () => {
    const players = [
      { ...basePlayer, name: 'Active', yearsRemaining: 1 },
      { ...basePlayer, name: 'Expired', yearsRemaining: 0 },
    ];
    const { container } = render(
      <MinorLeagueTable
        {...defaultProps}
        minorLeaguePlayers={players}
      />
    );
    expect(within(container).getByText(/PLAYER \(1\)/)).toBeInTheDocument();
  });
});
