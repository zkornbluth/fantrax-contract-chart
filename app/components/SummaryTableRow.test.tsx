/**
 * @author Cursor
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryTableRow from './SummaryTableRow';

describe('SummaryTableRow', () => {
  it('renders header text', () => {
    render(<SummaryTableRow header="Cap Ceiling" values={[100, 100]} />);
    expect(screen.getByText('Cap Ceiling')).toBeInTheDocument();
  });

  it('renders each value as formatted currency', () => {
    render(
      <SummaryTableRow
        header="Active Payroll"
        values={[50_000_000, 55_000_000]}
      />
    );
    expect(screen.getByText('$50,000,000')).toBeInTheDocument();
    expect(screen.getByText('$55,000,000')).toBeInTheDocument();
  });

  it('formats decimals to two places', () => {
    render(
      <SummaryTableRow header="Test" values={[100.5]} />
    );
    expect(screen.getByText('$100.50')).toBeInTheDocument();
  });
});
