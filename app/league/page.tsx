/**
 * @fileoverview Creates the LeaguePage with the league-wide cap summary table
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

'use client';

import React, { useState } from 'react';
import teamCapData from '../../data/teamCapInfo.json';
import LeagueColumnHeaders from '../components/LeagueColumnHeaders';
import LeagueTableRow, { LeagueTeamRow } from '../components/LeagueTableRow';
import DarkModeToggle from '../components/DarkModeToggle';
import { getCapHit, getCapSpace, getRosterCount, getMajorLeagueCount, getMinorLeagueCount, getInjuredCount } from '../utils/capCalculations';
import type { LeagueSortKey, SortDirection } from '../types';

export default function LeaguePage() {
  const [sortKey, setSortKey] = useState<LeagueSortKey>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSortChange = (columnKey: Exclude<LeagueSortKey, 'default'>) => {
    if (sortKey !== columnKey) {
      setSortKey(columnKey);
      setSortDirection('asc');
      return;
    }

    if (sortDirection === 'asc') {
      setSortDirection('desc');
      return;
    }

    // Third click resets to default (original league order)
    setSortKey('default');
    setSortDirection(null);
  };

  const rows: LeagueTeamRow[] = teamCapData.teams.map(team => ({
    teamName: team.teamName,
    capTotal: getCapHit(team, 2026),
    capSpace: getCapSpace(team, 2026),
    rosterCount: getRosterCount(team),
    mlbCount: getMajorLeagueCount(team),
    minorsCount: getMinorLeagueCount(team),
    injuredCount: getInjuredCount(team),
  }));

  const sortedRows = [...rows];
  if (sortKey !== 'default' && sortDirection) {
    sortedRows.sort((a, b) => {
      const base = sortKey === 'teamName'
        ? a.teamName.localeCompare(b.teamName)
        : a[sortKey] - b[sortKey];
      return sortDirection === 'asc' ? base : -base;
    });
  }

  return (
    <div>
      <DarkModeToggle />
      <div className="absolute top-2.5 right-2.5 text-xs text-gray-600 dark:text-gray-400">
        Last refreshed: {teamCapData.timestamp}
      </div>
      <h1 className="text-center text-3xl font-bold pt-6 pb-2 text-gray-900 dark:text-white">
        {teamCapData.name}: League Summary
      </h1>

      <table className="w-[90%] ml-[5%] border-collapse mb-6">
        <thead>
          <LeagueColumnHeaders sortKey={sortKey} sortDirection={sortDirection} onSortChange={handleSortChange} />
        </thead>
        <tbody>
          {sortedRows.map(row => (
            <LeagueTableRow key={row.teamName} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
