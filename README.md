# Fantrax Contract Chart

Check it out here: [insert link once this is live]

## Features
The Fantrax Contract Chart displays a Spotrac-style payroll table for my dynasty baseball team.
<!-- Insert image -->

Players are divided by positional grouping.

Notes on positional grouping:
- Pitchers with eligibility a starter and reliever are listed as relievers
- Batters with eligibility at multiple positions are listed by the position that appears first (ex. a player with 1B,2B,OF eligibility will show up as 1B and appear with infielders)

Major league players on the injured list are designated with an icon next to their names. Players with day-to-day injuries won't have an icon.
<!-- Insert image -->

Minor league players are grouped together in a "Minor Leagues" section.
<!-- Insert image -->

Dead cap hits are displayed below all players.
<!-- Insert image -->

At the bottom, two summary tables are displayed:
- Cap maximum, total active payroll, total dead cap hits, total payroll, cap space
- A positional breakdown with the total salary allocated per year for each positional grouping
<!-- Insert image -->

## Getting Started

If you want to set this up locally, follow the instructions below.

### 1. Ensure you have the following installed:
* Git
* node.js
* npm (Node Package Manager)

### 2. Clone the repository
```bash
git clone https://github.com/zkornbluth/fantrax-contract-chart.git
cd fantrax-contract-chart
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run
```bash
npm run dev
```

Your console should display a URL that looks like this: [https://localhost:3000](https://localhost:3000). Copy and paste that URL into a browser. 
Don't use the link here as your port may be different.

## Setting up a Different Team

This should work for teams in other leagues with the same general structure as my league:
- Salary cap
- Multi year contracts

If your league doesn't have a minor league system, that section won't appear.

### 1. Find your league and team ID
Clicking 'Roster' in the sidebar won't get you both. Click 'Standings' then click your team name in the standings. The league and team ID will both be in the URL.
![findingurl](https://github.com/user-attachments/assets/faf4aeab-2672-4543-86fd-f1d49175746d)

### 2. Set your league and team ID in the code
In `getTeamInfo.ts`, replace my leagueID and teamID with yours
[https://github.com/zkornbluth/fantrax-contract-chart/blob/9e591f40098b0384281a77f435d0b5fcf5cd1127/app/getTeamInfo.ts#L113-L114](https://github.com/zkornbluth/fantrax-contract-chart/blob/9e591f40098b0384281a77f435d0b5fcf5cd1127/app/getTeamInfo.ts#L113-L114)

### 3. Generate your own teamCapInfo.json
```bash
tsc getTeamInfo.ts // this converts the TypeScript file to JavaScript
node getTeamInfo.js // this runs the JavaScript file that updates the .json file
```

### 4. Run
```bash
npm run dev
```
