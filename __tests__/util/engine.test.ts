import engine, { calculateScore, fillBoard, playerWon, GameModeEnum, MAXN, MAX_ERROR_RATE, defaults } from '@/util/engine';

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
      expect(round).toHaveProperty('playSound');
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
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true
      ];

      const soundGuesses: boolean[] = [
        false, false, true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true
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
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true
      ];

      const buzzGuesses: boolean[] = [
        false, false, true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true
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
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true,
        true,  true,  true, true, true
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

});

describe('level progression', () => {
  describe('single N mode', () => {
    it('should be able to progress from level 1 to max level', () => {
      // Calculate max level (4 difficulty steps per N value)
      const maxLevel = (MAXN - 2) * 4 + 4; // Starting from N=2 to MAXN
      
      for (let level = 1; level <= maxLevel; level++) {
        const { gameLen, matchRate } = defaults(level);
        const currentN = Math.floor((level - 1) / 4) + 2; // Calculate N for current level
        
        const testEngine = engine({
          n: currentN,
          gameLen,
          matchRate
        });
        
        testEngine.createNewGame();
        const answers = testEngine.answers();
        
        // Simulate perfect game (100% accuracy)
        const result = {
          accuracy: 100,
          errorRate: 0
        };
        
        // Verify player can win at this level
        expect(playerWon(result, level)).toBe(true);
        
        // Verify player fails with high error rate
        const failResult = {
          accuracy: 100,
          errorRate: MAX_ERROR_RATE + 1
        };
        expect(playerWon(failResult, level)).toBe(false);
      }
    });
  });

  describe('dual N mode', () => {
    it('should be able to progress from level 1 to max level with both position and sound', () => {
      const maxLevel = (MAXN - 2) * 4 + 4;
      
      for (let level = 1; level <= maxLevel; level++) {
        const { gameLen, matchRate } = defaults(level);
        const currentN = Math.floor((level - 1) / 4) + 2;
        
        const testEngine = engine({
          n: currentN,
          gameLen,
          matchRate,
          isDualMode: true
        });
        
        testEngine.createNewGame();
        
        // Simulate perfect scores for both position and sound
        const posResult = {
          accuracy: 100,
          errorRate: 0
        };
        
        const soundResult = {
          accuracy: 100,
          errorRate: 0
        };
        
        // Verify player can win with good scores on both
        expect(playerWon(posResult, level, soundResult)).toBe(true);
        
        // Verify player fails if either score is bad
        const badResult = {
          accuracy: 100,
          errorRate: MAX_ERROR_RATE + 1
        };
        
        expect(playerWon(posResult, level, badResult)).toBe(false);
        expect(playerWon(badResult, level, soundResult)).toBe(false);
      }
    });
  });

  describe('level down mechanics', () => {
    it('should allow downleveling in single N mode when performing poorly', () => {
      const startingLevel = 5;
      const { gameLen, matchRate } = defaults(startingLevel);
      const currentN = Math.floor((startingLevel - 1) / 4) + 2;
      
      const testEngine = engine({
        n: currentN,
        gameLen,
        matchRate
      });
      
      testEngine.createNewGame();
      
      // Simulate poor performance
      const poorResult = {
        accuracy: 65,  // Increase from 50
        errorRate: 30  // Decrease from MAX_ERROR_RATE + 5
      };
      
      // Should fail at current level
      expect(playerWon(poorResult, startingLevel)).toBe(false);
      
      // Should be able to win at lower level with same performance
      expect(playerWon(poorResult, startingLevel - 1)).toBe(true);
    });

    it('should allow downleveling in dual N mode when performing poorly on either task', () => {
      const startingLevel = 5;
      const { gameLen, matchRate } = defaults(startingLevel);
      const currentN = Math.floor((startingLevel - 1) / 4) + 2;
      
      const testEngine = engine({
        n: currentN,
        gameLen,
        matchRate,
        isDualMode: true
      });
      
      testEngine.createNewGame();
      
      const goodResult = {
        accuracy: 100,
        errorRate: 0
      };
      
      const poorResult = {
        accuracy: 65,  // Increase from 50
        errorRate: 30  // Decrease from MAX_ERROR_RATE + 5
      };
      
      // Should fail at current level with poor position performance
      expect(playerWon(poorResult, startingLevel, goodResult)).toBe(false);
      
      // Should fail at current level with poor sound performance
      expect(playerWon(goodResult, startingLevel, poorResult)).toBe(false);
      
      // Should be able to win at lower level with same poor performance
      expect(playerWon(poorResult, startingLevel - 1, goodResult)).toBe(true);
      expect(playerWon(goodResult, startingLevel - 1, poorResult)).toBe(true);
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
        errorRate: MAX_ERROR_RATE * 2
      };
      
      // Should fail at level 1
      expect(playerWon(poorResult, startingLevel)).toBe(false);
      
      // Attempting to check level 0 should be same as level 1
      expect(playerWon(poorResult, 0)).toBe(false);
      expect(playerWon(poorResult, -1)).toBe(false);
    });
  });
}); 