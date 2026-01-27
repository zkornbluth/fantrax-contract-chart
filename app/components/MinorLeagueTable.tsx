/** 
 * @fileoverview Creates the MinorLeagueTable component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from "react";
import PositionGroupHeader from "./PositionGroupHeader";
import ActivePlayerRow from "./ActivePlayerRow";
import ColumnHeaders from "./ColumnHeaders";

export default function MinorLeagueTable({minorLeaguePlayers}) {
    return (
        <React.Fragment key="minors">
            <PositionGroupHeader posGroup="Minor League" />
                <table className="w-[90%] ml-[5%] border-collapse mb-6">
                    <thead>
                        <ColumnHeaders count={minorLeaguePlayers.filter(player => player.yearsRemaining > 0).length} type="active" />
                    </thead>
                    <tbody>
                        {minorLeaguePlayers.map((player, index) => (
                        <ActivePlayerRow key={`minors-${index}`} activePlayer={player} />
                        ))}
                    </tbody>
                </table>
            </React.Fragment>
        )
}