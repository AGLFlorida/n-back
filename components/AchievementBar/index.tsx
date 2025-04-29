import { useState, useEffect } from 'react';
import { View } from 'react-native';

import { useHistoryStore } from '@/store/useHistoryStore';

import { getStartLevel } from '@/util/engine';

import Streak, { streakRank } from './Streak';
import Medal, { medalRank } from './Medal';
import Brain, { brainRank } from './Brain';
import Banner from './Banner';

import styles from './styles';
import { ScoreCard } from '@/util/ScoreCard';

const AchievementBar = () => {
  const records = useHistoryStore(state => state.records) as Record<string, ScoreCard>;
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [N, setN] = useState(2);

  useEffect(() => {
    const total: number = Object.keys(records).length || 0;
    setStreak(total);
  }, [records]);

  // useEffect(() => {
  //   const l = getStartLevel(N)
  //   setLevel(level)
  // }, [level, N]);

  useEffect(() => {
    setN(N);
    const l = getStartLevel(N);
    setLevel(l);
  }, [N]);

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