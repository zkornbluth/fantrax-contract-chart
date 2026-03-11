/** 
 * @fileoverview Creates the MinorLeagueTable component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from "react";
import PositionGroupHeader from "./PositionGroupHeader";
import ActivePlayerRow from "./ActivePlayerRow";
import ColumnHeaders from "./ColumnHeaders";

interface MinorLeagueTableProps {
    minorLeaguePlayers: any[];
    sortKey: 'default' | 'age' | 'position' | 'team' | 'name';
    sortDirection: 'asc' | 'desc' | null;
    onSortChange: (columnKey: 'age' | 'position' | 'team' | 'name') => void;
}

export default function MinorLeagueTable({
    minorLeaguePlayers,
    sortKey,
    sortDirection,
    onSortChange,
}: MinorLeagueTableProps) {
    return (
        <React.Fragment key="minors">
            <PositionGroupHeader posGroup="Minor League" />
                <table className="w-[90%] ml-[5%] border-collapse mb-6">
                    <thead>
                        <ColumnHeaders
                            count={minorLeaguePlayers.filter(player => player.yearsRemaining > 0).length}
                            type="active"
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            onSortChange={onSortChange}
                        />
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