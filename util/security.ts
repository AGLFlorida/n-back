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

import { ScoresType } from './ScoreCard';

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
    ret = await storage.getItemAsync(key);
  } catch (e) {
    log.error(`Error retrieving setting: ${key}`, e);
  }

  return ret ? JSON.parse(ret) : null;
}

export default {
  set,
  get
};