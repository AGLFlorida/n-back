import engine, { calculateScore, fillBoard, playerWon, MAXN, defaults, getStartLevel, accuracyThresholds } from '@/util/engine';
import { whichGameMode, GameModeEnum } from '@/util/engine';
import { gameModeScore } from '@/util/engine';
import * as Haptics from 'expo-haptics';

const maxLevel = getStartLevel(MAXN) + 3;
const getCurrentN = (level: number) => Math.floor((level - 1) / 4) + 2;

describe('Engine Core Functions', () => {
  describe('fillBoard', () => {
    it('should create a 3x3 grid filled with false', () => {
      const board = fillBoard();
      expect(board.length).toBe(3);
      expect(board[0].length).toBe(3);
      expect(board.flat().every(cell => cell === false)).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should calculate accuracy correctly', () => {
      const testCase = {
        answers: [true, false, true, true],
        guesses: [true, false, true, false]
      };
      const result = calculateScore(testCase);
      expect(result.accuracy).toBe(67); // 2 correct out of 3 possible matches
    });

    it('should calculate error rate correctly', () => {
      const testCase = {
        answers: [true, false, true, true],
        guesses: [true, true, false, false]
      };
      const result = calculateScore(testCase);
      expect(result.errorRate).toBe(33); // 1 incorrect guess out of 3 possible matches
    });
  });

  describe('game engine', () => {
    const testEngine = engine({
      n: 2,
      gameLen: 10,
      matchRate: 0.3
    });

    it('should create a new game without errors', () => {
      expect(() => testEngine.createNewGame()).not.toThrow();
    });

    it('should generate valid next rounds', () => {
      testEngine.createNewGame();
      const round = testEngine.nextRound(0);

      expect(round).toHaveProperty('next');
      expect(round).toHaveProperty('triggerVibration');

      // Check grid structure
      expect(round.next.length).toBe(3);
      expect(round.next[0].length).toBe(3);

      // Check that exactly one cell is true
      const trueCount = round.next.flat().filter(cell => cell === true).length;
      expect(trueCount).toBe(1);
    });
  });

  describe('game engine e2e', () => {
    const testEngine = engine({
      n: 2,
      gameLen: 30,
      matchRate: 1
    });

    it('should score a perfect dual game correctly', () => {
      testEngine.createNewGame();
      const answers = testEngine.answers();

      const posGuesses: boolean[] = [
        false, false, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
      ];

      const soundGuesses: boolean[] = [
        false, false, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
      ];

      const buzzGuesses = undefined;

      const { accuracy: posScore } = calculateScore({ answers: answers?.pos as boolean[], guesses: posGuesses as boolean[] });

      let soundScore: number = 0;
      if (soundGuesses)
        ({ accuracy: soundScore } = calculateScore({ answers: answers?.sounds as boolean[], guesses: soundGuesses as boolean[] }));


      let buzzScore: number = 0;
      if (buzzGuesses)
        ({ accuracy: buzzScore } = calculateScore({ answers: answers?.buzz as boolean[], guesses: buzzGuesses as boolean[] }));

      expect(posScore).toBe(100);
      expect(soundScore).toBe(100);
      expect(buzzScore).toBe(0);
    });

    it('should score a perfect silent game correctly', () => {
      testEngine.createNewGame();
      const answers = testEngine.answers();

      const posGuesses: boolean[] = [
        false, false, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
      ];

      const buzzGuesses: boolean[] = [
        false, false, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
      ];

      const soundGuesses = undefined;

      const { accuracy: posScore } = calculateScore({ answers: answers?.pos as boolean[], guesses: posGuesses as boolean[] });

      let soundScore: number = 0;
      if (soundGuesses)
        ({ accuracy: soundScore } = calculateScore({ answers: answers?.sounds as boolean[], guesses: soundGuesses as boolean[] }));


      let buzzScore: number = 0;
      if (buzzGuesses)
        ({ accuracy: buzzScore } = calculateScore({ answers: answers?.buzz as boolean[], guesses: buzzGuesses as boolean[] }));

      expect(posScore).toBe(100);
      expect(soundScore).toBe(0);
      expect(buzzScore).toBe(100);
    });

    it('should score a perfect silent game correctly', () => {
      testEngine.createNewGame();
      const answers = testEngine.answers();

      const posGuesses: boolean[] = [
        false, false, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
      ];

      const buzzGuesses = undefined;

      const soundGuesses = undefined;

      const { accuracy: posScore } = calculateScore({ answers: answers?.pos as boolean[], guesses: posGuesses as boolean[] });

      let soundScore: number = 0;
      if (soundGuesses)
        ({ accuracy: soundScore } = calculateScore({ answers: answers?.sounds as boolean[], guesses: soundGuesses as boolean[] }));


      let buzzScore: number = 0;
      if (buzzGuesses)
        ({ accuracy: buzzScore } = calculateScore({ answers: answers?.buzz as boolean[], guesses: buzzGuesses as boolean[] }));

      expect(posScore).toBe(100);
      expect(soundScore).toBe(0);
      expect(buzzScore).toBe(0);
    });
  });

  describe('pattern matching', () => {
    const testEngine = engine({
      n: 2,
      gameLen: 5,
      matchRate: 1  // Force matches to occur
    });

    it('should correctly identify n-back matches', () => {
      testEngine.createNewGame();
      const answers = testEngine.answers();

      // First two positions can't be matches (n=2)
      expect(answers.pos[0]).toBe(false);
      expect(answers.pos[1]).toBe(false);

      // From position 2 onwards, matches should be possible
      expect(answers.pos.slice(2).some(x => x === true)).toBe(true);
    });

    it('should score perfect gameplay correctly', () => {
      const mockAnswers = [false, false, true, true, false];
      const mockGuesses = [false, false, true, true, false];

      const { accuracy } = calculateScore({
        answers: mockAnswers,
        guesses: mockGuesses
      });

      expect(accuracy).toBe(100);
    });

    it('should handle missed matches correctly', () => {
      const mockAnswers = [false, false, true, true, false];
      const mockGuesses = [false, false, false, true, false]; // Missed one match

      const { accuracy } = calculateScore({
        answers: mockAnswers,
        guesses: mockGuesses
      });

      expect(accuracy).toBe(50); // Only got 1 out of 2 matches
    });
  });

  describe('whichGameMode', () => {
    test.each([
      [false, false, GameModeEnum.SingleN],
      [true, false, GameModeEnum.DualN],
      [true, true, GameModeEnum.SilentDualN],
      [false, true, GameModeEnum.SingleN],  // Silent without dual defaults to single
    ])('isDual=%s, isSilent=%s should return %s', (isDual, isSilent, expected) => {
      expect(whichGameMode(isDual, isSilent)).toBe(expected);
    });
  });

  describe('gameModeScore', () => {
    it('should format single mode scores correctly', () => {
      const posResult = { accuracy: 90, errorRate: 10 };
      const score = gameModeScore(2, posResult);
      
      expect(score).toEqual({
        n: 2,
        score: 90,
        errorRate: 10,
        score2: undefined,
        errotRate2: undefined
      });
    });

    it('should format dual mode scores correctly', () => {
      const posResult = { accuracy: 90, errorRate: 10 };
      const soundResult = { accuracy: 85, errorRate: 15 };
      const score = gameModeScore(2, posResult, soundResult);
      
      expect(score).toEqual({
        n: 2,
        score: 90,
        errorRate: 10,
        score2: 85,
        errotRate2: 15
      });
    });

    it('should format silent mode scores correctly', () => {
      const posResult = { accuracy: 90, errorRate: 10 };
      const buzzResult = { accuracy: 80, errorRate: 20 };
      const score = gameModeScore(2, posResult, undefined, buzzResult);
      
      expect(score).toEqual({
        n: 2,
        score: 90,
        errorRate: 10,
        score2: 80,
        errotRate2: 20
      });
    });
  });

  describe('accuracyThresholds', () => {
    it('should align with playerWon logic', () => {
      const posResult = { accuracy: 75, errorRate: 30 };
      // N=3 should require 75% accuracy
      expect(playerWon(posResult, 4)).toBe(true);
      // N=4 should require 70% accuracy
      expect(playerWon(posResult, 3)).toBe(false);
    });
  });

  describe('triggerVibration', () => {
    it('should trigger vibration when override is true', () => {
      const testEngine = engine({
        n: 2,
        gameLen: 5,
        matchRate: 0.3
      });
      
      testEngine.createNewGame();
      const round = testEngine.nextRound(0);
      
      // Mock Haptics
      const mockHaptics = jest.spyOn(Haptics, 'notificationAsync');
      
      round.triggerVibration(true);
      expect(mockHaptics).toHaveBeenCalled();
      
      mockHaptics.mockRestore();
    });
  });
});

describe('level progression', () => {
  describe('single N mode', () => {
    let tests = [];
    for (let level = 1; level <= maxLevel; level++) {
      tests.push([level]);
    }

    test.each(tests)('should be able to progress from level %i to next level', (level) => {
      const currentN = getCurrentN(level);
      const requiredAccuracy = accuracyThresholds[currentN - 2];  // Match the index logic in playerWon

      // Simulate perfect game (100% accuracy)
      const result = {
        accuracy: 100,
        errorRate: 0
      };

      // Verify player can win at this level
      expect(playerWon(result, currentN)).toBe(true);

      // Verify player fails with high error rate
      const failResult = {
        accuracy: 100,
        errorRate: 41  // Just over maxErrorRate of 40
      };
      expect(playerWon(failResult, currentN)).toBe(false);

      // Verify player fails with low accuracy
      const failResult2 = {
        accuracy: requiredAccuracy - 1,  // Just under required accuracy
        errorRate: 0
      };
      expect(playerWon(failResult2, currentN)).toBe(false);
    });
  });

  describe('dual N mode', () => {
    let tests = [];
    for (let level = 1; level <= maxLevel; level++) {
      tests.push([level]);
    }

    test.each(tests)('sound and position should be able to progress from level %i to next level', (level) => {
      const { gameLen, matchRate } = defaults(level);
      const currentN = getCurrentN(level);

      const testEngine = engine({
        n: currentN,
        gameLen,
        matchRate,
        isDualMode: true
      });

      testEngine.createNewGame();

      const posResult = {
        accuracy: 100,
        errorRate: 0
      };

      const soundResult = {
        accuracy: 100,
        errorRate: 0
      };

      // Verify player can win with good scores on both
      expect(playerWon(posResult, currentN, soundResult)).toBe(true);

      // Verify player fails if either score is bad
      const badResult = {
        accuracy: 100,
        errorRate: 41
      };

      expect(playerWon(posResult, currentN, badResult)).toBe(false);
      expect(playerWon(badResult, currentN, soundResult)).toBe(false);
    });
  });

  describe('level down mechanics', () => {
    it('should allow downleveling in single N mode when performing poorly', () => {
      const startingLevel = 5;
      const currentN = getCurrentN(startingLevel);
      const requiredAccuracy = accuracyThresholds[currentN - 2];

      const poorResult = {
        accuracy: requiredAccuracy - 1,  // Just under required accuracy
        errorRate: 30
      };

      // Should fail at current level
      expect(playerWon(poorResult, currentN)).toBe(false);

      // Should pass at previous N-back level
      expect(playerWon(poorResult, currentN - 1)).toBe(true);
    });

    it('should allow downleveling in dual N mode when performing poorly on either task', () => {
      const startingLevel = 5;
      const currentN = getCurrentN(startingLevel);
      const requiredAccuracy = accuracyThresholds[currentN - 2];

      const goodResult = {
        accuracy: 100,
        errorRate: 0
      };

      const poorResult = {
        accuracy: requiredAccuracy - 1,
        errorRate: 30
      };

      // Should fail at current N
      expect(playerWon(poorResult, currentN, goodResult)).toBe(false);
      expect(playerWon(goodResult, currentN, poorResult)).toBe(false);

      // Should pass at previous N
      expect(playerWon(poorResult, currentN - 1, goodResult)).toBe(true);
      expect(playerWon(goodResult, currentN - 1, poorResult)).toBe(true);
    });

    it('should not allow downleveling below level 1', () => {
      const startingLevel = 1;
      const { gameLen, matchRate } = defaults(startingLevel);

      const testEngine = engine({
        n: 2,
        gameLen,
        matchRate
      });

      testEngine.createNewGame();

      const poorResult = {
        accuracy: 0,
        errorRate: 12 * 2
      };

      // Should fail at level 1
      expect(playerWon(poorResult, startingLevel)).toBe(false);

      // Attempting to check level 0 should be same as level 1
      expect(playerWon(poorResult, 0)).toBe(false);
      expect(playerWon(poorResult, -1)).toBe(false);
    });
  });

  describe('getStartLevel', () => {
    test.each([
      [2, 1],
      [3, 5],
      [4, 9],
      [5, 13],
    ])('N=%i should start at level %i', (n, expectedLevel) => {
      expect(getStartLevel(n)).toBe(expectedLevel);
    });
  });
}); 