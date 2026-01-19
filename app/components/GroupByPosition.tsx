/** 
 * @fileoverview Creates the GroupByPosition component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

export default function GroupByPosition({groupByPosition, setGroupByPosition}) {
    return (
        <span className='group-by-position'>
          <label htmlFor="groupByPos">
            Group Major League Players by Position
          </label>
          <input
            type="checkbox"
            id="groupByPos"
            checked={groupByPosition}
            onChange={() => setGroupByPosition(!groupByPosition)}
          />
        </span>
    )
}