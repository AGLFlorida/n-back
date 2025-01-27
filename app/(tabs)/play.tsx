import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { Audio } from "expo-av";

import Square from "@/components/Square";
import Button from "@/components/Button";
import Security from "@/util/Security";


export default function Play() {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: 3 }, () => Array(3).fill(false))
  );
  const [timerRunning, setTimerRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | NodeJS.Timeout | null>(null);
  const intervalRef = useRef<number | NodeJS.Timeout | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [defaultN, setDefaultN] = useState<number>();
  const navigation = useNavigation();
  
  const clickRef = useRef(0);
  const setClickRef = (f: (p: number) => number) => {
    clickRef.current = f(clickRef.current);
  }

  const resetGame = () => {
    setGrid(Array.from({ length: 3 }, () => Array(3).fill(false)));
    setTimerRunning(true);
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

  const stepGame = async () => {
    try {
      placeRandomSquare();

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/swords.m4a")
      );
      setSound(sound);
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
    }
  }, [elapsedTime]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopEngineTimer();
      stopIntervalTimer();
    };
  }, []);

  // Cleanup timers on lost focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stopEngineTimer();
        stopIntervalTimer();
      };
    }, [])
  );

  useFocusEffect(() => {
    const getN = async () => {
      try {
        const n = await Security.get("defaultN");
        setDefaultN(n as number);

        navigation.setOptions({
          title: `Play (${n}-back)`,
        });
      } catch (e) {}
    };

    getN();
  });

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
        <View style={styles.cell}>
          <Text>timerRunning: {timerRunning && ("yes")} {!timerRunning && ("no")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 1,
  },
  placeHolder: {
    width: 120,
    height: 120,
    backgroundColor: "#25292e",
  },
  clearBorder: {
    borderWidth: 0,
  }
});
