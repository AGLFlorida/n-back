import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { Audio } from "expo-av";

import Square from "@/components/Square";
import Button from "@/components/Button";
import StatusButton from "@/components/StatusButton";

import security from "@/util/security";

import Engine, { FillBoard, SoundState, CustomTimer } from "@/util/engine";


import { getGlobalStyles } from "@/styles/globalStyles";

export default function Play() {
  const [grid, setGrid] = useState(FillBoard());
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<CustomTimer>(null);
  const intervalRef = useRef<CustomTimer>(null);
  const [defaultN, setDefaultN] = useState<number>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [sounds, setSounds] = useState<SoundState>({});
  const [sound, setSound] = useState<Audio.Sound | null>(null); // when isDual == false;
  const [isDualMode, setDualMode] = useState<boolean>(false);

  const {
    resetGame,
    endGame,
    startEnginerTimer,
    stopEngineTimer,
    startIntervalTimer,
    stopIntervalTimer,
    loadSounds,
    getN,
    getDualMode,
  } = Engine({
    setGrid,
    setTimerRunning,
    setElapsedTime,
    setSound,
    setSounds,
    setDefaultN,
    setDualMode,
    grid,
    isDualMode,
    timerRef,
    intervalRef,
    navigation
  })

  const clickRef = useRef(0);

  const setClickRef = (fn: (p: number) => number) => {
    clickRef.current = fn(clickRef.current);
  }

  const styles = getGlobalStyles();

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

  useEffect(endGame(elapsedTime), [elapsedTime]);

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

      Promise.all([
        getN(),
        loadSounds(),
        getDualMode()
      ]).catch(e => e);

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
      <StatusButton onPress={resetGame} loading={loading} timerRunning={timerRunning} />
    </View>
  );
}
