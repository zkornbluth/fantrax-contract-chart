/** 
 * @fileoverview Creates the CapSpaceHeader, CapHitHeader, and CapMaxHeader components
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import HeaderCard from './HeaderCard';
import { getCapSpace, getCapHit } from '../utils/capCalculations';
import bills from '../assets/bills.png';
import paying from '../assets/paying.png';
import billstack from '../assets/billstack.png';

interface Team {
  salaryCap: number;
  activePlayers: any[];
  deadCapHits?: any[];
}

interface HeaderCardsProps {
  selectedTeam: Team;
}

export function CapSpaceHeader({selectedTeam}: HeaderCardsProps) {
  let capSpace = getCapSpace(selectedTeam, 2026);

  return (
    <HeaderCard text="2026 Cap Space" num={capSpace} icon={bills} />
  )
}

export function CapHitHeader({selectedTeam}: HeaderCardsProps) {
  let capHit = getCapHit(selectedTeam, 2026);

  return (
    <HeaderCard text="2026 Total Payroll" num={capHit} icon={paying} />
  )
}

export function CapMaxHeader({selectedTeam}: HeaderCardsProps) {
  let ceil = selectedTeam.salaryCap;

  return (
    <HeaderCard text="Cap Ceiling" num={ceil} icon={billstack} bordered={false} />
  )
}