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
    <tr className="border-y border-gray-300 dark:border-gray-600 odd:bg-gray-50 dark:odd:bg-gray-800/50 even:bg-white dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <td colSpan={4} className="py-0.5 px-4 text-gray-900 dark:text-white font-medium">{header}</td>
        {values.map((n, key) => (
          <td key={key} className="text-center py-0.5 px-4 text-gray-900 dark:text-white w-[10%]">
            {`$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`}
          </td>
        ))}
      </tr>
  )
}