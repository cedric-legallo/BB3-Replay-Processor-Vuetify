import { Die } from "./Die"

export type RollInfos = {
  Dice: {
    Die: Die
  }
  Difficulty: string
  NewRoll: string
  Outcome: string
  Requirement: string
  RollType: string
  Status: string
}
