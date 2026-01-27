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
    <div className="text-base flex justify-center items-center">
      <label htmlFor="team-select" className="text-gray-900 dark:text-white">Select Team: </label>
      <select 
        id="team-select"
        value={selectedTeamIndex} 
        onChange={(e) => onTeamChange(Number(e.target.value))}
        className="ml-2.5 px-3 py-2 text-base rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
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