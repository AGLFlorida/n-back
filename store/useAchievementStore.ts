import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { getStartLevel } from '@/util/engine';

import { MINN } from "@/util/engine/constants";

const systemTheme = Appearance.getColorScheme();

const startingLevel = getStartLevel(MINN);

export const darkModeDefault: boolean = systemTheme === "dark";


type AchievementState = {
  N: number;
  streak: number;
  singleLvl: number;
  dualLvl: number;
  silentLvl: number;
  setN: (x: number) => void;
  setStreak: (x: number) => void;
  setSingleLvl: (lvl: number) => void;
  setDualLvl: (lvl: number) => void;
  setSilentLvl: (lvl: number) => void;
  reset: () => void;
  resetPlayerLevels: (N?: number) => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      N: MINN,
      singleLvl: startingLevel,
      dualLvl: startingLevel,
      silentLvl: startingLevel,
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
          singleLvl: lvl
        })
      },
      setDualLvl: (lvl) => {
        set({
          dualLvl: lvl
        })
      },
      setSilentLvl: (lvl) => {
        set({
          silentLvl: lvl
        })
      },
      reset: () => {
        set({
          N: MINN,
          singleLvl: startingLevel,
          dualLvl: startingLevel,
          silentLvl: startingLevel,
          streak: 0
        });
      },
      resetPlayerLevels: (N = MINN) => {
        const l = getStartLevel(N);
        set({
          singleLvl: l,
          dualLvl: l,
          silentLvl: l,
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