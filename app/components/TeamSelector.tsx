/** 
 * @fileoverview Creates the TeamSelector component
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

interface TeamSelectorProps {
  teams: { teamName: string }[];
  selectedTeamIndex: number;
  onTeamChange: (index: number) => void;
}

export default function TeamSelector({ teams, selectedTeamIndex, onTeamChange }: TeamSelectorProps) { // Team selection dropdown
  return (
    <div className="team-selector">
      <label htmlFor="team-select">Select Team: </label>
      <select 
        id="team-select"
        value={selectedTeamIndex} 
        onChange={(e) => onTeamChange(Number(e.target.value))}
        className="team-dropdown"
      >
        {teams.map((team, index) => (
          <option key={index} value={index}>
            {team.teamName}
          </option>
        ))}
      </select>
    </div>
  );
}