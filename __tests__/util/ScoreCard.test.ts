import { ScoreCard, SingleScoreType } from '@/util/ScoreCard';

describe('ScoreCard', () => {
  let scoreCard: ScoreCard;
  const sampleScore: SingleScoreType = [100, 200, 300];

  beforeEach(() => {
    scoreCard = new ScoreCard({});
  });

  describe('basic operations', () => {
    it('should initialize with empty scores', () => {
      expect(scoreCard.scores).toEqual({});
    });

    it('should set and get scores correctly', () => {
      const newScores = { '2024-Mar-15': sampleScore };
      scoreCard.scores = newScores;
      expect(scoreCard.scores).toEqual(newScores);
    });
  });

  describe('getValue and setValue', () => {
    const testKey = '2024-Mar-15';

    it('should return undefined for non-existent key', () => {
      expect(scoreCard.getValue(testKey)).toBeUndefined();
    });

    it('should set and get value correctly', () => {
      scoreCard.setValue(testKey, sampleScore);
      expect(scoreCard.getValue(testKey)).toEqual(sampleScore);
    });
  });

  describe('hasKey and deleteKey', () => {
    const testKey = '2024-Mar-15';

    it('should check key existence correctly', () => {
      expect(scoreCard.hasKey(testKey)).toBeFalsy();
      scoreCard.setValue(testKey, sampleScore);
      expect(scoreCard.hasKey(testKey)).toBeTruthy();
    });

    it('should delete key correctly', () => {
      scoreCard.setValue(testKey, sampleScore);
      scoreCard.deleteKey(testKey);
      expect(scoreCard.hasKey(testKey)).toBeFalsy();
    });
  });

  describe('compareCards', () => {
    it('should return true for identical cards', () => {
      const card1: SingleScoreType = [100, 200, 300];
      const card2: SingleScoreType = [100, 200, 300];
      expect(scoreCard.compareCards(card1, card2)).toBeTruthy();
    });

    it('should return false for different cards', () => {
      const card1: SingleScoreType = [100, 200, 300];
      const card2: SingleScoreType = [100, 200, 301];
      expect(scoreCard.compareCards(card1, card2)).toBeFalsy();
    });

    it('should handle arrays of different lengths', () => {
      const card1: SingleScoreType = [100, 200, 300];
      const card2: SingleScoreType = [100, 200, 0];
      expect(scoreCard.compareCards(card1, card2)).toBeFalsy();
    });
  });
}); 