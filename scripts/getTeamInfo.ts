/** 
 * @fileoverview Scrapes Fantrax site and outputs to teamCapInfo.json
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

class ActivePlayer {
    name: string;
    age: number;
    team: string;
    pos: string;
    posGroup: string; // SP, RP, C, IF, OF, DH, minors
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

        switch (pos) {
            case "SP":
                this.posGroup = "Starting Pitcher";
                break;
            case "RP":
                this.posGroup = "Relief Pitcher";
                break;
            case "C":
                this.posGroup = "Catcher";
                break;
            case "1B":
            case "2B":
            case "SS":
            case "3B":
                this.posGroup = "Infielder";
                break;
            case "OF": // in our league, all OF are grouped, but include LF/CF/RF in case that varies by league
            case "LF":
            case "CF":
            case "RF":
                this.posGroup = "Outfielder";
                break;
            case "UT": // these are designated hitters, not utility players
            case "DH": // in our league, all listed as UT but may vary by league
                this.posGroup = "Designated Hitter";
                break;
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
    teams: string[];
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

async function getLeagueInfo(leagueID: string): Promise<League> {
    const response: LeagueTeamsResponse = await fetch(`https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=${leagueID}`).then(r => r.json());
    const name: string = response.leagueName;
    const teams: string[] = Object.keys(response.teamInfo);
    return {name, teams};
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
        const {name, teams} = await getLeagueInfo(leagueID);
        console.log(`Scraping for league: ${name}. ${teams.length} teams to scrape.`);
        for (const teamID of teams) {
            await driver.get(`https://www.fantrax.com/fantasy/league/${leagueID}/team/roster;teamId=${teamID}`);
            await driver.sleep(2000); // short delay to render the table
    
            // Scrape and prepare data
            // Team Name
            let teamNameEl = await driver.findElement(By.xpath("//mat-select-trigger/article/h5"));
            let teamName = await teamNameEl.getText();
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

            // Position
            let posEls = await driver.findElements(By.xpath(`//league-team-roster-tables/div/div[${divNum}]/div/div/scorer/div/div[2]/span[1]`));
            let positions: string[] = [];
            for (let e of posEls) {
                let t = await e.getText();
                let posList = t.split(",");
        
                if (posList.length == 1) { // if posList is one item, player has 1 position - add it
                    positions.push(posList[0]);
                } else if (posList[0] == "SP") { // player will have SP/RP eligibility, we want RP
                    positions.push(posList[posList.length - 1]);
                } else { // player is a batter, we want the first one
                    positions.push(posList[0]);
                }
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

            // Salary Cap
            let currCapCeilEl = await driver.findElement(By.xpath("/html/body/app-root/section/app-league-team-roster/section/league-team-roster-salary-info/div[2]/div[2]/div[3]"));
            let currCapCeil = await currCapCeilEl.getText();
            let capCeil = parseFloat(currCapCeil.replace(/[$,]/g, ""));

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
        const timestamp = new Date().toLocaleString("en-US", { timeZone: "EST" }) + " EST";
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