/** 
 * @fileoverview Creates the HomePage with the contract chart display
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

'use client';

import React, {useState} from 'react';
import teamCapData from './teamCapInfo.json';
import './styles.css';
import injured from './assets/injured.png';
import billstack from './assets/billstack.png';
import paying from './assets/paying.png';
import bills from './assets/bills.png';
import Image from 'next/image';

function ActivePlayerRow({activePlayer}) { // Generates one row for one active player
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

function ColumnHeaders({count=0, type}) { // Generates column headers for each pos group/section
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
        <th className="column-header-deadcap" colSpan={4}>PLAYER ({count})</th>
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

function PositionGroupHeader({posGroup}) { // Generates h2 with either position group name or other headline
  if (posGroup != "Summary" && posGroup != "Positional Summary") posGroup = posGroup + "s";
  return (
    <h2 className='position-group-header'>{posGroup}</h2>
  )
}

function DeadCapRow({deadCapHit}) { // Generates one row for one dead cap hit
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

function getCapSpace(selectedTeam, year: number) { // Gets cap space given scraped cap ceiling
  let ceiling = selectedTeam.salaryCap; 
  return ceiling - getCapHit(selectedTeam, year);
}

function getActivePayroll(selectedTeam, year: number) { // Gets total active payroll for specific year
  return getPositionalSum(selectedTeam.activePlayers, year);
}

function getDeadCapSum(selectedTeam, year: number) { // Gets total dead cap hits for specific year
  let capHit = 0;
  let index = year - 2025;

  if (!selectedTeam.deadCapHits || !Array.isArray(selectedTeam.deadCapHits)) {
    return capHit;
  }

  for (let deadCap of selectedTeam.deadCapHits) {
    if (typeof(deadCap.yearlyCapHit[index]) === "number") {
      capHit += deadCap.yearlyCapHit[index];
    }
  }

  return capHit;
}

function getCapHit(selectedTeam, year) {
  return getActivePayroll(selectedTeam, year) + getDeadCapSum(selectedTeam, year);
}

function CapSpaceHeader({selectedTeam}) {
  let capSpace = getCapSpace(selectedTeam, 2026);

  return (
    <HeaderCard text="2026 Cap Space" num={capSpace} icon={bills} />
  )
}

function CapHitHeader({selectedTeam}) {
  let capHit = getCapHit(selectedTeam, 2026);

  return (
    <HeaderCard text="2026 Total Payroll" num={capHit} icon={paying} />
  )
}

function CapMaxHeader({selectedTeam}) {
  let ceil = selectedTeam.salaryCap;

  return (
    <HeaderCard text="Cap Ceiling" num={ceil} icon={billstack} bordered={false} />
  )
}

function HeaderCard({text, num, icon, bordered=true}) { 
  // Make three of these, for 2025 Cap Hit, 2025 Cap Space, and 2025 Cap Max
  // CapHitHeader, CapSpaceHeader, CapMaxHeader each call it
  const formattedNum = num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className={"header-card" + (bordered ? " header-card-bordered" : "")}>
      <Image src={icon} alt="Money Icon" className="dollar-icon" />
      <div className="header-card-text">
        <div>{text}</div>
        <div><strong>{formattedNum}</strong></div>
      </div>
    </div>
  )
}

function SummaryTableRow({header, values}) { // Creates row for either summary or positional summary table
  return (
    <tr className="player-row">
        <td colSpan={4}>{header}</td>
        {values.map((n, key) => (
          <td key={key} className="active-player-cell salary-cell">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
  )
}

function SummaryTable({selectedTeam}) {
  let years = [2025, 2026, 2027, 2028, 2029, 2030];
  let yearlyMaximums = new Array(6).fill(selectedTeam.salaryCap);
  let yearlyPayrolls = years.map((year) => getActivePayroll(selectedTeam, year));
  let yearlyDeadCaps = years.map((year) => getDeadCapSum(selectedTeam, year));
  let yearlyCapHit = years.map((year) => getCapHit(selectedTeam, year));
  let yearlyCapSpace = years.map((year) => getCapSpace(selectedTeam, year));

  // Display the following rows: Cap Maximum, Active Payroll, Dead Cap Hits, Total Payroll, Cap Space
  return (
    <React.Fragment>
      <PositionGroupHeader posGroup="Summary" />
      <table>
        <thead>
          <ColumnHeaders type="summary" />
        </thead>
        <tbody>
          {/* Cap Ceiling */}
          <SummaryTableRow header="Cap Ceiling" values={yearlyMaximums} />
          {/* Active Payroll */}
          <SummaryTableRow header="Active Payroll" values={yearlyPayrolls} />
          {/* Dead Cap Hits */}
          <SummaryTableRow header="Dead Cap Hits" values={yearlyDeadCaps} />
          {/* Total Payroll */}
          <SummaryTableRow header="Total Payroll" values={yearlyCapHit} />
          {/* Cap Space */}
          <SummaryTableRow header="Cap Space" values={yearlyCapSpace} />
        </tbody>
      </table>
    </React.Fragment>
  )
}

function getPositionalSum(players, year) { 
  // Get sum of all salaries for group of players and specific year
  // Position determined before calling this
  // getActivePayroll passes in all players
  let sum = 0;
  let index = year - 2025;

  if (!players || !Array.isArray(players)) {
    return sum;
  }

  for (let player of players) {
    if (typeof(player.yearlyContract[index]) === "number") {
      sum += player.yearlyContract[index];
    }
  }

  return sum;
}

function PositionalSummaryTable({players, posOrder, minorLeaguers}) {
  let years = [2025, 2026, 2027, 2028, 2029, 2030];

  // Get list of position groups (from major league players)
  let posGroups = Object.keys(players);
  let posGroupSums = {};

  // For each position group, sum up salaries for each year
  for (let posGroup of posGroups) {
    let posPlayers = players[posGroup];
    let posSalarySums = years.map((year) => {
      return getPositionalSum(posPlayers, year);
    });
    posGroupSums[posGroup] = posSalarySums;
  }

  // Keep positions in posOrder, remove any that don't appear in posGroups
  const displayPosGroups = posOrder.filter(pos => posGroups.includes(pos));

  // Get minor leaguers
  let minorLeagueSalarySums = years.map((year) => {
    return getPositionalSum(minorLeaguers, year);
  })

  return (
    <React.Fragment>
      <PositionGroupHeader posGroup="Positional Summary" />
      <table>
        <thead>
          <ColumnHeaders type="summary" />
        </thead>
        <tbody>
        {displayPosGroups.map((posGroup, index) => (
          <SummaryTableRow key={index} header={posGroup + "s"} values={posGroupSums[posGroup]} />
        ))}
        <SummaryTableRow header={"Minor Leagues"} values={minorLeagueSalarySums} />
        </tbody>
      </table>
    </React.Fragment>
  )
}
 
export default function HomePage() {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(7); // Default to my team
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
      <div className="team-selector">
        <label htmlFor="team-select">Select Team: </label>
        <select 
          id="team-select"
          value={selectedTeamIndex} 
          onChange={(e) => setSelectedTeamIndex(Number(e.target.value))}
          className="team-dropdown"
        >
          {teamCapData.teams.map((team, index) => (
            <option key={index} value={index}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

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
                <ColumnHeaders count={players.length} type="active" />
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
              <ColumnHeaders count={minorLeaguePlayers.length} type="active" />
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