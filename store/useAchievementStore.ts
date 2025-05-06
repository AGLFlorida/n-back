import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { BASEN } from './useSettingsStore';
import { MINN, getStartLevel } from "@/util/engine";

const systemTheme = Appearance.getColorScheme();

const startingLevel = getStartLevel(BASEN || MINN);

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
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, ) => ({
      N: BASEN,
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
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
