import React, { useState, useEffect, useRef, ReactNode } from "react";
import { View, Animated, Alert, Text, ScrollView } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

import Square from "@/components/Square";
import PlayButton from "@/components/PlayButton";
import StatusButton from "@/components/StatusButton";
import { ScoreCard, ScoresType, SingleScoreType, scoreKey } from "@/util/ScoreCard";
import useGameSounds, { SoundKey } from "@/hooks/sounds";

import { showCustomAlert } from "@/util/alert";
import security from "@/util/security";
import log from "@/util/logger";

import engine, {
  getDualMode,
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
  MINN
} from "@/util/engine";

import { height, useGlobalStyles } from "@/styles/globalStyles";
import ScoreOverlay from '@/components/ScoreOverlay';
import TutorialOverlay from '@/components/TutorialOverlay';
import ProgressBar from '@/components/ProgressBar';

const fillGuessCard = (len: number): boolean[] => Array(len).fill(false);
const newCard = new ScoreCard({});

export default function Play() {
  const { t } = useTranslation();
  const GAME_MODE_NAMES = getGameModeNames(t);
  const styles = useGlobalStyles();
  const navigation = useNavigation();
  const router = useRouter();

  const { playSound } = useGameSounds();

  const [grid, setGrid] = useState<Grid>(fillBoard());
  const [shouldStartGame, startGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [defaultN, setDefaultN] = useState<number>(2);
  const [isDualMode, setDualMode] = useState<boolean>(true);
  const [isSilentMode, setSilenMode] = useState<boolean>(false);
  const [showScoreOverlay, setShowScoreOverlay] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelText, setLevelText] = useState<string>(t('play.level'));

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

  const { gameLen: DEFAULT_GAMELEN, matchRate: DEFAULT_MATCHRATE } = defaults(1)
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

  if (matchRate == undefined || gameLen == undefined) {
    const { gameLen: g, matchRate: m } = defaults();
    setMatchRate(m);
    setGameLen(g);
  }

  const [gameLevels, setGameLevels] = useState<GameLevels>(DEFAULT_LEVELS);
  
  const playerLevel = useRef<GameLevels>(DEFAULT_LEVELS);
  const setPlayerLevel = (mode: GameModeEnum, level: number) => {
    playerLevel.current = {
      ...playerLevel.current,
      [mode]: level
    };
    // Persist the levels
    security.set('gameLevels', playerLevel.current);
  };
  
  const getPlayerLevel = (mode: GameModeEnum): number => {
    return playerLevel.current[mode] || 1;
  };

  const [didLevelUp, setDidLevelUp] = useState(false);

  const syncNWithLevel = (level: number) => {
    const newN = Math.min(MAXN, Math.max(MINN, Math.floor(level/3) + 1));
    security.set("defaultN", newN);
    setDefaultN(newN);
  };

  const doLevelUp = (mode: GameModeEnum) => {
    setDidLevelUp(true);
    const currentLevel = getPlayerLevel(mode);
    const newLevel = currentLevel + 1;
    setPlayerLevel(mode, newLevel);
    setFailCount(0);
    setSuccessCount(0);
    
    // Sync N with new level
    syncNWithLevel(newLevel);
    
    // Update navigation title
    navigation.setOptions({
      title: `${levelText} ${newLevel} (${GAME_MODE_NAMES[mode]})`
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
        title: `${levelText} ${currentLevel - 1} (${GAME_MODE_NAMES[mode]})`
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
      let rec = await security.get("records");
      if (rec == null) {
        const initSingleN: SingleScoreType = {
          score: 0,
          errorRate: 0,
          n: defaultN,
        };
        const initDualN: SingleScoreType = {
          score: 0,
          score2: 0,
          errorRate: 0,
          errotRate2: 0,
          n: defaultN,
        }
        playHistory.setValue(GameModeEnum.SingleN, initSingleN);
        playHistory.setValue(GameModeEnum.DualN, initDualN);
        playHistory.setValue(GameModeEnum.SilentDualN, initDualN);
      }
      playHistory.scores = rec as ScoresType;
    } catch (e) {
      log.error("Error retrieving past scores.", e);
    }
  }

  // Current N
  const getN = async (): Promise<number> => {
    try {
      const n = await security.get("defaultN");
      return n as number
    } catch (e) {
      log.error("Error in [getN]", e);
      throw e;
    }
  };

  const getSilentMode = async (): Promise<boolean> => {
    try {
      const n = await security.get("silentMode");
      return n as boolean
    } catch (e) {
      log.error("Error in [getSilentMode]", e);
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
  const [totalWinsNeeded, setTotalWinsNeeded] = useState(3); // Adjust this value as needed

  // TODO achievements
  const scoreGame = ({ soundGuesses, posGuesses, buzzGuesses }: ScoreCard) => {
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
    if (!isSilentMode) playSound("yay");

    const currentGameMode = whichGameMode(isDualMode, isSilentMode);
    
    if (playerWon(
      posResult,
      defaultN,
      (isDualMode && !isSilentMode) ? soundResult : undefined,
      (isDualMode && isSilentMode) ? buzzResult : undefined
    )) {
      const successes = getSuccessCount() + 1;
      setSuccessCount(successes);
      if (shouldLevelUp(successes)) {
        doLevelUp(currentGameMode as GameModeEnum);
      }
      setWinsToNextLevel(prev => prev + 1);
      if (winsToNextLevel + 1 >= totalWinsNeeded) {
        doLevelUp(currentGameMode as GameModeEnum);
        setWinsToNextLevel(0);
      }
    } else {
      const failures = getFailCount() + 1;
      setFailCount(failures);
      if (failures > 3) {
        showCustomAlert(
          t('play.tryEasier'), 
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
    playHistory.save();
  }

  useFocusEffect(
    React.useCallback(() => {
      const getTerms = async () => {
        const terms = await security.get("termsAccepted");
        if (!terms) {
          Alert.alert(
            t('terms.title'),
            t('terms.message'),
            [
              { text: t('terms.seeTerms'), onPress: () => router.push('/terms') },
            ],
            { cancelable: false }
          );
        }
      }
      getTerms();

    }, [router])
  );

  useEffect(() => {
    // reset win count when game mode changes.
    setFailCount(0);
    setSuccessCount(0);
    setWinsToNextLevel(0);  // Reset progress bar

    return () => {
      setFailCount(0);
      setSuccessCount(0);
      setWinsToNextLevel(0);  // Reset progress bar on cleanup
    }
  }, [isDualMode, isSilentMode]);

  useFocusEffect(
    React.useCallback(() => {
      setLevelText(t('play.level'));
    }, [t])
  );

  // Main Gameplay Loop
  useFocusEffect(
    React.useCallback(() => {
      const initGame = async () => {
        try {
          const isDualMode: boolean = await getDualMode();
          const isSilentMode: boolean = await getSilentMode();
          let n: number = await getN();
          
          setDualMode(isDualMode);
          setSilenMode(isSilentMode);
          
          if (n === null) n = defaultN;

          navigation.setOptions({
            title: `${levelText} ${getPlayerLevel(whichGameMode(isDualMode, isSilentMode) as GameModeEnum)} (${GAME_MODE_NAMES[whichGameMode(isDualMode, isSilentMode) as GameModeEnum]})`
          });
          setDefaultN(n);

          setEngine(
            engine({
              n,
              gameLen: getGameLen(),
              matchRate: getMatchRate(),
              isDualMode
            })
          );

          getEngine().createNewGame();

          await loadRecords();

          // Load saved game levels
          const savedLevels = await security.get('gameLevels');
          if (savedLevels && typeof savedLevels === 'object') {
            const typedLevels = savedLevels as unknown as GameLevels;
            if (
              GameModeEnum.SingleN in typedLevels && 
              GameModeEnum.DualN in typedLevels && 
              GameModeEnum.SilentDualN in typedLevels
            ) {
              playerLevel.current = typedLevels;
              navigation.setOptions({
                title: `${levelText} ${getPlayerLevel(whichGameMode(isDualMode, isSilentMode) as GameModeEnum)} (${GAME_MODE_NAMES[whichGameMode(isDualMode, isSilentMode) as GameModeEnum]})`
              });
            }
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
    }, [/* first run: initialize game */])
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
    const handleNChange = async () => {
      try {
        const n = await security.get("defaultN") as number;
        if (n !== defaultN) {
          setDefaultN(n);
          // Reset all modes to appropriate starting level for this N
          const startingLevel = ((n - 1) * 3) + 1;
          Object.values(GameModeEnum).forEach(mode => {
            setPlayerLevel(mode, startingLevel);
          });
          
          // Update navigation title for current mode
          const currentMode = whichGameMode(isDualMode, isSilentMode) as GameModeEnum;
          navigation.setOptions({
            title: `${levelText} ${startingLevel} (${GAME_MODE_NAMES[currentMode]})`
          });
        }
      } catch (e) {
        log.error("Error syncing N value", e);
      }
    };

    handleNChange();
  }, []); // Run on mount to catch any settings changes

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


type DisplayProps = {
  children: ReactNode;
}
function Display({ children }: DisplayProps) {
  const makeScroll: boolean = height < 800;

  return (
    <>
      {makeScroll &&
        <ScrollView>
          {children}
        </ScrollView>
      }
      {!makeScroll &&
        <>
          {children}
        </>
      }
    </>
  )
}
