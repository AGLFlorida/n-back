import { useState, useEffect } from 'react';
import { View } from 'react-native';

import { useHistoryStore } from '@/store/useHistoryStore';
import { useAchievementStore } from '@/store/useAchievementStore';

import { getStartLevel } from '@/util/engine';

// TODO | FIXME -- bar grows to 100% even on a failed game. (only tested at 2 wins, 1 loss.)

import Streak, { streakRank } from './Streak';
import Medal, { medalRank } from './Medal';
import Brain, { brainRank } from './Brain';
import Banner from './Banner';

import styles from './styles';
import { ScoreCard } from '@/util/ScoreCard';

const AchievementBar = () => {
  const records = useHistoryStore(state => state.records) as Record<string, ScoreCard>;
  const { streak, setStreak } = useAchievementStore();
  const { N } = useAchievementStore();
  const { level } = useAchievementStore();

  useEffect(() => {
    const total: number = Object.keys(records).length || 0;
    setStreak(total);
    // console.log(total);
  }, [records]);

  return (
    <View style={styles.imgLayout}>
      <View style={styles.imgContainer}>
        <Medal level={level} />
        <Banner t={JSON.stringify(level)} rank={medalRank(level)} />
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