/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamSelector from './TeamSelector';

const teams = [
  { teamName: 'Red Sox' },
  { teamName: 'Yankees' },
  { teamName: 'Rays' },
];

describe('TeamSelector', () => {
  it('renders label and select with options', () => {
    render(
      <TeamSelector
        teams={teams}
        selectedTeamIndex={0}
        onTeamChange={vi.fn()}
      />
    );
    const select = screen.getByLabelText(/Select Team/);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('0');
    expect(screen.getByRole('option', { name: 'Red Sox' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Yankees' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rays' })).toBeInTheDocument();
  });

  it('shows selected team by index', () => {
    const { container } = render(
      <TeamSelector
        teams={teams}
        selectedTeamIndex={1}
        onTeamChange={vi.fn()}
      />
    );
    const select = container.querySelector<HTMLSelectElement>('select');
    expect(select).toBeTruthy();
    expect(select!.value).toBe('1');
  });

  it('calls onTeamChange with new index when selection changes', () => {
    const onTeamChange = vi.fn();
    const { container } = render(
      <TeamSelector
        teams={teams}
        selectedTeamIndex={0}
        onTeamChange={onTeamChange}
      />
    );
    const select = container.querySelector('select');
    expect(select).toBeTruthy();
    fireEvent.change(select!, { target: { value: '2' } });
    expect(onTeamChange).toHaveBeenCalledWith(2);
  });
});
