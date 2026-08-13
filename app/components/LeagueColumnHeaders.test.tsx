/**
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import LeagueColumnHeaders from './LeagueColumnHeaders';

describe('LeagueColumnHeaders', () => {
  it('renders all column labels', () => {
    render(
      <table>
        <thead>
          <LeagueColumnHeaders sortKey="default" sortDirection={null} onSortChange={() => {}} />
        </thead>
      </table>
    );
    expect(screen.getByText('TEAM')).toBeInTheDocument();
    expect(screen.getByText('2026 CAP TOTAL')).toBeInTheDocument();
    expect(screen.getByText('2026 CAP SPACE')).toBeInTheDocument();
    expect(screen.getByText('ROSTER')).toBeInTheDocument();
    expect(screen.getByText('MLB')).toBeInTheDocument();
    expect(screen.getByText('MiLB')).toBeInTheDocument();
    expect(screen.getByText('INJURED')).toBeInTheDocument();
    expect(screen.getByText('PITCHERS')).toBeInTheDocument();
    expect(screen.getByText('HITTERS')).toBeInTheDocument();
    expect(screen.getByText('MINORS')).toBeInTheDocument();
  });

  it('calls onSortChange with the clicked column key', () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <table>
        <thead>
          <LeagueColumnHeaders sortKey="default" sortDirection={null} onSortChange={onSortChange} />
        </thead>
      </table>
    );
    fireEvent.click(within(container).getByText('TEAM'));
    expect(onSortChange).toHaveBeenCalledWith('teamName');
    onSortChange.mockClear();
    fireEvent.click(within(container).getByText('INJURED'));
    expect(onSortChange).toHaveBeenCalledWith('injuredCount');
    onSortChange.mockClear();
    fireEvent.click(within(container).getByText('PITCHERS'));
    expect(onSortChange).toHaveBeenCalledWith('pitcherCapHit');
  });

  it('renders sort arrow when sortKey and sortDirection match', () => {
    const { container } = render(
      <table>
        <thead>
          <LeagueColumnHeaders sortKey="capSpace" sortDirection="asc" onSortChange={() => {}} />
        </thead>
      </table>
    );
    const header = within(container).getByText('2026 CAP SPACE');
    expect(header.closest('th')).toHaveTextContent(/2026 CAP SPACE ↑/);
  });
});
