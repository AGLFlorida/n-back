import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { Audio } from "expo-av";

import Square from "@/components/Square";
import Button from "@/components/Button";
import security from "@/util/security";
import { getGlobalStyles } from "@/styles/globalStyles";

const soundFiles: SoundFile[] = [
  { key: "C", file: require("../../assets/audio/C.m4a") as AVPlaybackSource },
  { key: "G", file: require("../../assets/audio/G.m4a") as AVPlaybackSource },
  { key: "H", file: require("../../assets/audio/H.m4a") as AVPlaybackSource },
  { key: "K", file: require("../../assets/audio/K.m4a") as AVPlaybackSource },
  { key: "P", file: require("../../assets/audio/P.m4a") as AVPlaybackSource },
  { key: "Q", file: require("../../assets/audio/Q.m4a") as AVPlaybackSource },
  { key: "T", file: require("../../assets/audio/T.m4a") as AVPlaybackSource },
  { key: "W", file: require("../../assets/audio/W.m4a") as AVPlaybackSource },
];

type AVPlaybackSource = Parameters<typeof Audio.Sound.createAsync>[0];

type SoundFile = {
  key: string;
  file: AVPlaybackSource;
};

type SoundState = Record<string, Audio.Sound | null>;


export default function Play() {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 3 }, () => Array(3).fill(false))
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number | NodeJS.Timeout | null>(null);
  const [defaultN, setDefaultN] = useState<number>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [sounds, setSounds] = useState<SoundState>({});

  const clickRef = useRef(0);
  const setClickRef = (fn: (p: number) => number) => {
    clickRef.current = fn(clickRef.current);
  }

  const styles = getGlobalStyles();

  const resetGame = (run: boolean = true) => {
    setGrid(Array.from({ length: 3 }, () => Array(3).fill(false)));
    setTimerRunning(run);
    setElapsedTime(0);
  };

  const placeRandomSquare = () => {
    const allCells: Array<[number, number]> = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((_: any, colIndex: number) => {
        allCells.push([rowIndex, colIndex]);
      });
    });

    const randomIndex = Math.floor(Math.random() * allCells.length);
    const [newRow, newCol] = allCells[randomIndex];

    const newGrid = Array.from({ length: 3 }, () => Array(3).fill(false));
    newGrid[newRow][newCol] = true;

    setGrid(newGrid);
  };

  const chooseRandomSound = (): AVPlaybackSource => {
    const randomIndex = Math.floor(Math.random() * soundFiles.length);
    return soundFiles[randomIndex].file;
  }

  const stepGame = async () => {
    try {
      placeRandomSquare();

      const { sound } = await Audio.Sound.createAsync(
        chooseRandomSound()
      );
      await sound.playAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }

  const startIntervalTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        stepGame();
      }, 2000);
    }
  }

  const startEnginerTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  }

  const stopIntervalTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const stopEngineTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => {
    if (timerRunning) {
      startEnginerTimer()
      startIntervalTimer();
    }

    return () => {
      stopIntervalTimer();
      stopEngineTimer();
    };
  }, [timerRunning]);

  useEffect(() => {
    if (elapsedTime >= 20) {
      setTimerRunning(false);
      const timeout = setTimeout(() => {
        setGrid(Array.from({ length: 3 }, () => Array(3).fill(false)));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [elapsedTime]);

  useEffect(() => {
    const unloadSounds = () => {
      Object.values(sounds).forEach((sound) => {
        if (sound) sound.unloadAsync();
      });
    }

    return () => { // Cleanup timers on unmount
      stopEngineTimer();
      stopIntervalTimer();
      resetGame(false);
      unloadSounds();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getN = async () => {
        try {
          const n = await security.get("defaultN");
          setDefaultN(n as number);

          navigation.setOptions({
            title: `Play (${n}-back)`,
          });
        } catch (e) { }
      };
      getN();

      const loadSounds = async () => {
        const loadedSounds: SoundState = {};

        for (const { key, file } of soundFiles) {
          const { sound } = await Audio.Sound.createAsync(file);
          loadedSounds[key] = sound;
        }

        setSounds(loadedSounds);
      };
      loadSounds();

      const loading = setTimeout(() => {
        setLoading(false);
        resetGame();
      }, 2000);
      return () => { // Cleanup timers on lost focus
        stopEngineTimer();
        stopIntervalTimer();
        resetGame(false);
        clearTimeout(loading);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {grid.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((isActive: boolean, colIndex: number) => (
            <View key={`cell-${rowIndex}-${colIndex}`} style={styles.cell}>
              {isActive &&
                (<Square key={`cell-${rowIndex}-${colIndex}`} />)
              }
              {!isActive &&
                (<View style={styles.placeHolder} />)
              }
            </View>
          ))}
        </View>
      ))}
      <View style={[styles.row, { marginTop: 20 }]}>
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Sound " onPress={() => alert(clickRef.current)} />
        </View>
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Position " onPress={() => setClickRef((prev) => prev + 1)} />
        </View>
      </View>
      <View style={[styles.row, { marginTop: 40 }]}>
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Play Again " onPress={() => resetGame()} />
        </View>
      </View>
      <View style={[styles.row, { marginTop: 40 }]}>
        <View style={[styles.cell, styles.play]}>
          <Text style={styles.playLabel}>
            {(loading) ? "loading..." : (timerRunning) ? "playing": "stopped"}
          </Text>
        </View>
      </View>
    </View>
  );
}
