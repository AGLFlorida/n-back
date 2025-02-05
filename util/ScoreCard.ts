export type SingleScoreType = [number, number, number];
export type ScoresType = Record<string, SingleScoreType>;

import log from "@/util/logger";

const ERROR_PREFIX = "Error in Scores: ";

export class ScoreCard {
  private _value: ScoresType

  constructor(initialValue: ScoresType = {}) {
    this._value = initialValue;
  }

  get scores(): ScoresType {
    return this._value;
  }

  set scores(newScore: ScoresType) {
    this._value = newScore;
  }

  getValue(key: string): SingleScoreType | undefined {
    try {
      return this._value[key];
    } catch (e) {
      log.error(ERROR_PREFIX + "getValue.", e);
      throw e;
    }
  }

  setValue(key: string, value: SingleScoreType): void {
    try {
      this._value[key] = value;
    } catch (e) {
      log.error(ERROR_PREFIX + "setValue.", e);
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

  compareCards(card1: SingleScoreType, card2: SingleScoreType): boolean {
    if (card1.length != card2.length) {
      log.warn("compareCards arrays are not equal in length.");
      return false;
    }

    const matches = card1.reduce((count, value, index) => {
      return count + (value === card2[index] ? 1 : 0);
    }, 0);
    
    return matches === card1.length;
  }
}
