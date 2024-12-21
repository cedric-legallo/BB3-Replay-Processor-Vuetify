import { PlayerId } from "../IdTypes/PlayerId";
import { Die } from "./Die";


export type DieRoll = {
    action?: string;
    outcome?: boolean;
    requirement?: string
    difficulty?: string
    rollType?: string;
    playerId: PlayerId;
    dice: Die[];
    rerolledDice: Die[];
    rerolledCause?: string;
    hidden?: boolean;
};
