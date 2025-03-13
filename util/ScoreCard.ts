import log from "@/util/logger";
import security from "./security";

const ERROR_PREFIX = "Error in ScoreCard: ";

export type SingleScoreType = {
  score: number,
  score2?: number, // for DualN and SilentDualN modes
  errorRate: number,
  errotRate2?: number,
  n: number,
};
export type ScoreBlock = Record<string, SingleScoreType>
export type ScoresType = Record<string, ScoreBlock>;

export const scoreKey = (date = new Date()) => {
  const year = date.getFullYear();
  const monthAbbr = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${monthAbbr}-${day}`;
};

export class ScoreCard {
  private static instance: ScoreCard;
  private _value: ScoresType;

  private constructor(initialValue: ScoresType = {}) {
    this._value = initialValue;
  }

  public static getInstance(): ScoreCard {
    if (!ScoreCard.instance) {
      ScoreCard.instance = new ScoreCard();
    }
    return ScoreCard.instance;
  }

  get scores(): ScoresType {
    return this._value;
  }

  set scores(newScore: ScoresType) {
    this._value = newScore;
  }

  getValue(key: string): SingleScoreType | undefined {
    const current: string = scoreKey();
    try {
      if (this._value[current] && this._value[current][key]) {
        return this._value[current][key];
      }
      return undefined;
    } catch (e) {
      log.warn(ERROR_PREFIX + "getValue.", e);
      return undefined;
    }
  }

  setValue(key: string, value: SingleScoreType): void {
    const current: string = scoreKey();
    try {
      // Reset _value if it's null or undefined
      if (this._value === null || this._value === undefined) {
        this._value = {};
      }

      // Ensure the current date object exists
      if (!this._value[current]) {
        this._value[current] = {};
      }

      // Set the value
      this._value[current][key] = value;
      
    } catch (e) {
      log.error(ERROR_PREFIX + "setValue. Key: " + key + ", Current: " + current, e);
      this._value = { [current]: { [key]: value } };
      log.info(ERROR_PREFIX + "setValue recovered. New state:", this._value);
    }
  }

  getBlock(key: string): ScoreBlock | undefined {
    try {
      return this._value[key];
    } catch (e) {
      log.error(ERROR_PREFIX + "getBlock.", e);
      throw e;
    }
  }

  setBlock(key: string, value: ScoreBlock): void {
    try {
      this._value[key] = value;
    } catch (e) {
      log.error(ERROR_PREFIX + "setBlock.", e);
      throw e;
    }
  }

  hasKey(key: string): boolean {
    return key in this._value;
  }

  deleteKey(key: string): void {
    try {
      delete this._value[key];
    } catch (e) {
      log.error(ERROR_PREFIX + "deleteKey.", e);
      throw e;
    }
  }

  save(): void {
    const saveScores = async () => {
      try {
        await security.set("records", this._value);
      } catch (e) {
        log.error("Error saving scores", e);
      }
    }
    saveScores();
  }
}
