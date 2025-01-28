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
  console.debug("RENDERED PLAY");
  const styles = getGlobalStyles();

  const [grid, setGrid] = useState(FillBoard());
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const timerRef = useRef<CustomTimer>(null);
  // const intervalRef = useRef<CustomTimer>(null);
  // const [defaultN, setDefaultN] = useState<number>();
  const navigation = useNavigation();

  // const [sounds, setSounds] = useState<SoundState>({});
  // const [sound, setSound] = useState<Audio.Sound | null>(null); // when isDual == false;

  // const [isDualMode, setDualMode] = useState<boolean>(false);
  //const [turn, setTurn] = useState<number>(0);

  // Current N-Back
  const defaultN = useRef<number>();
  const setDefaultN = (p: number) => {
    defaultN.current = p;
  }

  // Dual N-Back Mode
  const isDualMode = useRef<boolean>(false);
  const setDualMode = (p: boolean) => {
    isDualMode.current = p;
  }

  // Loaded Sounds
  const sounds = useRef<SoundState>({});
  const setSounds = (p: SoundState) => {
    sounds.current = p;
  }
  type sound = Audio.Sound | null;
  const sound = useRef<sound>(null);
  const setSound = (p: sound) => {
    sound.current = p;
  }


  // Tracking Score
  const clickRef = useRef(0);
  const setClickRef = (fn: (p: number) => number) => {
    clickRef.current = fn(clickRef.current);
  }

  // Main Gameplay
  // TODO these should be variable
  const len = 30
  const matchRate = 0.3

  // Start the engine. In hindsight, this could be much better...
  const {
    resetGame,
    shouldEndGame,
    startEngineTimer,
    stopEngineTimer,
    // startIntervalTimer,
    // stopIntervalTimer,
    loadSounds,
    //getN,
    getDualMode,
  } = Engine({
    setGrid,
    setTimerRunning,
    setElapsedTime,
    setSound,
    setSounds,
    //setDefaultN,
    setDualMode,
    //setTurn,
    grid,
    isDualMode: isDualMode.current,
    timerRef,
    // intervalRef,
    // navigation,
    len,
    matchRate,
    //turn,
    defaultN: defaultN.current as number
  });

  const getN = async () => {
    try {
      const n = await security.get("defaultN");
      setDefaultN(n as number);

      navigation.setOptions({
        title: `Play (${n}-back)`,
      });
    } catch (e) { }
  };

  useEffect(() => {
    if (timerRunning) {
      startEngineTimer();
    }

    return () => {
      stopEngineTimer();
    };
  }, [timerRunning]);

  useEffect(() => {
    if (elapsedTime === 0) setIsLoading(false);
    if (!isLoading || elapsedTime === 0) {
      shouldEndGame(elapsedTime);
    };
  }, [elapsedTime, isLoading]);

  // Cleanup
  useEffect(() => {
    const unloadSounds = () => {
      if (sounds.current !== null) {
        Object.values(sounds).forEach(({ current }) => {
          if (current) current.unloadAsync();
        });
      }

      if (sound.current !== null) {
        sound.current.unloadAsync();
      }
    }

    return () => { // Cleanup timers on unmount
      stopEngineTimer();
      resetGame(false);
      unloadSounds();
    };
  }, []);

  // Loading
  useFocusEffect(
    React.useCallback(() => {
      Promise.all([
        getN(),
        loadSounds(),
        getDualMode()
      ]).catch(e => e).then(_ => {
        // setIsLoading(false);
        resetGame();
      });


      return () => { // Cleanup timers on lost focus
        stopEngineTimer();
        resetGame(false);
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
      <StatusButton onPress={resetGame} isLoading={isLoading} timerRunning={timerRunning} />
    </View>
  );
}
