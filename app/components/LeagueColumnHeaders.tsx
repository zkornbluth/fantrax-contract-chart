/**
 * @fileoverview Creates the LeagueColumnHeaders component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import type { LeagueSortKey, SortDirection } from '../types';

interface LeagueColumnHeadersProps {
  sortKey: LeagueSortKey;
  sortDirection: SortDirection;
  onSortChange: (columnKey: Exclude<LeagueSortKey, 'default'>) => void;
}

const columns: { key: Exclude<LeagueSortKey, 'default'>; label: string }[] = [
  { key: 'teamName', label: 'TEAM' },
  { key: 'capTotal', label: '2026 CAP TOTAL' },
  { key: 'capSpace', label: '2026 CAP SPACE' },
  { key: 'rosterCount', label: 'ROSTER' },
  { key: 'mlbCount', label: 'MLB' },
  { key: 'minorsCount', label: 'MINORS' },
  { key: 'injuredCount', label: 'INJURED' },
];

export default function LeagueColumnHeaders({ sortKey, sortDirection, onSortChange }: LeagueColumnHeadersProps) { // Generates sortable column headers for the league summary table
  const renderSortArrow = (columnKey: Exclude<LeagueSortKey, 'default'>) => {
    if (!sortKey || sortKey !== columnKey || !sortDirection) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <tr className="bg-white dark:bg-gray-800">
      {columns.map(({ key, label }) => (
        <th
          key={key}
          className={`py-1 px-4 font-semibold text-gray-900 dark:text-white cursor-pointer select-none ${key === 'teamName' ? 'text-left' : 'text-center'}`}
          onClick={() => onSortChange(key)}
        >
          <div className={`inline-flex items-center gap-1 whitespace-nowrap ${key === 'teamName' ? '' : 'justify-center'}`}>
            <span>{label}</span>
            <span>{renderSortArrow(key)}</span>
          </div>
        </th>
      ))}
    </tr>
  );
}
