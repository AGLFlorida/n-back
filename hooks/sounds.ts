import { useEffect, useState, useRef } from "react";
import { Audio } from "expo-av";

import log from "@/util/logger";

import C from "@/assets/audio/C.m4a";
import G from "@/assets/audio/G.m4a";
import H from "@/assets/audio/H.m4a";
import K from "@/assets/audio/K.m4a";
import P from "@/assets/audio/P.m4a";
import Q from "@/assets/audio/Q.m4a";
import T from "@/assets/audio/T.m4a";
import W from "@/assets/audio/W.m4a";
import swap from "@/assets/audio/swap.m4a";
import fanfare from "@/assets/audio/fanfare.m4a";

export type SoundKey = "C" | "G" | "H" | "K" | "P" | "Q" | "T" | "W" | "swap" | "yay";

const soundFileMap: Record<string, number> = {
  C: C,
  G: G,
  H: H,
  K: K,
  P: P,
  Q: Q,
  T: T,
  W: W,
  swap: swap,
  yay: fanfare,
}

const useGameSounds = () => {
  const soundRefs = useRef<Record<SoundKey, Audio.Sound | null>>({
    C: null,
    G: null,
    H: null,
    K: null,
    P: null,
    Q: null,
    T: null,
    W: null,
    swap: null,
    yay: null,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAllSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        for (const key of Object.keys(soundFileMap) as SoundKey[]) {
          const { sound } = await Audio.Sound.createAsync(soundFileMap[key], {
            shouldPlay: false,
            isLooping: false
          });

          if (!isMounted) {
            await sound.unloadAsync();
            return;
          }

          soundRefs.current[key] = sound;
        }
        setIsLoaded(true);
      } catch (error) {
        log.error("Error loading sounds:", error);
      }
    };

    loadAllSounds();

    return () => {
      isMounted = false;
      for (const key of Object.keys(soundRefs.current) as SoundKey[]) {
        soundRefs.current[key]?.unloadAsync();
      }
    };
  }, []);

  const playSound = async (soundKey: SoundKey) => {
    const sound = soundRefs.current[soundKey];
    if (!sound || !isLoaded) {
      log.warn(`Sound ${soundKey} not loaded yet.`);
      return;
    }

    try {
      await sound.setPositionAsync(0); // Reset position
      await sound.setStatusAsync({ shouldPlay: true }); // Play without waiting for unload
    } catch (error) {
      log.error(`Error playing sound ${soundKey}:`, error);
    }
  };

  return { playSound, isLoaded };
};

export default useGameSounds;