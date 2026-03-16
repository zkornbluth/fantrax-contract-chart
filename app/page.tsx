/** 
 * @fileoverview Creates the HomePage with the contract chart display
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

'use client';

import React, {useState} from 'react';
import './globals.css';
import teamCapData from '../data/teamCapInfo.json';
import CapHeaders from './components/CapHeaders';
import PositionalSummaryTable from './components/PositionalSummaryTable';
import SummaryTable from './components/SummaryTable';
import TeamSelector from './components/TeamSelector';
import MajorLeagueTable from './components/MajorLeagueTables';
import MinorLeagueTable from './components/MinorLeagueTable';
import DeadCapTable from './components/DeadCapTable';
import GroupByPosition from './components/GroupByPosition';
import DarkModeToggle from './components/DarkModeToggle';
import type { SortKey, SortDirection } from './components/ColumnHeaders';
 
export default function HomePage() {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(teamCapData.teams.length > 13 ? 13 : 0); // Default to my team
  const [groupByPosition, setGroupByPosition] = useState(true);

  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSortChange = (columnKey: Exclude<SortKey, 'default'>) => {
    if (sortKey !== columnKey) {
      setSortKey(columnKey);
      setSortDirection('asc');
      return;
    }

    if (sortDirection === 'asc') {
      setSortDirection('desc');
      return;
    }

    // Third click resets to default salary/contract sorting
    setSortKey('default');
    setSortDirection(null);
  };

  const selectedTeam = teamCapData.teams[selectedTeamIndex];
  // Set up order to show positional groups - different from what appears on Fantrax (batters first)
  const positionOrder = [
    'Starting Pitcher',
    'Relief Pitcher',
    'Catcher',
    'Infielder', 
    'Outfielder',
    'Designated Hitter'
  ];

  // Order for sorting by position abbreviation when requested
  const positionSortOrder = ['SP', 'RP', 'C', '1B', '2B', '3B', 'SS', 'OF', 'UT'];

  /** Derive primary position from full eligibility string: SP/RP -> RP; batters with multiple -> first. */
  const getPrimaryPosition = (posStr: string | undefined): string => {
    if (!posStr || !posStr.trim()) return '';
    const posList = posStr.split(',').map(p => p.trim()).filter(Boolean);
    if (posList.length === 1) return posList[0];
    if (posList[0] === 'SP') return posList[posList.length - 1]; // reliever: use RP
    return posList[0]; // batter with multiple: use first
  };

  /** Map primary position abbreviation to group name for display/grouping. */
  const getPosGroup = (posStr: string | undefined): string => {
    const primary = getPrimaryPosition(posStr);
    switch (primary) {
      case 'SP': return 'Starting Pitcher';
      case 'RP': return 'Relief Pitcher';
      case 'C': return 'Catcher';
      case '1B':
      case '2B':
      case 'SS':
      case '3B': return 'Infielder';
      case 'OF':
      case 'LF':
      case 'CF':
      case 'RF': return 'Outfielder';
      case 'UT':
      case 'DH': return 'Designated Hitter';
      default: return 'Unknown';
    }
  };

  const getPositionRank = (pos: string | undefined) => {
    const primaryPos = getPrimaryPosition(pos);
    if (!primaryPos) return positionSortOrder.length;
    const index = positionSortOrder.indexOf(primaryPos);
    return index === -1 ? positionSortOrder.length : index;
  };

  const majorLeaguePlayers = selectedTeam.activePlayers.filter(player => !player.minors);
  const minorLeaguePlayers = selectedTeam.activePlayers.filter(player => player.minors);
  const deadCapHits = [...selectedTeam.deadCapHits];

  const getSalary = (player: any) =>
    typeof player.yearlyContract?.[0] === 'number' ? player.yearlyContract[0] : 0;

  const getYearsRemaining = (player: any) =>
    typeof player.yearsRemaining === 'number' ? player.yearsRemaining : 0;

  const sortActivePlayers = (players: any[]) => {
    const playersCopy = [...players];

    const compareByDefault = (a: any, b: any) => {
      const salaryA = getSalary(a);
      const salaryB = getSalary(b);
      if (salaryA !== salaryB) {
        return salaryB - salaryA;
      }
      return getYearsRemaining(b) - getYearsRemaining(a);
    };

    const compare = (a: any, b: any) => {
      // Default: salary descending then contract length descending
      if (sortKey === 'default') {
        return compareByDefault(a, b);
      }

      // Expected (ascending) comparators with salary/years as tie-breakers
      let base = 0;

      if (sortKey === 'age') {
        const ageA = typeof a.age === 'number' ? a.age : Number.MAX_SAFE_INTEGER;
        const ageB = typeof b.age === 'number' ? b.age : Number.MAX_SAFE_INTEGER;
        base = ageA - ageB;
      } else if (sortKey === 'position') {
        base = getPositionRank(a.pos) - getPositionRank(b.pos);
      } else if (sortKey === 'team') {
        const teamA = (a.team || '').toString();
        const teamB = (b.team || '').toString();
        base = teamA.localeCompare(teamB);
      } else if (sortKey === 'name') {
        const nameA = (a.name || '').toString();
        const nameB = (b.name || '').toString();
        base = nameA.localeCompare(nameB);
      }

      if (base === 0) {
        base = compareByDefault(a, b);
      }

      // Asc = expected order, Desc = full reverse (including salary/years)
      return (sortDirection ?? 'asc') === 'asc' ? base : -base;
    };

    playersCopy.sort(compare);
    return playersCopy;
  };

  const sortedMajorLeaguePlayers = sortActivePlayers(majorLeaguePlayers);
  const sortedMinorLeaguePlayers = sortActivePlayers(minorLeaguePlayers);

  // Sort dead cap hits by salary descending then contract length descending (unchanged)
  deadCapHits.sort((a, b) => {
    const salaryA = typeof a.yearlyCapHit[0] === 'number' ? a.yearlyCapHit[0] : 0;
    const salaryB = typeof b.yearlyCapHit[0] === 'number' ? b.yearlyCapHit[0] : 0;
    if (salaryA !== salaryB) {
      return salaryB - salaryA;
    }
    return b.yearsRemaining - a.yearsRemaining;
  });

  // Group major leaguers for grouped view, preserving the current sort order within each group
  const groupedPlayers = sortedMajorLeaguePlayers.reduce((groups, player) => {
    const group = getPosGroup(player.pos) || 'Unknown';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(player);
    return groups;
  }, {});

  return (
    <div>
      <DarkModeToggle />
      <div className="absolute top-2.5 right-2.5 text-xs text-gray-600 dark:text-gray-400">
        Last refreshed: {teamCapData.timestamp}
      </div>
      <h1 className="text-center text-3xl font-bold pt-6 pb-2 text-gray-900 dark:text-white">
        {teamCapData.name}: Multi-Year Payroll Table
      </h1>
      
      <div className="my-5 flex justify-center items-center gap-5 flex-wrap">
        {/* Team Selector Dropdown */}
        <TeamSelector 
          teams={teamCapData.teams}
          selectedTeamIndex={selectedTeamIndex}
          onTeamChange={setSelectedTeamIndex}
        />
        <GroupByPosition groupByPosition={groupByPosition} setGroupByPosition={setGroupByPosition} />
      </div>

      {/* Header Cards */}
      <CapHeaders selectedTeam={selectedTeam} />

      {/* Major League Players */}
      <MajorLeagueTable 
        groupByPosition={groupByPosition} 
        positionOrder={positionOrder} 
        groupedPlayers={groupedPlayers} 
        majorLeaguePlayers={sortedMajorLeaguePlayers}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Minor League Players */}
      {sortedMinorLeaguePlayers.length > 0 && (
        <MinorLeagueTable
          minorLeaguePlayers={sortedMinorLeaguePlayers}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      )}

      {/* Dead Cap Hits */}
      {deadCapHits.length > 0 && <DeadCapTable deadCapHits={deadCapHits} />}

      {/* Summary Table */}
      <SummaryTable selectedTeam={selectedTeam} />
      {/* Positional Summary Table */}
      <PositionalSummaryTable players={groupedPlayers} posOrder={positionOrder} minorLeaguers={minorLeaguePlayers} />
    </div>
  );
}