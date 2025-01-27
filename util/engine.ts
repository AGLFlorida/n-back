import React from 'react';
import { Audio } from "expo-av";

import security from './security';

// export default function generate(n: number): Array<string> {

//   return [];
// }

// generate pattern

// verify pattern

// calculate final score

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
  setDefaultN: (arg0: number) => void;
  setSounds: (arg0: SoundState) => void;
  setDualMode: (arg0: boolean) => void;
  grid: Grid;
  isDualMode: boolean;
  intervalRef: React.MutableRefObject<CustomTimer>;
  timerRef: React.MutableRefObject<CustomTimer>;
  navigation: any; // will fix later :P 
}

const FillBoard = () => Array.from({ length: 3 }, () => Array(3).fill(false))

const Engine = ({ setGrid, setTimerRunning, setElapsedTime, setSound, setSounds, setDefaultN, setDualMode, grid, isDualMode, intervalRef, timerRef, navigation }: Engine) => {

  const resetGame = (run: boolean = true) => {
    setGrid(FillBoard());
    setTimerRunning(run);
    setElapsedTime(0);
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

  const stepGame = async () => {
    try {
      placeRandomSquare();

      if (isDualMode) {
        const { sound } = await Audio.Sound.createAsync(
          chooseRandomSound()
        );
        await sound.playAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/audio/swords.m4a")
        );
        setSound(sound);
        await sound.playAsync();
      }
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }

  const startIntervalTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        stepGame();
      }, 2000);
    }
  }

  const startEnginerTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime: number) => prevTime + 1);
      }, 1000);
    }
  }

  const stopIntervalTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

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

  const endGame = (elapsedTime: number) => () => {
    if (elapsedTime >= 20) {
      setTimerRunning(false);
      const timeout = setTimeout(() => {
        setGrid(Array.from({ length: 3 }, () => Array(3).fill(false)));
      }, 2000);

      return () => clearTimeout(timeout);
    }

    return () => { }
  }

  const getN = async () => {
    try {
      const n = await security.get("defaultN");
      setDefaultN(n as number);

      navigation.setOptions({
        title: `Play (${n}-back)`,
      });
    } catch (e) { }
  };

  const getDualMode = async () => {
    try {
      const dual = await security.get("dualMode");
      setDualMode(dual as boolean);
    } catch (e) { }
  }

  return {
    resetGame,
    endGame,
    startIntervalTimer,
    startEnginerTimer,
    stopEngineTimer,
    stopIntervalTimer,
    loadSounds,
    getN,
    getDualMode,
  }
}



export { FillBoard, soundFiles };
export default Engine;