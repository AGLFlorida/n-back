import type { GameLevels, GameMode } from "./types";
import { GameModeEnum } from "./enums";

export const accuracyThresholds = [90, 80, 75, 70, 65, 60, 55, 50, 45];

export const MAXTIME = (5 * 60);

export const MAXN = 9;

export const MINN = 2;

export const DEFAULT_GAMELEN = 5//30;

export const MAXERRORRATE = 40;

export const possibleGridPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // 9 grid positions
export const possibleLetterSounds = ["C", "G", "H", "K", "P", "Q", "T", "W"]; // 8 sounds

export const DEFAULT_LEVELS: GameLevels = {
  [GameModeEnum.SingleN]: 1,
  [GameModeEnum.DualN]: 1,
  [GameModeEnum.SilentDualN]: 1,
};

export const defaultMode: GameMode = {
  isDual: false,
  isSilent: false
}
