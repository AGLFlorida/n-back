import { MAXERRORRATE, accuracyThresholds } from "./constants";
import type { Result } from "./types";

export const WINSTOLEVEL = 3;

const wincon = (requiredAccuracy: number) => {
  const passedPos = (pScore: Result): boolean => {

    const { accuracy, errorRate } = pScore;

    return accuracy >= requiredAccuracy && errorRate <= MAXERRORRATE;
  };

  const passedSound = (sScore?: Result): boolean => {
    if (!sScore) return true;

    const { accuracy, errorRate } = sScore;

    return accuracy >= requiredAccuracy && errorRate <= MAXERRORRATE;
  };

  const passedBuzz = (bScore?: Result): boolean => {
    if (!bScore) return true;

    const { accuracy, errorRate } = bScore;

    return accuracy >= requiredAccuracy && errorRate <= MAXERRORRATE;
  }

  return {
    passedPos,
    passedSound,
    passedBuzz
  }
}


/**
 * Determines if the player won the game based on their performance scores. This assumes
 * that if you don't pass a sound or buzz Score, then the player can proceed.
 * 
 * @param {Result} pScore - The player's position score.
 * @param {number} [n=1] - The current n value of the game.
 * @param {Result} [sScore] - The player's sound score (optional).
 * @param {Result} [bScore] - The player's buzz score (optional).
 * @returns {boolean} - Did the player win?
 */
export const playerWon = (
  pScore: Result,
  n: number = 2,
  sScore?: Result,
  bScore?: Result
): boolean => {
  
  // min accuracy threshold
  const requiredAccuracy = accuracyThresholds[n - 2];

  const currentWincon = wincon(requiredAccuracy);

  return currentWincon.passedPos(pScore) && 
    currentWincon.passedBuzz(bScore) && 
    currentWincon.passedSound(sScore);
}