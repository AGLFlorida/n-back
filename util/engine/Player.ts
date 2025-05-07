import type { GameLevels } from "./types";
import { DEFAULT_LEVELS } from "./constants";
import { GameModeEnum } from "./enums";

interface PC {
  level: GameLevels;
  get: (mode: GameModeEnum) => number;
  set: (x: number, y?: GameModeEnum) => void;
  levelUp: (mode: GameModeEnum) => void;
  levelDown: (mode: GameModeEnum) => void;
}
class Player implements PC {
  level: GameLevels;

  constructor() {
    this.level = DEFAULT_LEVELS;
    // TODO: properly hydrate level from store.
    // TODO: default levels should be based on N, not DEFAULT_LEVELS
  }

  get(mode: GameModeEnum) {
    return this.level[mode];
  }

  set(l: number, mode = 'SingleN') {
    this.level = {
      ...this.level,
      [mode]: l
    };
  }

  levelUp(mode: GameModeEnum) {
    this.set(this.get(mode) + 1, mode);

  }

  levelDown(mode: GameModeEnum) {
    if (this.get(mode) > 1) {
      this.set(this.get(mode) - 1, mode);
    }
  }
}

export default Player;