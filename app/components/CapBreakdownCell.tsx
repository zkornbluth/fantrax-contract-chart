/**
 * @fileoverview Creates the CapBreakdownCell component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

interface CapBreakdownCellProps {
  value: number;
  salaryCap: number;
}

const formatCurrency = (n: number) =>
  `$${(Math.round(n) !== n ? n.toFixed(2) : n).toLocaleString()}`;

export default function CapBreakdownCell({ value, salaryCap }: CapBreakdownCellProps) { // Renders a dollar value over a bar shaded by its share of the team's salary cap
  const proportion = salaryCap > 0 ? value / salaryCap : 0;
  const widthPct = Math.max(0, Math.min(proportion, 1)) * 100;

  return (
    <div className="relative h-7 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
      <div
        className="absolute inset-y-0 left-0 bg-blue-200 dark:bg-blue-800/60"
        style={{ width: `${widthPct}%` }}
      />
      <div className="relative flex items-center justify-center h-full text-xs font-medium text-gray-900 dark:text-white">
        {formatCurrency(value)}
      </div>
    </div>
  );
}
