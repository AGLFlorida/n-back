import { ScoreCard, SingleScoreType, ScoresType, ScoreBlock } from '@/util/ScoreCard';

describe('ScoreCard', () => {
  let scoreCard: ScoreCard;
  const testMode = 'SingleN';
  const sampleScore: SingleScoreType = {
    score: 100,
    errorRate: 0,
    n: 2
  };

  beforeEach(() => {
    scoreCard = new ScoreCard({});
  });

  describe('basic operations', () => {
    it('should initialize with empty scores', () => {
      expect(scoreCard.scores).toEqual({});
    });

    it('should set and get scores correctly', () => {
      const newScores: ScoresType = {
        '2024-Mar-15': {
          [testMode]: sampleScore
        }
      };
      scoreCard.scores = newScores;
      expect(scoreCard.scores).toEqual(newScores);
    });
  });

  describe('getValue and setValue', () => {
    it('should set and get value correctly', () => {
      scoreCard.setValue(testMode, sampleScore);
      expect(scoreCard.getValue(testMode)).toEqual(sampleScore);
    });
  });

  describe('getBlock and setBlock', () => {
    it('should get and set blocks correctly', () => {
      const block: ScoreBlock = { [testMode]: sampleScore };
      const dateKey = '2024-Mar-15';
      scoreCard.setBlock(dateKey, block);
      expect(scoreCard.getBlock(dateKey)).toEqual(block);
    });
  });

  describe('hasKey and deleteKey', () => {
    it('should check key existence correctly', () => {
      const dateKey = '2024-Mar-15';
      expect(scoreCard.hasKey(dateKey)).toBeFalsy();
      scoreCard.setBlock(dateKey, { [testMode]: sampleScore });
      expect(scoreCard.hasKey(dateKey)).toBeTruthy();
    });

    it('should delete key correctly', () => {
      const dateKey = '2024-Mar-15';
      scoreCard.setBlock(dateKey, { [testMode]: sampleScore });
      scoreCard.deleteKey(dateKey);
      expect(scoreCard.hasKey(dateKey)).toBeFalsy();
    });
  });
});