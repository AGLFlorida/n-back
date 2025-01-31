import React, { useState, useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useFocusEffect, useNavigation } from "expo-router";
import { Audio } from "expo-av";

import Square from "@/components/Square";
import PlayButton from "@/components/PlayButton";
import StatusButton from "@/components/StatusButton";
import { showCustomAlert } from "@/util/alert";
import { ScoreCard, ScoresType, SingleScoreType } from "@/util/ScoreCard";

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
  defaults,
  scoreKey
} from "@/util/engine";

import { getGlobalStyles } from "@/styles/globalStyles";

const fillGuessCard = (len: number): boolean[] => Array(len).fill(false);
const newCard = new ScoreCard({});

export default function Play() {
  // console.debug("RENDERED PLAY");

  const styles = getGlobalStyles();
  const navigation = useNavigation();

  const [grid, setGrid] = useState<Grid>(fillBoard());
  const [shouldStartGame, startGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [defaultN, setDefaultN] = useState<number>();
  const [isDualMode, setDualMode] = useState<boolean>(true);
  const [isSilentMode, setSilenMode] = useState<boolean>(false);

  const playHistory = useRef(newCard).current;
  const gameLoopRef = useRef<CustomTimer>(null);
  const engineRef = useRef<RunningEngine>();

  const { gameLen, matchRate } = defaults(1);

  // Make button transitions less abrupt
  const playButtonFadeAnim = useRef(new Animated.Value(0)).current;

  const hideButtons = () => {
    playButtonFadeAnim.setValue(0);
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

  // Previous Scores
  const loadRecords = async () => {
    const key = scoreKey();
    try {
      let rec = await security.get("records");
      if (rec == null) {
        const key = scoreKey();
        rec = {};
        rec[key] = [0, 0, 0];
      }
      playHistory.scores = rec as ScoresType;
    } catch (e) {
      console.error("Error retrieving past scores.", e);
    }
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

  const getSilentMode = async (): Promise<boolean> => {
    try {
      const n = await security.get("silentMode");
      return n as boolean
    } catch (e) {
      console.error("Error in [getSilentMode]", e);
      throw e;
    }
  }

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
  // TODO add guess error rate.
  // TODO auto-progression based on score and error rate.
  // TODO achievements
  // TODO flesh out score screen
  // TODO show version notes popup
  const scoreGame = ({ soundGuesses, posGuesses, buzzGuesses }: ScoreCard) => {
    const answers = engineRef.current?.answers();

    // console.debug("answers: ", answers);
    // console.debug("sound guess: ", soundGuesses);
    // console.debug("pos guess:", posGuesses);

    const { accuracy: soundScore } = calculateScore({ answers: answers?.sounds as boolean[], guesses: soundGuesses as boolean[] });
    const { accuracy: posScore } = calculateScore({ answers: answers?.pos as boolean[], guesses: posGuesses as boolean[] });
    const { accuracy: buzzScore } = calculateScore({ answers: answers?.buzz as boolean[], guesses: buzzGuesses as boolean[] });

    // TODO this is super ugly...
    // TODO track error rate.
    const key = scoreKey();
    const saveScores = async () => {
      if (playHistory.scores == null) {
        const initialScore: SingleScoreType = [0, 0, 0];
        playHistory.setValue(key, initialScore);
      }

      const newScores: SingleScoreType = [
        posScore,
        (posScore + soundScore) / 2,
        (posScore + buzzScore) / 2
      ]

      let prevScores = playHistory.getValue(key);
      if (prevScores && !playHistory.compareCards(prevScores, newScores)) {
        if (prevScores.length > 0 && prevScores[0] > newScores[0]) {
          newScores[0] = prevScores[0];
        }
        if (prevScores.length > 1 && prevScores[1] > newScores[1]) {
          newScores[1] = prevScores[1];
        }

        if (prevScores.length > 2 && prevScores[2] > newScores[2]) { // backwards compat. with old scoring system
          newScores[2] = prevScores[2];
        }
      }
      
      playHistory.setValue(key, newScores);
      try {
        await security.set("records", playHistory.scores);
      } catch (e) {
        console.error("Error saving scores", e);
      }

    }
    saveScores();

    showCustomAlert("Score", JSON.stringify({
      sounds: soundScore,
      positions: posScore,
      buzz: buzzScore
    }))

    return {
      soundScoreCard: soundScore,
      posScoreCard: posScore,
      buzzSCoreCard: buzzScore
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

          const isSilentMode: boolean = await getSilentMode();
          setSilenMode(isSilentMode);

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

          await loadRecords();

          setIsLoading(false);
        } catch (e) {
          console.error("Error initializing game.", e);
        }
      }

      initGame();

      Animated.timing(playButtonFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return () => {
        resetGame()
        hideButtons()
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
          // console.info("Game ended, turn: ", turn);
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
          if (isSilentMode) {
            round?.triggerVibration();
          } else {
            round?.playSound();
          }
        } catch (e) {
          console.error("Error in game. Ejecting.", e);
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
      <Animated.View style={{ opacity: playButtonFadeAnim }}>
        <PlayButton soundGuess={soundGuess} posGuess={posGuess} dualMode={isDualMode} silentMode={isSilentMode} />
      </Animated.View>
      <StatusButton onPress={() => { resetGame(); startGame(true) }} isLoading={isLoading} playing={shouldStartGame} />
    </View>
  );
}
