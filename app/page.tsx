/** 
 * @fileoverview Creates the HomePage with the contract chart display
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

'use client';

import React, {useState} from 'react';
import teamCapData from './teamCapInfo.json';
import './styles.css';
import ActivePlayerRow from './components/ActivePlayerRow';
import { CapHitHeader, CapMaxHeader, CapSpaceHeader } from './components/CapHeaders';
import ColumnHeaders from './components/ColumnHeaders';
import DeadCapRow from './components/DeadCapRow';
import PositionGroupHeader from './components/PositionGroupHeader';
import PositionalSummaryTable from './components/PositionalSummaryTable';
import SummaryTable from './components/SummaryTable';
import TeamSelector from './components/TeamSelector';
 
export default function HomePage() {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(13); // Default to my team
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

  const groupedPlayers = majorLeaguePlayers.reduce((groups, player) => {
    const group = player.posGroup || 'Unknown';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(player);
    return groups;
  }, {});

  // Within each group, sort players by salary descending then contract length descending
  Object.keys(groupedPlayers).forEach(group => {
    groupedPlayers[group].sort((a, b) => {
      const salaryA = typeof a.yearlyContract[0] === 'number' ? a.yearlyContract[0] : 0;
      const salaryB = typeof b.yearlyContract[0] === 'number' ? b.yearlyContract[0] : 0;
      if (salaryA !== salaryB) {
        return salaryB - salaryA;
      }
      return b.yearsRemaining - a.yearsRemaining;
    });
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
      <h1>{teamCapData.name}: Multi-Year Payroll Table</h1>
      
      {/* Team Selector Dropdown */}
      <TeamSelector 
        teams={teamCapData.teams}
        selectedTeamIndex={selectedTeamIndex}
        onTeamChange={setSelectedTeamIndex}
      />

      {/* Header Cards */}
      <div className="cap-headers">
        <CapMaxHeader selectedTeam={selectedTeam} />
        <CapHitHeader selectedTeam={selectedTeam} />
        <CapSpaceHeader selectedTeam={selectedTeam} />
      </div>

      {/* Major League Players */}
      {positionOrder.map((posGroup) => {
        const players = groupedPlayers[posGroup];
        if (!players || players.length === 0) return null;

        return (
          <React.Fragment key={posGroup}>
            <PositionGroupHeader posGroup={posGroup} />
            <table>
              <thead>
                <ColumnHeaders count={players.filter(player => player.yearsRemaining > 0).length} type="active" />
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <ActivePlayerRow key={`${posGroup}-${index}`} activePlayer={player} />
                ))}
              </tbody>
            </table>
          </React.Fragment>
        )
      })}

      {/* Minor League Players */}
      {minorLeaguePlayers.length > 0 && (
        <React.Fragment key="minors">
          <PositionGroupHeader posGroup="Minor League" />
          <table>
            <thead>
              <ColumnHeaders count={minorLeaguePlayers.filter(player => player.yearsRemaining > 0).length} type="active" />
            </thead>
            <tbody>
              {minorLeaguePlayers.map((player, index) => (
                <ActivePlayerRow key={`minors-${index}`} activePlayer={player} />
              ))}
            </tbody>
          </table>
        </React.Fragment>
      )}

      {/* Dead Cap Hits */}
      {deadCapHits.length > 0 && (
        <React.Fragment key="deadCap">
          <PositionGroupHeader posGroup="Dead Cap Hit" />
          <table>
            <thead>
              <ColumnHeaders count={deadCapHits.length} type="deadCap" />
            </thead>
            <tbody>
              {deadCapHits.map((capHit, index) => (
                <DeadCapRow key={`deadCap-${index}`} deadCapHit={capHit} />
              ))}
            </tbody>
          </table>
        </React.Fragment>
      )}

      {/* Summary Table */}
      <SummaryTable selectedTeam={selectedTeam} />
      {/* Positional Summary Table */}
      <PositionalSummaryTable players={groupedPlayers} posOrder={positionOrder} minorLeaguers={minorLeaguePlayers} />
    </div>
  );
}