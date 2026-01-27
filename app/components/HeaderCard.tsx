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
    <div className={`flex items-center justify-center gap-5 p-6 text-xl w-[275px] ${bordered ? 'border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm' : ''}`}>
      <Image src={icon} alt="Money Icon" className="w-[30px] h-[30px] dark:invert" />
      <div className="flex flex-col leading-tight">
        <div className="text-gray-900 dark:text-white">{text}</div>
        <div className="font-bold text-gray-900 dark:text-white">{formattedNum}</div>
      </div>
    </div>
  )
}