import { Step } from "@/types/Match/Step";
import { xmlToJson } from "../helperFns/xmlToJson";
import { ReplayStep } from "@/types/BaseTags/ReplayStep";
import { MatchData } from "@/types/MatchData";
import { Turn } from "@/types/Match/Turn";
import { StepResult } from "@/types/Match/StepResult";
import { TurnAction } from "@/types/Match/TurnAction";
import { ResultPlayerRemoval } from "@/types/messageData/ResultPlayerRemoval";
import { DamageStep } from "@/types/messageData/DamageStep";
import { ResultInjuryRoll } from "@/types/messageData/ResultInjuryRoll";
import { ResultRoll } from "@/types/messageData/ResultRoll";
import { processDieRoll } from "../helperFns/processDieRoll";
import { ResultCasualtyRoll } from "@/types/messageData/ResultCasualtyRoll";
import { QuestionKORecovery } from "@/types/messageData/QuestionKORecovery";

export const processDamageStep = (opts: {
  stepResult: Step;
  step: ReplayStep;
  matchData: MatchData;
  currentTurn: Turn;
  currentTurnAction: TurnAction;
  nextTurnAction: TurnAction;
  hasBall: string | undefined;
}) => {
  const { stepResult, step, matchData, currentTurn, currentTurnAction } = opts;
  const stepMessageData = xmlToJson(stepResult.Step.MessageData)
    .DamageStep as DamageStep;

  if (!stepMessageData) {
    console.warn("No stepMessageData found in the following step:", step);
    return opts;
  }

  // Create a new turnActionEvent for this event
  const turnActionEvent = {
    eventName: stepResult.Step.Name,
    eventType: stepMessageData.StepType,
    eventResults: [] as StepResult[],
  };

  // Process the damage step

  // Now we need to loop over the results of the action and process them
  stepResult.Results.StringMessage.forEach((result) => {
    // Create a new StepResult for this result
    const stepResult = {
      actionName: result.Name,
      messageData: result.MessageData,
      actionString: result.Name,
    } as StepResult;

    switch (result.Name) {
      case "ResultRoll": {
        // This tells us the result of a roll
        // it has data such as the type of roll, the value rolled and the target value
        // it also tells us if the roll was a success or a failure
        const damageActions: Record<string, string> = {
          '10': 'armor',
          '46': 'regeneration',
        }
        const resultMessageData = xmlToJson(result.MessageData)
          .ResultRoll as ResultRoll;
        console.log('Damage ResultRoll', resultMessageData);
        matchData.dieRollLog.push({
          action: damageActions[resultMessageData.RollType] ?? 'unknown',
          playerId: stepMessageData.PlayerId,
          dice: Array.isArray(resultMessageData.Dice.Die) ? resultMessageData.Dice.Die : [resultMessageData.Dice.Die],
          rerolledDice: [],
        });

        // resultMessageData.Difficulty is the modified target number
        // resultMessageData.Dice[] are the dice rolled
        // resultMessageData.Outcome is the result of the roll

        // add d6 roll data to the playerData
        // check if Dice.Die is an array or a single object
        if (Array.isArray(resultMessageData.Dice.Die)) {
          resultMessageData.Dice.Die.forEach((die) => {
            processDieRoll({
              dieRoll: die,
              playerId: stepMessageData.PlayerId,
              matchData,
            });
          });
        } else {
          processDieRoll({
            dieRoll: resultMessageData.Dice.Die,
            playerId: stepMessageData.PlayerId,
            matchData,
          });
        }

        // add injury roll data to the playerData
        matchData.playerData[
          stepMessageData.PlayerId
        ].armourRolls.armourRolls += 1;
        if (resultMessageData.Outcome === "1") {
          matchData.playerData[
            stepMessageData.PlayerId
          ].armourRolls.armourRollsFailed += 1;
        } else {
          matchData.playerData[
            stepMessageData.PlayerId
          ].armourRolls.armourRollsPassed += 1;
        }

        if (currentTurn.foulAttempted) {
          // this is a foul attempt
          currentTurnAction.actionsTaken.foulAttempted = {
            foulSuccess: resultMessageData.Outcome === "0",
            fouledPlayer: stepMessageData.TargetId,
          };
        }

        break;
      }
      case "ResultInjuryRoll": {
        // This tells the roll and result of an injury roll (Armour Break), and which player was potentially injured
        // if successful, a ResultCasualtyRoll will follow

        const resultMessageData = xmlToJson(result.MessageData)
          .ResultInjuryRoll as ResultInjuryRoll;
        console.log('Damage ResultInjuryRoll', resultMessageData);
        matchData.dieRollLog.push({
          action: "injury",
          playerId: stepMessageData.PlayerId,
          dice: Array.isArray(resultMessageData.Dice.Die) ? resultMessageData.Dice.Die : [resultMessageData.Dice.Die],
          rerolledDice: [],
        });
        if (Array.isArray(resultMessageData.Dice.Die)) {
          resultMessageData.Dice.Die.forEach((die) => {
            processDieRoll({
              dieRoll: die,
              playerId: stepMessageData.PlayerId,
              matchData,
            });
          });
        } else {
          processDieRoll({
            dieRoll: resultMessageData.Dice.Die,
            playerId: stepMessageData.PlayerId,
            matchData,
          });
        }

        // add injury roll data to the playerData
        matchData.playerData[
          stepMessageData.PlayerId
        ].injuryRolls.injuryRolls += 1;
        switch (resultMessageData.Outcome) {
          case "0": {
            // Check if this is a self inflicted injury
            if (stepMessageData.PlayerId === currentTurnAction.playerId) {
              currentTurnAction.actionsTaken.knockdownSustained = {
                type: "Stunned",
                player: currentTurnAction.playerId,
              };
            } else {
              matchData.playerData[
                stepMessageData.PlayerId
              ].injuryRolls.injuryStunned += 1;
              currentTurn.knockdown
                ? (currentTurn.knockdown += 1)
                : (currentTurn.knockdown = 1);
              currentTurnAction.actionsTaken.knockdownInflicted = {
                type: "Stunned",
                player: stepMessageData.PlayerId,
              };
            }
            break;
          }
          case "2": {
            matchData.playerData[
              stepMessageData.PlayerId
            ].injuryRolls.injuryKO += 1;
            break;
          }
          case "4": {
            matchData.playerData[
              stepMessageData.PlayerId
            ].injuryRolls.injuryCasualty += 1;
            break;
          }
        }

        break;
      }
      case "ResultCasualtyRoll": {
        // this doens thappen very frequently, needs testing what it tells us

        const resultMessageData = xmlToJson(result.MessageData)
           .ResultCasualtyRoll as ResultCasualtyRoll;
        console.log('Damage ResultCasualtyRoll', resultMessageData);
        matchData.dieRollLog.push({
          action: "casualty",
          playerId: stepMessageData.PlayerId,
          dice: Array.isArray(resultMessageData.Dice.Die) ? resultMessageData.Dice.Die : [resultMessageData.Dice.Die],
          rerolledDice: [],
        });
        // Add ResultCasualtyRoll data to the currentTurnAction
        // currentTurn.injury = true;
        // currentTurnAction.actionsTaken.injuryInflicted = "ResultCasualtyRoll";

        // console.log(
        //   "Injury inflicted",
        //   currentTurnAction.actionsTaken.injuryInflicted
        // );

        break;
      }
      case "ResultPlayerRemoval": {
        // This tells us who was removed from the pitch and why

        // // Not yet used so commenting to save computation
        const resultMessageData = xmlToJson(result.MessageData)
          .ResultPlayerRemoval as ResultPlayerRemoval;

        // Add ResultPlayerRemoval data to the currentTurnAction

        let injuryType = "";
        switch (resultMessageData.Status) {
          case "0": {
            injuryType = "Stunned - Pushed Out of Bounds";
            break;
          }
          case "3": {
            injuryType = "KO";
            break;
          }
          case "4": {
            injuryType = "Serious Injury";
            break;
          }
          case "5": {
            injuryType = "Death";
            break;
          }
          default: {
            injuryType = resultMessageData.Status;
            break;
          }
        }

        // Check if this was a self inflicted injury
        if (resultMessageData.PlayerId === currentTurnAction.playerId) {
          currentTurnAction.actionsTaken.injurySustained = {
            type: injuryType,
            player: resultMessageData.PlayerId,
          };
          currentTurn.injurySustained
            ? (currentTurn.injurySustained += 1)
            : (currentTurn.injurySustained = 1);
          currentTurn.knockdownSustained
            ? (currentTurn.knockdownSustained += 1)
            : (currentTurn.knockdownSustained = 1);
        } else {
          currentTurnAction.actionsTaken.injuryInflicted = {
            type: injuryType,
            player: resultMessageData.PlayerId,
          };
          currentTurn.injury
            ? (currentTurn.injury += 1)
            : (currentTurn.injury = 1);
          currentTurn.knockdown
            ? (currentTurn.knockdown += 1)
            : (currentTurn.knockdown = 1);
        }

        // add roll data to the matchData
        matchData.playerData[
          resultMessageData.PlayerId
        ].timesRemovedFromPlay += 1;

        break;
      }
      case "QuestionKORecovery": {
        // This asks the client if the player wants to use a skill to recover from KO like Apothecary
        const resultMessageData = xmlToJson(result.MessageData)
          .QuestionKORecovery as QuestionKORecovery;
        console.log('Damage QuestionKORecovery', resultMessageData);
        matchData.dieRollLog.push({
          action: "injury healed",
          playerId: stepMessageData.PlayerId,
          dice: Array.isArray(resultMessageData.RollInfos.Dice.Die) ? resultMessageData.RollInfos.Dice.Die : [resultMessageData.RollInfos.Dice.Die],
          rerolledDice: [],
        });
        break;
      }
      case "ResultTeamRerollUsage": {
        console.log("Damage ResultTeamRerollUsage");
        // This tells us a reroll was used and by which _player_ (not by which team)

        // // Not yet used so commenting to save computation
        // const resultMessageData = xmlToJson(message.MessageData)
        //   .ResultTeamRerollUsage as ResultTeamRerollUsage;

        break;
      }
      default: {
        break;
      }
    }

    // Add the result to the turnActionEvent
    turnActionEvent.eventResults.push(stepResult);
  });

  // Add the turnActionEvent to the currentTurnAction
  currentTurnAction.turnActionEvents.push(turnActionEvent);

  return opts;
};
