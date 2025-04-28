import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
        [GameModeEnum.SingleN]: startingLevel,
        [GameModeEnum.DualN]: startingLevel,
        [GameModeEnum.SilentDualN]: startingLevel,
*/

import { BASEN } from './useSettingsStore';
import { MINN, getStartLevel } from "@/util/engine";

const startingLevel = getStartLevel(BASEN || MINN);

type HistoryState = {
  records: {};
  singleLvl: number;
  dualLvl: number;
  silentLvl: number;
  setRecords: (records: {}) => void;
  setSingleLvl: (lvl: number) => void;
  setDualLvl: (lvl: number) => void;
  setSilentLvl: (lvl: number) => void;
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: {},
      singleLvl: startingLevel,
      dualLvl: startingLevel,
      silentLvl: startingLevel,
      setRecords: (records) => {
        set({
          records
        });
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
          records: {},
          singleLvl: startingLevel,
          dualLvl: startingLevel,
          silentLvl: startingLevel,
        });
      }
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


export const resetHistoryStore = async () => {
  try {
    // Clear AsyncStorage key manually
    await AsyncStorage.removeItem('my-store');

    // Reset Zustand store state
    useHistoryStore.getState().reset();
  } catch (error) {
    console.error('Failed to reset store', error);
  }
};