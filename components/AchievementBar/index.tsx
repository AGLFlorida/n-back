import { View, Text } from 'react-native';

import { useAchievementStore } from '@/store/useAchievementStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useTheme } from '@/contexts/ThemeContext';

import { useTranslation } from 'react-i18next';

import { Hr } from "@/components/Hr";

import Streak, { streakRank } from './Streak';
import Medal, { medalRank } from './Medal';
import Brain, { brainRank } from './Brain';
import Banner from './Banner';

import styles, { createStyles } from './styles';

const AchievementBar = () => {
  const { streak } = useAchievementStore();
  const N = useAchievementStore(state => state.N);
  const { single: singleLvl, dual: silentLvl, silent: dualLvl } = useAchievementStore();

  const { hasRecords } = useHistoryStore();
  const hideN = !!!hasRecords();


  const level = highest(singleLvl, dualLvl, silentLvl);

  const { t } = useTranslation();

  const { theme } = useTheme();
  const dynamicStyles = createStyles(theme)

  return (
    <>
      <View style={styles.imgLayout}>
        <View style={styles.imgContainer}>
          <Medal level={singleLvl} />
          <Banner t={JSON.stringify(singleLvl)} rank={medalRank(level.value)} />
        </View>
        <View style={styles.imgContainer}>
          <Brain n={(hideN) ? 0 : N} />
          <Banner t={JSON.stringify(N)} rank={(hideN) ? 'none' : brainRank(N)} />
        </View>
        <View style={styles.imgContainer}>
          <Streak streak={streak} />
          <Banner t={JSON.stringify(streak)} rank={streakRank(streak)} />
        </View>
      </View>
      <View style={dynamicStyles.textLayout}>
        <View style={dynamicStyles.textContainer}>
          <Text style={dynamicStyles.text}>{t("history.level")} ({t(level.label)})</Text>
        </View>
        <View style={dynamicStyles.textContainer}>
          <Text style={dynamicStyles.text}>{t("history.highestn")}</Text>
        </View>
        <View style={dynamicStyles.textContainer}>
          <Text style={dynamicStyles.text}>{t("history.streak")}</Text>
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