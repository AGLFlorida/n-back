import * as SecureStore from 'expo-secure-store';


async function set(key: string, value: any): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
    console.log(`Error saving setting: ${key}`);
    return false;
  }

  return true;
}

async function get(key: string): Promise<number | boolean | null> {
  let ret: string | null = null;
  try {
    ret = await SecureStore.getItemAsync(key);
  } catch (e) {
    console.log(e);
    console.log(`Error saving setting: ${key}`);
  }

  return ret ? JSON.parse(ret) : null; 
}

export default {
  set: set,
  get: get
};