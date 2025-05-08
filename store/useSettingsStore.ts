import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MINN } from '@/util/engine/constants';

const systemTheme = Appearance.getColorScheme();

export const darkModeDefault: boolean = systemTheme === "dark";

type SettingsState = {
  N: number;
  darkMode: boolean;
  dualMode: boolean;
  silentMode: boolean;
  termsAccepted: boolean;
  showMoveCounts: boolean;
  setN: (n?: number) => void;
  setTermsAccepted: (t: boolean) => void;
  saveDarkMode: (t: boolean) => void;
  saveDualMode: (t: boolean) => void;
  saveSilentMode: (t: boolean) => void;
  saveShowMoveCounts: (t: boolean) => void;
  reset: () => void;
}



export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      N: MINN,
      darkMode: (systemTheme === "dark") ? true : false,
      dualMode: false,
      silentMode: false,
      termsAccepted: false,
      showMoveCounts: false,
      setN: (n) => {
        const localN = (!n || n < 2) ? MINN : n;
        set({
          N: localN
        });
      },
      setTermsAccepted: (t) => {
        set({
          termsAccepted: t
        });
      },
      saveDarkMode: (t) => {
        set({
          darkMode: t
        });
      },
      saveDualMode: (t) => {
        set({
          dualMode: t
        });
      },
      saveSilentMode: (t) => {
        set({
          silentMode: t
        });
      },
      saveShowMoveCounts: (t) => {
        set({
          showMoveCounts: t
        })
      },
      reset: () => {
        set({
          N: MINN,
          darkMode: (systemTheme === "dark") ? true : false,
          dualMode: false,
          silentMode: false,
          termsAccepted: false,
          showMoveCounts: false
        });
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


export const resetSettingsStore = async () => {
  try {
    await AsyncStorage.removeItem('settings-storage');
    useSettingsStore.persist.clearStorage();
    useSettingsStore.getState().reset();
  } catch (error) {
    console.error('Failed to reset store', error);
  }
}