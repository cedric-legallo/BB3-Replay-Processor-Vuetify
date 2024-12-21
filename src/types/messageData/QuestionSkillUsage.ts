import { PlayerId } from "../IdTypes/PlayerId";
import { SkillId } from "../IdTypes/SkillId";
import { RollInfos } from "../Pitch/RollInfos";

export type QuestionSkillUsage = {
  PlayerId: PlayerId;
  GamerId: string;
  RollInfos?: RollInfos
  Skill: SkillId;
  Used: "0" |"1";
};
