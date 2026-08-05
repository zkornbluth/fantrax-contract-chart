/**
 * @fileoverview Creates the LeagueTableRow component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import Link from 'next/link';

export interface LeagueTeamRow {
  teamName: string;
  capTotal: number;
  capSpace: number;
  rosterCount: number;
  mlbCount: number;
  minorsCount: number;
  injuredCount: number;
}

interface LeagueTableRowProps {
  row: LeagueTeamRow;
}

const formatCurrency = (n: number) =>
  `$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`;

export default function LeagueTableRow({ row }: LeagueTableRowProps) { // Creates a single team's row in the league summary table
  return (
    <tr className="border-y border-gray-300 dark:border-gray-600 odd:bg-gray-50 dark:odd:bg-gray-800/50 even:bg-white dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <td className="py-1 px-4 text-gray-900 dark:text-white font-medium">
        <Link
          href={`/?team=${encodeURIComponent(row.teamName)}`}
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          {row.teamName}
        </Link>
      </td>
      <td className="text-center py-1 px-4 text-gray-900 dark:text-white">{formatCurrency(row.capTotal)}</td>
      <td className="text-center py-1 px-4 text-gray-900 dark:text-white">{formatCurrency(row.capSpace)}</td>
      <td className="text-center py-1 px-4 text-gray-900 dark:text-white">{row.rosterCount}</td>
      <td className="text-center py-1 px-4 text-gray-900 dark:text-white">{row.mlbCount}</td>
      <td className="text-center py-1 px-4 text-gray-900 dark:text-white">{row.minorsCount}</td>
      <td className="text-center py-1 px-4 text-gray-900 dark:text-white">{row.injuredCount}</td>
    </tr>
  );
}
