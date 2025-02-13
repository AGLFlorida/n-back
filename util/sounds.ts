import { useEffect, useState } from "react";
import { Audio } from "expo-av";

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

type SoundKey = "C" | "G" | "H" | "K" | "P" | "Q" | "T" | "W" | "swap" | "yay";

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

const useSoloSound = (soundKey: SoundKey) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates if unmounted

    const loadSound = async () => {
      try {
        const soundFile = soundFileMap[soundKey];

        if (!soundFile) {
          console.warn(`Sound file for key "${soundKey}" not found.`);
          return;
        }

        const { sound } = await Audio.Sound.createAsync(soundFile, {
          shouldPlay: false, // Don't auto-play
        });

        if (!isMounted) {
          await sound.unloadAsync(); // Cleanup if unmounted before loading completes
          return;
        }

        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded && status.error) {
            console.error("AVPlayerItem failed:", status.error);
            sound.unloadAsync(); // Unload on error
          }
        });
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync(); // Cleanup on unmount or re-render
      }
    };
  }, [soundKey]); // Re-run effect when the key changes

  return sound;
};

export default useSoloSound;
