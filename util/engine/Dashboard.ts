import { WINSTOLEVEL } from "./wincon";

type HUD = {
  successCount: number;
  failCount: number;
}
export interface DashboardInterface {
  incrementSuccess: (x?: number) => void;
  incrementFail: (x?: number) => void;
  decrementSuccess: (x?: number) => void;
  decrementFail: (x?: number) => void;
  reset: () => void;
  resetFailCount: () => void;
  resetSuccessCount: () => void;
  get successCount(): number;
  get failCount(): number;
  getValues: () => HUD;
  getProgress: () => number;
}

export class Dashboard implements DashboardInterface {
  private _successCount: number = 0;
  private _failCount: number = 0;

  constructor(successCount = 0, failCount = 0) {
    this._successCount = successCount;
    this._failCount = failCount;
  }

  incrementSuccess(amount = 1) {
    this._successCount += amount;
  }

  incrementFail(amount = 1) {
    this._failCount += amount;
  }

  decrementSuccess(amount = 1) {
    this._successCount -= amount;
  }

  decrementFail(amount = 1) {
    this._failCount -= amount;
  }

  reset() {
    this.resetSuccessCount();
    this.resetFailCount();
  }

  resetFailCount() {
    this.failCount = 0;
  }

  resetSuccessCount() {
    this.successCount = 0;
  }

  get successCount(): number {
    return this._successCount;
  }

  set successCount(n: number) {
    this._successCount = n;
  }

  get failCount(): number {
    return this._failCount;
  }

  set failCount(n: number) {
    this._failCount = n;
  }

  getValues(): HUD {
    return { successCount: this.successCount, failCount: this.failCount };
  }

  getProgress() {
    return this.successCount / WINSTOLEVEL;
  }
}
