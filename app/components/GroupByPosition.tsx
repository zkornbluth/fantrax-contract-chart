/** 
 * @fileoverview Creates the GroupByPosition component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

export default function GroupByPosition({groupByPosition, setGroupByPosition}) {
    return (
        <span className='text-base flex items-center gap-2'>
          <label htmlFor="groupByPos" className="text-gray-900 dark:text-white cursor-pointer">
            Group Major League Players by Position
          </label>
          <input
            type="checkbox"
            id="groupByPos"
            checked={groupByPosition}
            onChange={() => setGroupByPosition(!groupByPosition)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
          />
        </span>
    )
}