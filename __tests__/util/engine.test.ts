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
      const testDate = new Date('2024-03-15');
      const key = scoreKey(testDate);
      expect(key).toBe('2024-Mar-15');
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
}); 