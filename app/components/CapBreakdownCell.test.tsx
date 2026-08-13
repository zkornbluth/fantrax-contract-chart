/**
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import { describe, it, expect } from 'vitest';
import { render, within } from '@testing-library/react';
import CapBreakdownCell from './CapBreakdownCell';

describe('CapBreakdownCell', () => {
  it('renders the formatted currency value', () => {
    const { container } = render(<CapBreakdownCell value={500} salaryCap={2000} />);
    expect(within(container).getByText('$500')).toBeInTheDocument();
  });

  it('formats decimals to two places', () => {
    const { container } = render(<CapBreakdownCell value={500.5} salaryCap={2000} />);
    expect(within(container).getByText('$500.50')).toBeInTheDocument();
  });

  it('shades the bar proportional to the value relative to the salary cap', () => {
    const { container } = render(<CapBreakdownCell value={500} salaryCap={2000} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('25%');
  });

  it('clamps the bar width to 100% when the value exceeds the salary cap', () => {
    const { container } = render(<CapBreakdownCell value={3000} salaryCap={2000} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('100%');
  });

  it('does not divide by zero when salaryCap is 0', () => {
    const { container } = render(<CapBreakdownCell value={100} salaryCap={0} />);
    const bar = container.querySelector('[style]') as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });
});
