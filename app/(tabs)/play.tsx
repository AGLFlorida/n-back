import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, Alert } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

import Square from "@/components/Square";
import PlayButton from "@/components/PlayButton";
import StatusButton from "@/components/StatusButton";
import { ScoreCard, SingleScoreType } from "@/util/ScoreCard";
import useGameSounds, { SoundKey } from "@/hooks/sounds";

import Display from "@/components/Display"

// TODO | FIXME -- switching between game modes does not change player level or N -- actually, there are several weird bugs 
// with state here. clearing data once didn't reset the player level but hitting it 3 or 4 times did. sometimes is gets the toggles
// out of sync with the actualy settings. also saw an issue where the player leveled to 6 but when I tabbed away and back, the level
// went back to 5.

// TODO | FIXME -- I reproduced a bug twice. I am not sure if it occurs after level 3 or after the first "failed" game. If you hit one
// of those two conditions, switch screens, then back, it resets to level 3 / N 2.

import { showCustomAlert } from "@/util/alert";
import log from "@/util/logger";

import { useAchievementStore } from "@/store/useAchievementStore";

import engine, {
  fillBoard,
  CustomTimer,
  RunningEngine,
  Grid,
  calculateScore,
  defaults,
  shouldLevelUp,
  playerWon,
  whichGameMode,
  gameModeScore,
  GameModeEnum,
  GameLevels,
  DEFAULT_LEVELS,
  getGameModeNames,
  MAXN,
  MINN,
  getStartLevel
} from "@/util/engine";

import { useGlobalStyles } from "@/styles/globalStyles";
import ScoreOverlay from '@/components/ScoreOverlay';
import TutorialOverlay from '@/components/TutorialOverlay';
import ProgressBar from '@/components/ProgressBar';

import { useHistoryStore } from "@/store/useHistoryStore";
import { useSettingsStore } from "@/store/useSettingsStore";


const fillGuessCard = (len: number): boolean[] => Array(len).fill(false);
const newCard = ScoreCard.getInstance();

export default function Play() {
  const { t } = useTranslation();
  const GAME_MODE_NAMES = getGameModeNames(t);
  const styles = useGlobalStyles();
  const navigation = useNavigation();
  const router = useRouter();

  const { playSound } = useGameSounds();

  const setN = useSettingsStore(state => state.setN);
  const defaultN = useSettingsStore(state => state.N);
  const storedTermsAccepted = useSettingsStore(state => state.termsAccepted);
  const isDualMode = useSettingsStore(state => state.dualMode);
  const isSilentMode = useSettingsStore(state => state.silentMode);

  const [grid, setGrid] = useState<Grid>(fillBoard());
  const [shouldStartGame, startGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [defaultN, setDefaultN] = useState<number>(2);
  // const [isDualMode, setDualMode] = useState<boolean>(dualMode);
  // const [isSilentMode, setSilentMode] = useState<boolean>(silentMode);
  const [showScoreOverlay, setShowScoreOverlay] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelText, setLevelText] = useState<string>(t('play.level'));

  const {
    singleLvl, setSingleLvl,
    dualLvl, setDualLvl,
    silentLvl, setSilentLvl,
    records, //setRecords,
  } = useHistoryStore();

  type GameScores = {
    positions: number;
    sounds: number;
    buzz: number;
    pError?: number;
    sError?: number;
    bError?: number;
  }
  const [gameScores, setGameScores] = useState<GameScores>({ positions: 0, sounds: 0, buzz: 0, pError: 0, sError: 0, bError: 0 });

  const playHistory = useRef(newCard).current;
  const gameLoopRef = useRef<CustomTimer>(null);

  const successCount = useRef<number>(0);
  const setSuccessCount = (n: number) => {
    successCount.current = n;
  }
  const getSuccessCount = (): number => {
    return successCount.current || 0;
  }
  const failCount = useRef<number>(0);
  const setFailCount = (n: number) => {
    failCount.current = n;
  }
  const getFailCount = (): number => {
    return failCount.current || 0;
  }

  const engineRef = useRef<RunningEngine>();
  const getEngine = (): RunningEngine => {
    return engineRef.current || engine({
      n: 2,
      gameLen: getGameLen(),
      matchRate: getMatchRate(),
      isDualMode
    })
  }
  const setEngine = (e: RunningEngine) => {
    engineRef.current = e;
  }

  const { gameLen: DEFAULT_GAMELEN, matchRate: DEFAULT_MATCHRATE } = defaults(1);
  const gameLen = useRef<number>();
  const setGameLen = (p: number) => {
    gameLen.current = p;
  }
  const getGameLen = (): number => {
    return gameLen.current || DEFAULT_GAMELEN;
  }
  const matchRate = useRef<number>();
  const setMatchRate = (p: number) => {
    matchRate.current = p;
  }
  const getMatchRate = (): number => {
    return matchRate.current || DEFAULT_MATCHRATE
  }

  const turnsLeft = useRef<number>(gameLen.current || DEFAULT_GAMELEN);
  const decrementTurns = () => turnsLeft.current--;
  const resetTurns = () => turnsLeft.current = (gameLen.current || DEFAULT_GAMELEN);

  if (matchRate == undefined || gameLen == undefined) {
    const { gameLen: g, matchRate: m } = defaults();
    setMatchRate(m);
    setGameLen(g);
  }

  const playerLevel = useRef<GameLevels>(DEFAULT_LEVELS);
  const setPlayerLevel = (mode: GameModeEnum, level: number) => {
    playerLevel.current = {
      ...playerLevel.current,
      [mode]: level
    };

    const { SingleN, DualN, SilentDualN } = playerLevel.current;

    setSingleLvl(SingleN);
    setDualLvl(DualN);
    setSilentLvl(SilentDualN);
  };

  const getPlayerLevel = (mode: GameModeEnum): number => {
    return playerLevel.current[mode] || 1;
  };

  const [didLevelUp, setDidLevelUp] = useState(false);

  const syncNWithLevel = (level: number) => {
    const newN = Math.min(MAXN, Math.max(MINN, Math.floor(level / 3) + 1));
    setN(newN);
    // setDefaultN(newN);
  };

  const doLevelUp = (mode: GameModeEnum) => {
    setDidLevelUp(true);
    const currentLevel = getPlayerLevel(mode);
    const newLevel = currentLevel + 1;
    console.error('doLevelUp > newLevel', currentLevel + 1);
    setPlayerLevel(mode, newLevel);
    setFailCount(0);
    setSuccessCount(0);

    // Sync N with new level
    syncNWithLevel(newLevel);

    // Update navigation title
    navigation.setOptions({
      title: `${levelText} ${newLevel} [N: ${defaultN}] ${GAME_MODE_NAMES[mode]}`
    });
  };

  const doLevelDown = (mode: GameModeEnum) => {
    const currentLevel = getPlayerLevel(mode);
    if (currentLevel > 1) {
      setPlayerLevel(mode, currentLevel - 1);
      setFailCount(0);
      setSuccessCount(0);

      // Update navigation title
      navigation.setOptions({
        title: `${levelText} ${currentLevel - 1} [N: ${defaultN}] ${GAME_MODE_NAMES[mode]}`
      });
    }
  };

  // Make button transitions less abrupt
  const playButtonFadeAnim = useRef(new Animated.Value(0)).current;

  const hideButtons = () => {
    playButtonFadeAnim.setValue(0);
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
    try {
      if (records == null) {
        const initSingleN: SingleScoreType = {
          score: 0,
          errorRate: 0,
          n: defaultN,
        };
        const initDualN: SingleScoreType = {
          score: 0,
          score2: 0,
          errorRate: 0,
          errorRate2: 0,
          n: defaultN,
        }
        playHistory.setValue(GameModeEnum.SingleN, initSingleN);
        playHistory.setValue(GameModeEnum.DualN, initDualN);
        playHistory.setValue(GameModeEnum.SilentDualN, initDualN);
      }
      playHistory.scores = records;
    } catch (e) {
      log.error("Error retrieving past scores.", e);
    }
  }

  const resetGame = () => {
    stopGameLoop();
    startGame(false);
    setElapsedTime(-1);
    setGrid(fillBoard());
    setTurnRef(0);
    emptyGuessCards();
    resetTurns();
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
    posClickRef.current = fillGuessCard(getGameLen());
    if (isDualMode) soundClickRef.current = fillGuessCard(getGameLen());
  }

  interface ScoreCard {
    soundGuesses?: boolean[];
    posGuesses?: boolean[];
    buzzGuesses?: boolean[];
  }

  // Add state for tracking wins
  const [winsToNextLevel, setWinsToNextLevel] = useState(0);
  const [totalWinsNeeded,] = useState(3); // Adjust this value as needed

  // TODO achievements
  const scoreGame = ({ soundGuesses, posGuesses }: ScoreCard) => {
    setDidLevelUp(false);
    const answers = getEngine().answers();
    const posResult = calculateScore({ answers: answers?.pos as boolean[], guesses: posGuesses as boolean[] });
    const { accuracy: posScore, errorRate: posError } = posResult;

    let soundScore: number = 0;
    let soundError: number = 0;
    let soundResult;

    let buzzScore: number = 0;
    let buzzError: number = 0;
    let buzzResult;

    if (isDualMode) {
      if (isSilentMode) {
        buzzResult = calculateScore({ answers: answers?.buzz as boolean[], guesses: soundGuesses as boolean[] });
        ({ accuracy: buzzScore, errorRate: buzzError } = buzzResult);
      } else {
        soundResult = calculateScore({ answers: answers?.sounds as boolean[], guesses: soundGuesses as boolean[] });
        ({ accuracy: soundScore, errorRate: soundError } = soundResult);
      }
    }

    setGameScores({
      positions: posScore,
      sounds: soundScore,
      buzz: buzzScore,
      pError: posError,
      sError: soundError,
      bError: buzzError
    });
    setShowScoreOverlay(true);
    const isWinner: boolean = playerWon(
      posResult,
      defaultN,
      (isDualMode && !isSilentMode) ? soundResult : undefined,
      (isDualMode && isSilentMode) ? buzzResult : undefined
    );

    if (!isSilentMode && isWinner) playSound("yay");
    if (!isSilentMode && !isWinner) playSound("failure");

    const currentGameMode = whichGameMode(isDualMode, isSilentMode);

    if (isWinner) {
      const successes = getSuccessCount() + 1;
      setSuccessCount(successes);
      setWinsToNextLevel(prev => prev + 1);
      if (winsToNextLevel + 1 >= totalWinsNeeded && shouldLevelUp(successes)) {
        doLevelUp(currentGameMode as GameModeEnum);
        setWinsToNextLevel(0);
      }
      setFailCount(0);
    } else {
      const failures = getFailCount() + 1;
      setFailCount(failures);
      setSuccessCount(0);
      if (failures > 3) {
        showCustomAlert(
          t('play.tryAgain'),
          t('play.tryEasierMessage'),
          () => doLevelDown(currentGameMode as GameModeEnum),
          true,
          { ok: t('ok'), cancel: t('cancel') }
        );
      }
      setWinsToNextLevel(0);
    }

    const currentGameScore: SingleScoreType = gameModeScore(defaultN, posResult, soundResult, buzzResult);
    playHistory.setValue(currentGameMode, currentGameScore);
    console.log("current game score", currentGameScore);
    console.log("play history", playHistory);
    // setRecords({
    //   ...records,
    //   [currentGameMode]: currentGameScore // TODO this is some autocorrect/copilot BS. make sure to come back and look at it.
    // });
  }


  const { N: highestN, setN: setHighestN } = useAchievementStore();
  const { level: higestLevel, setLevel: setHighestLevel } = useAchievementStore();
  // const { streak, setStreak = useAchievementStore(state => [state.streak, state.setStreak])
  useEffect(() => {
    if (highestN < defaultN) {
      setHighestN(defaultN);
    }

    const currentGameMode = whichGameMode(isDualMode, isSilentMode);
    if (higestLevel < playerLevel.current[currentGameMode as GameModeEnum]) {
      setHighestLevel(playerLevel.current[currentGameMode as GameModeEnum]);
    }
  }, [playerLevel, defaultN, isDualMode, isSilentMode]);

  // useEffect(() => {
  //   console.log("Dual Mode: ", dualMode, isDualMode);
  //   console.log("Silent Mode: ", silentMode, isSilentMode);
  //   console.log("N: ", N, "================");
  //   setDualMode(dualMode);
  //   setSilenMode(silentMode);
  // }, [dualMode, silentMode]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // reset win count when game mode changes.
  //     setFailCount(0);
  //     setSuccessCount(0);
  //     setWinsToNextLevel(0);  // Reset progress bar



  //     return () => {
  //       setFailCount(0);
  //       setSuccessCount(0);
  //       setWinsToNextLevel(0);  // Reset progress bar on cleanup
  //     }

  //   }, [isDualMode, isSilentMode])
  // );

  useFocusEffect(
    React.useCallback(() => {
      if (!storedTermsAccepted) {
        Alert.alert(
          t('terms.title'),
          t('terms.message'),
          [
            { text: t('terms.seeTerms'), onPress: () => router.push('/terms') },
          ],
          { cancelable: false }
        );
      }

    }, [router])
  );

  useFocusEffect(
    React.useCallback(() => {
      setLevelText(t('play.level'));
    }, [t])
  );

  // useEffect(() => {
  //   console.log("silent | dual", isSilentMode, isDualMode);
  // }, [isSilentMode, isDualMode]);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("silent | dual", isSilentMode, isDualMode, silentMode, dualMode);
  //     if (silentMode != isSilentMode) {
  //       setSilentMode(silentMode)
  //     }

  //     if (dualMode != isDualMode) {
  //       setDualMode(dualMode);
  //     }
  //   }, [isSilentMode, isDualMode])
  // );

  // Main Gameplay Loop
  useFocusEffect(
    React.useCallback(() => {
      const initGame = async () => {
        try {
          navigation.setOptions({
            title: `${levelText} ${getPlayerLevel(whichGameMode(isDualMode, isSilentMode) as GameModeEnum)} [N: ${defaultN}] (${GAME_MODE_NAMES[whichGameMode(isDualMode, isSilentMode) as GameModeEnum]})`
          });
          // setDefaultN(N);

          setEngine(
            engine({
              n: defaultN,
              gameLen: getGameLen(),
              matchRate: getMatchRate(),
              isDualMode
            })
          );

          getEngine().createNewGame();

          await loadRecords();

          // Load saved game levels
          const savedLevels = {
            [GameModeEnum.SingleN]: singleLvl,
            [GameModeEnum.DualN]: dualLvl,
            [GameModeEnum.SilentDualN]: silentLvl
          }
          if (savedLevels && typeof savedLevels === 'object') {
            const typedLevels = savedLevels as unknown as GameLevels;
            if (
              GameModeEnum.SingleN in typedLevels &&
              GameModeEnum.DualN in typedLevels &&
              GameModeEnum.SilentDualN in typedLevels
            ) {
              playerLevel.current = typedLevels;
            } else {
              playerLevel.current = DEFAULT_LEVELS;
            }
            navigation.setOptions({
              title: `${levelText} ${getPlayerLevel(whichGameMode(isDualMode, isSilentMode) as GameModeEnum)} [N: ${defaultN}] ${GAME_MODE_NAMES[whichGameMode(isDualMode, isSilentMode) as GameModeEnum]}`
            });
          }

          setIsLoading(false);
        } catch (e) {
          log.error("Error initializing game.", e);
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
    }, [isDualMode, isSilentMode, defaultN])
  );

  useEffect(() => {
    if (shouldStartGame) {
      startGameLoop();

      return () => {
        stopGameLoop();
      }
    }
  }, [shouldStartGame]);

  useEffect(() => {
    if (elapsedTime >= 0) {
      if (elapsedTime > getEngine().timeLimit) { // exit condition 1: game went too long.
        log.warn("Game ended, timer: ", elapsedTime);
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
        decrementTurns();
        if (turn >= getGameLen()) { // exit condition 2: game is actually over.
          scoreGame({
            posGuesses: posClickRef.current,
            soundGuesses: soundClickRef.current,
          });
          resetGame();
          return;
        }
        try {
          const round = getEngine().nextRound(turn);

          setGrid(fillBoard());

          // fix for missing visual indicator when two turns have the same visible square.
          const redraw = setTimeout(() => {
            setGrid(round?.next as Grid);
          }, 200);

          if (isSilentMode) {
            round?.triggerVibration((isSilentMode && !isDualMode));
          } else {
            playSound(round?.letter as SoundKey);
          }

          return () => clearTimeout(redraw);
        } catch (e) {
          log.error("Error in game. Ejecting.", e);
          resetGame();
        }

      }
    }
  }, [elapsedTime])

  // Cleanup
  useEffect(() => {
    return () => { // Cleanup on unmount
      resetGame();
    };
  }, []);

  // Add effect to handle N changes from settings
  useEffect(() => {
    const startingLevel = getStartLevel(defaultN);
    Object.values(GameModeEnum).forEach(mode => {
      setPlayerLevel(mode, startingLevel);
    });

    // Update navigation title for current mode
    const currentMode = whichGameMode(isDualMode, isSilentMode) as GameModeEnum;
    navigation.setOptions({
      title: `${levelText} ${startingLevel} [N: ${defaultN}] ${GAME_MODE_NAMES[currentMode]}`
    });
  }, [defaultN]); // Run on mount to catch any settings changes

  useEffect(() => {
    console.debug('[play] dual, silent - ', isDualMode, isSilentMode);
  }, [isDualMode, isSilentMode])

  return (
    <Display>
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
        <StatusButton
          onPress={() => { resetGame(); startGame(true) }}
          isLoading={isLoading}
          playing={shouldStartGame}
          onTutorial={() => setShowTutorial(!showTutorial)}
        />
        <ProgressBar progress={winsToNextLevel / totalWinsNeeded} />
        <View style={styles.indexContainer}>
          <Text style={[styles.label, { fontSize: 24 }]}>Turns Left: {turnsLeft.current}</Text>
        </View>
        {/* <View>
          <Text style={{ color: 'white' }}>Level: {getPlayerLevel()}</Text>
          <Text style={{ color: 'white' }}>Wins: {getSuccessCount()}</Text>
        </View> */}
        <ScoreOverlay
          isVisible={showScoreOverlay}
          onClose={() => setShowScoreOverlay(false)}
          scores={gameScores}
          didLevelUp={didLevelUp}
        />
        <TutorialOverlay
          isVisible={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      </View>
    </Display>
  );
}



