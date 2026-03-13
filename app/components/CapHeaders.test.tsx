/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import CapHeaders from './CapHeaders';

vi.mock('../assets/bills.png', () => ({ default: { src: '/bills.png' } }));
vi.mock('../assets/paying.png', () => ({ default: { src: '/paying.png' } }));
vi.mock('../assets/billstack.png', () => ({ default: { src: '/billstack.png' } }));

const selectedTeam = {
  salaryCap: 200_000_000,
  activePlayers: [{ yearlyContract: [10_000_000, 0, 0, 0, 0, 0] }],
  deadCapHits: [{ yearlyCapHit: [2_000_000, 0, 0, 0, 0, 0] }],
};

describe('CapHeaders', () => {
  it('renders Cap Ceiling with team salary cap', () => {
    const { container } = render(<CapHeaders selectedTeam={selectedTeam} />);
    expect(within(container).getByText('Cap Ceiling')).toBeInTheDocument();
    expect(within(container).getByText('$200,000,000.00')).toBeInTheDocument();
  });

  it('renders 2026 Total Payroll and 2026 Cap Space', () => {
    const { container } = render(<CapHeaders selectedTeam={selectedTeam} />);
    expect(within(container).getByText('2026 Total Payroll')).toBeInTheDocument();
    expect(within(container).getByText('2026 Cap Space')).toBeInTheDocument();
  });

  it('shows three header cards', () => {
    const { container } = render(<CapHeaders selectedTeam={selectedTeam} />);
    const cards = container.querySelectorAll('.border');
    expect(cards.length).toBe(2); // Cap Ceiling has bordered={false}, so only 2 have border
    expect(within(container).getByText('Cap Ceiling')).toBeInTheDocument();
    expect(within(container).getByText('2026 Total Payroll')).toBeInTheDocument();
    expect(within(container).getByText('2026 Cap Space')).toBeInTheDocument();
  });
});
