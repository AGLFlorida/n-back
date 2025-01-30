import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { Audio } from "expo-av";

import Square from "@/components/Square";
import Button from "@/components/Button";
import StatusButton from "@/components/StatusButton";
import { showCustomAlert } from "@/util/alert";

import security from "@/util/security";

import engine, { 
  MAXTIME, 
  getDualMode, 
  fillBoard, 
  SoundState, 
  CustomTimer, 
  loadSounds, 
  RunningEngine, 
  loadSound, 
  Grid, 
  calculateScore, 
  defaults 
} from "@/util/engine";

import { getGlobalStyles } from "@/styles/globalStyles";

const fillGuessCard = (len: number): boolean[] => Array(len).fill(false)

export default function Play() {
  // console.debug("RENDERED PLAY");

  const styles = getGlobalStyles();
  const navigation = useNavigation();

  const [grid, setGrid] = useState<Grid>(fillBoard());
  const [shouldStartGame, startGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [defaultN, setDefaultN] = useState<number>();

  const gameLoopRef = useRef<CustomTimer>(null);
  const engineRef = useRef<RunningEngine>();

  const { gameLen, matchRate } = defaults(1);

  // Is Dual N-Back Mode
  const isDualMode = useRef<boolean>(false);
  const setDualMode = (p: boolean) => {
    isDualMode.current = p;
  }

  // All Sounds
  const sounds = useRef<SoundState>({});
  const setSounds = (p: SoundState) => {
    sounds.current = p;
  }
  type sound = Audio.Sound | null;
  const sound = useRef<sound>(null);
  const setSound = (p: sound) => {
    sound.current = p;
  }

  const soundClickRef = useRef<boolean[]>([]);
  const soundGuess = () => {
    soundClickRef.current[turnRef.current] = true;
  };

  const posClickRef = useRef<boolean[]>([]);
  const posGuess = () => {
    posClickRef.current[turnRef.current] = true;
  };

  const turnRef = useRef<number>(0);
  const setTurnRef = (t: number) => {
    turnRef.current = t;
  }

  // Current N
  const getN = async (): Promise<number> => {
    try {
      const n = await security.get("defaultN");
      return n as number
    } catch (e) {
      console.error("Error in [getN]", e);
      throw e;
    }
  };

  const resetGame = () => {
    stopGameLoop();
    startGame(false);
    setElapsedTime(-1);
    setGrid(fillBoard());
    setTurnRef(0);
    emptyGuessCards();
  }

  const startGameLoop = () => {
    if (!gameLoopRef.current) {
      gameLoopRef.current = setInterval(() => {
        setElapsedTime((p) => p + 1);
      }, 1000);
    }
  }

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }

  const emptyGuessCards = () => {
    posClickRef.current = fillGuessCard(gameLen);
    soundClickRef.current = fillGuessCard(gameLen);
  }

  interface ScoreCard {
    soundGuesses?: boolean[];
    posGuesses?: boolean[];
    buzzGuesses?: boolean[];
  }
  // TODO move this to the engine util?
  const scoreGame = ({ soundGuesses, posGuesses, buzzGuesses }: ScoreCard) => {
    const answers = engineRef.current?.answers();

    console.debug("answers: ", answers);
    console.debug("sound guess: ", soundGuesses);
    console.debug("pos guess:", posGuesses);

    const soundScore = calculateScore({answers: answers?.sounds as boolean[], guesses: soundGuesses as boolean[]});
    const posScore = calculateScore({answers: answers?.pos as boolean[], guesses: posGuesses as boolean[]});

    showCustomAlert("Score", JSON.stringify({
      sounds: soundScore,
      positions: posScore
    }))

    return {
      soundScoreCard: soundScore,
      posScoreCard: posScore,
      // buzzGuesses: calculateMatchPercentage(answers?.sounds as boolean[], []),
    }
  }

  // Main Gameplay Loop
  useFocusEffect(
    React.useCallback(() => {
      const initGame = async () => {
        try {
          const n: number = await getN();
          emptyGuessCards();

          navigation.setOptions({
            title: `Play (${n}-back)`,
          });
          setDefaultN(n);

          const isDualMode: boolean = await getDualMode();
          setDualMode(isDualMode);

          if (isDualMode) {
            const sounds = await loadSounds();
            setSounds(sounds);

          } else {
            const sound = await loadSound();
            setSound(sound);
          }

          engineRef.current = engine({
            n,
            gameLen,
            matchRate,
            isDualMode
          });

          engineRef.current.createNewGame();
          // startGame(true);
          setIsLoading(false);
        } catch (e) {
          console.error("Error initializing game.", e);
        }
      }

      initGame();

      return () => {
        resetGame()
      } // Cleanup on unmount
    }, [/* first run: initialize game */])
  );

  useEffect(() => {
    if (shouldStartGame) {
      startGameLoop();
      // setIsLoading(false);

      return () => {
        stopGameLoop();
      }
    }
  }, [shouldStartGame]);

  useEffect(() => {
    if (elapsedTime >= 0) {
      if (elapsedTime > MAXTIME) { // exit condition 1: game went too long.
        console.warn("Game ended, timer: ", elapsedTime);
        scoreGame({
          posGuesses: posClickRef.current,
          soundGuesses: soundClickRef.current,
        });
        resetGame();
        return;
      }

      if (elapsedTime % 2 === 0) {
        const turn = Math.floor(elapsedTime / 2);
        setTurnRef(turn);
        if (turn >= gameLen) { // exit condition 2: game is actually over.
          console.info("Game ended, turn: ", turn);
          scoreGame({
            posGuesses: posClickRef.current,
            soundGuesses: soundClickRef.current,
          });
          resetGame();
          return;
        }
        try {
          const round = engineRef.current?.nextRound(turn);
          setGrid(round?.next as Grid);
          round?.playSound()
        } catch (e) {
          console.log("Error in game. Ejecting.", e);
          resetGame();
        }
      }
    }
  }, [elapsedTime])

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

    return () => { // Cleanup on unmount
      unloadSounds();
      resetGame();
    };
  }, []);

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
          <Button label=" Sound " onPress={soundGuess} />
        </View>
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Position " onPress={posGuess} />
        </View>
      </View>
      <StatusButton onPress={() => { resetGame(); startGame(true) }} isLoading={isLoading} playing={shouldStartGame} />
    </View>
  );
}
