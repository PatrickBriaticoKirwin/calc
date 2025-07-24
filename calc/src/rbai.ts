import {Move} from './move';
import {Pokemon} from './pokemon';


function calcMoveScores(user: Pokemon, target: Pokemon): number {
  const highestDmgMove  = 6;
  const probAddTwo = 0.2;
  const slowKill = 9;
  const fastKill = 12;
  var moveScore = 0;
  // ai rolls a random damage roll for all attacks and highest gets highest dmg move. If multiple kill, all get the bonus
  if (moveKills(move)){
    if (user.stats.spe >= target.stats.spe || (move.hasPriority() &&  user.stats.spe < target.stats.spe)) {
      moveScore += 6;
    }
    else if (! user.isFaster(target)){
      moveScore += 3;
    }
    if (user.ability in ["Moxie", "Beast Boost", "Chilling Neigh", "Grim Neigh"]){
      moveScore += 1;
    }
  }
  return moveScore;
}

function calcMoveScore(move: Move, user: Pokemon, target: Pokemon): number {
  switch (move.name) {
    case "Acid Spray":
      return calcAttackMove(move, user, target) + calcAcidSpray();

    case "Future Sight":
      return calcFutureSight(user, target);

    case "Relic Song":
      return calcRelicSong(user.isInBaseForm()); // Assuming there's an isInBaseForm method

    case "Sucker Punch":
      return calcSuckerPunch(target.wasLastMove); // Assuming there's a wasLastMove property

    case "Pursuit":
      return calcPursuit(user, target, move.canKO(target)); // Assuming there's a canKO method

    case "Fell Stinger":
      return calcFellStinger(user, target, move.canKO(target));

    case "Rollout":
      return calcRollout();

    case "Stealth Rock":
      return calcStealthRock(user.isFirstTurn); // Assuming there's an isFirstTurn property

    case "Spikes":
      return calcSpickes(target.hasSpikes, user.isFirstTurn); // Assuming these properties exist

    case "Sticky Web":
      return calcStickyWeb(user, user.isFirstTurn);

    case "Protect":
    case "Detect":
    case "King's Shield":
    case "Baneful Bunker":
      return calcProtect(user, target, user.lastMoveWasProtect); // Assuming this property exists

    case "Imprison":
      return calcImprison(user, target);

    case "Baton Pass":
      return calcBatonPass(user, target, user.isLastMon); // Assuming this property exists

    case "Tailwind":
      return calcTailwind(user, target);

    case "Trick Room":
      return calcTrickRoom(user, target, battle.isTrickRoom); // Assuming battle context exists

    case "Fake Out":
      return calcFakeout(user, target, user.isFirstTurn);

    case "Final Gambit":
      return calcFinalGambit(user, target);

    // Add terrain moves
    case "Electric Terrain":
    case "Grassy Terrain":
    case "Misty Terrain":
    case "Psychic Terrain":
      return calcTerrain(user);

    // Screen moves
    case "Light Screen":
    case "Reflect":
    case "Aurora Veil":
      return calcScreens(user, target.hasCorrespondingMove); // Assuming this property exists

    case "Substitute":
      return calcSubstitute(user, target);

    // Boom moves
    case "Self-Destruct":
    case "Explosion":
      return calcBoomMove(user, target, user.isPartyEmpty); // Assuming this property exists

    case "Memento":
      return calcMomento(user, target);

    // Status moves
    case "Thunder Wave":
    case "Stun Spore":
    case "Glare":
      return calcPar(user, target);

    case "Will-O-Wisp":
      return calcWillo(user, target);

    case "Trick":
    case "Switcheroo":
      return calcTrick(user);

    // Sleep moves
    case "Hypnosis":
    case "Sleep Powder":
    case "Sing":
    case "Grasswhistle":
    case "Spore":
      return calcSleepMoves(user, target, move);

    // Recovery moves in sun
    case "Synthesis":
    case "Morning Sun":
    case "Moonlight":
      return calcSunRecMoves(user, target, move, battle.isSunny);

    // Rest
    case "Rest":
      return calcRest(user, target, battle.isRaining);

    // Mixed setup moves
    case "Coil":
    case "Bulk Up":
    case "No Retreat":
      return calcMixedSetupMoves(user, target, move);

    // Shell Smash
    case "Shell Smash":
      return calcShellSmash(user, target);

    // Belly Drum
    case "Belly Drum":
      return calcBellyDrum(user, target);

    // Meteor Beam
    case "Meteor Beam":
      return calcMeteorBeam(user);

    // Destiny Bond
    case "Destiny Bond":
      return calcDestinyBond(user, target);

    // Taunt
    case "Taunt":
      return calcTaunt(user, target, battle.isTrickRoom, battle.isAuroraVeil);

    // Encore
    case "Encore":
      return calcEncore(user, target, target.lastMove);

    // Counter/Mirror Coat
    case "Counter":
    case "Mirror Coat":
      return calcCounterMirrorCoat(user, target, move);

    // Speed boosting moves
    case "Agility":
    case "Rock Polish":
    case "Autotomize":
      return calcSpeedMoves(user, target);

    // Special Attack boosting moves
    case "Nasty Plot":
    case "Calm Mind":
    case "Quiver Dance":
      return calcSpAtkUpMoves(user, target);

    // Recovery moves
    case "Recover":
    case "Slack Off":
    case "Soft-Boiled":
    case "Roost":
    case "Shore Up":
      return calcRecoveryMoves(user, target, move);

    // Poison moves
    case "Toxic":
    case "Poison Powder":
      return calcPoisonMoves(user, target, move);

    // General setup moves
    case "Dragon Dance":
    case "Growth":
    case "Work Up":
      return calcGeneralSetup(user, target, move);

    // Defense setup moves
    case "Iron Defense":
    case "Acid Armor":
    case "Cosmic Power":
      return calcDefenseSetup(user, target, move);

    case "Focus Energy":
    case "Laser Focus":
      return calcCritMoves(user, target, hasHighCritMove(user));

    default:
      return calcAttackMove(user, target, move)
  }
}

function hasHighCritMove(user: Pokemon): boolean{
  const highCritMoves: string[] = [
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
  for (const move of user.moves) {
    if (highCritMoves.includes(move)) {
      return true;
    }
  }
  return false;
}


function calcSpeedDropMove(user: Pokemon, target:Pokemon): number{
  return 9;
}

function calcAtkDropMove(user: Pokemon, target: Pokemon, hasMoveOfSplit: boolean): number{
  if((target.ability !== "Clear Body" || target.ability !== "White Smoke" || target.ability !== "Contrary") && hasMoveOfSplit) {
    return 6;
  }
  return 5;
}

function calcAcidSpray(): number {
  return 6;
}

function calcFutureSight(user: Pokemon, target: Pokemon): number {
  if(user.stats.spe > target.stats.spe && target.maxDamage(user) >= 1) {
    return 8;
  }
  return 6;
}

function calcRelicSong(inBaseForm: boolean): number {
  if(inBaseForm) {
    return 10;
  }
  return -20;
}

function calcSuckerPunch(wasLastMove: boolean): number {
  if(wasLastMove) {
    return -20;
  }
  return 0;
}

function calcPursuit(user: Pokemon, target: Pokemon, canKO: boolean): number {
  var score = 0;
  if(canKO) {
    score += 10;
  }else if(target.curHP() / target.maxHP() <= 0.2) {
    score += 10;
  } else if(target.curHP() / target.maxHP() <= 0.4) {
    score += 8; // 50% chance to do nothing
  }
  if(user.stats.spe >= target.stats.spe) {
    score += 3;
  }
  return score;
}

function calcFellStinger(user: Pokemon, target: Pokemon, doesKo: boolean): number {
  if(user.boosts.atk <= 5 && doesKo){
    if(user.stats.spe >= target.stats.spe){
      return 21; //20% chance to be 23
    }
    else{
      return 15; //20% chance to be 17
    }
  }
  return 0; //just a normal attack, shouldn't even call this function
}

function calcRollout(): number {
  return 7;
}

function calcStealthRock(firstTurn: boolean): number {
  if(firstTurn) {
    return 9;
  }
  return 7;//25% chance to be 1 lower
}

function calcSpickes(hasSpikes: boolean, firstTurn: boolean): number {
  var score = 7; //25% chance to be -1
  if(hasSpikes) {
    score -= 1;
  }
  if(firstTurn) {
    score += 2;
  }
  return score;
}

function calcStickyWeb(user: Pokemon, firstTurn: boolean): number {
  if(firstTurn) {
    return 12; // 25% return 9
  }
  return 9; // 25% return 6
}

function calcProtect(user: Pokemon, target: Pokemon, lastMoveProtect: boolean): number {
  var score = 6;
  if(user.status === "Poison" || user.status === "Burn" || user.seeded) {// there are some other checks im lazy
    score -= 2;
  }
  if(target.status === "Poison" || target.status === "Burn" || target.seeded){
    score += 1;
  }
  if(lastMoveProtect) {
    return -20; //50% of time
  }

}

function calcImprison(user: Pokemon, target: Pokemon): number {
  if(user.moves.filter((element) => target.moves.includes(element))) {
    return 9;
  }
  return -20;
}

function calcBatonPass(user: Pokemon, target: Pokemon, isLastMon: boolean): number {
  if(isLastMon) {
    return -20;
  }
  if(user.substitue || user.hasStatIncrease) {
    return 14;
  }return 0;
}

function calcTailwind(user: Pokemon, target:Pokemon): number {
  if(user.stats.spe < target.stats.spe) {
    return 9;
  }
  return 5;
}

function calcTrickRoom(user:Pokemon, target:Pokemon, isTrickRoom: boolean): number {
  if(isTrickRoom) {
    return -20;
  } else if(user.stats.spe < target.stats.spe) {
    return 10;
  }
  return 5;
}

function calcFakeout(user: Pokemon, target: Pokemon, firstTurn: boolean): number {
  if((target.ability !== "Shield Dust" || target.ability !== "Inner Focus") && firstTurn){
    return 9;
  }
  return 0;
}

function calcFinalGambit(user: Pokemon, target: Pokemon) {
  if(user.stats.spe >= target.stats.spe && user.maxHP() > target.maxHP()) {
    return 8;
  } else if(user.stats.spe >= target.stats.spe && target.maxDamage(user) >= user.curHP()) {
    return 7;
  }
  return 6;
}

function calcTerrain(user: Pokemon): number {
  if(user.item === "Terrain Extender") {
    return 9;
  }
  return 8;
}

function calcScreens(user: Pokemon, targetHasCorrespondingMove: boolean): number {
  var score = 6;
  if (targetHasCorrespondingMove) {
    if(user.item === "Light Clay") {
      score += 1;
    }
    score += 1; //50% of the time
  }
  return score;
}

function calcSubstitute(user: Pokemon, target: Pokemon): number {
  var score = 6;
  if(target.status() === "Sleep") {
    score += 2;
  }
  if(target.isSeeded() && user.stats.spe >= target.stats.spe) {
    score += 2;
  }
  //There is a random -1 here
  if(target.moves.includes(soundMoves)) {
    score -= 8;
  }
  if(user.curHP() / user.maxHP() <= 0.5 || target.ability === "Infiltrator") {
    return -20;
  }
  return score;
}

function calcBoomMove(user: Pokemon, target: Pokemon, isPartyEmpty: boolean): number {
  if(isPartyEmpty || target.type1 == "Ghost" || target.type2 == "Ghost") {
    return -20;
  }
  if(user.curHP()/user.maxHP() <= 0.1) {
    return 10;
  } else if(user.curHP()/user.maxHP() <= 0.33) {
    return 8; // 30% to be 0
  } else if(user.curHP()/user.maxHP() <= 0.66) {
    return 7; // 50% to be 0
  } else{
    return 6; // 5% to be 13
  }
//if only 1 mon left in the players party and the ai's party is empty its just a -1
}

function calcMomento(user: Pokemon, target: Pokemon): number {
  if(user.curHP()/user.maxHP() <= 0.1) {
    return 16;
  } else if(user.curHP()/user.maxHP() <= 0.33) {
    return 14; // 30% to be 6
  } else if(user.curHP()/user.maxHP() <= 0.66) {
    return 13; // 50% to be 6
  } else{
    return 6; // 5% to be 13
  }
//never used if last mon
}

function calcPar(user: Pokeon, target: Pokemon): number {
  if((target.stats.spe > user.stats.spe && user.stats.spe >= 0.25*target.stats.spe) || user.moves.includes("Hex") || target.status() === "Confused" || target.status() === "Infatuated") {
    return 8
  }
  return 7; //50% time return 6
}

function calcWillo(user: Pokemon, target: Pokemon): number {
  var score = 6;
  if(target.moves.hasPhysical()) {
    score += 1;
  }
  if(user.moves.includes("Hex")) {
    score += 1;
  }
  return score;
}

function calcTrick(user: Pokemon): number {
  if(user.item() === "Toxic Orb" || user.item() === "Flame Orb" || user.item() === "Black Sludge") {
    return 6; //50% of the time its 7
  } if(user.item() === "Iron Ball" || user.item() === "Lagging Tail" || user.item() === "Sticky Barb") {
    return 7;
  }
  return 5;
}

function calcSleepMoves(user: Pokemon, target: Pokemon, move: Move): number {
  var score = 6;
  if(canSleep(target)) {
    score += 1;
    if((user.moves.includes("Dream Eater") || user.moves.includes("Nightmare")) &&
       (!target.moves.includes("Snore") || !target.moves.includes("Sleep Talk"))) {
      score += 1;
    }
    if(user.moves.includes("Hex")) {
      score += 1;
    }
  }
  return score;
}

function calcPoisonMoves(user: Pokemon, target: Pokemon, move: Move): number {
  var score = 6;
  if(target.curHP()/target.maxHP() >= 0.2 && canPoison(target)) { // THIS ONLY HAPPENS 38% of the time???@?@???@??
    if(user.moves.includes("Hex") || user.moves.includes("Venom Drench") || user.moves.includes("Venoshock") || user.ability === "Merciless") {
      score += 2;
    }
  }
  return score
}

function calcGeneralSetup(user: Pokemon, target: Pokemon, move: Move): number {
  if(target.maxDamage(user) >= 1) {
    return -20;
  }
  if(target.ability() === "Unaware" && ! ["Power-up Punch", "Swords Dance", "Howl"].includes(move.name())) {
    return -20;
  }
  return 6;
  // we can either just return the calc of defense/offense based on move name here or have this in the control flow
  // TODO: decide and clean up control flow
}

function calcMixedSetupMoves(user: Pokemon, target: Pokemon, move: Move): number {
  const physicalMoves = ["Coil", "Bulk Up", "No Retreat"];
  if(physicalMoves.includes(move.name())) {
    if(hasOnlyMovesOfSplit(target, "Physical")) {
      return calcDefenseSetup(user, target, move);
    } else{
      return calcOffenseSetup(user, target, move);
    }
  }else{
    if(hasOnlyMovesOfSplit(target, "Special")) {
      return calcDefenseSetup(user, target, move);
    } else {
      return calcOffenseSetup(user, target, move);
    }
  }
}

function calcOffenseSetup(user: Pokemon, target: Pokemon, move: Move): number {
  var score = 6;
  if(target.status === "Frozen" || target.status === "Sleep" || target.recharging()) {
    score += 3;
  }
  if(user.stats.spe <= target.stats.spe && target.maxDamage(user) / user.curHP() <= 2) {
    score -= 5;
  }
  return score;
}

function calcDefenseSetup(user: Pokemon, target: Pokemon, move: Move): number {
  var score = 6;
  if(user.stats.spe <= target.stats.spe && target.maxDamage(user) / user.curHP() <= 2) {
    score -= 5;
  }
  if(target.status === "Frozen" || target.status === "Sleep" || target.recharging()) {
    score += 2;
  }
  if(move.name() === "Cosmic Power" && (user.def <= 1 || user.spdef <= 1)) {
    score += 2;
  }
  return score;
}

function calcSpeedMoves(user: Pokemon, target: Pokemon): number {
  if(user.stats.spe <= target.stats.spe) {
    return 7;
  }
  return -20;
}

function calcSpAtkUpMoves(user: Pokemon, target: Pokemon): number {
  var score = 6;
  if (target.status === "Frozen" || target.status === "Sleep" || target.recharging()) {
    score += 3;
  } else if(target.maxDamage(user)/user.curHP() >= 3) {
    score += 1;
    if(user.stats.spe >= target.stats.spe) {
      score += 1;
    }
  } else if(target.maxDamage(user) / user.curHP() <= 2 && user.stats.spe <= target.stats.spe) {
    score -= 5;
  }
  if(user.spAtk >= 2) {
    score -= 1;
  }
  return score;
}

function calcShellSmash(user: Pokemon, target: Pokemon): number {
  var score = 6;
  if (target.status === "Frozen" || target.status === "Sleep" || target.recharging()) {
    score += 3;
  }
  if (target.maxDamage(user) <=  user.curHP()){//TODO: Add defense drops to the max damage
    score += 2;
  } else if (target.maxDamage(user) >= user.curHP()) {
    score -= 2;
  }
  if (user.boosts.atk >= 1 || user.boosts.atk === 6 || user.boosts.spa === 6) {
    score -= 20;
  }
  return score;
}

function calcBellyDrum(user: Pokemon, target: Pokemon): number {
  var damage = 0.5;
  if (user.item === "Sitrus Berry") {
    damage -= 0.25;
  }
  if(target.status === "Frozen" || target.status === "Sleep" || target.recharging()) {
    return 9;
  } else if (target.maxDamage(user) < user.curHP() - damage) {
    return 8;
  } else {
    return 4
  }
}

function calcCritMoves(user: Pokemon, target: Pokemon, hasHighCritMove: boolean): number {
  if(target.ability === "Battle Armor" || target.ability === "Shell Armor") {
    return -20;
  } else if (user.ability === "Sniper" || user.ability === "Super Luck" || user.item === "Scope Lens" || hasHighCritMove){
    return 7;
  }
  return 6;
}

function calcMeteorBeam(user: Pokemon): number {
  if(user.item === "Power Herb"){
    return 9;
  }
  return -20;
}

function calcDestinyBond(user: Pokemon, target: Pokemon): number {
  if(user.stats.spe >= target.stats.spe && target.maxDamage() >= user.curHP()) {
    return 7; // 19% of the time it returns 6 WHY IS IT 19%??
  } else if(user.stats.spe < target.stats.spe){
    return 5; // 50% of the time its 6
  }
}

function calcRecoveryMoves(user: Pokemon, target: Pokemon, move: Move): number {

  if(user.curHP()/user.maxHP() === 1){
    return -20;
  }else if(user.curHP()/user.maxHP() >= 0.85) {
    return -6;
  }

  if(shouldRecover(user, target, move){
    return 7;
  } else {
    return 5;
  }
}

function calcSunRecMoves(user: Pokemon, target: Pokemon, move: Move, isSun: boolean): number{
  const sunShouldRecover = shouldRecover(user, target, move);
  const recalcShouldRecover = shouldRecover(user, target, move.make("Recover");
  //TODO: Fix move creation
  if(user.curHP()/user.maxHP() === 1){
    return -20;
  }else if(user.curHP()/user.maxHP() >= 0.85) {
    return -6;
  }
  if(isSun && sunShouldRecover) {
    return 8;
  } else if(!isSun && recalcShouldRecover) { //Treat the move as recover if the sun isnt up
    return 7;
  }
  return 5;
}

function calcRest(user: Pokemon,target: Pokemon, isRaining: boolean): number {
  if(shouldRecover(user, target, move.make("Rest"))) {
    if((user.item() === "Lum Berry" || user.item() === "Chesto Berry") ||
       (user.moves.includes("Sleep Talk") || user.moves.includes("Snore")) ||
       (user.ability() === "Shed Skin" || user.ability() === "Early Bird") ||
       (user.ability() === "Hydration" && isRaining)){
      return 8;
    }else{
      return 7;
    }
  }
  return 5;
  //TODO: fix construction of the move rest
}

function calcTaunt(user: Pokemon, target: Pokemon, isTRActive: boolean, isAVActive: boolean): number{
  if(target.moves().includes("Trick Room") && isTRActive) {
    return 9;
  }else if(target.moves().includes("Defog") && isAVActive) {
    return 9;
  }
  return 5;
}

function calcEncore(user: Pokemon, target: Pokemon, lastMove: Move): number{
  if(user.stats.spe >= target.stats.spe && lastMove.category === "Status"){
    return 7;
  }
  else if (user.stats.spe <= target.stats.spe){
    return 6; // 50% of the time +5 instead
  }
  return -20.;
}

function calcCounterMirrorCoat(user: Pokemon, target: Pokemon, move: Move): number{
  var moveScore = 6;
  var category = "Physical";
  if (move.name() === "Mirror Coat") {
    category = "Special"
  }
  if(hasOnlyMovesOfSplit(target, category) && target.canKill() && (user.curHP()/user.maxHP() == 1 && (user.item() === "Focus Sash" || user.ability() === "Sturdy"))) {
    moveScore += 2;
  }
  if (target.canKill() && !(user.curHP()/user.maxHP() === 1 && (user.item() === "Focus Sash" || user.ability() === "Sturdy"))){
    moveScore -= 20;
  }
  if(!target.canKill() && hasOnlyMovesOfSplit(target, category)) {
    moveScore += 2; // 20% adds nothing
  }
  if(user.stats.spe >= target.stats.spe) {
    moveScore -= 1; // 75% no change
  }
  if(hasStatusMove(target)){
    moveScore -= 1; //75% no change
  }
}

function hasStatusMove(target: Pokemon): boolean {
  for(const move of target.moves()){
    if( move.category === "Status") {
      return true;
    }
  }
  return false;
}

function hasOnlyMovesOfSplit(target: Pokemon, moveCat: string): boolean {
  if(moveCat === "Physical"){
    for(const move of target.moves()){
      if(move.category === "Special") {
        return false;
      }
    }
    return true;
  } else if(moveCat === "Special"){
    for(const move of target.moves()){
      if move.category === "Physical") {
        return false;
      }
    }
    return false;
  }
}

function shouldRecover(user: Pokemon, target: Pokemon, healMove: Move): number {
  var percentage = getMovePercentage(healMove);
  if(user.stats == "Toxic"){
    return 0;
  }
  if(target.maxDamage() >= percentage) {
    return 0;
  }
  if(user.stats.spe() >= target.stats.spe()) {
    if (target.maxDamage() <= user.curHP()/user.maxHP() + percentage) && target.maxDamage() >= user.curHP()()) {
      return 1;
    }
    else if (target.maxDamage() <= user.curHP()()){
      if(user.curHP()/user.maxHP() <= 0.66 && user.curHP()/user.maxHP() >= 0.4){
        return 0.5;
      }else if (user.curHP()/user.maxHP() <= 0.4){
        return 1;
      }
    }
  } else {
    if(user.curHP()/user.maxHP() <= 0.7){
      return 0.75;
    }else if(user.curHP()/user.maxHP() <= 0.5){
      return 1;
    }
  }
  return 0;
}

function getMovePercentage(healMove: Move): number {
  const weatherMoves = ["Morning Sun", "Synthesis", "Moonlight"];
  if(healMove.name == "Rest") {
    return 1;
  } else if(weatherMoves.includes(healMove.name)) {
    return 0.67;
  } else {
    return 0.5;
  }
}

function willSwitch(user: Pokemon, target: Pokemon, team: Pokemon[]): boolean {
  // TODO: implement
  // single battles only or perish song
  // only ineffective moves (all scores <= -5) due to choice, encore, pp stall
  // AND mon in party that is 1. faster than enemy and 2 is not ohko'd or is slower and not 2hko'd
  //      (there is a bug that does not check this if only one pokemon is faster)
  // AND current mon is not below 50% hp
  // THEN switch chance is 50% -> this fn just checks all the conditions
  return false;
}


