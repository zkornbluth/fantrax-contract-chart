/**
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import { describe, it, expect } from 'vitest';
import { render, within } from '@testing-library/react';
import LeagueTableRow, { LeagueTeamRow } from './LeagueTableRow';

const makeRow = (overrides: Partial<LeagueTeamRow> = {}): LeagueTeamRow => ({
  teamName: 'Worst To First',
  capTotal: 1500,
  capSpace: 500.5,
  rosterCount: 20,
  mlbCount: 15,
  minorsCount: 5,
  injuredCount: 2,
  ...overrides,
});

describe('LeagueTableRow', () => {
  it('renders the team name as a link back to the team page', () => {
    const { container } = render(
      <table>
        <tbody>
          <LeagueTableRow row={makeRow()} />
        </tbody>
      </table>
    );
    const link = within(container).getByText('Worst To First').closest('a');
    expect(link).toHaveAttribute('href', '/?team=Worst%20To%20First');
  });

  it('renders currency and count columns', () => {
    const { container } = render(
      <table>
        <tbody>
          <LeagueTableRow row={makeRow()} />
        </tbody>
      </table>
    );
    expect(within(container).getByText('$1,500')).toBeInTheDocument();
    expect(within(container).getByText('$500.50')).toBeInTheDocument();
    expect(within(container).getByText('20')).toBeInTheDocument();
    expect(within(container).getByText('15')).toBeInTheDocument();
    expect(within(container).getByText('5')).toBeInTheDocument();
    expect(within(container).getByText('2')).toBeInTheDocument();
  });
});
