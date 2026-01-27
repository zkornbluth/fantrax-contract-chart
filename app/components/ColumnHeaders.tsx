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
      <tr className="bg-white dark:bg-gray-800">
        <th className="text-left w-1/4 py-1 px-4 font-semibold text-gray-900 dark:text-white">PLAYER ({count})</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white">TEAM</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white">POS</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white">AGE</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2026</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2027</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2028</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2029</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2030</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2031</th>
      </tr>
    )
  } else if (type == "deadCap") {
    return (
      <tr className="bg-white dark:bg-gray-800">
        <th className="text-left py-1 px-4 font-semibold text-gray-900 dark:text-white" colSpan={4}>PLAYER ({count})</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2026</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2027</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2028</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2029</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2030</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2031</th>
      </tr>
    )
  } else {
    return (
      <tr className="bg-white dark:bg-gray-800">
        <th colSpan={4} className="py-1 px-4"></th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2026</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2027</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2028</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2029</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2030</th>
        <th className="text-center py-1 px-4 font-semibold text-gray-900 dark:text-white w-[10%]">2031</th>
      </tr>
    )
  }
}