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
    <tr className="player-row">
      <td>
        <div className="player-name-cell">
        {activePlayer.name}
        {activePlayer.injured && (
          <Image src={injured} alt="Injured" className="injured-icon" />
        )}
        </div>
      </td>
      <td className="active-player-cell">{activePlayer.team}</td>
      <td className="active-player-cell">{activePlayer.pos}</td>
      <td className="active-player-cell">{activePlayer.age}</td>
      {activePlayer.yearlyContract.map((salary, index) => {
        const displayValue = typeof salary === "number" 
          ? `$${salary.toLocaleString()}` 
          : salary;

        return (
          <td key={index} className="active-player-cell salary-cell">
            {displayValue}
          </td>
        );
      })}
    </tr>
  )
}