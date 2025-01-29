import { Audio } from "expo-av";

import security from './security';

const MAXTIME = (5 * 60);

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
  file: require("../assets/audio/swords.m4a")
}

type AVPlaybackSource = Parameters<typeof Audio.Sound.createAsync>[0];

type SoundFile = {
  key: string;
  file: AVPlaybackSource;
};

export type Grid = any[][];
export type MultiType = number | ((arg0: number) => number);

export type SoundState = Record<string, Audio.Sound | null>;
export type CustomTimer = number | NodeJS.Timeout | null;

let gridPositions: number[];
let gridMatches: boolean[];
let letterSounds: string[];
let soundMatches: boolean[];

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
}

type Answers = {
  sounds: boolean[];
  pos: boolean[];
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
    console.error("Error in [getDualMode]", e);
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
    row.forEach((_: any, colIndex: number) => {
      allCells.push([rowIndex, colIndex]);
    });
  });

  return allCells;
})();

interface Score {
  answers: boolean[]; 
  guesses: boolean[];
}
const calculateScore = ({ answers, guesses}: Score): number => {
  //TODO add error rate.
  if (answers.length !== guesses.length) {
    console.log(answers.length, guesses.length)
    console.error("Error in [calculateScore], array lengths do not match.");
  }

  const correct = answers.reduce((count, value, index) => {
    return count + ((value === guesses[index] && value === true) ? 1 : 0);
  }, 0);

  const possible = answers.reduce((count, value) => {
    return count + (value === true ? 1 : 0);
  }, 0);

  const percentage = (correct / possible) * 100;
  return percentage;
}

const engine = ({ n, gameLen, matchRate, isDualMode = false }: Engine): RunningEngine => {

  interface Patterns {
    gridPositions: number[]; 
    letterSounds: string[];
    gridMatches: boolean[];
    soundMatches: boolean[];
  }
  const generatePattern = (): Patterns => {
    const gridPositions: number[] = [];
    const letterSounds: string[] = [];
    const gridMatches: boolean[] = [];
    const soundMatches: boolean[] = [];
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
          newLetter =
            possibleLetterSounds[
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
    }

    return { gridPositions, letterSounds, gridMatches, soundMatches };
  }

  const createNewGame = () => {
    try {
      const patterns = generatePattern();
      gridPositions = patterns.gridPositions;
      letterSounds = patterns.letterSounds;
      gridMatches = patterns.gridMatches;
      soundMatches = patterns.soundMatches;
    } catch (e) {
      console.error("Error in [createNewGame]", e);
      throw e;
    }
  }

  const chooseNextSound = (turn: number) => {
    try {
      const patternIndex = letterSounds[turn];
      const nextIndex = soundFiles.findIndex((item) => item.key == patternIndex);
      return soundFiles[nextIndex].file;
    } catch (error) {
      console.error("Error in chooseNextSound.");
      throw error;
    }
  }

  const nextRound = (turn: number): Round => {
    const playSound = async () => {
      try {
        const nextSound = chooseNextSound(turn);
        const { sound } = await Audio.Sound.createAsync(nextSound);
        await sound.playAsync();
      } catch (e) {
        console.error("Error playing sound.", e);
        throw e;
      }
    }

    const nextGrid = (): Grid => {
      try {
        const nextIndex = (gridPositions[turn] - 1);
        const [newRow, newCol] = gridIndexes[nextIndex];
        const newGrid = fillBoard();
        newGrid[newRow][newCol] = true;
        return newGrid
      } catch (error) {
        console.error("Error in placing next square.");
        throw error;
      }
    }

    return {
      next: nextGrid(),
      playSound
    }
  }

  const answers = () => {
    return {
      sounds: gridMatches,
      pos: soundMatches,
    }
  }

  return {
    createNewGame,
    nextRound,
    answers,
  }
}

export { calculateScore, fillBoard, getDualMode, loadSounds, loadSound, MAXTIME };
export default engine;
