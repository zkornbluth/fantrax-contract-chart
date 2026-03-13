/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import MajorLeagueTables from './MajorLeagueTables';

const basePlayer = {
  name: 'Player',
  team: 'BOS',
  pos: 'SP',
  age: 25,
  yearlyContract: [1e6, 0, 0, 0, 0, 0],
  yearsRemaining: 1,
};

describe('MajorLeagueTables', () => {
  const defaultProps = {
    groupByPosition: false,
    positionOrder: ['SP', 'RP'],
    groupedPlayers: {
      SP: [{ ...basePlayer, name: 'Starter', pos: 'SP' }],
      RP: [{ ...basePlayer, name: 'Reliever', pos: 'RP' }],
    },
    majorLeaguePlayers: [
      { ...basePlayer, name: 'Player One' },
      { ...basePlayer, name: 'Player Two' },
    ],
    sortKey: 'default' as const,
    sortDirection: null as 'asc' | 'desc' | null,
    onSortChange: vi.fn(),
  };

  it('when groupByPosition is false, renders single Major League table', () => {
    render(<MajorLeagueTables {...defaultProps} />);
    expect(screen.getByText('Major Leagues')).toBeInTheDocument();
    expect(screen.getByText('Player One')).toBeInTheDocument();
    expect(screen.getByText('Player Two')).toBeInTheDocument();
  });

  it('when groupByPosition is true, renders tables per position group', () => {
    render(<MajorLeagueTables {...defaultProps} groupByPosition={true} />);
    expect(screen.getByText('SPs')).toBeInTheDocument();
    expect(screen.getByText('RPs')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Reliever')).toBeInTheDocument();
  });

  it('renders column headers with active type', () => {
    const { container } = render(<MajorLeagueTables {...defaultProps} />);
    expect(within(container).getByText('TEAM')).toBeInTheDocument();
    expect(within(container).getByText('POS')).toBeInTheDocument();
  });
});
