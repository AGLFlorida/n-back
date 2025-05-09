import { GameModeEnum } from "./enums";
import type { Result, Grid, Score, Level } from "./types";
import type { ScoreBlock, SingleScoreType } from "./ScoreCard";
import { DEFAULT_GAMELEN, MINN, MAXN } from "./constants";

import log from "@/util/logger";

import { WINSTOLEVEL } from "./wincon";


export const getStartLevel = (n: number) => Math.max(1, ((n - 2) * 4 + 1));

export function gameModeScore(n: number, pScore: Result, sScore?: Result, bScore?: Result): SingleScoreType {
  const { accuracy: pAcc, errorRate: pErr } = pScore;
  let mode = GameModeEnum.SingleN;

  let accuracy;
  let errorRate;
  if (sScore !== undefined) {
    ({ accuracy, errorRate } = sScore);
    mode = GameModeEnum.DualN;
  } else if (bScore !== undefined) {
    ({ accuracy, errorRate } = bScore);
    mode = GameModeEnum.SilentDualN;
  }

  const card: SingleScoreType = {
    mode: mode,
    n: n,
    score: pAcc,
    errorRate: pErr
  }


  card.score2 = accuracy;
  card.errorRate2 = errorRate;

  return card;
}

export const fillBoard: () => Grid = () => Array.from({ length: 3 }, () => Array(3).fill(false));
export const gridIndexes: Array<[number, number]> = (() => {
  const allCells: Array<[number, number]> = [];
  fillBoard().forEach((row, rowIndex) => {
    row.forEach((_, colIndex: number) => {
      allCells.push([rowIndex, colIndex]);
    });
  });

  return allCells;
})();


export const calculateScore = ({ answers, guesses }: Score): Result => {
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

/**
 * Provides basic game settings based on the current level.
 * 
 * @param {number} [level=1] - The current level of the game.
 * @returns {Level} - An object containing the game length, match rate, and new N-back value.
 */
export const defaults = (level: number = 1): Level => {
  let _l = level;
  const maxLevel = (MAXN - MINN) * 4 + 4; // theoretical max level is 32

  if (level > maxLevel) _l = maxLevel;

  const gameLen = DEFAULT_GAMELEN;

  const newN = MINN + Math.floor((_l - 1) / 4);

  const matchRateCycle = [.5, .4, .3, .2];
  const matchRate = matchRateCycle[(_l - 1) % matchRateCycle.length];

  return { gameLen, matchRate, newN };
}


export const shouldLevelUp = (winStreak: number): boolean => (winStreak == WINSTOLEVEL);


export const getGameModeNames = (t: (key: string) => string) => ({
  [GameModeEnum.SingleN]: t('gameModes.single'),
  [GameModeEnum.DualN]: t('gameModes.dual'),
  [GameModeEnum.SilentDualN]: t('gameModes.silent')
});


export const calculateHighScore = (mode: GameModeEnum, block: SingleScoreType): number => {
  let score1 = 0;
  let score2 = 0;

  try {
    score1 = (block.n * block.score) - block.errorRate;

    if (mode != 'SingleN' && block.score2) {
      score2 = (block.n * block.score2) - (block?.errorRate2 || 0);

      if (mode == 'SilentDualN') {
        score2 = score2 + 10; // Silent Mode is harder.
      }
    }
  } catch (e) {
    console.info("error calculating scores:", mode, JSON.stringify(block));
  }

  return score1 + score2;
}