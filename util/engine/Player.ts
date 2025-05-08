import type { GameLevels } from "./types";
import { GameModeEnum } from "./enums";

import { useAchievementStore } from "@/store/useAchievementStore";

interface PC {
  level: GameLevels;
  get: (mode: GameModeEnum) => number;
  set: (x: number, y?: GameModeEnum) => void;
  levelUp: (mode: GameModeEnum) => void;
  levelDown: (mode: GameModeEnum) => void;
  canLevelDown: (mode: GameModeEnum) => boolean;
}
class Player implements PC {
  level: GameLevels;

  constructor() {
    // hydrate levels
    const {single, dual, silent } = useAchievementStore.getState();
    this.level = {
      SingleN: single,
      DualN: dual,
      SilentDualN: silent
    };
  }

  get(mode: GameModeEnum) {
    return this.level[mode];
  }

  set(l: number, mode = 'SingleN') {
    this.level = {
      ...this.level,
      [mode]: l
    };
    useAchievementStore.getState().setAllLvl(this.level);
  }

  levelUp(mode: GameModeEnum) {
    this.set(this.get(mode) + 1, mode);
  }

  levelDown(mode: GameModeEnum) {
    if (this.get(mode) > 1) {
      this.set(this.get(mode) - 1, mode);
    }
  }

  canLevelDown(mode: GameModeEnum) {
    return (this.get(mode) > 1)
  }
}

export default Player;