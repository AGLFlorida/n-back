import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import security from './security';
import log from "./logger";
import { SingleScoreType } from "./ScoreCard";

export const accuracyThresholds = [0, 80, 75, 70, 65, 60, 55, 50, 45];

export enum GameModeEnum {
  SingleN = "SingleN",
  DualN = "DualN",
  SilentDualN = "SilentDualN"
}
export function whichGameMode(isDualMode: boolean, isSilentMode: boolean = false): string {
  if (!isDualMode) {
    return GameModeEnum.SingleN;
  } else if (isDualMode && !isSilentMode) {
    return GameModeEnum.DualN;
  } else {
    return GameModeEnum.SilentDualN;
  }
}
export function gameModeScore(n: number, pScore: Result, sScore?: Result, bScore?: Result): SingleScoreType {
  const {accuracy: pAcc, errorRate: pErr} = pScore;
  const card: SingleScoreType = {
    n: n,
    score: pAcc,
    errorRate: pErr
  }

  let accuracy;
  let errorRate;
  if (sScore !== undefined) {
    ({accuracy, errorRate} = sScore);
  } else if (bScore !== undefined) {
    ({accuracy, errorRate} = bScore);
  }

  card.score2 = accuracy;
  card.errotRate2 = errorRate;

  return card;
}

export type Grid = boolean[][];
export type MultiType = number | ((arg0: number) => number);

export type SoundState = Record<string, Audio.Sound | null>;
export type CustomTimer = number | NodeJS.Timeout | null;

let gridPositions: number[];
let gridMatches: boolean[];
let buzzPatterns: number[];
let letterSounds: string[];
let soundMatches: boolean[];
let buzzMatches: boolean[];

const fillBoard: () => Grid = () => Array.from({ length: 3 }, () => Array(3).fill(false));

interface Engine {
  n: number;
  gameLen: number;
  matchRate: number;
  isDualMode?: boolean
}

type Round = {
  next: Grid;
  triggerVibration: (override?: boolean) => void;
  letter: string;
}

type Answers = {
  sounds: boolean[];
  pos: boolean[];
  buzz: boolean[];
}

export type RunningEngine = {
  createNewGame: () => void,
  nextRound: (arg0: number) => Round,
  answers: () => Answers;
  timeLimit: number;
}

const getDualMode = async (): Promise<boolean> => {
  try {
    const dual = await security.get("dualMode");
    return dual as boolean;
  } catch (e) {
    log.error("Error in [getDualMode]", e);
    throw e;
  }
};

const gridIndexes: Array<[number, number]> = (() => {
  const allCells: Array<[number, number]> = [];
  fillBoard().forEach((row, rowIndex) => {
    row.forEach((_, colIndex: number) => {
      allCells.push([rowIndex, colIndex]);
    });
  });

  return allCells;
})();

interface Score {
  answers: boolean[];
  guesses: boolean[];
}
interface Result {
  accuracy: number,
  errorRate: number
}
const calculateScore = ({ answers, guesses }: Score): Result => {
  if (answers.length !== guesses.length) {
    log.error("Error in [calculateScore], array lengths do not match.");
  }

  const correct = answers.reduce((count, value, index) =>
    count + ((value === guesses[index] && value === true) ? 1 : 0),
    0);

  const possible = answers.reduce((count, value) =>
    count + (value === true ? 1 : 0),
    0);

  const incorrect = answers.reduce((count, value, index) =>
    count + (value !== guesses[index] && guesses[index] === true ? 1 : 0),
    0);

  const accuracy = possible > 0 ? (correct / possible) * 100 : 0;

  const errorRate = possible > 0 ? (incorrect / possible) * 100 : 0;

  return {
    accuracy: Math.round(accuracy), // Round to 2 decimal places
    errorRate: Math.round(errorRate) // Round to 2 decimal places
  }
};

const MAXTIME = (5 * 60);
export const MAXN = 9;
export const MINN = 2;
const DEFAULT_GAMELEN = 30;
interface Level {
  gameLen: number,
  matchRate: number,
  newN: number
}
/**
 * Provides basic game settings based on the current level.
 * 
 * @param {number} [level=1] - The current level of the game.
 * @returns {Level} - An object containing the game length, match rate, and new N-back value.
 */
const defaults = (level: number = 1): Level => {
  let _l = level;
  const maxLevel = (MAXN - MINN) * 4 + 4; // theoretical max level is 32

  if (level > maxLevel) _l = maxLevel;

  const gameLen = DEFAULT_GAMELEN;

  const newN = MINN + Math.floor((_l - 1) / 4);

  const matchRateCycle = [.5, .4, .3, .2];
  const matchRate = matchRateCycle[(_l - 1) % matchRateCycle.length];

  return { gameLen, matchRate, newN };
}


const shouldLevelUp = (winStreak: number): boolean => (winStreak > 2);

/**
 * Determines if the player won the game based on their performance scores. This assumes
 * that if you don't pass a sound or buzz Score, then the player can proceed.
 * 
 * @param {Result} pScore - The player's position score.
 * @param {number} [level=1] - The current level of the game.
 * @param {Result} [sScore] - The player's sound score (optional).
 * @param {Result} [bScore] - The player's buzz score (optional).
 * @returns {boolean} - True if the player should level up, false otherwise.
 */
/**
 * Determines if the player won the game based on their performance scores. This assumes
 * that if you don't pass a sound or buzz Score, then the player can proceed.
 * 
 * @param {Result} pScore - The player's position score.
 * @param {number} [n=2] - The current N-back value.
 * @param {Result} [sScore] - The player's sound score (optional).
 * @param {Result} [bScore] - The player's buzz score (optional).
 * @returns {boolean} - True if the player should level up, false otherwise.
 */
const playerWon = (pScore: Result, n: number = 2, sScore?: Result, bScore?: Result): boolean => {
  // Error rate and accuracy are passed in as a whole number (i.e. a percentage) rather than a decimal;
  // const accuracyThresholds = [0, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45]; // index corresponds to N-1
  // const accuracyThresholds = [0, 80, 75, 70, 65, 60, 55, 50, 45]; // index corresponds to N-1
  // const maxErrorRate = 0.4; 
  const maxErrorRate = 40;

  // min accuracy threshold
  const requiredAccuracy = accuracyThresholds[n - 2];

  const passedPos = (): boolean => {

    const { accuracy, errorRate } = pScore;

    return accuracy >= requiredAccuracy && errorRate <= maxErrorRate;
  };

  const passedSound = (): boolean => {
    if (!sScore) return true;

    const { accuracy, errorRate } = sScore;

    return accuracy >= requiredAccuracy && errorRate <= maxErrorRate;
  };

  const passedBuzz = (): boolean => {
    if (!bScore) return true;

    const { accuracy, errorRate } = bScore;

    return accuracy >= requiredAccuracy && errorRate <= maxErrorRate;
  };

  return passedPos() && passedBuzz() && passedSound();
}

const engine = ({ n, gameLen, matchRate, isDualMode = false }: Engine): RunningEngine => {

  interface Patterns {
    gridPositions: number[];
    letterSounds: string[];
    buzzPattern: number[];
    gridMatches: boolean[];
    soundMatches: boolean[];
    buzzMatches: boolean[];
  }
  const generatePattern = (): Patterns => {
    const gridPositions: number[] = [];
    const letterSounds: string[] = [];
    const buzzPattern: number[] = [];
    const gridMatches: boolean[] = [];
    const soundMatches: boolean[] = [];
    const buzzMatches: boolean[] = [];
    const possibleGridPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 9 grid positions
    const possibleLetterSounds = ["C", "G", "H", "K", "P", "Q", "T", "W"]; // 8 sounds

  if (matchRate > 1) {
    log.error("Match rate was greater than 1 while generating pattern. Defaulting to 0.5");
    matchRate = 0.5;
  }

    for (let i = 0; i < gameLen; i++) {
      // Grid Positions Logic
      if (i < n || Math.random() > matchRate) {
        // No match or not enough history
        let newGridPos;
        do {
          newGridPos = possibleGridPositions[
            Math.floor(Math.random() * possibleGridPositions.length)
          ];
        } while (i >= n && newGridPos === gridPositions[i - n]); // Avoid accidental match
        gridPositions.push(newGridPos); // Ensure newGridPos is valid before pushing
        gridMatches.push(false);
      } else {
        // Match from `n` steps back
        gridPositions.push(gridPositions[i - n]);
        gridMatches.push(true)
      }

      // Letter Sounds Logic
      if ((i < n || Math.random() > matchRate)) {
        // No match or not enough history
        let newLetter;
        do {
          newLetter = possibleLetterSounds[
            Math.floor(Math.random() * possibleLetterSounds.length)
          ];
        } while (i >= n && newLetter === letterSounds[i - n]); // Avoid accidental match
        letterSounds.push(newLetter); // Ensure newLetter is valid before pushing
        soundMatches.push(false)
      } else {
        // Match from `n` steps back
        letterSounds.push(letterSounds[i - n]);
        soundMatches.push(true);
      }

      // Buzz Pattern Logic
      if (i < n || Math.random() > matchRate) {
        // No match or not enough history
        buzzPattern.push(0);
        buzzMatches.push(false);
      } else {
        // Match from `n` steps back
        buzzPattern.push(1);
        buzzMatches.push(true);
      }
    }

    return { gridPositions, letterSounds, buzzPattern, gridMatches, soundMatches, buzzMatches };
  }

  const createNewGame = () => {
    try {
      const patterns = generatePattern();
      gridPositions = patterns.gridPositions;
      letterSounds = patterns.letterSounds;
      buzzPatterns = patterns.buzzPattern;
      gridMatches = patterns.gridMatches;
      soundMatches = patterns.soundMatches;
      buzzMatches = patterns.buzzMatches;
    } catch (e) {
      log.error("Error in [createNewGame]", e);
      throw e;
    }
  }

  const nextRound = (turn: number): Round => {
    const chooseNextLetter = (turn: number) => {
      try {
        let patternIndex;
        if (isDualMode) {
          patternIndex = letterSounds[turn];
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
      if (buzzPatterns[turn] === 1 || override)
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
    };

    const nextGrid = (): Grid => {
      try {
        const nextIndex = (gridPositions[turn] - 1);
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
      letter: chooseNextLetter(turn)
    }
  }

  const answers = () => {
    return {
      sounds: soundMatches,
      pos: gridMatches,
      buzz: buzzMatches
    }
  }

  return {
    createNewGame,
    nextRound,
    answers,
    timeLimit: MAXTIME,
  }
}

// export const scoreKey = (date = new Date()) => {
//   const year = date.getFullYear();
//   const monthAbbr = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb"
//   const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day

//   return `${year}-${monthAbbr}-${day}`;
// };

export interface GameLevels {
  [GameModeEnum.SingleN]: number;
  [GameModeEnum.DualN]: number;
  [GameModeEnum.SilentDualN]: number;
}

export const DEFAULT_LEVELS: GameLevels = {
  [GameModeEnum.SingleN]: 1,
  [GameModeEnum.DualN]: 1,
  [GameModeEnum.SilentDualN]: 1,
};

// export const GAME_MODE_NAMES = {
//   [GameModeEnum.SingleN]: "Single",
//   [GameModeEnum.DualN]: "Dual",
//   [GameModeEnum.SilentDualN]: "Silent"
// };

export const getGameModeNames = (t: (key: string) => string) => ({
  [GameModeEnum.SingleN]: t('gameModes.single'),
  [GameModeEnum.DualN]: t('gameModes.dual'),
  [GameModeEnum.SilentDualN]: t('gameModes.silent')
});

export const getStartLevel = (n: number) => Math.max(1, ((n - 2) * 4 + 1));

export {
  calculateScore,
  fillBoard,
  getDualMode,
  defaults,
  shouldLevelUp,
  playerWon
};
export default engine;
