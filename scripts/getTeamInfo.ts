/** 
 * @fileoverview Scrapes Fantrax site and outputs to teamCapInfo.json
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

class ActivePlayer {
    name: string;
    age: number;
    team: string;
    pos: string;
    minors: boolean;
    injured: boolean;
    yearlyContract: any[] = [];
    yearsRemaining: number;

    constructor(name: string, age: number, team: string, pos: string, salary: number, contractEndYear: number, minors: boolean, injured: boolean) {
        this.name = name;
        this.age = age;
        this.team = team;
        this.pos = pos;
        this.minors = minors;
        this.injured = injured;
        this.yearsRemaining = contractEndYear - 2025;

        for (let year = 2026; year <= 2031; year++ ) {
            if (year <= contractEndYear) {
                this.yearlyContract.push(salary);
            } else if (year - contractEndYear == 1) {
                this.yearlyContract.push("Free Agent");
            } else {
                this.yearlyContract.push("");
            }
        }
    }
}

class DeadCap {
    name: string;
    yearlyCapHit: any[] = [];
    yearsRemaining: number;

    constructor(name: string, capHit: number, endYear: number) {
        this.name = name;
        this.yearsRemaining = endYear - 2025;

        for (let year = 2026; year <= 2031; year++ ) {
            year <= endYear 
                ? this.yearlyCapHit.push(capHit) 
                : this.yearlyCapHit.push("");
        }
    }
}

class TeamCapInfo {
    teamName: string;
    activePlayers: ActivePlayer[] = [];
    deadCapHits: DeadCap[] = [];
    salaryCap: number;

    constructor(name: string, salaryCap: number) {
        this.teamName = name;
        this.salaryCap = salaryCap;
    }

    addActivePlayer(newPlayer: ActivePlayer): void {
        this.activePlayers.push(newPlayer);
    }

    addDeadCapHit(newDeadCapHit: DeadCap): void {
        this.deadCapHits.push(newDeadCapHit);
    }
}

interface LeagueCapInfo {
    name: string;
    teams: TeamCapInfo[];
    timestamp: string;
}

interface League {
    name: string;
    teamIDs: string[];
    teamNames: string[];
}

async function removeEmptyElements(elements) { // necessary because Age/Salary/Contract fields will bring in empty lines
    const filteredElements = [];
    for (const element of elements) {
        const text = await element.getText();
        if (text.trim() !== "") {
            filteredElements.push(element);
        }
    }

    return filteredElements;
}

interface LeagueTeamsResponse {
    leagueName: string;
    teamInfo: Record<string, any>;
}

interface GetTeamRostersResponse {
    rosters: Record<string, { salaryCap?: number | string }>;
}

async function getTeamRostersByLeague(leagueID: string): Promise<Record<string, { salaryCap?: number | string }>> {
    const response: GetTeamRostersResponse = await fetch(
        `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${leagueID}`
    ).then((r) => r.json());
    return response.rosters ?? {};
}

function parseSalaryCapValue(raw: number | string | undefined): number {
    if (raw === undefined) return NaN;
    if (typeof raw === "number") return raw;
    return parseFloat(String(raw).replace(/[$,]/g, ""));
}

async function getLeagueInfo(leagueID: string): Promise<League> {
    const response: LeagueTeamsResponse = await fetch(`https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=${leagueID}`).then(r => r.json());
    const name: string = response.leagueName;
    const teamIDs: string[] = Object.keys(response.teamInfo);
    const teamNames: string[] = Object.values(response.teamInfo).map(team => team.name);
    return {name, teamIDs, teamNames};
}

const {By, Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const leagueID = "0xhc53jbmgiftfp0";

export async function getTeamInfo(): Promise<LeagueCapInfo> {
    let driver;

    try {
        let options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--no-sandbox');
        options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        let capInfoList: TeamCapInfo[] = [];
        const {name, teamIDs, teamNames} = await getLeagueInfo(leagueID);
        const rostersByTeamId = await getTeamRostersByLeague(leagueID);
        console.log(`Scraping for league: ${name}. ${teamIDs.length} teams to scrape.`);
        for (let i = 0; i < teamIDs.length; i++) {
            let teamID = teamIDs[i];
            let teamName = teamNames[i];
            await driver.get(`https://www.fantrax.com/fantasy/league/${leagueID}/team/roster;teamId=${teamID}`);
            await driver.sleep(2000); // short delay to render the table
    
            // Scrape and prepare data
            console.log(`Processing team: ${teamName}...`);

            // Active Players
            // Name
            let divNum = 2;
            let nameEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div/scorer/div/div[1]"));
            if (nameEls.length == 0) {
                divNum = 3;
                nameEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/div/scorer/div/div[1]`));
            }
            let names: string[] = [];
            for (let e of nameEls) {
                const t = await e.getText();
                names.push(t);
            }

            // Age
            let allAgeEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/table-cell[1]`));
            let ageEls = await removeEmptyElements(allAgeEls);
            let ages: number[] = [];
            for (let e of ageEls) {
                const t = await e.getText();
                ages.push(parseInt(t));
            }

            // Team
            let teamEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/div/scorer/div/div[2]/span[2]`));
            let teams: string[] = [];
            for (let e of teamEls) {
                let t = await e.getText();
                teams.push(t.slice(2));
            }

            // Position (store full eligibility string; primary position / grouping is derived in the app)
            let posEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/div/scorer/div/div[2]/span[1]`));
            let positions: string[] = [];
            for (let e of posEls) {
                let t = await e.getText();
                positions.push(t);
            }

            // Minor League and Injured flags
            const playerContainerEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/div[1]/scorer`));
            let minors: boolean[] = [];
            let injured: boolean[] = [];

            for (const container of playerContainerEls) {
                const flagSpans = await container.findElements(By.xpath(".//div/div[2]/span"));
                let isMinors = false;
                let isInjured = false;

                for (const span of flagSpans) {
                    const classes = await span.getAttribute("class");
                    if (classes.includes("scorer-icon--MINORS")) isMinors = true;
                    if (classes.includes("scorer-icon--INJURY_LIST") || classes.includes("scorer-icon--INJURED_OUT")) isInjured = true;
                }

                minors.push(isMinors);
                injured.push(isInjured);
            }

            // Salary
            const allSalaryEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/table-cell[3]`));
            let salaryEls = await removeEmptyElements(allSalaryEls);
            let salaries: number[] = [];
            for (let el of salaryEls) {
                const t = await el.getText();
                salaries.push(parseFloat(t.replace(/[$,]/g, "")));
            }

            // Contract end year
            const allContractEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/table-cell[4]`));
            let contractEls = await removeEmptyElements(allContractEls);
            let contracts: number[] = [];
            for (let el of contractEls) {
                const t = await el.getText();
                contracts.push(parseInt(t));
            }

            // Dead Cap
            // Name
            const deadCapNameEls = await driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[4]/scorer/div/div[1]"));
            const deadCapNames: string[] = [];
            for (let el of deadCapNameEls) {
                const t = await el.getText();
                deadCapNames.push(t);
            }

            // Cap Hit (have to replace the $ and , so it can be a number)
            const deadCapHitEls = await driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[1]/span"));
            const deadCapHits: number[] = [];
            for (let el of deadCapHitEls) {
                const t = await el.getText();
                const val = parseFloat(t.replace(/[$,]/g, ""));
                deadCapHits.push(val);
            }

            // End Year
            const deadEndYearEls = await driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[3]"));
            const deadEndYears: number[] = [];
            for (let el of deadEndYearEls.slice(1)) {
                const t = await el.getText();
                deadEndYears.push(parseInt(t));
            }

            // Salary cap from Fantrax API (getTeamRosters)
            const capCeil = parseSalaryCapValue(rostersByTeamId[teamID]?.salaryCap);
            if (Number.isNaN(capCeil)) {
                throw new Error(`Missing or invalid salaryCap for team ${teamID} (${teamName}) in getTeamRosters response`);
            }

            // Build TeamCapInfo object and return it
            let capInfo = new TeamCapInfo(teamName, capCeil);

            // Add active players
            // The info for one player should be all at the same index in each list
            for (let i = 0; i < names.length; i++) {
                let newPlayer = new ActivePlayer(names[i], ages[i], teams[i], positions[i],
                    salaries[i], contracts[i], minors[i], injured[i]);

                capInfo.addActivePlayer(newPlayer);
            }

            // Add dead cap hits
            // Same as active players, all info for one should be at the same index
            for (let i = 0; i < deadCapNames.length; i++) {
                let newDeadCapHit = new DeadCap(deadCapNames[i], deadCapHits[i], deadEndYears[i]);
                capInfo.addDeadCapHit(newDeadCapHit);
            }
            capInfoList.push(capInfo);

            console.log(`Successfully scraped data for team: ${teamName}`);
        }
        // Format "Last refreshed" in America/New_York so it automatically shows EST vs EDT.
        const timestamp = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            timeZoneName: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
        }).format(new Date());
        return {name: name, teams: capInfoList, timestamp: timestamp};

    } catch(e) {
        console.log(e);
    } finally {
        driver.quit();
    }
}

import * as fs from "fs";

if (require.main === module) {
  (async () => {
    const teamInfo = await getTeamInfo();

    if (teamInfo) {
      const filePath = "data/teamCapInfo.json";
      fs.writeFileSync(filePath, JSON.stringify(teamInfo, null, 2));
      console.log(`Saved team info to ${filePath}`);
    } else {
      console.error("Failed to scrape team info");
    }
  })();
}