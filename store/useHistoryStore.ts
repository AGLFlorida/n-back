import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { calculateHighScore } from '@/util/engine/helpers';

import type { ScoresType } from '@/util/engine/ScoreCard';


type HistoryState = {
  records: ScoresType;
  setRecords: (records: {}) => void;
  setTodaysRecord: () => void;
  getTodaysRecord: () => ScoresType
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, ) => ({
      records: {},
      setTodaysRecord: () => {

      },
      getTodaysRecord: () => {
        return {

        } as ScoresType
      },
      setRecords: (records) => {
        set({
          records
        });
      },
      reset: () => {
        set({
          records: {},
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
    await AsyncStorage.removeItem('history-storage');
    useHistoryStore.persist.clearStorage();
    useHistoryStore.getState().reset();
  } catch (error) {
    console.error('Failed to reset store', error);
  }
};