import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import security from './security';
import log from "./logger";

const soundFiles: SoundFile[] = [
  { key: "C", file: require("../assets/audio/C.m4a") as AVPlaybackSource },
  { key: "G", file: require("../assets/audio/G.m4a") as AVPlaybackSource },
  { key: "H", file: require("../assets/audio/H.m4a") as AVPlaybackSource },
  { key: "K", file: require("../assets/audio/K.m4a") as AVPlaybackSource },
  { key: "P", file: require("../assets/audio/P.m4a") as AVPlaybackSource },
  { key: "Q", file: require("../assets/audio/Q.m4a") as AVPlaybackSource },
  { key: "T", file: require("../assets/audio/T.m4a") as AVPlaybackSource },
  { key: "W", file: require("../assets/audio/W.m4a") as AVPlaybackSource },
];

const soloSound: SoundFile = {
  key: "NOISE",
  file: require("../assets/audio/swap.m4a")
}

const celebration: SoundFile = {
  key: "CELEBRATE",
  file: require("../assets/audio/fanfare.m4a")
}

type AVPlaybackSource = Parameters<typeof Audio.Sound.createAsync>[0];

type SoundFile = {
  key: string;
  file: AVPlaybackSource;
};

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
  playSound: () => Promise<void>
  triggerVibration: () => void
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

const loadSounds = async (): Promise<SoundState> => {
  const loadedSounds: SoundState = {};

  for (const { key, file } of soundFiles) {
    const { sound } = await Audio.Sound.createAsync(file);
    loadedSounds[key] = sound;
  }

  return loadedSounds;
}

const loadSound = async (): Promise<Audio.Sound> => {
  const { sound } = await Audio.Sound.createAsync(soloSound.file);

  return sound;
}

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

  // TODO there is a bug in the errorRate score where it's always
  // 100 - correct
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
const playerWon = (pScore: Result, level: number = 1, sScore?: Result, bScore?: Result): boolean => {
  console.log("p score: ", pScore);
  console.log("s score: ", sScore);
  console.log("b score: ", bScore);
  const accuracyThresholds = [0, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45]; // index corresponds to N-1
  const maxErrorRate = 0.4;

  // min accuracy threshold
  const requiredAccuracy = accuracyThresholds[Math.min(level, accuracyThresholds.length - 1)];

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

  console.log(passedPos(), passedBuzz(), passedSound());
  return passedPos() && passedBuzz() && passedSound();
}

const loadCelebrate = async (): Promise<Audio.Sound> => {

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: false,
    playThroughEarpieceAndroid: false,
  });

  const { sound } = await Audio.Sound.createAsync(
    celebration.file
  );


  return sound
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
      log.error("Match rate  was greater than 100% while generating pattern. Defaulting to 50%");
      matchRate = .5; // override match rate on error.
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

  const chooseNextSound = (turn: number) => {
    try {
      const patternIndex = letterSounds[turn];
      const nextIndex = soundFiles.findIndex((item) => item.key == patternIndex);
      return soundFiles[nextIndex].file;
    } catch (error) {
      log.error("Error in chooseNextSound.");
      throw error;
    }
  }

  const nextRound = (turn: number): Round => {
    const playSound = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        if (isDualMode) {
          const nextSound = chooseNextSound(turn);
          const { sound } = await Audio.Sound.createAsync(nextSound); // TODO we are running createAsync twice for each sound :P
          await sound.playAsync();
        } else {
          const { sound } = await Audio.Sound.createAsync(soloSound.file);
          await sound.playAsync();
        }
      } catch (e) {
        log.error("Error playing sound.", e);
        throw e;
      }
    }

    const triggerVibration = () => {
      if (buzzPatterns[turn] === 1)
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
      playSound,
      triggerVibration
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
    timeLimit: MAXTIME
  }
}

export const scoreKey = (date = new Date()) => {
  const year = date.getFullYear();
  const monthAbbr = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb"
  const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day

  return `${year}-${monthAbbr}-${day}`;
};

export {
  calculateScore,
  fillBoard,
  getDualMode,
  loadSounds,
  loadSound,
  defaults,
  loadCelebrate,
  shouldLevelUp,
  playerWon
};
export default engine;
