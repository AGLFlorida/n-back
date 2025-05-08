import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, Alert } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

import Square from "@/components/Square";
import PlayButton from "@/components/PlayButton";
import StatusButton from "@/components/StatusButton";

import { ScoreCard } from "@/util/engine/ScoreCard";

import { MAXTIME } from "@/util/engine/constants";

import useGameSounds, { SoundKey } from "@/hooks/sounds";

import type { ScoreCardInterface } from "@/util/engine/ScoreCard";
import type { CustomTimer, Grid } from "@/util/engine/types";

import Display from "@/components/Display";

import Player from "@/util/engine/Player";

import { GameModeEnum } from "@/util/engine/enums";

// TODO | FIXME -- switching between game modes does not change player level or N -- actually, there are several weird bugs 
// with state here. clearing data once didn't reset the player level but hitting it 3 or 4 times did. sometimes is gets the toggles
// out of sync with the actualy settings. also saw an issue where the player leveled to 6 but when I tabbed away and back, the level
// went back to 5.

// TODO | FIXME -- I reproduced a bug twice. I am not sure if it occurs after level 3 or after the first "failed" game. If you hit one
// of those two conditions, switch screens, then back, it resets to level 3 / N 2.

import { showCustomAlert } from "@/util/alert";
import log from "@/util/logger";

// import { useAchievementStore } from "@/store/useAchievementStore";

// TODO persist player and scores after each round

import RunningEngine, {
  getGameModeNames,
  fillBoard,
  calculateScore,
  playerWon,
  shouldLevelUp
} from "@/util/engine";

import { Dashboard } from "@/util/engine/Dashboard";
import type { GameScores } from "@/util/engine/types";
import type { DashboardInterface } from "@/util/engine/Dashboard";

import { useGlobalStyles } from "@/styles/globalStyles";
import ScoreOverlay from '@/components/ScoreOverlay';
import TutorialOverlay from '@/components/TutorialOverlay';
import ProgressBar from '@/components/ProgressBar';

import { useSettingsStore } from "@/store/useSettingsStore";


const fillGuessCard = (len: number): boolean[] => Array(len).fill(false);
const newCard = ScoreCard.getInstance();

export default function Play() {

  // non game loop related setup.
  const { t } = useTranslation();
  const styles = useGlobalStyles();
  const navigation = useNavigation();
  const router = useRouter();
  const storedTermsAccepted = useSettingsStore(state => state.termsAccepted);
  const playButtonFadeAnim = useRef(new Animated.Value(0)).current; // Make button transitions less abrupt
  const hideButtons = () => {
    playButtonFadeAnim.setValue(0);
  }

  // // DEBUG
  // const achDebug = useAchievementStore();
  // // DEBUG

  const { playSound } = useGameSounds();
  const GAME_MODE_NAMES = getGameModeNames(t);
  const [grid, setGrid] = useState<Grid>(fillBoard());
  const defaultN = useSettingsStore(state => state.N);
  const { dualMode: isDualMode, silentMode: isSilentMode, showMoveCounts} = useSettingsStore();
  const [showScoreOverlay, setShowScoreOverlay] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelText, ] = useState<string>(t('play.level'));

  const dashRef = useRef<DashboardInterface>(new Dashboard());
  const engineRef = useRef(new RunningEngine({ n: defaultN, gameMode: { isDual: isDualMode, isSilent: isSilentMode } }));
  const playerRef = useRef(new Player());

  // game loop
  const [shouldStartGame, startGame] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const gameLoopRef = useRef<CustomTimer>(null);

  // post game loop
  const [gameScores, setGameScores] = useState<GameScores>({ positions: 0, sounds: 0, buzz: 0, pError: 0, sError: 0, bError: 0 });
  const [didLevelUp, setDidLevelUp] = useState(false);

  // helper methods  
  const soundClickRef = useRef<boolean[]>([]);
  const soundGuess = (elapsedTime: number) => {
    soundClickRef.current[engineRef.current.getTurn(elapsedTime)] = true;
  };

  const posClickRef = useRef<boolean[]>([]);
  const posGuess = (elapsedTime: number) => {
    posClickRef.current[engineRef.current.getTurn(elapsedTime)] = true;
  };

  const doLevelUp = (mode: GameModeEnum) => {
    if (playerRef.current.canLevelUp(mode, defaultN)) setDidLevelUp(true);
    playerRef.current.levelUp(mode, defaultN);
    dashRef.current.reset();

    navigation.setOptions({ // update navigation title
      title: `${levelText} ${playerRef.current.get(mode)} [N: ${defaultN}] ${GAME_MODE_NAMES[mode]}`
    });
  };

  const doLevelDown = (mode: GameModeEnum) => {
    const currentLevel = playerRef.current.get(mode);
    if (currentLevel > 1) {
      playerRef.current.levelDown(mode);
      dashRef.current.reset();

      navigation.setOptions({ // update navigation title
        title: `${levelText} ${playerRef.current.get(mode)} [N: ${defaultN}] ${GAME_MODE_NAMES[mode]}`
      });
    }
  };

  const resetGame = () => {
    stopGameLoop();
    startGame(false);
    setElapsedTime(-1);
    setGrid(fillBoard());
    emptyGuessCards();

    engineRef.current.reset();
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
    const gameLen = engineRef.current.getGameLen();
    posClickRef.current = fillGuessCard(gameLen);
    if (isDualMode) soundClickRef.current = fillGuessCard(gameLen);
  }

  const scoreGame = ({ soundGuesses, posGuesses }: ScoreCardInterface) => {
    setDidLevelUp(false);

    const answers = engineRef.current.answers();
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

    // TODO move this to scorecard?
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

    if (isWinner) {
      dashRef.current.incrementSuccess();
      if (shouldLevelUp(dashRef.current.getSuccessCount())) {
        doLevelUp(engineRef.current.getGameMode());
        dashRef.current.reset();
      } else {
        dashRef.current.resetFailCount();
      }
    } else {
      dashRef.current.incrementFail();
      dashRef.current.resetSuccessCount();

      if (dashRef.current.getFailCount() == 3) {
        const _mode = engineRef.current.getGameMode();
        if (playerRef.current.canLevelDown(_mode)) {
          showCustomAlert(
            t('play.tryAgain'),
            t('play.tryEasierMessage'),
            () => doLevelDown(_mode),
            true,
            { ok: t('ok'), cancel: t('cancel') }
          );
        } else {
          showCustomAlert(
            t('play.showTutorial'),
            t('play.showTutorialMessage'),
            () => {
              setShowTutorial(true)
            },
            true,
            { ok: t('ok'), cancel: t('cancel') }
          );
          playerRef.current.set(1, _mode);
        }

        dashRef.current.reset();
        setShowScoreOverlay(false);
      }
    }

    console.log("engine: ", JSON.stringify(engineRef.current));
    console.log("player: ", JSON.stringify(playerRef.current));
    console.log("dashboard: ", JSON.stringify(dashRef.current));
  }

  useFocusEffect(
    React.useCallback(() => {
      // go back to terms if the terms are not accepted.
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
      return () => { // stop the game if we tab away.
        stopGameLoop();
        resetGame();
      }
    }, [router])
  );

  // Init the engine, reset the dashboard, and show the play buttons
  useEffect(() => {
    engineRef.current = new RunningEngine({ n: defaultN, gameMode: { isDual: isDualMode, isSilent: isSilentMode } });
    dashRef.current.reset();
    playerRef.current = new Player();
    setIsLoading(false);

    const _mode = engineRef.current.getGameMode();
    const level = playerRef.current.get(_mode);
    navigation.setOptions({
      title: `${levelText} ${level} [N: ${defaultN}] ${GAME_MODE_NAMES[_mode]}`
    });

    Animated.timing(playButtonFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      resetGame();
      hideButtons();
    }
  }, [isDualMode, isSilentMode, defaultN])

  // start the game.
  useEffect(() => {
    if (shouldStartGame) {
      startGameLoop();

      return () => {
        stopGameLoop();
      }
    }
  }, [shouldStartGame]);

  // play loop
  useEffect(() => {
    if (elapsedTime >= 0) {
      if (elapsedTime > MAXTIME) { // exit condition 1: game went too long.
        log.warn("Game ended, timer: ", elapsedTime);
        scoreGame({
          posGuesses: posClickRef.current,
          soundGuesses: soundClickRef.current,
        });
        resetGame();
        return;
      }

      if (elapsedTime % 2 === 0) {
        if (engineRef.current.gameOver(elapsedTime)) { // exit condition 2: game is actually over.
          scoreGame({
            posGuesses: posClickRef.current,
            soundGuesses: soundClickRef.current,
          });
          resetGame();
          return;
        }
        try {
          const round = engineRef.current.nextRound(engineRef.current.getTurn(elapsedTime));
          setGrid(fillBoard());

          // fix for missing visual indicator when two turns have the same square.
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
    // engineRef.current.reset();

    return () => { // Cleanup on unmount
      resetGame();
    };
  }, []);

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
          <PlayButton soundGuess={() => soundGuess(elapsedTime)} posGuess={() => posGuess(elapsedTime)} dualMode={isDualMode} silentMode={isSilentMode} />
        </Animated.View>
        <StatusButton
          onPress={() => { resetGame(); startGame(true) }}
          isLoading={isLoading}
          playing={shouldStartGame}
          onTutorial={() => setShowTutorial(!showTutorial)}
        />
        <ProgressBar progress={dashRef.current.getProgress()} />
        <View style={styles.indexContainer}>
          {showMoveCounts && <Text style={[styles.label, { fontSize: 24 }]}>{t('play.turnsLeft')}: {engineRef.current.turnsLeft()}</Text>}
          {/* <Text style={{ color: '#ccc' }}>{defaultN} {JSON.stringify(playerRef.current)}</Text> */}
        </View>
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



