'use client';

import React, { useState, useEffect } from 'react';
import teamCapData from './teamCapInfo.json';
import './styles.css';
import injured from './assets/injured.png';
import Image from 'next/image';

function ActivePlayerRow({activePlayer}) {
  return (
    <tr>
      <td>
        {activePlayer.name}
        {activePlayer.injured && (
          <Image src={injured} alt="Injured" className="injured-icon" />
        )}
      </td>
      <td>{activePlayer.team}</td>
      <td>{activePlayer.pos}</td>
      <td>{activePlayer.age}</td>
      {activePlayer.yearlyContract.map((salary, index) => (
        <td key={index}>{salary}</td>
      ))}
    </tr>
  )
}

function ColumnHeaders() {
  return (
    <tr className="column-headers">
      <th className="column-header-player">Player</th>
      <th>Team</th>
      <th>Pos</th>
      <th>Age</th>
      <th>2025</th>
      <th>2026</th>
      <th>2027</th>
      <th>2028</th>
      <th>2029</th>
      <th>2030</th>
    </tr>
  )
}

function PositionGroupHeader({posGroup}) {
  return (
    <tr className="position-group-header">
      <td colSpan={10}><strong>{posGroup}s</strong></td>
    </tr>
  )
}
 
export default function HomePage() {
  const positionOrder = [
    'Starting Pitcher',
    'Relief Pitcher',
    'Catcher',
    'Infielder', 
    'Outfielder',
    'Designated Hitter'
  ];

  const majorLeaguePlayers = teamCapData.activePlayers.filter(player => !player.minors);
  const minorLeaguePlayers = teamCapData.activePlayers.filter(player => player.minors);

  const groupedPlayers = majorLeaguePlayers.reduce((groups, player) => {
    const group = player.posGroup || 'Unknown';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(player);
    return groups;
  }, {});

  Object.keys(groupedPlayers).forEach(group => {
    groupedPlayers[group].sort((a, b) => {
      const salaryA = typeof a.yearlyContract[0] === 'number' ? a.yearlyContract[0] : 0;
      const salaryB = typeof b.yearlyContract[0] === 'number' ? b.yearlyContract[0] : 0;
      return salaryB - salaryA; // Sort by 2025 salary, highest first
    });
  });

  minorLeaguePlayers.sort((a, b) => {
    const salaryA = typeof a.yearlyContract[0] === 'number' ? a.yearlyContract[0] : 0;
    const salaryB = typeof b.yearlyContract[0] === 'number' ? b.yearlyContract[0] : 0;
    return salaryB - salaryA;
  });

  return (
    <div>
      <h1>Walker Buehler's Day Off: Multi-Year Payroll Table</h1>
      <table>
        <tbody>
          {/* Major League Players */}
          {positionOrder.map((posGroup) => {
            const players = groupedPlayers[posGroup];
            if (!players || players.length === 0) return null;
            
            return (
              <React.Fragment key={posGroup}>
                <PositionGroupHeader posGroup={posGroup} />
                <ColumnHeaders />
                {players.map((player, index) => (
                  <ActivePlayerRow key={`${posGroup}-${index}`} activePlayer={player} />
                ))}
              </React.Fragment>
            );
          })}
          
          {/* Minor League Players */}
          {minorLeaguePlayers.length > 0 && (
            <React.Fragment key="minors">
              <PositionGroupHeader posGroup="Minor League" />
              <ColumnHeaders />
              {minorLeaguePlayers.map((player, index) => (
                <ActivePlayerRow key={`minors-${index}`} activePlayer={player} />
              ))}
            </React.Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
}