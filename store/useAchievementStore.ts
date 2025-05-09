import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { todayHelper, isYesterday } from './util';

import type { GameLevels } from "@/util/engine/types";

import { getStartLevel } from '@/util/engine';

import { MINN } from "@/util/engine/constants";

const systemTheme = Appearance.getColorScheme();

const startingLevel = getStartLevel(MINN);

export const darkModeDefault: boolean = systemTheme === "dark";

type AchievementState = {
  N: number;
  streak: number;
  single: number;
  dual: number;
  silent: number;
  streakLastUpdate: string | undefined;
  setN: (x: number) => void;
  setStreak: (x: number) => void;
  incrementStreak: () => void;
  setSingleLvl: (lvl: number) => void;
  setDualLvl: (lvl: number) => void;
  setSilentLvl: (lvl: number) => void;
  setAllLvl: (lvls: GameLevels) => void;
  reset: () => void;
  resetPlayerLevels: (N?: number) => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      N: 0,
      single: startingLevel,
      dual: startingLevel,
      silent: startingLevel,
      streak: 0,
      streakLastUpdate: undefined,
      setN: N => {
        const oldN = get().N;
        if (oldN === undefined || N > oldN) {
          set({
            N
          });
        }
      },
      setStreak: streak => {
        const today = todayHelper();
        set({
          streak,
          streakLastUpdate: today
        })
      },
      incrementStreak: () => {
        const today = todayHelper();
        const lu = get().streakLastUpdate || '1971-01-01';
        if (today > lu) {
          if (!isYesterday(lu)) {
            set({
              streak: 1,
              streakLastUpdate: today
            });
          } else {
            set({
              streak: get().streak + 1,
              streakLastUpdate: today
            });
          }
        }
      },
      setSingleLvl: (lvl) => {
        set({
          single: lvl
        })
      },
      setDualLvl: (lvl) => {
        set({
          dual: lvl
        })
      },
      setSilentLvl: (lvl) => {
        set({
          silent: lvl
        })
      },
      setAllLvl: (lvls: GameLevels) => {
        const { SingleN, DualN, SilentDualN } = lvls;
        set({
          single: SingleN,
          dual: DualN,
          silent: SilentDualN
        })
      },
      reset: () => {
        set({
          N: MINN,
          single: startingLevel,
          dual: startingLevel,
          silent: startingLevel,
          streak: 0
        });
      },
      resetPlayerLevels: (N = MINN) => {
        const l = getStartLevel(N);
        set({
          single: l,
          dual: l,
          silent: l,
        })
      }
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const resetAchievementStore = async () => {
  try {
    await AsyncStorage.removeItem('achievement-storage');
    useAchievementStore.persist.clearStorage();
    useAchievementStore.getState().reset();
  } catch (error) {
    console.error('Failed to reset store', error);
  }
};
