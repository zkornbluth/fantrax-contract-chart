/** 
 * @fileoverview Creates the SummaryTable component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from 'react';
import ColumnHeaders from './ColumnHeaders';
import PositionGroupHeader from './PositionGroupHeader';
import SummaryTableRow from './SummaryTableRow';
import { getActivePayroll, getDeadCapSum, getCapHit, getCapSpace } from '../utils/capCalculations';

interface SummaryTableProps {
  selectedTeam: any;
}

export default function SummaryTable({selectedTeam}: SummaryTableProps) {
  let years = [2026, 2027, 2028, 2029, 2030, 2031];
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