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
      }
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
