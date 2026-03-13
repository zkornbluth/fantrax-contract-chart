/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import GroupByPosition from './GroupByPosition';

describe('GroupByPosition', () => {
  it('renders label and checkbox', () => {
    render(
      <GroupByPosition groupByPosition={false} setGroupByPosition={vi.fn()} />
    );
    expect(
      screen.getByLabelText('Group Major League Players by Position')
    ).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox', {
      name: 'Group Major League Players by Position',
    });
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox reflects groupByPosition prop', () => {
    const { container } = render(
      <GroupByPosition groupByPosition={true} setGroupByPosition={vi.fn()} />
    );
    expect(within(container).getByRole('checkbox')).toBeChecked();
  });

  it('calls setGroupByPosition with toggled value on change', () => {
    const setGroupByPosition = vi.fn();
    const { container } = render(
      <GroupByPosition
        groupByPosition={false}
        setGroupByPosition={setGroupByPosition}
      />
    );
    fireEvent.click(within(container).getByRole('checkbox'));
    expect(setGroupByPosition).toHaveBeenCalledWith(true);
  });
});
