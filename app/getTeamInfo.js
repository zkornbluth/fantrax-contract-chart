"use strict";
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
        this.yearsRemaining = contractEndYear - 2024;
        for (var year = 2025; year <= 2030; year++) {
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
    return ActivePlayer;
}());
var DeadCap = /** @class */ (function () {
    function DeadCap(name, capHit, endYear) {
        this.yearlyCapHit = [];
        this.name = name;
        this.yearsRemaining = endYear - 2024;
        for (var year = 2025; year <= 2030; year++) {
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
var _a = require('selenium-webdriver'), By = _a.By, Builder = _a.Builder, Browser = _a.Browser;
// Will eventually want these as inputs
// Future idea (not for MVP) - input league, use Fantrax API to get teams in league and put them in a dropdown to select from
var leagueID = "upqoky97m4037px3";
var teamID = "7dwuaijpm4037px9";
function getTeamInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var driver, divNum, nameEls, names, _i, nameEls_1, e, t, allAgeEls, ageEls, ages, _a, ageEls_1, e, t, teamEls, teams, _b, teamEls_1, e, t, posEls, positions, _c, posEls_1, e, t, posList, playerContainerEls, minors, injured, _d, playerContainerEls_1, container, flagSpans, isMinors, isInjured, _e, flagSpans_1, span, classes, allSalaryEls, salaryEls, salaries, _f, salaryEls_1, el, t, allContractEls, contractEls, contracts, _g, contractEls_1, el, t, deadCapNameEls, deadCapNames, _h, deadCapNameEls_1, el, t, deadCapHitEls, deadCapHits, _j, deadCapHitEls_1, el, t, val, deadEndYearEls, deadEndYears, _k, _l, el, t, currCapCeilEl, currCapCeil, capCeil, teamNameEl, teamName, capInfo, i, newPlayer, i, newDeadCapHit, e_1;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 67, 68, 69]);
                    return [4 /*yield*/, new Builder().forBrowser(Browser.CHROME).build()];
                case 1:
                    driver = _m.sent();
                    return [4 /*yield*/, driver.get("https://www.fantrax.com/fantasy/league/".concat(leagueID, "/team/roster;teamId=").concat(teamID))];
                case 2:
                    _m.sent();
                    return [4 /*yield*/, driver.manage().setTimeouts({ implicit: 5000 })];
                case 3:
                    _m.sent();
                    divNum = 2;
                    return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[2]/div/div/scorer/div/div[1]"))];
                case 4:
                    nameEls = _m.sent();
                    if (!(nameEls.length == 0)) return [3 /*break*/, 6];
                    divNum = 3;
                    return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div/scorer/div/div[1]")))];
                case 5:
                    nameEls = _m.sent();
                    _m.label = 6;
                case 6:
                    names = [];
                    _i = 0, nameEls_1 = nameEls;
                    _m.label = 7;
                case 7:
                    if (!(_i < nameEls_1.length)) return [3 /*break*/, 10];
                    e = nameEls_1[_i];
                    return [4 /*yield*/, e.getText()];
                case 8:
                    t = _m.sent();
                    names.push(t);
                    _m.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/table-cell[1]")))];
                case 11:
                    allAgeEls = _m.sent();
                    return [4 /*yield*/, removeEmptyElements(allAgeEls)];
                case 12:
                    ageEls = _m.sent();
                    ages = [];
                    _a = 0, ageEls_1 = ageEls;
                    _m.label = 13;
                case 13:
                    if (!(_a < ageEls_1.length)) return [3 /*break*/, 16];
                    e = ageEls_1[_a];
                    return [4 /*yield*/, e.getText()];
                case 14:
                    t = _m.sent();
                    ages.push(parseInt(t));
                    _m.label = 15;
                case 15:
                    _a++;
                    return [3 /*break*/, 13];
                case 16: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div/scorer/div/div[2]/span[2]")))];
                case 17:
                    teamEls = _m.sent();
                    teams = [];
                    _b = 0, teamEls_1 = teamEls;
                    _m.label = 18;
                case 18:
                    if (!(_b < teamEls_1.length)) return [3 /*break*/, 21];
                    e = teamEls_1[_b];
                    return [4 /*yield*/, e.getText()];
                case 19:
                    t = _m.sent();
                    teams.push(t.slice(2));
                    _m.label = 20;
                case 20:
                    _b++;
                    return [3 /*break*/, 18];
                case 21: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div/scorer/div/div[2]/span[1]")))];
                case 22:
                    posEls = _m.sent();
                    positions = [];
                    _c = 0, posEls_1 = posEls;
                    _m.label = 23;
                case 23:
                    if (!(_c < posEls_1.length)) return [3 /*break*/, 26];
                    e = posEls_1[_c];
                    return [4 /*yield*/, e.getText()];
                case 24:
                    t = _m.sent();
                    posList = t.split(",");
                    if (posList.length == 1) { // if posList is one item, player has 1 position - add it
                        positions.push(posList[0]);
                    }
                    else if (posList[0] == "SP") { // player will have SP/RP eligibility, we want RP
                        positions.push(posList[posList.length - 1]);
                    }
                    else { // player is a batter, we want the first one
                        positions.push(posList[0]);
                    }
                    _m.label = 25;
                case 25:
                    _c++;
                    return [3 /*break*/, 23];
                case 26: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/div[1]/scorer")))];
                case 27:
                    playerContainerEls = _m.sent();
                    minors = [];
                    injured = [];
                    _d = 0, playerContainerEls_1 = playerContainerEls;
                    _m.label = 28;
                case 28:
                    if (!(_d < playerContainerEls_1.length)) return [3 /*break*/, 35];
                    container = playerContainerEls_1[_d];
                    return [4 /*yield*/, container.findElements(By.xpath(".//div/div[2]/span"))];
                case 29:
                    flagSpans = _m.sent();
                    isMinors = false;
                    isInjured = false;
                    _e = 0, flagSpans_1 = flagSpans;
                    _m.label = 30;
                case 30:
                    if (!(_e < flagSpans_1.length)) return [3 /*break*/, 33];
                    span = flagSpans_1[_e];
                    return [4 /*yield*/, span.getAttribute("class")];
                case 31:
                    classes = _m.sent();
                    if (classes.includes("scorer-icon--MINORS"))
                        isMinors = true;
                    if (classes.includes("scorer-icon--INJURY_LIST"))
                        isInjured = true;
                    _m.label = 32;
                case 32:
                    _e++;
                    return [3 /*break*/, 30];
                case 33:
                    minors.push(isMinors);
                    injured.push(isInjured);
                    _m.label = 34;
                case 34:
                    _d++;
                    return [3 /*break*/, 28];
                case 35: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/table-cell[3]")))];
                case 36:
                    allSalaryEls = _m.sent();
                    return [4 /*yield*/, removeEmptyElements(allSalaryEls)];
                case 37:
                    salaryEls = _m.sent();
                    salaries = [];
                    _f = 0, salaryEls_1 = salaryEls;
                    _m.label = 38;
                case 38:
                    if (!(_f < salaryEls_1.length)) return [3 /*break*/, 41];
                    el = salaryEls_1[_f];
                    return [4 /*yield*/, el.getText()];
                case 39:
                    t = _m.sent();
                    salaries.push(parseFloat(t.replace(/[$,]/g, "")));
                    _m.label = 40;
                case 40:
                    _f++;
                    return [3 /*break*/, 38];
                case 41: return [4 /*yield*/, driver.findElements(By.xpath("//league-team-roster-tables/div/div[".concat(divNum, "]/div/table-cell[4]")))];
                case 42:
                    allContractEls = _m.sent();
                    return [4 /*yield*/, removeEmptyElements(allContractEls)];
                case 43:
                    contractEls = _m.sent();
                    contracts = [];
                    _g = 0, contractEls_1 = contractEls;
                    _m.label = 44;
                case 44:
                    if (!(_g < contractEls_1.length)) return [3 /*break*/, 47];
                    el = contractEls_1[_g];
                    return [4 /*yield*/, el.getText()];
                case 45:
                    t = _m.sent();
                    contracts.push(parseInt(t));
                    _m.label = 46;
                case 46:
                    _g++;
                    return [3 /*break*/, 44];
                case 47: return [4 /*yield*/, driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[4]/scorer/div/div[1]"))];
                case 48:
                    deadCapNameEls = _m.sent();
                    deadCapNames = [];
                    _h = 0, deadCapNameEls_1 = deadCapNameEls;
                    _m.label = 49;
                case 49:
                    if (!(_h < deadCapNameEls_1.length)) return [3 /*break*/, 52];
                    el = deadCapNameEls_1[_h];
                    return [4 /*yield*/, el.getText()];
                case 50:
                    t = _m.sent();
                    deadCapNames.push(t);
                    _m.label = 51;
                case 51:
                    _h++;
                    return [3 /*break*/, 49];
                case 52: return [4 /*yield*/, driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[1]/span"))];
                case 53:
                    deadCapHitEls = _m.sent();
                    deadCapHits = [];
                    _j = 0, deadCapHitEls_1 = deadCapHitEls;
                    _m.label = 54;
                case 54:
                    if (!(_j < deadCapHitEls_1.length)) return [3 /*break*/, 57];
                    el = deadCapHitEls_1[_j];
                    return [4 /*yield*/, el.getText()];
                case 55:
                    t = _m.sent();
                    val = parseFloat(t.replace(/[$,]/g, ""));
                    deadCapHits.push(val);
                    _m.label = 56;
                case 56:
                    _j++;
                    return [3 /*break*/, 54];
                case 57: return [4 /*yield*/, driver.findElements(By.xpath("/html/body/app-root/section/app-league-team-roster/section/div[3]/div[2]/div/div[3]"))];
                case 58:
                    deadEndYearEls = _m.sent();
                    deadEndYears = [];
                    _k = 0, _l = deadEndYearEls.slice(1);
                    _m.label = 59;
                case 59:
                    if (!(_k < _l.length)) return [3 /*break*/, 62];
                    el = _l[_k];
                    return [4 /*yield*/, el.getText()];
                case 60:
                    t = _m.sent();
                    deadEndYears.push(parseInt(t));
                    _m.label = 61;
                case 61:
                    _k++;
                    return [3 /*break*/, 59];
                case 62: return [4 /*yield*/, driver.findElement(By.xpath("/html/body/app-root/section/app-league-team-roster/section/league-team-roster-salary-info/div[2]/div[2]/div[3]"))];
                case 63:
                    currCapCeilEl = _m.sent();
                    return [4 /*yield*/, currCapCeilEl.getText()];
                case 64:
                    currCapCeil = _m.sent();
                    capCeil = parseFloat(currCapCeil.replace(/[$,]/g, ""));
                    return [4 /*yield*/, driver.findElement(By.xpath("//mat-select-trigger/article/h5"))];
                case 65:
                    teamNameEl = _m.sent();
                    return [4 /*yield*/, teamNameEl.getText()];
                case 66:
                    teamName = _m.sent();
                    capInfo = new TeamCapInfo(teamName, capCeil);
                    // Add active players
                    // The info for one player should be all at the same index in each list
                    for (i = 0; i < names.length; i++) {
                        newPlayer = new ActivePlayer(names[i], ages[i], teams[i], positions[i], salaries[i], contracts[i], minors[i], injured[i]);
                        capInfo.addActivePlayer(newPlayer);
                    }
                    // Add dead cap hits
                    // Same as active players, all info for one should be at the same index
                    for (i = 0; i < deadCapNames.length; i++) {
                        newDeadCapHit = new DeadCap(deadCapNames[i], deadCapHits[i], deadEndYears[i]);
                        capInfo.addDeadCapHit(newDeadCapHit);
                    }
                    return [2 /*return*/, capInfo];
                case 67:
                    e_1 = _m.sent();
                    console.log(e_1);
                    return [3 /*break*/, 69];
                case 68:
                    driver.quit();
                    return [7 /*endfinally*/];
                case 69: return [2 /*return*/];
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
                        filePath = "./teamCapInfo.json";
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
