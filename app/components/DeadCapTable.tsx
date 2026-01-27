/** 
 * @fileoverview Creates the DeadCapTable component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

import React from "react";
import PositionGroupHeader from "./PositionGroupHeader";
import DeadCapRow from "./DeadCapRow";
import ColumnHeaders from "./ColumnHeaders";

export default function DeadCapTable({deadCapHits}) {
    return (
         <React.Fragment key="deadCap">
            <PositionGroupHeader posGroup="Dead Cap Hit" />
            <table className="w-[90%] ml-[5%] border-collapse mb-6">
                <thead>
                    <ColumnHeaders count={deadCapHits.length} type="deadCap" />
                </thead>
                <tbody>
                    {deadCapHits.map((capHit, index) => (
                    <DeadCapRow key={`deadCap-${index}`} deadCapHit={capHit} />
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    )
}