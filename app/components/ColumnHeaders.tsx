/** 
 * @fileoverview Creates the ColumnHeaders component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import type { SortKey, SortDirection } from '../types';
export type { SortKey, SortDirection };

interface ColumnHeadersProps {
  count?: number;
  type: 'active' | 'deadCap' | 'summary';
  sortKey?: SortKey;
  sortDirection?: SortDirection;
  onSortChange?: (columnKey: Exclude<SortKey, 'default'>) => void;
}

export default function ColumnHeaders({ count = 0, type, sortKey, sortDirection, onSortChange }: ColumnHeadersProps) { // Generates column headers for each pos group/section
  const renderSortArrow = (columnKey: Exclude<SortKey, 'default'>) => {
    if (!sortKey || sortKey !== columnKey || !sortDirection) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

    if (type == "active") {
    return (
      <tr className="bg-white dark:bg-gray-800">
        <th
          className="text-left w-[20%] py-1 px-4 font-semibold text-gray-900 dark:text-white cursor-pointer select-none"
          onClick={() => onSortChange && onSortChange('name')}
        >
          <div className="inline-flex items-center gap-1 whitespace-nowrap">
            <span>PLAYER ({count})</span>
            <span>{renderSortArrow('name')}</span>
          </div>
        </th>
        <th
          className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white cursor-pointer select-none"
          onClick={() => onSortChange && onSortChange('team')}
        >
          <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
            <span>TEAM</span>
            <span>{renderSortArrow('team')}</span>
          </div>
        </th>
        <th
          className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white cursor-pointer select-none"
          onClick={() => onSortChange && onSortChange('position')}
        >
          <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
            <span>POS</span>
            <span>{renderSortArrow('position')}</span>
          </div>
        </th>
        <th
          className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white cursor-pointer select-none"
          onClick={() => onSortChange && onSortChange('age')}
        >
          <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
            <span>AGE</span>
            <span>{renderSortArrow('age')}</span>
          </div>
        </th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2026</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2027</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2028</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2029</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2030</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2031</th>
      </tr>
    )
  } else if (type == "deadCap") {
    return (
      <tr className="bg-white dark:bg-gray-800">
        <th className="text-left py-1 px-4 font-semibold text-gray-900 dark:text-white" colSpan={4}>PLAYER ({count})</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2026</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2027</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2028</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2029</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2030</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2031</th>
      </tr>
    )
  } else {
    return (
      <tr className="bg-white dark:bg-gray-800">
        <th colSpan={4} className="py-1 px-4"></th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2026</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2027</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2028</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2029</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2030</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2031</th>
      </tr>
    )
  }
}