/** 
 * @fileoverview Creates the ActivePlayerRow component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from 'react';
import Image from 'next/image';
import injured from '../assets/injured.png';

interface ActivePlayerRowProps {
  activePlayer: {
    name: string;
    injured?: boolean;
    team: string;
    pos: string;
    age: number;
    yearlyContract: (number | string)[];
  };
}

export default function ActivePlayerRow({ activePlayer }: ActivePlayerRowProps) { // Generates one row for one active player
  return (
    <tr className="border-y border-gray-300 dark:border-gray-600 odd:bg-gray-50 dark:odd:bg-gray-800/50 even:bg-white dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <td className="py-0.5 px-4 text-gray-900 dark:text-white">
        <div className="inline-flex items-center gap-1.5">
        {activePlayer.name}
        {activePlayer.injured && (
          <Image src={injured} alt="Injured" className="w-4 h-4" />
        )}
        </div>
      </td>
      <td className="text-center py-0.5 px-4 text-gray-900 dark:text-white">{activePlayer.team}</td>
      <td className="text-center py-0.5 px-4 text-gray-900 dark:text-white">{activePlayer.pos}</td>
      <td className="text-center py-0.5 px-4 text-gray-900 dark:text-white">{activePlayer.age}</td>
      {activePlayer.yearlyContract.map((salary, index) => {
        const displayValue = typeof salary === "number" 
          ? `$${salary.toLocaleString()}` 
          : salary;

        return (
          <td key={index} className="text-center py-0.5 px-4 text-gray-900 dark:text-white w-[10%]">
            {displayValue}
          </td>
        );
      })}
    </tr>
  )
}