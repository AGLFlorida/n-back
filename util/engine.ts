import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import security from './security';
import log from "./logger";

const MAXTIME = (5 * 60);
export const MAXN = 9;
export const MINN = 2;

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
const calculateScore = ({ answers, guesses }: Score): { accuracy: number, errorRate: number } => {
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

const DEFFAULT_GAMELEN = 30;
const DEFAULT_MATCHRATE = 0.3;
type Defaults = {
  gameLen: number;
  matchRate: number;
  levelUp: boolean;
}
const defaults = (/*prevScore: number*/): Defaults => {
  const gameLen = DEFFAULT_GAMELEN;
  const matchRate = DEFAULT_MATCHRATE;
  const levelUp = false;

  return { // TODO these should be variable per game
    gameLen,
    matchRate,
    levelUp
  }
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
  }
}

export const scoreKey = (date = new Date()) => {
  const year = date.getFullYear();
  const monthAbbr = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb"
  const day = String(date.getDate()).padStart(2, "0"); // Ensures two-digit day

  return `${year}-${monthAbbr}-${day}`;
};

export { calculateScore, fillBoard, getDualMode, loadSounds, loadSound, MAXTIME, defaults, loadCelebrate };
export default engine;
