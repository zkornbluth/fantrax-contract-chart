'use client';

import React, { useState, useEffect } from 'react';
import teamCapData from './teamCapInfo.json';
import './styles.css';
import injured from './assets/injured.png';
import dollar from './assets/dollar.png';
import Image from 'next/image';

function ActivePlayerRow({activePlayer}) {
  return (
    <tr className="player-row">
      <td>
        <div className="player-name-cell">
        {activePlayer.name}
        {activePlayer.injured && (
          <Image src={injured} alt="Injured" className="injured-icon" />
        )}
        </div>
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

function getCapSpace(year: number) {
  let ceiling = parseFloat(teamCapData.salaryCap.replace(/[$,]/g, "")); // Scraper saves it as a string
  return ceiling - getCapHit(year);
}

function getCapHit(year: number) {
  let capHit = 0;
  let index = year - 2025; // index 0 is 2025, index 1 is 2026, etc.

  // Add active players
  for (let player of teamCapData.activePlayers) {
    if (typeof(player.yearlyContract[index]) === "number") {
      capHit += player.yearlyContract[index];
    }
  }

  // Add dead cap hits
  for (let deadCap of teamCapData.deadCapHits) {
    if (typeof(deadCap.yearlyCapHit[index]) === "number") {
      capHit += deadCap.yearlyCapHit[index];
    }
  }

  return capHit;
}

function CapSpaceHeader() {
  let capSpace = getCapSpace(2025);

  return (
    <HeaderCard text="2025 Cap Space" num={capSpace} />
  )
}

function CapHitHeader() {
  let capHit = getCapHit(2025);

  return (
    <HeaderCard text="2025 Cap Hit" num={capHit} />
  )
}

function HeaderCard({text, num}) { 
  // Make two of these, for 2025 Cap Hit and 2025 Cap Space
  // CapHitHeader and CapSpaceHeader should each call it
  const formattedNum = num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className="header-card">
      {/* <div>{text}</div> */}
      <Image src={dollar} alt="Money Icon" className="dollar-icon" />
      <div className="header-card-text">
        <div>{text}</div>
        <div><strong>{formattedNum}</strong></div>
      </div>
    </div>
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
      if (salaryA !== salaryB) {
        return salaryB - salaryA;
      }
      return b.yearsRemaining - a.yearsRemaining;
    });
  });

  minorLeaguePlayers.sort((a, b) => {
    const salaryA = typeof a.yearlyContract[0] === 'number' ? a.yearlyContract[0] : 0;
    const salaryB = typeof b.yearlyContract[0] === 'number' ? b.yearlyContract[0] : 0;
    if (salaryA !== salaryB) {
      return salaryB - salaryA;
    }
    return b.yearsRemaining - a.yearsRemaining;
  });

  const deadCapHits = teamCapData.deadCapHits;

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
      <h1>Walker Buehler's Day Off: Multi-Year Payroll Table</h1>
      {/* Header Cards */}
      <div className="cap-headers">
        <CapHitHeader />
        <CapSpaceHeader />
      </div>
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

          {/* Summary Table */}
          {/* lines for active players, dead cap, total payroll, cap space */}

          {/* Positional Summary Table */}
          {/* lines for each positional group, and minors separate at the bottom */}
        </tbody>
      </table>
    </div>
  );
}