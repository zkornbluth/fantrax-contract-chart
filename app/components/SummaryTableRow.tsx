/** 
 * @fileoverview Creates the SummaryTableRow component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

interface SummaryTableRowProps {
  header: string;
  values: number[];
}

export default function SummaryTableRow({header, values}: SummaryTableRowProps) { // Creates row for either summary or positional summary table
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