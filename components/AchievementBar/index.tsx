import { useEffect } from 'react';
import { View, Text } from 'react-native';

import { useHistoryStore } from '@/store/useHistoryStore';
import { useAchievementStore } from '@/store/useAchievementStore';

import { useTranslation } from 'react-i18next';

import { Hr } from '../hr';

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
  const { single: singleLvl, dual: silentLvl, silent: dualLvl } = useAchievementStore();

  const level = highest(singleLvl, dualLvl, silentLvl);

  const { t } = useTranslation();

  useEffect(() => {
    const total: number = Object.keys(records).length || 0;
    setStreak(total); // TODO | ADDME -- this is not really a streak.
  }, [records]);

  return (
    <>
      <View style={styles.imgLayout}>
        <View style={styles.imgContainer}>
          <Medal level={singleLvl} />
          <Banner t={JSON.stringify(singleLvl)} rank={medalRank(level.value)} />
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
      <View style={styles.textLayout}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t("history.level")} ({t(level.label)})</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t("history.highestn")}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t("history.streak")}</Text>
        </View>
      </View>
      <Hr />
    </>
  );
};

type HighestType = {
  value: number,
  label: string
}
const highest = (single: number, dual: number, silent: number): HighestType => {
  if (single >= dual && single >= silent) return { label: 'history.single', value: single };
  if (dual >= silent) return { label: 'history.dual', value: dual };
  return { label: 'history.silent', value: silent };
}


export default AchievementBar;