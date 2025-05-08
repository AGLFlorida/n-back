import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  setN: (x: number) => void;
  setStreak: (x: number) => void;
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
      N: MINN,
      single: startingLevel,
      dual: startingLevel,
      silent: startingLevel,
      streak: 0,
      setN: N => {
        set({
          N
        });
      },
      setStreak: streak => {
        set({
          streak
        })
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
        console.log("ach reset!")
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
