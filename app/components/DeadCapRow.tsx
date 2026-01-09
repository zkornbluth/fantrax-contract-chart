/** 
 * @fileoverview Creates the DeadCapRow component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

interface DeadCapRowProps {
  deadCapHit: {
    name: string;
    yearlyCapHit: (number | string)[];
  };
}

export default function DeadCapRow({deadCapHit}: DeadCapRowProps) { // Generates one row for one dead cap hit
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