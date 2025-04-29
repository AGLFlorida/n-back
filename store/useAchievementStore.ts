import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASEN = 2;

const systemTheme = Appearance.getColorScheme();

export const darkModeDefault: boolean = systemTheme === "dark";

type AchievementState = {
  N: number;
  level: number;
  streak: number;
  setN: (x: number) => void;
  setLevel: (x: number) => void;
  setStreak: (x: number) => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, ) => ({
      N: BASEN,
      level: 1,
      streak: 0,
      setN: N => {
        set({
          N
        });
      },
      setLevel: level => {
        set({
          level
        });
      },
      setStreak: streak => {
        set({
          streak
        })
      }
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
