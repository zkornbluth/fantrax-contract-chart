/** 
 * @fileoverview Creates the GroupedMajorLeagueTable and UngroupedMajorLeagueTable components
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from "react";
import PositionGroupHeader from "./PositionGroupHeader";
import ColumnHeaders from "./ColumnHeaders";
import ActivePlayerRow from "./ActivePlayerRow";

function GroupedMajorLeagueTable({positionOrder, groupedPlayers}) {
    return (
        positionOrder.map((posGroup) => {
            const players = groupedPlayers[posGroup];
            if (!players || players.length === 0) return null;

            return (
                <React.Fragment key={posGroup}>
                    <PositionGroupHeader posGroup={posGroup} />
                    <table>
                        <thead>
                        <ColumnHeaders count={players.filter(player => player.yearsRemaining > 0).length} type="active" />
                        </thead>
                        <tbody>
                        {players.map((player, index) => (
                            <ActivePlayerRow key={`${posGroup}-${index}`} activePlayer={player} />
                        ))}
                        </tbody>
                    </table>
                </React.Fragment>
            )
            }
        )
    )
}

function UngroupedMajorLeagueTable({players}) {
    return (
        <React.Fragment key='major-leagues'>
            <PositionGroupHeader posGroup='Major League' />
            <table>
                <thead>
                    <ColumnHeaders count={players.filter(player => player.yearsRemaining > 0).length} type="active" />
                </thead>
                <tbody>
                    {players.map((player, index) => (
                    <ActivePlayerRow key={`majors-${index}`} activePlayer={player} />
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    )
}

export {GroupedMajorLeagueTable, UngroupedMajorLeagueTable};