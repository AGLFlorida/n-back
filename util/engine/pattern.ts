import type { Patterns } from "./types";

import { 
  possibleGridPositions,
  possibleLetterSounds 
} from "./constants";

import log from "@/util/logger";

export const generatePattern = (matchRate: number, gameLen: number, n: number): Patterns => {
  const gridPositions: number[] = [];
  const letterSounds: string[] = [];
  const buzzPattern: number[] = [];
  const gridMatches: boolean[] = [];
  const soundMatches: boolean[] = [];
  const buzzMatches: boolean[] = [];

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