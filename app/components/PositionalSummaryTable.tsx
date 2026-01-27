/** 
 * @fileoverview Creates the PositionalSummaryTable component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from 'react';
import ColumnHeaders from './ColumnHeaders';
import PositionGroupHeader from './PositionGroupHeader';
import SummaryTableRow from './SummaryTableRow';
import { getPositionalSum } from '../utils/capCalculations';

interface PositionalSummaryTableProps {
  players: { [key: string]: any[] };
  posOrder: string[];
  minorLeaguers: any[];
}

export default function PositionalSummaryTable({players, posOrder, minorLeaguers}: PositionalSummaryTableProps) {
  let years = [2026, 2027, 2028, 2029, 2030, 2031];

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
      <table className="w-[90%] ml-[5%] border-collapse mb-6">
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