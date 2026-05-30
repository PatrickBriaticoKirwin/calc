import { Move } from './move';
import { Pokemon } from './pokemon';
import { Field } from './field';
export interface BattleState {
    field: Field;
    lastMove?: Move;
    userParty: Pokemon[];
}
export declare function calcAttackMove(move: Move, user: Pokemon, target: Pokemon, field: Field): number;
export declare function calcMoveScore(move: Move, user: Pokemon, target: Pokemon, battle: BattleState): number;
