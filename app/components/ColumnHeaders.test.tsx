/**
 * @author Cursor
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ColumnHeaders from './ColumnHeaders';

describe('ColumnHeaders', () => {
  describe('type="active"', () => {
    it('renders PLAYER with count and sortable column labels', () => {
      render(
        <table>
          <thead>
            <ColumnHeaders count={5} type="active" />
          </thead>
        </table>
      );
      expect(screen.getByText(/PLAYER \(5\)/)).toBeInTheDocument();
      expect(screen.getByText('TEAM')).toBeInTheDocument();
      expect(screen.getByText('POS')).toBeInTheDocument();
      expect(screen.getByText('AGE')).toBeInTheDocument();
      expect(screen.getByText('2026')).toBeInTheDocument();
      expect(screen.getByText('2031')).toBeInTheDocument();
    });

    it('calls onSortChange when a sortable header is clicked', () => {
      const onSortChange = vi.fn();
      const { container } = render(
        <table>
          <thead>
            <ColumnHeaders
              count={3}
              type="active"
              sortKey="name"
              sortDirection="asc"
              onSortChange={onSortChange}
            />
          </thead>
        </table>
      );
      fireEvent.click(within(container).getByText(/PLAYER \(3\)/));
      expect(onSortChange).toHaveBeenCalledWith('name');
      onSortChange.mockClear();
      fireEvent.click(within(container).getByText('TEAM'));
      expect(onSortChange).toHaveBeenCalledWith('team');
    });

    it('renders sort arrow when sortKey and sortDirection match', () => {
      const { container } = render(
        <table>
          <thead>
            <ColumnHeaders
              count={2}
              type="active"
              sortKey="age"
              sortDirection="desc"
              onSortChange={() => {}}
            />
          </thead>
        </table>
      );
      const ageHeader = within(container).getByText('AGE');
      expect(ageHeader.closest('th')).toHaveTextContent(/AGE ↓/);
    });
  });

  describe('type="deadCap"', () => {
    it('renders PLAYER with count and year headers', () => {
      const { container } = render(
        <table>
          <thead>
            <ColumnHeaders count={1} type="deadCap" />
          </thead>
        </table>
      );
      expect(within(container).getByText(/PLAYER \(1\)/)).toBeInTheDocument();
      expect(within(container).getByText('2026')).toBeInTheDocument();
    });
  });

  describe('type="summary"', () => {
    it('renders year headers only', () => {
      const { container } = render(
        <table>
          <thead>
            <ColumnHeaders type="summary" />
          </thead>
        </table>
      );
      expect(within(container).getByText('2026')).toBeInTheDocument();
      expect(within(container).getByText('2031')).toBeInTheDocument();
    });
  });
});
