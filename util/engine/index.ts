import * as Haptics from "expo-haptics";

import log from "@/util/logger";

import {
  fillBoard,
  calculateScore,
  gridIndexes,
  defaults,
  shouldLevelUp,
  getStartLevel,
  getGameModeNames,
} from "./helpers";


import {
  defaultMode,
  MINN
} from "./constants";

import type {
  Grid,
  Round,
  Answers,
  EngineConfig,
  GameMode
} from './types';

import { playerWon } from "./wincon";

import { generatePattern } from "./pattern";
import { GameModeEnum } from "./enums";

export interface RunningEngineInterface {
  gridPositions: number[];
  gridMatches: boolean[];
  buzzPatterns: number[];
  letterSounds: string[];
  soundMatches: boolean[];
  buzzMatches: boolean[];
  currentN: number;
  gameMode?: boolean;
  gameLen: number;
  matchRate: number;
  turn: number;
  // createNewGame: () => void,
  nextRound: (arg0: number) => Round,
  answers: () => Answers;
  getGameLen: () => number;
  // timeLimit: number;
  getGameMode: () => GameModeEnum
  reset: (x: number) => void;
  getTurn: (x: number) => number;
  turnsLeft: () => number;
  canLevelDown: () => boolean;
  gameOver: (x: number) => boolean;
}

class RunningEngine implements RunningEngineInterface {
  gridPositions: number[];
  gridMatches: boolean[];
  buzzPatterns: number[];
  letterSounds: string[];
  soundMatches: boolean[];
  buzzMatches: boolean[];
  currentN: number;
  mode?: GameMode;
  gameLen: number;
  matchRate: number;
  turn: number;
  
  constructor({ n, gameMode = defaultMode, level = 1}: EngineConfig) {

    this.currentN = n;
    this.mode = gameMode;

    this.turn = 0;

    const { gameLen, matchRate } = defaults(level);
    this.gameLen = gameLen;
    this.matchRate = matchRate;

    try {
      const patterns = generatePattern(this.matchRate, this.gameLen, this.currentN);
      
      this.gridPositions = patterns.gridPositions;
      this.letterSounds = patterns.letterSounds;
      this.buzzPatterns = patterns.buzzPattern;
      this.gridMatches = patterns.gridMatches;
      this.soundMatches = patterns.soundMatches;
      this.buzzMatches = patterns.buzzMatches;
    } catch (e) {
      log.error("Error in [createNewGame]", e);
      throw e;
    }
  }

  answers() {
    return {
      sounds: this.soundMatches,
      pos: this.gridMatches,
      buzz: this.buzzMatches
    }
  }

  nextRound(turn: number): Round {
    const chooseNextLetter = () => {
      try {
        let patternIndex;
        if (this.mode?.isDual) {
          patternIndex = this.letterSounds[turn];
        } else {
          patternIndex = "swap";
        }
        return patternIndex
      } catch (error) {
        log.error("Error in chooseNextSound.");
        throw error;
      }
    }

    const triggerVibration = (override: boolean = false) => {
      if (this.buzzPatterns[turn] === 1 || override)
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
    };

    const nextGrid = (): Grid => {
      try {
        const nextIndex = (this.gridPositions[turn] - 1);
        const [newRow, newCol] = gridIndexes[nextIndex];
        const newGrid = fillBoard();
        newGrid[newRow][newCol] = true;
        return newGrid
      } catch (error) {
        log.error("Error in placing next square.");
        throw error;
      }
    }

    return {
      next: nextGrid(),
      triggerVibration,
      letter: chooseNextLetter()
    }
  }

  getGameLen() {
    return this.gameLen;
  }

  reset(l = 1) {
    if (this.gameLen == undefined || this.matchRate == undefined) {
      const { gameLen, matchRate } = defaults(l);
      this.gameLen = gameLen;
      this.matchRate = matchRate;
    }
  }

  getGameMode() {
    if (!this.mode?.isDual) {
      return GameModeEnum.SingleN;
    } else if (this.mode?.isDual && !this.mode?.isSilent) {
      return GameModeEnum.DualN;
    } else {
      return GameModeEnum.SilentDualN;
    }
  }

  getTurn(elapsedTime: number) {
    this.turn = Math.floor(elapsedTime / 2);
    return this.turn;
  }

  turnsLeft() {
    return this.gameLen - this.turn;
  }

  canLevelDown() {
    return this.currentN > MINN;
  }

  gameOver(elapsedTime: number) {
    return this.getTurn(elapsedTime) >= this.getGameLen();
  }
}

export {
  calculateScore,
  fillBoard,
  // defaults,
  shouldLevelUp,
  playerWon,
  getStartLevel,
  getGameModeNames
};



export default RunningEngine;