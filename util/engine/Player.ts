import type { GameLevels } from "./types";
import { GameModeEnum } from "./enums";
import { MINN } from "./constants";

import { useAchievementStore } from "@/store/useAchievementStore";

import { getStartLevel } from "./helpers";

interface PC {
  get: (mode: GameModeEnum) => number;
  set: (x: number, y?: GameModeEnum) => void;
  levelUp: (mode: GameModeEnum, n?: number) => void;
  levelDown: (mode: GameModeEnum) => void;
  canLevelDown: (mode: GameModeEnum) => boolean;
  canLevelUp: (mode: GameModeEnum, n?: number) => boolean;
}
class Player implements PC {
  private level: GameLevels;

  constructor() {
    // hydrate levels
    const { single, dual, silent } = useAchievementStore.getState();
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

  levelUp(mode: GameModeEnum, n: number = MINN) {
    if (this.canLevelUp(mode, n)) {
      console.log("can level up!")
      const baseLevel = getStartLevel(n);
      const nextLevel = this.get(mode) + 1;

      if (baseLevel > nextLevel) {
        this.set(baseLevel, mode);
      } else {
        this.set(nextLevel, mode);
      }
    }
  }

  levelDown(mode: GameModeEnum) {
    if (this.canLevelDown(mode)) {
      this.set(this.get(mode) - 1, mode);
    }
  }

  canLevelDown(mode: GameModeEnum) {
    return (this.get(mode) > 1);
  }

  canLevelUp(mode: GameModeEnum, n: number = MINN) {
    return (this.get(mode) < getStartLevel(n) + 2);
  }
}

export default Player;