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
    <h2 className='position-group-header'>{posGroup}</h2>
  )
}