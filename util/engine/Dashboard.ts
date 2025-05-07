import { WINSTOLEVEL } from "./wincon";

type HUD = {
  successCount: number;
  failCount: number;
}
export interface DashboardInterface {
  successCount: number;
  failCount: number;
  incrementSuccess: (x?: number) => void;
  incrementFail: (x?: number) => void;
  decrementSuccess: (x?: number) => void;
  decrementFail: (x?: number) => void;
  reset: () => void;
  resetFailCount: () => void;
  resetSuccessCount: () => void;
  getSuccessCount: () => number;
  getFailCount: () => number;
  getValues: () => HUD;
  getProgress: () => number;
}

export class Dashboard implements DashboardInterface {
  successCount: number;
  failCount: number;

  constructor(successCount = 0, failCount = 0) {
    this.successCount = successCount;
    this.failCount = failCount;
  }

  incrementSuccess(amount = 1) {
    this.successCount += amount;
  }

  incrementFail(amount = 1) {
    this.failCount += amount;
  }

  decrementSuccess(amount = 1) {
    this.successCount -= amount;
  }

  decrementFail(amount = 1) {
    this.failCount -= amount;
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

  getSuccessCount(): number {
    return this.successCount;
  }

  getFailCount(): number {
    return this.failCount;
  }

  getValues(): HUD {
    return { successCount: this.successCount, failCount: this.failCount };
  }

  getProgress() {
    return this.successCount / WINSTOLEVEL;
  }
}
