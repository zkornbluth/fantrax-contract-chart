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
 
export default function HomePage() {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(teamCapData.teams.length > 13 ? 13 : 0); // Default to my team
  const [groupByPosition, setGroupByPosition] = useState(true);
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

  const majorLeaguePlayers = selectedTeam.activePlayers.filter(player => !player.minors);
  const minorLeaguePlayers = selectedTeam.activePlayers.filter(player => player.minors);
  const deadCapHits = selectedTeam.deadCapHits;

  // Sort major leaguers by salary descending then contract length descending
  majorLeaguePlayers.sort((a, b) => {
    const salaryA = typeof a.yearlyContract[0] === 'number' ? a.yearlyContract[0] : 0;
    const salaryB = typeof b.yearlyContract[0] === 'number' ? b.yearlyContract[0] : 0;
    if (salaryA !== salaryB) {
      return salaryB - salaryA;
    }
    return b.yearsRemaining - a.yearsRemaining;
  });

  // Sort minor leaguers the same way
  minorLeaguePlayers.sort((a, b) => {
    const salaryA = typeof a.yearlyContract[0] === 'number' ? a.yearlyContract[0] : 0;
    const salaryB = typeof b.yearlyContract[0] === 'number' ? b.yearlyContract[0] : 0;
    if (salaryA !== salaryB) {
      return salaryB - salaryA;
    }
    return b.yearsRemaining - a.yearsRemaining;
  });

  // Sort dead cap hits the same way
  deadCapHits.sort((a, b) => {
    const salaryA = typeof a.yearlyCapHit[0] === 'number' ? a.yearlyCapHit[0] : 0;
    const salaryB = typeof b.yearlyCapHit[0] === 'number' ? b.yearlyCapHit[0] : 0;
    if (salaryA !== salaryB) {
      return salaryB - salaryA;
    }
    return b.yearsRemaining - a.yearsRemaining;
  });

  // Group major leaguers for grouped view
  const groupedPlayers = majorLeaguePlayers.reduce((groups, player) => {
    const group = player.posGroup || 'Unknown';
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
        majorLeaguePlayers={majorLeaguePlayers} 
      />

      {/* Minor League Players */}
      {minorLeaguePlayers.length > 0 && <MinorLeagueTable minorLeaguePlayers={minorLeaguePlayers} />}

      {/* Dead Cap Hits */}
      {deadCapHits.length > 0 && <DeadCapTable deadCapHits={deadCapHits} />}

      {/* Summary Table */}
      <SummaryTable selectedTeam={selectedTeam} />
      {/* Positional Summary Table */}
      <PositionalSummaryTable players={groupedPlayers} posOrder={positionOrder} minorLeaguers={minorLeaguePlayers} />
    </div>
  );
}