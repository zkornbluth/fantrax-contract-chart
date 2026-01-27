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
    <tr className="border-y border-gray-300 dark:border-gray-600 odd:bg-gray-50 dark:odd:bg-gray-800/50 even:bg-white dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <td colSpan={4} className="py-0.5 px-4 text-gray-900 dark:text-white">{deadCapHit.name}</td>
      {deadCapHit.yearlyCapHit.map((salary, index) => {
        let displayValue;
        if (typeof salary === "number") {
          if (Math.round(salary) !== salary) salary = salary.toFixed(2);
          displayValue = `$${salary.toLocaleString()}`;
        } else {
          displayValue = salary;
        }

        return (
          <td key={index} className="text-center py-0.5 px-4 text-gray-900 dark:text-white w-[10%]">
            {displayValue}
          </td>
        );
      })}
    </tr>
  )
}