import { useEffect } from 'react';
import { View } from 'react-native';

import { useHistoryStore } from '@/store/useHistoryStore';
import { useAchievementStore } from '@/store/useAchievementStore';

// TODO | FIXME -- bar grows to 100% even on a failed game. (only tested at 2 wins, 1 loss.)

import Streak, { streakRank } from './Streak';
import Medal, { medalRank } from './Medal';
import Brain, { brainRank } from './Brain';
import Banner from './Banner';

import styles from './styles';
import { ScoreCard } from '@/util/engine/ScoreCard';

const AchievementBar = () => {
  const records = useHistoryStore(state => state.records) as Record<string, ScoreCard>;
  const { streak, setStreak } = useAchievementStore();
  const N = useAchievementStore(state => state.N);
  const { singleLvl, silentLvl, dualLvl } = useAchievementStore();

  useEffect(() => {
    const total: number = Object.keys(records).length || 0;
    setStreak(total); // TODO | ADDME -- this is not really a streak.
  }, [records]);

  return (
    <View style={styles.imgLayout}>
      <View style={styles.imgContainer}>
        <Medal level={singleLvl} />
        <Banner t={JSON.stringify(singleLvl)} rank={medalRank(singleLvl)} />
      </View>
      <View style={styles.imgContainer}>
        <Brain n={N} />
        <Banner t={JSON.stringify(N)} rank={brainRank(N)} />
      </View>
      <View style={styles.imgContainer}>
        <Streak streak={streak} />
        <Banner t={JSON.stringify(streak)} rank={streakRank(streak)} />
      </View>
    </View>
  );
};


export default AchievementBar;