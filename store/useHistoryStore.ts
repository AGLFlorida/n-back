import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { todayHelper } from './util';

import type { ScoreBlock, SingleScoreType } from '@/util/engine/ScoreCard';
import { GameModeEnum } from '@/util/engine/enums';

type DateString = string; // 'YYYY-MM-DD'
type PersistedScoreBlock = Record<GameModeEnum, SingleScoreType>
type PersistedScoresType = Record<DateString, PersistedScoreBlock>


type HistoryState = {
  lastPlayed: DateString | undefined;
  records: PersistedScoresType;
  setRecords: (records: {}) => void;
  setTodaysRecord: (score: ScoreBlock) => void;
  getTodaysRecord: () => PersistedScoreBlock;
  getRecordByDate: (date: DateString) => PersistedScoreBlock;
  reset: () => void;
  hasRecords: () => boolean;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: {},
      lastPlayed: undefined,
      setTodaysRecord: (s: ScoreBlock) => {
        const lp = get().lastPlayed;
        const today = todayHelper();
        const rec = get().records;
        set({
          records: {
            ...rec,
            [todayHelper()]: {
              ...s,
            }
          },
          ...(lp !== today && { lastPlayed: today })
        })
      },
      getTodaysRecord: () => {
        return get().getRecordByDate(todayHelper());
      },
      setRecords: (records) => {
        set({
          records
        });
      },
      getRecordByDate: (date) => {
        return get().records[date];
      },
      reset: () => {
        set({
          records: {},
        });
      },
      hasRecords: () => {
        for (const _ in get().records) return true;
        return false;
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
