import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import log from "./logger";

// Web fallback
const webStorage = {
  setItemAsync: async (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      log.error(`Web storage setItem failed for key: ${key}`, e);
      throw e;
    }
  },
  getItemAsync: async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      log.error(`Web storage getItem failed for key: ${key}`, e);
      throw e;
    }
  }
};

// Use SecureStore for native platforms, localStorage for web
const storage = Platform.select({
  web: webStorage,
  default: SecureStore
});

import { ScoresType } from '@/util/engine/ScoreCard';

type N = number | undefined

async function set(key: string, value: string | number | boolean | ScoresType | N | object): Promise<boolean> {
  try {
    await storage.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    log.error(`Error saving setting: ${key}`, e);
    return false;
  }

  return true;
}

async function get(key: string): Promise<number | boolean | ScoresType | null> {
  let ret: string | null = null;
  try {
    // This issue only popped up in compiled apps. 
    // -2 is an os level error code. 
    ret = await storage.getItemAsync(key);
    if (ret === "-2") return null;
    const parsed = ret ? JSON.parse(ret) : null;
    
    if (parsed && typeof parsed === 'object') {
      const allNegativeTwo = Object.values(parsed).every(v => v === -2);
      if (allNegativeTwo) return null;
    }
    
    return parsed;
  } catch (e) {
    log.error(`Error retrieving setting: ${key}`, e);
  }

  return null;
}

export default {
  set,
  get
};