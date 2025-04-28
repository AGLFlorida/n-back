import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASEN = 2;


const systemTheme = Appearance.getColorScheme();

export const darkModeDefault: boolean = systemTheme === "dark";

type SettingsState = {
  N: number;
  darkMode: boolean;
  dualMode: boolean;
  silentMode: boolean;
  termsAccepted: boolean;
  setN: (n?: number) => void;
  setTermsAccepted: (t: boolean) => void;
  saveDarkMode: (t?: boolean) => void;
  saveDualMode: (t?: boolean) => void;
  saveSilentMode: (t?: boolean) => void;
}



export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      N: BASEN,
      darkMode: (systemTheme === "dark") ? true : false,
      dualMode: false,
      silentMode: false,
      termsAccepted: false,
      setN: (n) => {
        const localN = (!n || n < 2) ? BASEN : n;
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
        const local = t ? t : !get().darkMode;
        set({
          darkMode: local
        });
      },
      saveDualMode: (t) => {
        const local = t ? t : !get().dualMode;
        set({
          dualMode: local
        });
      },
      saveSilentMode: (t) => {
        const local = t ? t : !get().silentMode;
        set({
          silentMode: local
        });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
