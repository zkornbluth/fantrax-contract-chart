/** 
 * @fileoverview Creates the HomePage with the contract chart display
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

'use client';

import React, {useState} from 'react';
import teamCapData from '../data/teamCapInfo.json';
import './styles.css';
import { CapHitHeader, CapMaxHeader, CapSpaceHeader } from './components/CapHeaders';
import PositionalSummaryTable from './components/PositionalSummaryTable';
import SummaryTable from './components/SummaryTable';
import TeamSelector from './components/TeamSelector';
import {GroupedMajorLeagueTable, UngroupedMajorLeagueTable} from './components/MajorLeagueTables';
import MinorLeagueTable from './components/MinorLeagueTable';
import DeadCapTable from './components/DeadCapTable';
 
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

  // Group major leaguers for grouped view
  const groupedPlayers = majorLeaguePlayers.reduce((groups, player) => {
    const group = player.posGroup || 'Unknown';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(player);
    return groups;
  }, {});

  const deadCapHits = selectedTeam.deadCapHits;

  // Sort dead cap hits the same way
  deadCapHits.sort((a, b) => {
    const salaryA = typeof a.yearlyCapHit[0] === 'number' ? a.yearlyCapHit[0] : 0;
    const salaryB = typeof b.yearlyCapHit[0] === 'number' ? b.yearlyCapHit[0] : 0;
    if (salaryA !== salaryB) {
      return salaryB - salaryA;
    }
    return b.yearsRemaining - a.yearsRemaining;
  });

  return (
    <div>
      <div className="timestamp">Last refreshed: {teamCapData.timestamp}</div>
      <h1>{teamCapData.name}: Multi-Year Payroll Table</h1>
      
      <div className="filters-wrap">
        {/* Team Selector Dropdown */}
        <TeamSelector 
          teams={teamCapData.teams}
          selectedTeamIndex={selectedTeamIndex}
          onTeamChange={setSelectedTeamIndex}
        />
        <span className='group-by-position'>
          <label htmlFor="groupByPos">
            Group Major League Players by Position
          </label>
          <input
            type="checkbox"
            id="groupByPos"
            checked={groupByPosition}
            onChange={() => setGroupByPosition(!groupByPosition)}
          />
        </span>
      </div>

      {/* Header Cards */}
      <div className="cap-headers">
        <CapMaxHeader selectedTeam={selectedTeam} />
        <CapHitHeader selectedTeam={selectedTeam} />
        <CapSpaceHeader selectedTeam={selectedTeam} />
      </div>

      {/* Major League Players */}
      {groupByPosition ? <GroupedMajorLeagueTable positionOrder={positionOrder} groupedPlayers={groupedPlayers} />
      : <UngroupedMajorLeagueTable players={majorLeaguePlayers} />}

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