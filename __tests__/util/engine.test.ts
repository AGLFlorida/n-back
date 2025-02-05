import engine, { calculateScore, fillBoard, scoreKey } from '@/util/engine';

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

  describe('scoreKey', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-03-15T12:00:00Z'); // Use ISO format with time
      const key = scoreKey(testDate);
      const expected = '2024-Mar-15';
      expect(key).toBe(expected);
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

}); 