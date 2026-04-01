"use strict";
/**
 * @fileoverview Scrapes Fantrax site and outputs to teamCapInfo.json
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamInfo = getTeamInfo;
var ActivePlayer = /** @class */ (function () {
    function ActivePlayer(name, age, team, pos, salary, contractEndYear, minors, injured) {
        this.yearlyContract = [];
        this.name = name;
        this.age = age;
        this.team = team;
        this.pos = pos;
        this.minors = minors;
        this.injured = injured;
        this.yearsRemaining = contractEndYear - 2025;
        for (var year = 2026; year <= 2031; year++) {
            if (year <= contractEndYear) {
                this.yearlyContract.push(salary);
            }
            else if (year - contractEndYear == 1) {
                this.yearlyContract.push("Free Agent");
            }
            else {
                this.yearlyContract.push("");
            }
        }
    }
    return ActivePlayer;
}());
var DeadCap = /** @class */ (function () {
    function DeadCap(name, capHit, endYear) {
        this.yearlyCapHit = [];
        this.name = name;
        this.yearsRemaining = endYear - 2025;
        for (var year = 2026; year <= 2031; year++) {
            year <= endYear
                ? this.yearlyCapHit.push(capHit)
                : this.yearlyCapHit.push("");
        }
    }
    return DeadCap;
}());
var TeamCapInfo = /** @class */ (function () {
    function TeamCapInfo(name, salaryCap) {
        this.activePlayers = [];
        this.deadCapHits = [];
        this.teamName = name;
        this.salaryCap = salaryCap;
    }
    TeamCapInfo.prototype.addActivePlayer = function (newPlayer) {
        this.activePlayers.push(newPlayer);
    };
    TeamCapInfo.prototype.addDeadCapHit = function (newDeadCapHit) {
        this.deadCapHits.push(newDeadCapHit);
    };
    return TeamCapInfo;
}());
function removeEmptyElements(elements) {
    return __awaiter(this, void 0, void 0, function () {
        var filteredElements, _i, elements_1, element, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filteredElements = [];
                    _i = 0, elements_1 = elements;
                    _a.label = 1;
                case 1:
                    if (!(_i < elements_1.length)) return [3 /*break*/, 4];
                    element = elements_1[_i];
                    return [4 /*yield*/, element.getText()];
                case 2:
                    text = _a.sent();
                    if (text.trim() !== "") {
                        filteredElements.push(element);
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, filteredElements];
            }
        });
    });
}
function getTeamRostersByLeague(leagueID) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=".concat(leagueID)).then(function (r) { return r.json(); })];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, (_a = response.rosters) !== null && _a !== void 0 ? _a : {}];
            }
        });
    });
}
function parseSalaryCapValue(raw) {
    if (raw === undefined)
        return NaN;
    if (typeof raw === "number")
        return raw;
    return parseFloat(String(raw).replace(/[$,]/g, ""));
}
function getLeagueInfo(leagueID) {
    return __awaiter(this, void 0, void 0, function () {
        var response, name, teamIDs, teamNames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=".concat(leagueID)).then(function (r) { return r.json(); })];
                case 1:
                    response = _a.sent();
                    name = response.leagueName;
                    teamIDs = Object.keys(response.teamInfo);
                    teamNames = Object.values(response.teamInfo).map(function (team) { return team.name; });
                    return [2 /*return*/, { name: name, teamIDs: teamIDs, teamNames: teamNames }];
            }
        });
    });
}
var _a = require('selenium-webdriver'), By = _a.By, Builder = _a.Builder;
var chrome = require('selenium-webdriver/chrome');
var leagueID = "0xhc53jbmgiftfp0";
function getTeamInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var driver, options, capInfoList, _a, name_1, teamIDs, teamNames, rostersByTeamId, i, teamID, teamName, divNum, nameEls, names, _i, nameEls_1, e, t, allAgeEls, ageEls, ages, _b, ageEls_1, e, t, teamEls, teams, _c, teamEls_1, e, t, posEls, positions, _d, posEls_1, e, t, playerContainerEls, minors, injured, _e, playerContainerEls_1, container, flagSpans, isMinors, isInjured, _f, flagSpans_1, span, classes, allSalaryEls, salaryEls, salaries, _g, salaryEls_1, el, t, allContractEls, contractEls, contracts, _h, contractEls_1, el, t, deadCapNameEls, deadCapNames, _j, deadCapNameEls_1, el, t, deadCapHitEls, deadCapHits, _k, deadCapHitEls_1, el, t, val, deadEndYearEls, deadEndYears, _l, _m, el, t, capCeil, capInfo, i_1, newPlayer, i_2, newDeadCapHit, timestamp, e_1;
        var _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 68, 69, 70]);
                    options = new chrome.Options();
                    options.addArguments('--headless=new');
                    options.addArguments('--disable-dev-shm-usage');
                    options.addArguments('--window-size=1920,1080');
                    options.addArguments('--no-sandbox');
                    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
                    return [4 /*yield*/, new Builder()
                            .forBrowser('chrome')
                            .setChromeOptions(options)
                            .build()];
                case 1:
                    driver = _p.sent();
                    capInfoList = [];
                    return [4 /*yield*/, getLeagueInfo(leagueID)];
                case 2:
                    _a = _p.sent(), name_1 = _a.name, teamIDs = _a.teamIDs, teamNames = _a.teamNames;
                    return [4 /*yield*/, getTeamRostersByLeague(leagueID)];
                case 3:
                    rostersByTeamId = _p.sent();
                    console.log("Scraping for league: ".concat(name_1, ". ").concat(teamIDs.length, " teams to scrape."));
                    i = 0;
                    _p.label = 4;
                case 4:
                    if (!(i < teamIDs.length)) return [3 /*break*/, 67];
                    teamID = teamIDs[i];
                    teamName = teamNames[i];
                    return [4 /*yield*/, driver.get("https://www.fantrax.com/fantasy/league/".concat(leagueID, "/team/roster;teamId=").concat(teamID))];
                case 5:
                    _p.sent();
                    return [4 /*yield*/, driver.sleep(2000)];
                case 6:
                    _p.sent(); // short delay to render the table
                    // Scrape and prepare data
                    console.log("Processing team: ".concat(teamName, "..."));
                    divNum = 2;
                    return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div/scorer/div/div[1]"))];
                case 7:
                    nameEls = _p.sent();
                    if (!(nameEls.length == 0)) return [3 /*break*/, 9];
                    divNum = 3;
                    return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div/scorer/div/div[1]")))];
                case 8:
                    nameEls = _p.sent();
                    _p.label = 9;
                case 9:
                    names = [];
                    _i = 0, nameEls_1 = nameEls;
                    _p.label = 10;
                case 10:
                    if (!(_i < nameEls_1.length)) return [3 /*break*/, 13];
                    e = nameEls_1[_i];
                    return [4 /*yield*/, e.getText()];
                case 11:
                    t = _p.sent();
                    names.push(t);
                    _p.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/table-cell[1]")))];
                case 14:
                    allAgeEls = _p.sent();
                    return [4 /*yield*/, removeEmptyElements(allAgeEls)];
                case 15:
                    ageEls = _p.sent();
                    ages = [];
                    _b = 0, ageEls_1 = ageEls;
                    _p.label = 16;
                case 16:
                    if (!(_b < ageEls_1.length)) return [3 /*break*/, 19];
                    e = ageEls_1[_b];
                    return [4 /*yield*/, e.getText()];
                case 17:
                    t = _p.sent();
                    ages.push(parseInt(t));
                    _p.label = 18;
                case 18:
                    _b++;
                    return [3 /*break*/, 16];
                case 19: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div/scorer/div/div[2]/span[2]")))];
                case 20:
                    teamEls = _p.sent();
                    teams = [];
                    _c = 0, teamEls_1 = teamEls;
                    _p.label = 21;
                case 21:
                    if (!(_c < teamEls_1.length)) return [3 /*break*/, 24];
                    e = teamEls_1[_c];
                    return [4 /*yield*/, e.getText()];
                case 22:
                    t = _p.sent();
                    teams.push(t.slice(2));
                    _p.label = 23;
                case 23:
                    _c++;
                    return [3 /*break*/, 21];
                case 24: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div/scorer/div/div[2]/span[1]")))];
                case 25:
                    posEls = _p.sent();
                    positions = [];
                    _d = 0, posEls_1 = posEls;
                    _p.label = 26;
                case 26:
                    if (!(_d < posEls_1.length)) return [3 /*break*/, 29];
                    e = posEls_1[_d];
                    return [4 /*yield*/, e.getText()];
                case 27:
                    t = _p.sent();
                    positions.push(t);
                    _p.label = 28;
                case 28:
                    _d++;
                    return [3 /*break*/, 26];
                case 29: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div[1]/scorer")))];
                case 30:
                    playerContainerEls = _p.sent();
                    minors = [];
                    injured = [];
                    _e = 0, playerContainerEls_1 = playerContainerEls;
                    _p.label = 31;
                case 31:
                    if (!(_e < playerContainerEls_1.length)) return [3 /*break*/, 38];
                    container = playerContainerEls_1[_e];
                    return [4 /*yield*/, container.findElements(By.xpath(".//div/div[2]/span"))];
                case 32:
                    flagSpans = _p.sent();
                    isMinors = false;
                    isInjured = false;
                    _f = 0, flagSpans_1 = flagSpans;
                    _p.label = 33;
                case 33:
                    if (!(_f < flagSpans_1.length)) return [3 /*break*/, 36];
                    span = flagSpans_1[_f];
                    return [4 /*yield*/, span.getAttribute("class")];
                case 34:
                    classes = _p.sent();
                    if (classes.includes("scorer-icon--MINORS"))
                        isMinors = true;
                    if (classes.includes("scorer-icon--INJURY_LIST") || classes.includes("scorer-icon--INJURED_OUT"))
                        isInjured = true;
                    _p.label = 35;
                case 35:
                    _f++;
                    return [3 /*break*/, 33];
                case 36:
                    minors.push(isMinors);
                    injured.push(isInjured);
                    _p.label = 37;
                case 37:
                    _e++;
                    return [3 /*break*/, 31];
                case 38: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/table-cell[3]")))];
                case 39:
                    allSalaryEls = _p.sent();
                    return [4 /*yield*/, removeEmptyElements(allSalaryEls)];
                case 40:
                    salaryEls = _p.sent();
                    salaries = [];
                    _g = 0, salaryEls_1 = salaryEls;
                    _p.label = 41;
                case 41:
                    if (!(_g < salaryEls_1.length)) return [3 /*break*/, 44];
                    el = salaryEls_1[_g];
                    return [4 /*yield*/, el.getText()];
                case 42:
                    t = _p.sent();
                    salaries.push(parseFloat(t.replace(/[$,]/g, "")));
                    _p.label = 43;
                case 43:
                    _g++;
                    return [3 /*break*/, 41];
                case 44: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/table-cell[4]")))];
                case 45:
                    allContractEls = _p.sent();
                    return [4 /*yield*/, removeEmptyElements(allContractEls)];
                case 46:
                    contractEls = _p.sent();
                    contracts = [];
                    _h = 0, contractEls_1 = contractEls;
                    _p.label = 47;
                case 47:
                    if (!(_h < contractEls_1.length)) return [3 /*break*/, 50];
                    el = contractEls_1[_h];
                    return [4 /*yield*/, el.getText()];
                case 48:
                    t = _p.sent();
                    contracts.push(parseInt(t));
                    _p.label = 49;
                case 49:
                    _h++;
                    return [3 /*break*/, 47];
                case 50: return [4 /*yield*/, driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[4]/scorer/div/div[1]"))];
                case 51:
                    deadCapNameEls = _p.sent();
                    deadCapNames = [];
                    _j = 0, deadCapNameEls_1 = deadCapNameEls;
                    _p.label = 52;
                case 52:
                    if (!(_j < deadCapNameEls_1.length)) return [3 /*break*/, 55];
                    el = deadCapNameEls_1[_j];
                    return [4 /*yield*/, el.getText()];
                case 53:
                    t = _p.sent();
                    deadCapNames.push(t);
                    _p.label = 54;
                case 54:
                    _j++;
                    return [3 /*break*/, 52];
                case 55: return [4 /*yield*/, driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[1]/span"))];
                case 56:
                    deadCapHitEls = _p.sent();
                    deadCapHits = [];
                    _k = 0, deadCapHitEls_1 = deadCapHitEls;
                    _p.label = 57;
                case 57:
                    if (!(_k < deadCapHitEls_1.length)) return [3 /*break*/, 60];
                    el = deadCapHitEls_1[_k];
                    return [4 /*yield*/, el.getText()];
                case 58:
                    t = _p.sent();
                    val = parseFloat(t.replace(/[$,]/g, ""));
                    deadCapHits.push(val);
                    _p.label = 59;
                case 59:
                    _k++;
                    return [3 /*break*/, 57];
                case 60: return [4 /*yield*/, driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[3]"))];
                case 61:
                    deadEndYearEls = _p.sent();
                    deadEndYears = [];
                    _l = 0, _m = deadEndYearEls.slice(1);
                    _p.label = 62;
                case 62:
                    if (!(_l < _m.length)) return [3 /*break*/, 65];
                    el = _m[_l];
                    return [4 /*yield*/, el.getText()];
                case 63:
                    t = _p.sent();
                    deadEndYears.push(parseInt(t));
                    _p.label = 64;
                case 64:
                    _l++;
                    return [3 /*break*/, 62];
                case 65:
                    capCeil = parseSalaryCapValue((_o = rostersByTeamId[teamID]) === null || _o === void 0 ? void 0 : _o.salaryCap);
                    if (Number.isNaN(capCeil)) {
                        throw new Error("Missing or invalid salaryCap for team ".concat(teamID, " (").concat(teamName, ") in getTeamRosters response"));
                    }
                    capInfo = new TeamCapInfo(teamName, capCeil);
                    // Add active players
                    // The info for one player should be all at the same index in each list
                    for (i_1 = 0; i_1 < names.length; i_1++) {
                        newPlayer = new ActivePlayer(names[i_1], ages[i_1], teams[i_1], positions[i_1], salaries[i_1], contracts[i_1], minors[i_1], injured[i_1]);
                        capInfo.addActivePlayer(newPlayer);
                    }
                    // Add dead cap hits
                    // Same as active players, all info for one should be at the same index
                    for (i_2 = 0; i_2 < deadCapNames.length; i_2++) {
                        newDeadCapHit = new DeadCap(deadCapNames[i_2], deadCapHits[i_2], deadEndYears[i_2]);
                        capInfo.addDeadCapHit(newDeadCapHit);
                    }
                    capInfoList.push(capInfo);
                    console.log("Successfully scraped data for team: ".concat(teamName));
                    _p.label = 66;
                case 66:
                    i++;
                    return [3 /*break*/, 4];
                case 67:
                    timestamp = new Intl.DateTimeFormat("en-US", {
                        timeZone: "America/New_York",
                        timeZoneName: "short",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                    }).format(new Date());
                    return [2 /*return*/, { name: name_1, teams: capInfoList, timestamp: timestamp }];
                case 68:
                    e_1 = _p.sent();
                    console.log(e_1);
                    return [3 /*break*/, 70];
                case 69:
                    driver.quit();
                    return [7 /*endfinally*/];
                case 70: return [2 /*return*/];
            }
        });
    });
}
var fs = require("fs");
if (require.main === module) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var teamInfo, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTeamInfo()];
                case 1:
                    teamInfo = _a.sent();
                    if (teamInfo) {
                        filePath = "data/teamCapInfo.json";
                        fs.writeFileSync(filePath, JSON.stringify(teamInfo, null, 2));
                        console.log("Saved team info to ".concat(filePath));
                    }
                    else {
                        console.error("Failed to scrape team info");
                    }
                    return [2 /*return*/];
            }
        });
    }); })();
}
