import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';

import log from '@/util/logger';

const THRESHOLD_MINUTES = 15;

export function useReloadIfInactiveTooLong() {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastActiveRef = useRef<number>(Date.now());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      const now = Date.now();

      // Store timestamp when app goes to background
      if (appState.current === 'active' && nextState === 'background') {
        lastActiveRef.current = now;
      }

      // On resume, compare time spent away
      if (appState.current === 'background' && nextState === 'active') {
        const minutesAway = (now - lastActiveRef.current) / (1000 * 60);
        if (minutesAway > THRESHOLD_MINUTES) {
          log.info(`Reloading app after ${minutesAway.toFixed(1)} minutes in background...`);
          await Updates.reloadAsync();
        }
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);
}
