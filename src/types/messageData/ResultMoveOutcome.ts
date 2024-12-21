export type ResultMoveOutcome = {
  TentacleUsed: string;
  Moved: string;
  Rolls: {
    RollSummary: {
      RollType: string;
      Outcome: string;
    }
  }
};
