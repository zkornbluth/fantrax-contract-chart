/** 
 * @fileoverview Creates the ColumnHeaders component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

interface ColumnHeadersProps {
  count?: number;
  type: 'active' | 'deadCap' | 'summary';
}

export default function ColumnHeaders({ count = 0, type }: ColumnHeadersProps) { // Generates column headers for each pos group/section
    if (type == "active") {
    return (
      <tr className="column-headers">
        <th className="column-header-player">PLAYER ({count})</th>
        <th>TEAM</th>
        <th>POS</th>
        <th>AGE</th>
        <th>2026</th>
        <th>2027</th>
        <th>2028</th>
        <th>2029</th>
        <th>2030</th>
        <th>2031</th>
      </tr>
    )
  } else if (type == "deadCap") {
    return (
      <tr className="column-headers">
        <th className="column-header-deadcap" colSpan={4}>PLAYER ({count})</th>
        <th>2026</th>
        <th>2027</th>
        <th>2028</th>
        <th>2029</th>
        <th>2030</th>
        <th>2031</th>
      </tr>
    )
  } else {
    return (
      <tr className="column-headers">
        <th colSpan={4}></th>
        <th>2026</th>
        <th>2027</th>
        <th>2028</th>
        <th>2029</th>
        <th>2030</th>
        <th>2031</th>
      </tr>
    )
  }
}