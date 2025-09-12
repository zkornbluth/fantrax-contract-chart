class ActivePlayer {
    name: string;
    age: number;
    team: string;
    pos: string;
    posGroup: string; // SP, RP, C, IF, OF, DH, minors
    minors: boolean;
    injured: boolean;
    yearlyContract: any[] = [];

    constructor(name: string, age: number, team: string, pos: string, salary: number, contractEndYear: number, minors: boolean, injured: boolean) {
        this.name = name;
        this.age = age;
        this.team = team;
        this.pos = pos;
        this.minors = minors;
        this.injured = injured;

        for (let year = 2025; year <= 2030; year++ ) {
            if (year <= contractEndYear) {
                this.yearlyContract.push(salary) 
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

    constructor(name: string, capHit: number, endYear: number) {
        this.name = name;

        for (let year = 2025; year <= 2030; year++ ) {
            year <= endYear 
                ? this.yearlyCapHit.push(capHit) 
                : this.yearlyCapHit.push("");
        }
    }
}

class TeamCapInfo {
    activePlayers: ActivePlayer[] = [];
    deadCapHits: DeadCap[] = [];
    salaryCap: number;
    salaryFloor: number;

    constructor(salaryCap: number, salaryFloor: number) {
        this.salaryCap = salaryCap;
        this.salaryFloor = salaryFloor;
    }

    addActivePlayer(newPlayer: ActivePlayer): void {
        this.activePlayers.push(newPlayer);
    }

    addDeadCapHit(newDeadCapHit: DeadCap): void {
        this.deadCapHits.push(newDeadCapHit);
    }
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

const {By, Builder, Browser} = require('selenium-webdriver');
// Will eventually want these as inputs
// Future idea (not for MVP) - input league, use Fantrax API to get teams in league and put them in a dropdown to select from
const leagueID = "upqoky97m4037px3"
const teamID = "7dwuaijpm4037px9"

export async function getTeamInfo(): Promise<TeamCapInfo> {
    let driver;

    try {
        driver = await new Builder().forBrowser(Browser.CHROME).build();
        await driver.get(`https://www.fantrax.com/fantasy/league/${leagueID}/team/roster;teamId=${teamID}`);
  
        await driver.manage().setTimeouts({implicit: 5000});

        // Scrape and prepare data
        // Active Players
        // Name
        let nameEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div/scorer/div/div[1]"));
        let names: string[] = []
        for (let e of nameEls) {
            const t = await e.getText();
            names.push(t);
        }

        // Age
        let allAgeEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/table-cell[1]"));
        let ageEls = await removeEmptyElements(allAgeEls);
        let ages: number[] = []
        for (let e of ageEls) {
            const t = await e.getText();
            ages.push(parseInt(t));
        }

        // Team
        let teamEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div/scorer/div/div[2]/span[2]"));
        let teams: string[] = [];
        for (let e of teamEls) {
            let t = await e.getText();
            teams.push(t.slice(2));
        }

        // Position
        // Need to set up logic for splitting/choosing which position
        let posEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div/scorer/div/div[2]/span[1]"));
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

        // Minors/Injured: set up empty [] for each
        // await element.getAttribute('class')
        // check if scorer-icon--INJURY_LIST or scorer-icon--MINORS appear in that string
        // if it appears, push true, if not push false

        // this failed because very rarely, players will only have one flag, and everything after that player will shift and we may give a player the wrong flag
        // const firstFlagEls = await driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/league-team-roster-tables/div/div[2]/div/div/scorer/div/div[2]/span[3]"));
        // const secondFlagEls = await driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/league-team-roster-tables/div/div[2]/div/div/scorer/div/div[2]/span[4]"));
        // const minorsClass = "scorer-icon--MINORS";
        // const injuredClass = "scorer-icon--INJURY_LIST";
        // let minors: boolean[] = [];
        // let injured: boolean[] = [];
        // for (let i=0; firstFlagEls.length; i++) {
        //     let firstEl = firstFlagEls[i];
        //     let secondEl = secondFlagEls[i];
        //     let firstClasses = await firstEl.getAttribute("class");
        //     let secondClasses = await secondEl.getAttribute("class");

        //     if (firstClasses.includes(minorsClass) || secondClasses.includes(minorsClass)) {
        //         minors.push(true);
        //     } else {
        //         minors.push(false);
        //     }

        //     if (firstClasses.includes(injuredClass) || secondClasses.includes(injuredClass)) {
        //         injured.push(true);
        //     } else {
        //         injured.push(false);
        //     }
        // }

        const playerContainerEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div[1]/scorer"));
        let minors: boolean[] = [];
        let injured: boolean[] = [];

        for (const container of playerContainerEls) {
            const flagSpans = await container.findElements(By.xpath(".//div/div[2]/span"));
            let isMinors = false;
            let isInjured = false;

            for (const span of flagSpans) {
                const classes = await span.getAttribute("class");
                if (classes.includes("scorer-icon--MINORS")) isMinors = true;
                if (classes.includes("scorer-icon--INJURY_LIST")) isInjured = true;
            }

            minors.push(isMinors);
            injured.push(isInjured);
        }

        // Salary
        const allSalaryEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/table-cell[3]"));
        let salaryEls = await removeEmptyElements(allSalaryEls);
        let salaries: number[] = [];
        for (let el of salaryEls) {
            const t = await el.getText();
            salaries.push(parseFloat(t));
        }

        // Contract end year
        const allContractEls = await driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/table-cell[4]"));
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

        // Cap Hit (have to slice the $ so it can be a number)
        const deadCapHitEls = await driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[1]/span"));
        const deadCapHits: number[] = [];
        for (let el of deadCapHitEls) {
            const t = await el.getText();
            const val = parseFloat(t.slice(1));
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
        let currCapHitEl = await driver.findElement(By.xpath("/html/body/app-root/section/app-league-team-roster/section/league-team-roster-salary-info/div[2]/div[2]/div[1]"));
        let currCapHit = await currCapHitEl.getText();

        // Salary Floor
        let currCapFloorEl = await driver.findElement(By.xpath("/html/body/app-root/section/app-league-team-roster/section/league-team-roster-salary-info/div[2]/div[2]/div[4]"));
        let currCapFloor = await currCapFloorEl.getText();

        // Build TeamCapInfo object and return it
        let capInfo = new TeamCapInfo(currCapHit, currCapFloor);

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

        return capInfo;

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
      const filePath = "./teamCapInfo.json";
      fs.writeFileSync(filePath, JSON.stringify(teamInfo, null, 2));
      console.log(`Saved team info to ${filePath}`);
    } else {
      console.error("Failed to scrape team info");
    }
  })();
}