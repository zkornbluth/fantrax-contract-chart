/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import DeadCapRow from './DeadCapRow';

const defaultDeadCap = {
  name: 'Released Player',
  yearlyCapHit: [500000, 250000, 0],
};

describe('DeadCapRow', () => {
  it('renders player name', () => {
    render(
      <table>
        <tbody>
          <DeadCapRow deadCapHit={defaultDeadCap} />
        </tbody>
      </table>
    );
    expect(screen.getByText('Released Player')).toBeInTheDocument();
  });

  it('renders numeric cap hits as formatted currency', () => {
    const { container } = render(
      <table>
        <tbody>
          <DeadCapRow deadCapHit={defaultDeadCap} />
        </tbody>
      </table>
    );
    const row = within(container).getByRole('row');
    expect(within(row).getByText('$500,000')).toBeInTheDocument();
    expect(within(row).getByText('$250,000')).toBeInTheDocument();
    expect(within(row).getByText('$0')).toBeInTheDocument();
  });

  it('formats decimal numbers to two places', () => {
    const deadCap = {
      name: 'Other',
      yearlyCapHit: [100.5, 200.123],
    };
    render(
      <table>
        <tbody>
          <DeadCapRow deadCapHit={deadCap} />
        </tbody>
      </table>
    );
    expect(screen.getByText('$100.50')).toBeInTheDocument();
    expect(screen.getByText('$200.12')).toBeInTheDocument();
  });

  it('renders non-numeric values as-is', () => {
    const deadCap = {
      name: 'Other',
      yearlyCapHit: [100, 'N/A'],
    };
    render(
      <table>
        <tbody>
          <DeadCapRow deadCapHit={deadCap} />
        </tbody>
      </table>
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
