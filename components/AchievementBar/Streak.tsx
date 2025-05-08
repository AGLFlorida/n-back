import { Image } from 'react-native';

import type { StreakProps, Rank } from './types';
import styles from './styles';

export const streakRank = (t: number): Rank => {
  if (t >= 21) return 'gold';
  if (t >= 14) return 'silver';
  if (t >= 1) return 'bronze';

  return 'none'
}

const Streak = ({ streak }: StreakProps) => {
  const rank = streakRank(streak);
  if (rank === 'gold') {
    return (<Image
      source={require('@/assets/images/achievements/streakGold.png')} // eslint-disable-line
      style={styles.img}
      resizeMode="contain"
    />);
  } else if (rank === 'silver') {
    return (<Image
      source={require('@/assets/images/achievements/streakSilver.png')} // eslint-disable-line
      style={styles.img}
      resizeMode="contain"
    />);
  } else if (rank === 'bronze') {
    return (<Image
      source={require('@/assets/images/achievements/streakBronze.png')} // eslint-disable-line
      style={styles.img}
      resizeMode="contain"
    />);
  }

  return (<Image
    source={require('@/assets/images/achievements/streakEmpty.png')} // eslint-disable-line
    style={styles.img}
    resizeMode="contain"
  />);

}

export default Streak;