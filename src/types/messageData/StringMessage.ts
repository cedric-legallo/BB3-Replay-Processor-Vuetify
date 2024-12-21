export type StringMessage = {
  Name:
    | "ResultUseAction"
    | "ResultDoMove"
    | "ResultMoveOutcome"
    | "QuestionBlockDice"
    | "QuestionPushBack"
    | "QuestionFollowUp"
    | "QuestionSkillUsage"
    | "QuestionKORecovery"
    | "ResultBlockRoll"
    | "ResultPushBack"
    | "ResultFollowUp"
    | "ResultBlockOutcome"
    | "ResultRoll"
    | "ResultSkillUsage"
    | "ResultInjuryRoll"
    | "ResultCasualtyRoll"
    | "ResultPlayerRemoval"
    | "ResultTeamRerollUsage"
    | "QuestionTeamRerollUsage"
    | "QuestionBribeUsage"
    | "ResultPlayerSentOff";

  MessageData: string; // This is stringified XML
};
