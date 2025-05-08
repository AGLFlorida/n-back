export type Rank = 'gold' | 'silver' | 'bronze' | 'none';

export type StreakProps = {
  streak: number;
};

export type BrainProps = {
  n: number;
};

export type MedalProps = {
  level: number;
};

export type BannerProps = {
  t: string;
  rank: Rank;
};

