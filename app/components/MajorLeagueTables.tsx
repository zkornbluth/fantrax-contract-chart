/** 
 * @fileoverview Creates the GroupedMajorLeagueTable and UngroupedMajorLeagueTable components
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from "react";
import PositionGroupHeader from "./PositionGroupHeader";
import ColumnHeaders from "./ColumnHeaders";
import ActivePlayerRow from "./ActivePlayerRow";

interface MajorLeagueTableProps {
    groupByPosition: boolean;
    positionOrder: string[];
    groupedPlayers: any;
    majorLeaguePlayers: any[];
    sortKey: 'default' | 'age' | 'position' | 'team' | 'name';
    sortDirection: 'asc' | 'desc' | null;
    onSortChange: (columnKey: 'age' | 'position' | 'team' | 'name') => void;
}

function GroupedMajorLeagueTable({
    positionOrder,
    groupedPlayers,
    sortKey,
    sortDirection,
    onSortChange,
}: Pick<MajorLeagueTableProps, 'positionOrder' | 'groupedPlayers' | 'sortKey' | 'sortDirection' | 'onSortChange'>) {
    return (
        positionOrder.map((posGroup) => {
            const players = groupedPlayers[posGroup];
            if (!players || players.length === 0) return null;

            return (
                <React.Fragment key={posGroup}>
                    <PositionGroupHeader posGroup={posGroup} />
                    <table className="w-[90%] ml-[5%] border-collapse mb-6">
                        <thead>
                        <ColumnHeaders
                            count={players.filter(player => player.yearsRemaining > 0).length}
                            type="active"
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSortChange={onSortChange}
                        />
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

function UngroupedMajorLeagueTable({
    players,
    sortKey,
    sortDirection,
    onSortChange,
}: {
    players: any[];
    sortKey: MajorLeagueTableProps['sortKey'];
    sortDirection: MajorLeagueTableProps['sortDirection'];
    onSortChange: MajorLeagueTableProps['onSortChange'];
}) {
    return (
        <React.Fragment key='major-leagues'>
            <PositionGroupHeader posGroup='Major League' />
            <table className="w-[90%] ml-[5%] border-collapse mb-6">
                <thead>
                    <ColumnHeaders
                        count={players.filter(player => player.yearsRemaining > 0).length}
                        type="active"
                        sortKey={sortKey}
                        sortDirection={sortDirection}
                        onSortChange={onSortChange}
                    />
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

export default function MajorLeagueTable({
    groupByPosition,
    positionOrder,
    groupedPlayers,
    majorLeaguePlayers,
    sortKey,
    sortDirection,
    onSortChange,
}: MajorLeagueTableProps) {
    return groupByPosition
        ? (
            <GroupedMajorLeagueTable
                positionOrder={positionOrder}
                groupedPlayers={groupedPlayers}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
            />
        )
        : (
            <UngroupedMajorLeagueTable
                players={majorLeaguePlayers}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortChange={onSortChange}
            />
        );
}