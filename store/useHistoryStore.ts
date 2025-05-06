import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
        [GameModeEnum.SingleN]: startingLevel,
        [GameModeEnum.DualN]: startingLevel,
        [GameModeEnum.SilentDualN]: startingLevel,
*/




type HistoryState = {
  records: {};
  setRecords: (records: {}) => void;
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      records: {},
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