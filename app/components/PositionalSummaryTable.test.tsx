/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import PositionalSummaryTable from './PositionalSummaryTable';

const players = {
  SP: [
    { yearlyContract: [10_000_000, 12_000_000, 0, 0, 0, 0] },
    { yearlyContract: [8_000_000, 0, 0, 0, 0, 0] },
  ],
  RP: [{ yearlyContract: [2_000_000, 2_000_000, 0, 0, 0, 0] }],
};
const posOrder = ['SP', 'RP', 'C'];
const minorLeaguers = [{ yearlyContract: [500_000, 0, 0, 0, 0, 0] }];

describe('PositionalSummaryTable', () => {
  it('renders Positional Summary header', () => {
    const { container } = render(
      <PositionalSummaryTable
        players={players}
        posOrder={posOrder}
        minorLeaguers={minorLeaguers}
      />
    );
    expect(within(container).getByText('Positional Summary')).toBeInTheDocument();
  });

  it('renders summary rows for each position in posOrder that exists in players', () => {
    const { container } = render(
      <PositionalSummaryTable
        players={players}
        posOrder={posOrder}
        minorLeaguers={minorLeaguers}
      />
    );
    expect(within(container).getByText('SPs')).toBeInTheDocument();
    expect(within(container).getByText('RPs')).toBeInTheDocument();
    expect(within(container).queryByText('Cs')).not.toBeInTheDocument(); // C not in players
  });

  it('renders Minor Leagues row', () => {
    const { container } = render(
      <PositionalSummaryTable
        players={players}
        posOrder={posOrder}
        minorLeaguers={minorLeaguers}
      />
    );
    expect(within(container).getByText('Minor Leagues')).toBeInTheDocument();
  });

  it('renders year headers', () => {
    const { container } = render(
      <PositionalSummaryTable
        players={players}
        posOrder={posOrder}
        minorLeaguers={minorLeaguers}
      />
    );
    expect(within(container).getByText('2026')).toBeInTheDocument();
    expect(within(container).getByText('2031')).toBeInTheDocument();
  });
});
