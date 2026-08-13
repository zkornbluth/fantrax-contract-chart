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

const columns: { key: Exclude<LeagueSortKey, 'default'>; label: string; width: string }[] = [
  { key: 'teamName', label: 'TEAM', width: 'w-[26%]' },
  { key: 'capTotal', label: '2026 CAP TOTAL', width: 'w-[13%]' },
  { key: 'capSpace', label: '2026 CAP SPACE', width: 'w-[13%]' },
  { key: 'rosterCount', label: 'ROSTER', width: 'w-[6%]' },
  { key: 'mlbCount', label: 'MLB', width: 'w-[6%]' },
  { key: 'minorsCount', label: 'MiLB', width: 'w-[6%]' },
  { key: 'injuredCount', label: 'INJURED', width: 'w-[6%]' },
  { key: 'pitcherCapHit', label: 'PITCHERS', width: 'w-[8%]' },
  { key: 'hitterCapHit', label: 'HITTERS', width: 'w-[8%]' },
  { key: 'minorsCapHit', label: 'MINORS', width: 'w-[8%]' },
];

export default function LeagueColumnHeaders({ sortKey, sortDirection, onSortChange }: LeagueColumnHeadersProps) { // Generates sortable column headers for the league summary table
  const renderSortArrow = (columnKey: Exclude<LeagueSortKey, 'default'>) => {
    if (!sortKey || sortKey !== columnKey || !sortDirection) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <tr className="bg-white dark:bg-gray-800">
      {columns.map(({ key, label, width }) => (
        <th
          key={key}
          className={`py-1 px-4 font-semibold text-gray-900 dark:text-white cursor-pointer select-none ${width} ${key === 'teamName' ? 'text-left' : 'text-center'}`}
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
