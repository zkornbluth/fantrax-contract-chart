/** 
 * @fileoverview Creates the HeaderCard component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import Image, {StaticImageData} from 'next/image';

interface HeaderCardProps {
  text: string;
  num: number;
  icon: StaticImageData;
  bordered?: boolean;
}

export default function HeaderCard({text, num, icon, bordered=true}: HeaderCardProps) { 
  // Make three of these, for 2026 Cap Hit, 2026 Cap Space, and Cap Max
  // CapHitHeader, CapSpaceHeader, CapMaxHeader each call it
  const formattedNum = num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div className={"header-card" + (bordered ? " header-card-bordered" : "")}>
      <Image src={icon} alt="Money Icon" className="dollar-icon" />
      <div className="header-card-text">
        <div>{text}</div>
        <div><strong>{formattedNum}</strong></div>
      </div>
    </div>
  )
}