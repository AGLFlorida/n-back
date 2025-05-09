import log from "@/util/logger";
import { GameModeEnum } from "./enums";

import { useHistoryStore } from "@/store/useHistoryStore";
import { calculateHighScore } from "./helpers";

const ERROR_PREFIX = "Error in ScoreCard: ";

export type ScoreCardType = {
  soundGuesses?: boolean[];
  posGuesses?: boolean[];
  buzzGuesses?: boolean[];
}

type DateString = string;
export type SingleScoreType = {
  mode: GameModeEnum
  score: number,
  score2?: number,
  errorRate: number,
  errorRate2?: number,
  n: number,
};
export type ScoreBlock = Record<GameModeEnum, SingleScoreType>
export type ScoresType = Record<DateString, ScoreBlock>;

/*
{
  "2025-05-07": {
    "SingleN": {
      "mode": "SingleN",
      "score": 95,
      "errorRate": 0.03,
      "n": 4
    },
    "DualN": {
      "mode": "DualN",
      "score": 88,
      "score2": 86,
      "errorRate": 0.07,
      "errorRate2": 0.06,
      "n": 3
    }
  },
  "2025-05-06": {
    "SilentDualN": {
      "mode": "SilentDualN",
      "score": 80,
      "score2": 82,
      "errorRate": 0.1,
      "errorRate2": 0.08,
      "n": 5
    }
  }
}
*/

export const scoreKey = (date = new Date()) => {
  const year = date.getFullYear();
  const monthAbbr = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${monthAbbr}-${day}`;
};

interface ScoreCardInterface {
  getSingle: (key: GameModeEnum) => SingleScoreType | undefined;
  setSingle: (key: GameModeEnum, value: SingleScoreType) => void;
  getBlock: () => ScoreBlock | undefined;
  setBlock: (sb: ScoreBlock) => void;
  hasKey: (key: GameModeEnum) => boolean;
  deleteKey: (key: GameModeEnum) => void;
}
export class ScoreCard implements ScoreCardInterface {
  private static instance: ScoreCard;
  private _value: ScoreBlock;

  private constructor(initialValue: ScoreBlock = {} as ScoreBlock) {
    this._value = initialValue;
  }

  public static getInstance(): ScoreCard {
    if (!ScoreCard.instance) {
      ScoreCard.instance = new ScoreCard();
    }
    return ScoreCard.instance;
  }

  getSingle(key: GameModeEnum) {
    try {
      if (this._value[key]) {
        return this._value[key];
      }
      return undefined;
    } catch (e) {
      log.warn(ERROR_PREFIX + "getValue.", e);
      return undefined;
    }
  }

  setSingle(key: GameModeEnum, value: SingleScoreType) {
    const current: DateString = scoreKey();
    try {
      // Reset _value if it's null or undefined
      if (this._value === null || this._value === undefined) {
        this._value = {} as ScoreBlock;
      }

      // Set the value
      this._value[key] = value;

    } catch (e) {
      log.error(ERROR_PREFIX + "setValue. Key: " + key, e);
      this._value = { [key]: value } as ScoreBlock;
    }
  }

  getBlock(): ScoreBlock | undefined {
    try {
      return this._value;
    } catch (e) {
      log.error(ERROR_PREFIX + "getBlock.", e);
      throw e;
    }
  }

  setBlock(value: ScoreBlock): void {
    try {
      this._value = value;
    } catch (e) {
      log.error(ERROR_PREFIX + "setBlock.", e);
      throw e;
    }
  }

  hasKey(key: string): boolean {
    return key in this._value;
  }

  deleteKey(key: GameModeEnum): void {
    try {
      delete this._value[key];
    } catch (e) {
      log.error(ERROR_PREFIX + "deleteKey.", e);
      throw e;
    }
  }

  save(): void {
    const newBlock: ScoreBlock = this.getBlock() as ScoreBlock;
    const storedBlock = useHistoryStore.getState().getTodaysRecord();
    let isHighScore: boolean = storedBlock === undefined;

    if (storedBlock !== undefined) {
      const { 
        SingleN: StoredSingleN, 
        DualN: StoredDualN, 
        SilentDualN: StoredSilentDualN
      } = storedBlock;

      const {
        SingleN, 
        DualN, 
        SilentDualN
      } = newBlock;

      let rev1, rev2, rev3 = false;

      if (!compareBlock(SingleN, StoredSingleN)) {
        newBlock.SingleN = StoredSingleN; // revert to stored SingleN block
        rev1 = true;
      }

      if (!compareBlock(DualN, StoredDualN)) {
        newBlock.DualN = StoredDualN; // revert to stored DualN block
        rev2 = true;
      }

      if (!compareBlock(SilentDualN, StoredSilentDualN)) {
        newBlock.DualN = StoredDualN; // revert to stored SilentDualN block
        rev3 = true;
      }
      
      isHighScore = rev1 || rev2 || rev3;
    }

    console.log("saving scores:", isHighScore);
    if (isHighScore) {
      useHistoryStore.getState().setTodaysRecord(newBlock);
    }
  }
}

/**
 * Compares the new Score with the Stored Score. If the new one is "better", it returns true.
 * @param b1 SingleScoreType
 * @param b2 PersistedSingleScoreType
 * @returns boolean
 */
const compareBlock = (b1: SingleScoreType, b2: SingleScoreType): boolean => {
  const score1 = calculateHighScore(b1.mode, b1);
  const score2 = calculateHighScore(b1.mode, b2);

  return score1 > score2;
}
