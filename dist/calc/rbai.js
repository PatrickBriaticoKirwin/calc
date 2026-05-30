"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;

var move_1 = require("./move");
var data_1 = require("./data");
var calc_1 = require("./calc");
var gen = data_1.Generations.get(8);
function calcAttackMove(move, user, target, field) {
    var moveScore = 0;
    var result = (0, calc_1.calculate)(gen, user, target, move, field);
    var canKill = result.range()[0] >= target.curHP();
    var thisDmgFraction = result.range()[1] / target.maxHP();
    var maxDmgFraction = maxDamage(user, target, field);
    if (canKill || thisDmgFraction >= maxDmgFraction) {
        moveScore += 6;
    }
    if (canKill) {
        if (user.stats.spe >= target.stats.spe || (move.priority > 1 && user.stats.spe < target.stats.spe)) {
            moveScore += 6;
        }
        else if (!(user.stats.spe > target.stats.spe)) {
            moveScore += 3;
        }
        if (user.ability && ["Moxie", "Beast Boost", "Chilling Neigh", "Grim Neigh"].includes(user.ability)) {
            moveScore += 1;
        }
    }
    return moveScore;
}
exports.calcAttackMove = calcAttackMove;
function calcMoveScore(move, user, target, battle) {
    var _a;
    var lastMove = (_a = battle.lastMove) !== null && _a !== void 0 ? _a : true;
    var firstTurn = null;
    if (lastMove) {
        firstTurn = true;
    }
    else {
        firstTurn = false;
    }
    switch (move.name) {
        case "Acid Spray":
            return calcAttackMove(move, user, target, battle.field) + calcAcidSpray();
        case "Trop Kick":
        case "Breaking Swipe":
        case "Lunge":
            return calcAtkDropMove(user, target, hasMoveOfSplit(target, "Physical"));
        case "Skitter Smack":
        case "Mystical Fire":
        case "Snarl":
        case "Spirit Break":
        case "Struggle Bug":
            return calcAtkDropMove(user, target, hasMoveOfSplit(target, "Special"));
        case "Future Sight":
            return calcFutureSight(user, target, battle.field);
        case "Relic Song":
            return calcRelicSong(user);
        case "Sucker Punch":
            return calcSuckerPunch(battle.lastMove);
        case "Pursuit":
            return calcPursuit(user, target, maxDamage(target, user, battle.field) >= user.curHP() / user.maxHP());
        case "Fell Stinger":
            return calcFellStinger(user, target, maxDamage(target, user, battle.field) >= user.curHP() / user.maxHP());
        case "Rollout":
            return calcRollout();
        case "Stealth Rock":
            return calcStealthRock(firstTurn);
        case "Spikes":
            return calcSpikes(battle.field.defenderSide.spikes, firstTurn);
        case "Sticky Web":
            return calcStickyWeb(firstTurn);
        case "Protect":
        case "Detect":
        case "King's Shield":
        case "Baneful Bunker":
            return calcProtect(user, target, battle);
        case "Imprison":
            return calcImprison(user, target);
        case "Baton Pass":
            return calcBatonPass(user, battle.userParty.every(function (p) { return p === user || p.curHP() === 0; }));
        case "Tailwind":
            return calcTailwind(user, target);
        case "Trick Room":
            return calcTrickRoom(user, target, battle.field.isTrickRoom);
        case "Fake Out":
            return calcFakeout(target, user.isFirstTurn());
        case "Final Gambit":
            return calcFinalGambit(user, target, battle.field);
        case "Electric Terrain":
        case "Grassy Terrain":
        case "Misty Terrain":
        case "Psychic Terrain":
            return calcTerrain(user);
        case "Light Screen":
        case "Reflect":
        case "Aurora Veil":
            return calcScreens(user, target, move);
        case "Substitute":
            return calcSubstitute(user, target, battle);
        case "Self-Destruct":
        case "Explosion":
            return calcBoomMove(user, target, battle.userParty.every(function (p) { return p === user || p.curHP() === 0; }));
        case "Memento":
            return calcMomento(user);
        case "Thunder Wave":
        case "Stun Spore":
        case "Glare":
            return calcPar(user, target);
        case "Will-O-Wisp":
            return calcWillo(user, target);
        case "Trick":
        case "Switcheroo":
            return calcTrick(user);
        case "Hypnosis":
        case "Sleep Powder":
        case "Sing":
        case "Grasswhistle":
        case "Spore":
            return calcSleepMoves(user, target);
        case "Synthesis":
        case "Morning Sun":
        case "Moonlight":
            return calcSunRecMoves(user, target, move, battle.field.hasWeather('Sun'), battle.field);
        case "Rest":
            return calcRest(user, target, battle.field.hasWeather('Rain'), battle.field);
        case "Coil":
        case "Bulk Up":
        case "No Retreat":
        case "Calm Mind":
            return calcMixedSetupMoves(user, target, move, battle.field);
        case "Shell Smash":
            return calcShellSmash(user, target, battle.field);
        case "Belly Drum":
            return calcBellyDrum(user, target, battle.field);
        case "Meteor Beam":
            return calcMeteorBeam(user);
        case "Destiny Bond":
            return calcDestinyBond(user, target, battle.field);
        case "Taunt":
            return calcTaunt(target, battle.field.isTrickRoom, battle.field.defenderSide.isAuroraVeil);
        case "Encore":
            return calcEncore(user, target, battle.lastMove);
        case "Counter":
        case "Mirror Coat":
            return calcCounterMirrorCoat(user, target, move, battle.field);
        case "Agility":
        case "Rock Polish":
        case "Autotomize":
            return calcSpeedMoves(user, target);
        case "Nasty Plot":
        case "Calm Mind":
        case "Quiver Dance":
            return calcSpAtkUpMoves(user, target, battle.field);
        case "Recover":
        case "Slack Off":
        case "Soft-Boiled":
        case "Roost":
        case "Shore Up":
            return calcRecoveryMoves(user, target, move, battle.field);
        case "Toxic":
        case "Poison Powder":
            return calcPoisonMoves(user, target);
        case "Dragon Dance":
        case "Growth":
        case "Work Up":
            return calcGeneralSetup(user, target, move, battle.field);
        case "Iron Defense":
        case "Acid Armor":
        case "Cosmic Power":
            return calcDefenseSetup(user, target, move, battle.field);
        case "Focus Energy":
        case "Laser Focus":
            return calcCritMoves(user, target, hasHighCritMove(user));
        default:
            return calcAttackMove(move, user, target, battle.field);
    }
}
exports.calcMoveScore = calcMoveScore;
function hasStatBoost(pokemon) {
    var boostableStats = ['atk', 'def', 'spa', 'spd', 'spe'];
    return boostableStats.some(function (stat) { return pokemon.boosts[stat] > 0; });
}
function hasHighCritMove(user) {
    var e_1, _a;
    var highCritMoves = [
        "10,000,000 Volt Thunderbolt",
        "Aeroblast",
        "Air Cutter",
        "Aqua Cutter",
        "Attack Order",
        "Blaze Kick",
        "Crabhammer",
        "Cross Chop",
        "Cross Poison",
        "Dire Claw",
        "Drill Run",
        "Esper Wing",
        "Ivy Cudgel",
        "Karate Chop",
        "Leaf Blade",
        "Night Slash",
        "Poison Tail",
        "Psycho Cut",
        "Razor Leaf",
        "Razor Wind",
        "Shadow Blast",
        "Shadow Claw",
        "Sky Attack",
        "Slash",
        "Snipe Shot",
        "Spacial Rend",
        "Stone Edge",
        "Triple Arrows"
    ];
    try {
        for (var _b = __values(user.moves), _c = _b.next(); !_c.done; _c = _b.next()) {
            var move = _c.value;
            if (highCritMoves.includes(move)) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}
function maxDamage(attacker, defender, field) {
    var e_2, _a;
    if (attacker.moves.length === 0)
        return 0;
    var maxFraction = 0;
    try {
        for (var _b = __values(attacker.moves), _c = _b.next(); !_c.done; _c = _b.next()) {
            var moveEntry = _c.value;
            var move = typeof moveEntry === 'string' ? new move_1.Move(gen, moveEntry) : moveEntry;
            if (move.category === 'Status')
                continue;
            var result = (0, calc_1.calculate)(gen, attacker, defender, move, field);
            var fraction = result.range()[1] / defender.maxHP();
            if (fraction > maxFraction)
                maxFraction = fraction;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return maxFraction;
}
function calcAtkDropMove(user, target, hasMoveOfSplit) {
    if ((target.ability !== "Clear Body" || target.ability !== "White Smoke" || target.ability !== "Contrary") && hasMoveOfSplit) {
        return 6;
    }
    return 5;
}
function calcAcidSpray() {
    return 6;
}
function calcFutureSight(user, target, field) {
    if (user.stats.spe > target.stats.spe && maxDamage(target, user, field) >= 1) {
        return 8;
    }
    return 6;
}
function calcRelicSong(user) {
    if (user.name === "Meloetta") {
        return 10;
    }
    return -20;
}
function calcSuckerPunch(lastMove) {
    var wasLastMove = lastMove.name === "Sucker Punch";
    if (wasLastMove) {
        return -20;
    }
    return 0;
}
function calcPursuit(user, target, canKO) {
    var score = 0;
    if (canKO) {
        score += 10;
    }
    else if (target.curHP() / target.maxHP() <= 0.2) {
        score += 10;
    }
    else if (target.curHP() / target.maxHP() <= 0.4) {
        score += 8;
    }
    if (user.stats.spe >= target.stats.spe) {
        score += 3;
    }
    return score;
}
function calcFellStinger(user, target, doesKo) {
    if (user.boosts.atk <= 5 && doesKo) {
        if (user.stats.spe >= target.stats.spe) {
            return 21;
        }
        else {
            return 15;
        }
    }
    return 0;
}
function calcRollout() {
    return 7;
}
function calcStealthRock(firstTurn) {
    if (firstTurn) {
        return 9;
    }
    return 7;
}
function calcSpikes(hasSpikes, firstTurn) {
    var score = 7;
    if (hasSpikes) {
        score -= 1;
    }
    if (firstTurn) {
        score += 2;
    }
    return score;
}
function calcStickyWeb(firstTurn) {
    if (firstTurn) {
        return 12;
    }
    return 9;
}
function calcProtect(user, target, battle) {
    var protectMoves = ["Protect", "Detect", "King's Shield", "Baneful Bunker"];
    if (battle.lastMove && protectMoves.includes(battle.lastMove.name)) {
        var lastMoveProtect = true;
    }
    else {
        var lastMoveProtect = false;
    }
    var score = 6;
    if (user.status === "psn" || user.status === "brn" || battle.field.attackerSide.isSeeded) {
        score -= 2;
    }
    if (target.status === "psn" || target.status === "brn" || battle.field.defenderSide.isSeeded) {
        score += 1;
    }
    if (lastMoveProtect) {
        return -20;
    }
    return score;
}
function calcImprison(user, target) {
    if (user.moves.filter(function (element) { return target.moves.includes(element); })) {
        return 9;
    }
    return -20;
}
function calcBatonPass(user, isLastMon) {
    if (isLastMon) {
        return -20;
    }
    if (user.substitute || hasStatBoost(user)) {
        return 14;
    }
    return 0;
}
function calcTailwind(user, target) {
    if (user.stats.spe < target.stats.spe) {
        return 9;
    }
    return 5;
}
function calcTrickRoom(user, target, isTrickRoom) {
    if (isTrickRoom) {
        return -20;
    }
    else if (user.stats.spe < target.stats.spe) {
        return 10;
    }
    return 5;
}
function calcFakeout(target, firstTurn) {
    if ((target.ability !== "Shield Dust" || target.ability !== "Inner Focus") && firstTurn) {
        return 9;
    }
    return 0;
}
function calcFinalGambit(user, target, field) {
    if (user.stats.spe >= target.stats.spe && user.maxHP() > target.maxHP()) {
        return 8;
    }
    else if (user.stats.spe >= target.stats.spe && maxDamage(target, user, field) >= user.curHP() / user.maxHP()) {
        return 7;
    }
    return 6;
}
function calcTerrain(user) {
    if (user.item === "Terrain Extender") {
        return 9;
    }
    return 8;
}
function calcScreens(user, target, move) {
    var score = 6;
    var targetHasCorrespondingMove = false;
    if (move.name == "Light Screen") {
        targetHasCorrespondingMove = hasMoveOfSplit(target, "Special");
    }
    else if (move.name == "Reflect") {
        targetHasCorrespondingMove = hasMoveOfSplit(target, "Physical");
    }
    else {
        targetHasCorrespondingMove = true;
    }
    if (targetHasCorrespondingMove) {
        if (user.item === "Light Clay") {
            score += 1;
        }
        score += 1;
    }
    return score;
}
function calcSubstitute(user, target, battle) {
    var score = 6;
    if (target.status === "slp") {
        score += 2;
    }
    if (battle.field.defenderSide.isSeeded && user.stats.spe >= target.stats.spe) {
        score += 2;
    }
    var hasSoundMoves = hasSoundMove(target);
    if (hasSoundMoves) {
        score -= 8;
    }
    if (user.curHP() / user.maxHP() <= 0.5 || target.ability === "Infiltrator") {
        return -20;
    }
    return score;
}
function hasSoundMove(target) {
    var e_3, _a;
    try {
        for (var _b = __values(target.moves), _c = _b.next(); !_c.done; _c = _b.next()) {
            var move = _c.value;
            if (soundMoves.includes(move)) {
                return true;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return false;
}
var soundMoves = [
    "Growl",
    "Roar",
    "Sing",
    "Supersonic",
    "Screech",
    "Snore",
    "Perish Song",
    "Heal Bell",
    "Uproar",
    "Hyper Voice",
    "Metal Sound",
    "Grass Whistle",
    "Howl",
    "Bug Buzz",
    "Chatter",
    "Round",
    "Echoed Voice",
    "Relic Song",
    "Snarl",
    "Noble Roar",
    "Disarming Voice",
    "Parting Shot",
    "Boomburst",
    "Confide",
    "Sparkling Aria",
    "Clanging Scales",
    "Clangorous Soulblaze",
    "Clangorous Soul",
    "Overdrive",
    "Eerie Spell",
    "Torch Song",
    "Dragon Cheer",
    "Alluring Voice",
    "Psychic Noise"
];
function calcBoomMove(user, target, isPartyEmpty) {
    if (isPartyEmpty || target.types.includes("Ghost")) {
        return -20;
    }
    if (user.curHP() / user.maxHP() <= 0.1) {
        return 10;
    }
    else if (user.curHP() / user.maxHP() <= 0.33) {
        return 8;
    }
    else if (user.curHP() / user.maxHP() <= 0.66) {
        return 7;
    }
    else {
        return 6;
    }
}
function calcMomento(user) {
    if (user.curHP() / user.maxHP() <= 0.1) {
        return 16;
    }
    else if (user.curHP() / user.maxHP() <= 0.33) {
        return 14;
    }
    else if (user.curHP() / user.maxHP() <= 0.66) {
        return 13;
    }
    else {
        return 6;
    }
}
function calcPar(user, target) {
    if ((target.stats.spe > user.stats.spe && user.stats.spe >= 0.25 * target.stats.spe) || user.moves.includes(new move_1.Move(gen, "Hex").name)) {
        return 8;
    }
    return 7;
}
function calcWillo(user, target) {
    var score = 6;
    if (hasMoveOfSplit(target, "Physical")) {
        score += 1;
    }
    if (user.moves.includes(new move_1.Move(gen, "Hex").name)) {
        score += 1;
    }
    return score;
}
function calcTrick(user) {
    if (user.item === "Toxic Orb" || user.item === "Flame Orb" || user.item === "Black Sludge") {
        return 6;
    }
    if (user.item === "Iron Ball" || user.item === "Lagging Tail" || user.item === "Sticky Barb") {
        return 7;
    }
    return 5;
}
function calcSleepMoves(user, target) {
    var score = 6;
    if (canSleep(target)) {
        score += 1;
        if ((user.moves.includes(new move_1.Move(gen, "Dream Eater").name) || user.moves.includes(new move_1.Move(gen, "Nightmare").name)) &&
            (!target.moves.includes(new move_1.Move(gen, "Snore").name) || !target.moves.includes(new move_1.Move(gen, "Sleep Talk").name))) {
            score += 1;
        }
        if (user.moves.includes(new move_1.Move(gen, "Hex").name)) {
            score += 1;
        }
    }
    return score;
}
function canSleep(target) {
    if (target.status || target.hasAbility("Insomnia") || target.hasAbility("Vital Spirit")) {
        return false;
    }
    return true;
}
function calcPoisonMoves(user, target) {
    var score = 6;
    if (target.curHP() / target.maxHP() >= 0.2 && canPoison(target)) {
        if (user.moves.includes(new move_1.Move(gen, "Hex").name) || user.moves.includes(new move_1.Move(gen, "Venom Drench").name) || user.moves.includes(new move_1.Move(gen, "Venoshock").name) || user.ability === "Merciless") {
            score += 2;
        }
    }
    return score;
}
function canPoison(target) {
    if (target.hasType('Steel') || target.hasType('Poison') || target.status || target.hasAbility("Poison Heal") || target.hasAbility("Magic Guard")) {
        return false;
    }
    return true;
}
function calcGeneralSetup(user, target, move, field) {
    if (maxDamage(target, user, field) >= 1) {
        return -20;
    }
    if (target.ability === "Unaware" && !["Power-up Punch", "Swords Dance", "Howl"].includes(move.name)) {
        return -20;
    }
    return 6;
}
function calcMixedSetupMoves(user, target, move, field) {
    var physicalMoves = ["Coil", "Bulk Up", "No Retreat"];
    if (physicalMoves.includes(move.name)) {
        if (hasOnlyMovesOfSplit(target, "Physical")) {
            return calcDefenseSetup(user, target, move, field);
        }
        else {
            return calcOffenseSetup(user, target, field);
        }
    }
    else {
        if (hasOnlyMovesOfSplit(target, "Special")) {
            return calcDefenseSetup(user, target, move, field);
        }
        else {
            return calcOffenseSetup(user, target, field);
        }
    }
}
function calcOffenseSetup(user, target, field) {
    var score = 6;
    if (target.status === "frz" || target.status === "slp" || target.recharging()) {
        score += 3;
    }
    if (user.stats.spe <= target.stats.spe && maxDamage(target, user, field) * user.maxHP() / user.curHP() <= 2) {
        score -= 5;
    }
    return score;
}
function calcDefenseSetup(user, target, move, field) {
    var score = 6;
    if (user.stats.spe <= target.stats.spe && maxDamage(target, user, field) * user.maxHP() / user.curHP() <= 2) {
        score -= 5;
    }
    if (target.status === "frz" || target.status === "slp" || target.recharging()) {
        score += 2;
    }
    if (move.name === "Cosmic Power" && (user.stats.def <= 1 || user.stats.spd <= 1)) {
        score += 2;
    }
    return score;
}
function calcSpeedMoves(user, target) {
    if (user.stats.spe <= target.stats.spe) {
        return 7;
    }
    return -20;
}
function calcSpAtkUpMoves(user, target, field) {
    var score = 6;
    if (target.status === "frz" || target.status === "slp" || target.recharging()) {
        score += 3;
    }
    else if (maxDamage(target, user, field) * user.maxHP() / user.curHP() >= 3) {
        score += 1;
        if (user.stats.spe >= target.stats.spe) {
            score += 1;
        }
    }
    else if (maxDamage(target, user, field) * user.maxHP() / user.curHP() <= 2 && user.stats.spe <= target.stats.spe) {
        score -= 5;
    }
    if (user.boosts.spa >= 2) {
        score -= 1;
    }
    return score;
}
function calcShellSmash(user, target, field) {
    var score = 6;
    if (target.status === "frz" || target.status === "slp" || target.recharging()) {
        score += 3;
    }
    var dmgFraction = maxDamage(target, user, field);
    var curHPFraction = user.curHP() / user.maxHP();
    if (dmgFraction <= curHPFraction) {
        score += 2;
    }
    else if (dmgFraction >= curHPFraction) {
        score -= 2;
    }
    if (user.boosts.atk >= 1 || user.boosts.atk === 6 || user.boosts.spa === 6) {
        score -= 20;
    }
    return score;
}
function calcBellyDrum(user, target, field) {
    var hpCostFraction = 0.5;
    if (user.item === "Sitrus Berry") {
        hpCostFraction -= 0.25;
    }
    if (target.status === "frz" || target.status === "slp" || target.recharging()) {
        return 9;
    }
    else if (maxDamage(target, user, field) < user.curHP() / user.maxHP() - hpCostFraction) {
        return 8;
    }
    else {
        return 4;
    }
}
function calcCritMoves(user, target, hasHighCritMove) {
    if (target.ability === "Battle Armor" || target.ability === "Shell Armor") {
        return -20;
    }
    else if (user.ability === "Sniper" || user.ability === "Super Luck" || user.item === "Scope Lens" || hasHighCritMove) {
        return 7;
    }
    return 6;
}
function calcMeteorBeam(user) {
    if (user.item === "Power Herb") {
        return 9;
    }
    return -20;
}
function calcDestinyBond(user, target, field) {
    if (user.stats.spe >= target.stats.spe && maxDamage(target, user, field) >= user.curHP() / user.maxHP()) {
        return 7;
    }
    else if (user.stats.spe < target.stats.spe) {
        return 5;
    }
    return -20;
}
function calcRecoveryMoves(user, target, move, field) {
    if (user.curHP() / user.maxHP() === 1) {
        return -20;
    }
    else if (user.curHP() / user.maxHP() >= 0.85) {
        return -6;
    }
    if (shouldRecover(user, target, move, field)) {
        return 7;
    }
    else {
        return 5;
    }
}
function calcSunRecMoves(user, target, move, isSun, field) {
    var sunShouldRecover = shouldRecover(user, target, move, field);
    var recalcShouldRecover = shouldRecover(user, target, new move_1.Move(gen, "Recover"), field);
    if (user.curHP() / user.maxHP() === 1) {
        return -20;
    }
    else if (user.curHP() / user.maxHP() >= 0.85) {
        return -6;
    }
    if (isSun && sunShouldRecover) {
        return 8;
    }
    else if (!isSun && recalcShouldRecover) {
        return 7;
    }
    return 5;
}
function calcRest(user, target, isRaining, field) {
    if (shouldRecover(user, target, new move_1.Move(gen, "Rest"), field)) {
        if ((user.item === "Lum Berry" || user.item === "Chesto Berry") ||
            (user.moves.includes(new move_1.Move(gen, "Sleep Talk").name)) || user.moves.includes(new move_1.Move(gen, "Snore").name) ||
            (user.ability === "Shed Skin" || user.ability === "Early Bird") ||
            (user.ability === "Hydration" && isRaining)) {
            return 8;
        }
        else {
            return 7;
        }
    }
    return 5;
}
function calcTaunt(target, isTRActive, isAVActive) {
    if (target.moves.includes(new move_1.Move(gen, "Trick Room").name) && isTRActive) {
        return 9;
    }
    else if (target.moves.includes(new move_1.Move(gen, "Defog").name) && isAVActive) {
        return 9;
    }
    return 5;
}
function calcEncore(user, target, lastMove) {
    if (user.stats.spe >= target.stats.spe && lastMove.category === "Status") {
        return 7;
    }
    else if (user.stats.spe <= target.stats.spe) {
        return 6;
    }
    return -20.;
}
function calcCounterMirrorCoat(user, target, move, field) {
    var moveScore = 6;
    var category = "Physical";
    if (move.name === "Mirror Coat") {
        category = "Special";
    }
    var canKill = maxDamage(target, user, field) >= user.curHP() / user.maxHP();
    var hasSurvivalItem = user.curHP() / user.maxHP() === 1 && (user.item === "Focus Sash" || user.ability === "Sturdy");
    if (hasOnlyMovesOfSplit(target, category) && canKill && hasSurvivalItem) {
        moveScore += 2;
    }
    if (canKill && !hasSurvivalItem) {
        moveScore -= 20;
    }
    if (!canKill && hasOnlyMovesOfSplit(target, category)) {
        moveScore += 2;
    }
    if (user.stats.spe >= target.stats.spe) {
        moveScore -= 1;
    }
    if (hasStatusMove(target)) {
        moveScore -= 1;
    }
    return moveScore;
}
function hasStatusMove(target) {
    var e_4, _a;
    try {
        for (var _b = __values(target.moves), _c = _b.next(); !_c.done; _c = _b.next()) {
            var move = _c.value;
            var checkMove = new move_1.Move(gen, move);
            if (checkMove.category === "Status") {
                return true;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return false;
}
function hasOnlyMovesOfSplit(target, moveCat) {
    var e_5, _a, e_6, _b;
    if (moveCat === "Physical") {
        try {
            for (var _c = __values(target.moves), _d = _c.next(); !_d.done; _d = _c.next()) {
                var move = _d.value;
                var checkMove = new move_1.Move(gen, move);
                if (checkMove.category === "Special") {
                    return false;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return true;
    }
    else if (moveCat === "Special") {
        try {
            for (var _e = __values(target.moves), _f = _e.next(); !_f.done; _f = _e.next()) {
                var move = _f.value;
                var checkMove = new move_1.Move(gen, move);
                if (checkMove.category === "Physical") {
                    return false;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return true;
    }
    return true;
}
function hasMoveOfSplit(target, moveCat) {
    var e_7, _a, e_8, _b;
    if (moveCat === "Physical") {
        try {
            for (var _c = __values(target.moves), _d = _c.next(); !_d.done; _d = _c.next()) {
                var move = _d.value;
                var checkMove = new move_1.Move(gen, move);
                if (checkMove.category === "Physical") {
                    return true;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return false;
    }
    else if (moveCat === "Special") {
        try {
            for (var _e = __values(target.moves), _f = _e.next(); !_f.done; _f = _e.next()) {
                var move = _f.value;
                var checkMove = new move_1.Move(gen, move);
                if (checkMove.category === "Special") {
                    return true;
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_8) throw e_8.error; }
        }
        return false;
    }
    return true;
}
function shouldRecover(user, target, healMove, field) {
    var percentage = getMovePercentage(healMove);
    var dmgFraction = maxDamage(target, user, field);
    if (user.status == "tox") {
        return 0;
    }
    if (dmgFraction >= percentage) {
        return 0;
    }
    if (user.stats.spe >= target.stats.spe) {
        if (dmgFraction <= user.curHP() / user.maxHP() + percentage && dmgFraction >= user.curHP() / user.maxHP()) {
            return 1;
        }
        else if (dmgFraction <= user.curHP() / user.maxHP()) {
            if (user.curHP() / user.maxHP() <= 0.66 && user.curHP() / user.maxHP() >= 0.4) {
                return 0.5;
            }
            else if (user.curHP() / user.maxHP() <= 0.4) {
                return 1;
            }
        }
    }
    else {
        if (user.curHP() / user.maxHP() <= 0.7) {
            return 0.75;
        }
        else if (user.curHP() / user.maxHP() <= 0.5) {
            return 1;
        }
    }
    return 0;
}
function getMovePercentage(healMove) {
    var weatherMoves = ["Morning Sun", "Synthesis", "Moonlight"];
    if (healMove.name == "Rest") {
        return 1;
    }
    else if (weatherMoves.includes(healMove.name)) {
        return 0.67;
    }
    else {
        return 0.5;
    }
}
function willSwitch(user, target, team) {
    return false;
}
//# sourceMappingURL=rbai.js.map