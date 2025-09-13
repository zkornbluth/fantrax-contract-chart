'use client';

import React, { useState, useEffect } from 'react';
import teamCapData from './teamCapInfo.json';
import './styles.css';
import injured from './assets/injured.png';
import Image from 'next/image';

function ActivePlayerRow({activePlayer}) {
  return (
    <tr className="player-row">
      <td>
        {activePlayer.name}
        {activePlayer.injured && (
          <Image src={injured} alt="Injured" className="injured-icon" />
        )}
      </td>
      <td className="active-player-cell">{activePlayer.team}</td>
      <td className="active-player-cell">{activePlayer.pos}</td>
      <td className="active-player-cell">{activePlayer.age}</td>
      {activePlayer.yearlyContract.map((salary, index) => {
        let displayValue;
        if (typeof salary === "number") {
          displayValue = `$${salary.toLocaleString()}`;
        } else {
          displayValue = salary;
        }

        return (
          <td key={index} className="active-player-cell salary-cell">
            {displayValue}
          </td>
        );
      })}
    </tr>
  )
}

function ColumnHeaders({count, type}) {
  if (type == "active") {
    return (
      <tr className="column-headers">
        <th className="column-header-player">PLAYER ({count})</th>
        <th>TEAM</th>
        <th>POS</th>
        <th>AGE</th>
        <th>2025</th>
        <th>2026</th>
        <th>2027</th>
        <th>2028</th>
        <th>2029</th>
        <th>2030</th>
      </tr>
    )
  } else {
    return (
      <tr className="column-headers">
        <th className="column-header-player" colSpan={4}>PLAYER ({count})</th>
        <th>2025</th>
        <th>2026</th>
        <th>2027</th>
        <th>2028</th>
        <th>2029</th>
        <th>2030</th>
      </tr>
    )
  }
}

function PositionGroupHeader({posGroup}) {
  return (
    <tr className="position-group-header">
      <td colSpan={10}><strong>{posGroup}s</strong></td>
    </tr>
  )
}

function DeadCapRow({deadCapHit}) {
  return (
    <tr className="player-row">
      <td colSpan={4}>{deadCapHit.name}</td>
      {deadCapHit.yearlyCapHit.map((salary, index) => {
        let displayValue;
        if (typeof salary === "number") {
          if (Math.round(salary) !== salary) salary = salary.toFixed(2);
          displayValue = `$${salary.toLocaleString()}`;
        } else {
          displayValue = salary;
        }

        return (
          <td key={index} className="active-player-cell salary-cell">
            {displayValue}
          </td>
        );
      })}
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

  const deadCapHits = teamCapData.deadCapHits;

  deadCapHits.sort((a, b) => {
    const salaryA = typeof a.yearlyCapHit[0] === 'number' ? a.yearlyCapHit[0] : 0;
    const salaryB = typeof b.yearlyCapHit[0] === 'number' ? b.yearlyCapHit[0] : 0;
    return salaryB - salaryA;
  });

  return (
    <div>
      <h1>Walker Buehler's Day Off: Multi-Year Payroll Table</h1>
      <table className="active-players">
        <tbody>
          {/* Major League Players */}
          {positionOrder.map((posGroup) => {
            const players = groupedPlayers[posGroup];
            if (!players || players.length === 0) return null;
            
            return (
              <React.Fragment key={posGroup}>
                <PositionGroupHeader posGroup={posGroup} />
                <ColumnHeaders count={players.length} type={"active"} />
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
              <ColumnHeaders count={minorLeaguePlayers.length} type={"active"} />
              {minorLeaguePlayers.map((player, index) => (
                <ActivePlayerRow key={`minors-${index}`} activePlayer={player} />
              ))}
            </React.Fragment>
          )}

          {/* Dead Cap Hits */}
          {deadCapHits.length > 0 && (
            <React.Fragment key="deadCap">
              <PositionGroupHeader posGroup="Dead Cap Hit" />
              <ColumnHeaders count={deadCapHits.length} type={"deadCap"} />
              {deadCapHits.map((capHit, index) => (
                <DeadCapRow key={`deadCap-${index}`} deadCapHit={capHit} />
              ))}
            </React.Fragment>
          )}
        </tbody>
      </table>
    </div>
  );
}