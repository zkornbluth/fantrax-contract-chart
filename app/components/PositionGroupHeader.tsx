/** 
 * @fileoverview Creates the PositionGroupHeader component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

interface PositionGroupHeaderProps {
  posGroup: string;
}

export default function PositionGroupHeader({posGroup}: PositionGroupHeaderProps) { // Generates h2 with either position group name or other headline
  if (posGroup != "Summary" && posGroup != "Positional Summary") posGroup = posGroup + "s";
  return (
    <h2 className='w-[90%] ml-[5%] text-left text-xl font-semibold py-1.5 text-gray-900 dark:text-white'>{posGroup}</h2>
  )
}