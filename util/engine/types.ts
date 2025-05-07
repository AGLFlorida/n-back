import { Audio } from "expo-av";
import { GameModeEnum } from "./enums";


export type GameMode = {
  isDual: boolean;
  isSilent: boolean;
}

export interface EngineConfig {
  n: number;
  level?: number;
  gameMode?: GameMode
}


export type GameScores = {
  positions: number;
  sounds: number;
  buzz: number;
  pError?: number;
  sError?: number;
  bError?: number;
}

export type Grid = boolean[][];
export type MultiType = number | ((arg0: number) => number);

export type SoundState = Record<string, Audio.Sound | null>;
export type CustomTimer = number | NodeJS.Timeout | null;


export type Round = {
  next: Grid;
  triggerVibration: (override?: boolean) => void;
  letter: string;
}

export type Answers = {
  sounds: boolean[];
  pos: boolean[];
  buzz: boolean[];
}

export interface Score {
  answers: boolean[];
  guesses: boolean[];
}
export interface Result {
  accuracy: number,
  errorRate: number
}

export interface Level {
  gameLen: number,
  matchRate: number,
  newN: number
}

export interface Patterns {
  gridPositions: number[];
  letterSounds: string[];
  buzzPattern: number[];
  gridMatches: boolean[];
  soundMatches: boolean[];
  buzzMatches: boolean[];
}

export interface GameLevels {
  [GameModeEnum.SingleN]: number;
  [GameModeEnum.DualN]: number;
  [GameModeEnum.SilentDualN]: number;
}