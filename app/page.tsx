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
  } else if (type == "deadCap") {
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
  } else {
    return (
      <tr className="column-headers">
        <th colSpan={4}></th>
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
  if (posGroup != "Summary") posGroup = posGroup + "s";
  return (
    <tr className="position-group-header">
      <td colSpan={10}><strong>{posGroup}</strong></td>
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
  let ceiling = teamCapData.salaryCap; 
  return ceiling - getCapHit(year);
}

function getActivePayroll(year: number) {
  let capHit = 0;
  let index = year - 2025;

  for (let player of teamCapData.activePlayers) {
    if (typeof(player.yearlyContract[index]) === "number") {
      capHit += player.yearlyContract[index];
    }
  }

  return capHit;
}

function getDeadCapSum(year: number) {
  let capHit = 0;
  let index = year - 2025;

  for (let deadCap of teamCapData.deadCapHits) {
    if (typeof(deadCap.yearlyCapHit[index]) === "number") {
      capHit += deadCap.yearlyCapHit[index];
    }
  }

  return capHit;
}

function getCapHit(year: number) {
  return getActivePayroll(year) + getDeadCapSum(year);
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

function SummaryTable() {
  let years = [2025, 2026, 2027, 2028, 2029, 2030];
  let yearlyMaximums = new Array(6).fill(teamCapData.salaryCap);
  let yearlyPayrolls = years.map(getActivePayroll);
  let yearlyDeadCaps = years.map(getDeadCapSum);
  let yearlyCapHit = years.map(getCapHit);
  let yearlyCapSpace = years.map(getCapSpace);

  // Display the following rows: Cap Maximum, Active Payroll, Dead Cap Hits, Total Payroll, Cap Space
  return (
    <React.Fragment>
      <PositionGroupHeader posGroup="Summary" />
      <ColumnHeaders count={0} type="summary" />
      {/* Cap Ceiling */}
      <tr className="player-row">
        <td colSpan={4}>Cap Maximum</td>
        {yearlyMaximums.map((n, key) => (
          <td key={key} className="active-player-cell salary-cell">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
      {/* Active Payroll */}
      <tr className="player-row">
        <td colSpan={4}>Active Payroll</td>
        {yearlyPayrolls.map((n, key) => (
          <td key={key} className="active-player-cell salary-cell">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
      {/* Dead Cap Hits */}
      <tr className="player-row">
        <td colSpan={4}>Dead Cap Hits</td>
        {yearlyDeadCaps.map((n, key) => (
          <td key={key} className="active-player-cell salary-cell">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
      {/* Total Payroll */}
      <tr className="player-row">
        <td colSpan={4}>Total Payroll</td>
        {yearlyCapHit.map((n, key) => (
          <td key={key} className="active-player-cell salary-cell">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
      {/* Cap Space */}
      <tr className="player-row">
        <td colSpan={4}>Cap Space</td>
        {yearlyCapSpace.map((n, key) => (
          <td key={key} className="active-player-cell salary-cell">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
    </React.Fragment>
  )
}

function PositionalSummaryRow({posGroup}) {

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
          <SummaryTable />

          {/* Positional Summary Table */}
          {/* lines for each positional group, and minors separate at the bottom */}
        </tbody>
      </table>
    </div>
  );
}