/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import DeadCapTable from './DeadCapTable';

const deadCapHits = [
  { name: 'Player A', yearlyCapHit: [100, 50, 0] },
  { name: 'Player B', yearlyCapHit: [200, 0, 0] },
];

describe('DeadCapTable', () => {
  it('renders PositionGroupHeader with Dead Cap Hit', () => {
    render(<DeadCapTable deadCapHits={deadCapHits} />);
    expect(screen.getByText('Dead Cap Hits')).toBeInTheDocument();
  });

  it('renders column headers with count', () => {
    const { container } = render(<DeadCapTable deadCapHits={deadCapHits} />);
    expect(within(container).getByText(/PLAYER \(2\)/)).toBeInTheDocument();
  });

  it('renders a row for each dead cap hit', () => {
    const { container } = render(<DeadCapTable deadCapHits={deadCapHits} />);
    expect(within(container).getByText('Player A')).toBeInTheDocument();
    expect(within(container).getByText('Player B')).toBeInTheDocument();
  });

  it('renders year headers 2026–2031', () => {
    const { container } = render(<DeadCapTable deadCapHits={deadCapHits} />);
    expect(within(container).getByText('2026')).toBeInTheDocument();
    expect(within(container).getByText('2031')).toBeInTheDocument();
  });

  it('renders empty table when deadCapHits is empty', () => {
    const { container } = render(<DeadCapTable deadCapHits={[]} />);
    expect(within(container).getByText(/PLAYER \(0\)/)).toBeInTheDocument();
    expect(within(container).getByText('Dead Cap Hits')).toBeInTheDocument();
  });
});
