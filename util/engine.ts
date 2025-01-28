import React from 'react';
import { Audio } from "expo-av";

import security from './security';


//const MAXTIME = (5 * 60);
const MAXTIME = 20; // DEBUG TODO FIXME

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

type AVPlaybackSource = Parameters<typeof Audio.Sound.createAsync>[0];

type SoundFile = {
  key: string;
  file: AVPlaybackSource;
};

type Grid = any[][];
type MultiType = number | ((arg0: number) => number)

export type SoundState = Record<string, Audio.Sound | null>;
export type CustomTimer = number | NodeJS.Timeout | null

interface Engine {
  setGrid: (arg0: any[][]) => void
  setTimerRunning: (arg0: boolean) => void;
  setElapsedTime: (arg0: MultiType) => void;
  setSound: (arg0: Audio.Sound | null) => void;
  //setDefaultN: (arg0: number) => void;
  setSounds: (arg0: SoundState) => void;
  setDualMode: (arg0: boolean) => void;
  //setTurn: (arg0: MultiType) => void;
  grid: Grid;
  isDualMode: boolean;
  // intervalRef: React.MutableRefObject<CustomTimer>;
  timerRef: React.MutableRefObject<CustomTimer>;
  defaultN: number;
  len: number;
  matchRate: number;
  //turn: number;
  // navigation: any; // will fix later :P 
}

let gridPositions: number[];
let letterSounds: string[];

const FillBoard = () => Array.from({ length: 3 }, () => Array(3).fill(false))

const Engine = ({
  setGrid,
  setTimerRunning,
  setElapsedTime,
  setSound,
  setSounds,
  //setDefaultN,
  setDualMode,
  //setTurn,
  grid,
  isDualMode,
  // intervalRef,
  timerRef,
  // navigation,
  defaultN,
  len,
  matchRate,
  //turn
}: Engine) => {
  // const { gridPositions, letterSounds } = generatePattern(defaultN as number, len, matchRate);


  const generatePattern = (
    n: number,
    length: number,
    matchRatio: number
  ): { gridPositions: number[]; letterSounds: string[] } => {
    const gridPositions: number[] = [];
    const letterSounds: string[] = [];
    const possibleGridPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 9 grid positions
    const possibleLetterSounds = ["C", "G", "H", "K", "P", "Q", "T", "W"]; // 8 sounds

    for (let i = 0; i < length; i++) {
      // Grid Positions Logic
      if (i < n || Math.random() > matchRatio) {
        // No match or not enough history
        let newGridPos;
        do {
          newGridPos =
            possibleGridPositions[
            Math.floor(Math.random() * possibleGridPositions.length)
            ];
        } while (i >= n && newGridPos === gridPositions[i - n]); // Avoid accidental match
        gridPositions.push(newGridPos); // Ensure newGridPos is valid before pushing
      } else {
        // Match from `n` steps back
        gridPositions.push(gridPositions[i - n]);
      }

      // Letter Sounds Logic
      if (i < n || Math.random() > matchRatio) {
        // No match or not enough history
        let newLetter;
        do {
          newLetter =
            possibleLetterSounds[
            Math.floor(Math.random() * possibleLetterSounds.length)
            ];
        } while (i >= n && newLetter === letterSounds[i - n]); // Avoid accidental match
        letterSounds.push(newLetter); // Ensure newLetter is valid before pushing
      } else {
        // Match from `n` steps back
        letterSounds.push(letterSounds[i - n]);
      }
    }

    return { gridPositions, letterSounds };
  }

  const createNewGame = () => {
    // Create new game
    const patterns = generatePattern(defaultN as number, len, matchRate);
    gridPositions = patterns.gridPositions;
    letterSounds = patterns.letterSounds;
  }

  const resetGame = (run: boolean = true) => {
    // Start new game
    if (run) {
      setGrid(FillBoard());
      createNewGame();
    } 
    setTimerRunning(run);
    setElapsedTime(-1);
    //setTurn(0);
  };

  const placeRandomSquare = () => {
    const allCells: Array<[number, number]> = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((_: any, colIndex: number) => {
        allCells.push([rowIndex, colIndex]);
      });
    });

    const randomIndex = Math.floor(Math.random() * allCells.length);
    const [newRow, newCol] = allCells[randomIndex];

    const newGrid = FillBoard();
    newGrid[newRow][newCol] = true;

    setGrid(newGrid);
  };

  const chooseRandomSound = (): AVPlaybackSource => {
    const randomIndex = Math.floor(Math.random() * soundFiles.length);
    return soundFiles[randomIndex].file;
  }

  const placeNextSquare = (turn: number) => {
    try {
      const allCells: Array<[number, number]> = [];
      grid.forEach((row, rowIndex) => {
        row.forEach((_: any, colIndex: number) => {
          allCells.push([rowIndex, colIndex]);
        });
      });

      const nextIndex = (gridPositions[turn] - 1); // 1
      const [newRow, newCol] = allCells[nextIndex];

      const newGrid = FillBoard();
      newGrid[newRow][newCol] = true;

      setGrid(newGrid);
    } catch (error) {
      console.error("Error in place next square.");
      throw error;
    }
  }

  const chooseNextSound = (turn: number) => {
    try {
      const patternIndex = letterSounds[turn]; // 2
      const nextIndex = soundFiles.findIndex((item) => item.key == patternIndex);
      return soundFiles[nextIndex].file;
    } catch (error) {
      console.error("Error in chooseNextSound.");
      throw error;
    }
  }

  // START GAME LOOP
  const stepGame = async (_t: number) => {
    if (_t === undefined) {
      console.warn("Turn is undefined in [stepGame].");
      return;
    }
    
    try {
      if (_t === 0) {
        createNewGame();
      }
      console.log("--- GAME LOOP ---");
      console.debug(gridPositions, letterSounds);
      placeNextSquare(_t);

      if (isDualMode) {
        const { sound } = await Audio.Sound.createAsync(
          chooseNextSound(_t)
        );
        await sound.playAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/audio/swords.m4a")
        );
        setSound(sound);
        await sound.playAsync();
      }

      console.log("--- SET TURN ---");
      //setTurn((prev) => prev+1);
    } catch (error) {
      console.error("Error stepping game.");
      console.error(error);
      console.log("--- RESET GAME ---")
      resetGame(false);
    }
  }

  const shouldEndGame = (elapsedTime: number) => {
    console.log("should end game?", elapsedTime);
    const _et: number = elapsedTime;
    const _t: number = _et / 2;

    console.log("turn: ", _t, "elapsed time: ", _et);

    const delayedClear = () => {
      resetGame(false);
      const timeout = setTimeout(() => {
        setGrid(FillBoard());
      }, 2000);

      return () => clearTimeout(timeout);
    }
    
    if (_et > MAXTIME) {
      console.warn("Timer expired.");
      return delayedClear();
    }
    console.info("len: ", len);
    if (_t > len) {
      console.info("Game complete.");
      return delayedClear();
    }

    if (_et === undefined) {
      console.error("Error in [shouldEndGame], elapsedTime is undefined.", _et);
    }
    if (_et % 2 === 0) {
      stepGame(_et / 2);
    }
  }

  // const startIntervalTimer = () => {
  //   if (!intervalRef.current) {
  //     createNewGame();
  //     intervalRef.current = setInterval(() => {
  //       stepGame();
  //     }, 2000);
  //   }
  // }
  // END GAME LOOP

  const startEngineTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime: number) => prevTime + 1);
      }, 1000);
    }
  }

  // const stopIntervalTimer = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // }

  const stopEngineTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  const loadSounds = async () => {
    const loadedSounds: SoundState = {};

    for (const { key, file } of soundFiles) {
      const { sound } = await Audio.Sound.createAsync(file);
      loadedSounds[key] = sound;
    }

    setSounds(loadedSounds);
  };

  const getDualMode = async () => {
    try {
      const dual = await security.get("dualMode");
      setDualMode(dual as boolean);
    } catch (e) { }
  }

  return {
    resetGame,
    shouldEndGame,
    // startIntervalTimer,
    startEngineTimer,
    stopEngineTimer,
    // stopIntervalTimer,
    loadSounds,
    //getN,
    getDualMode,
    generatePattern,
  }
}



export { FillBoard, soundFiles };
export default Engine;