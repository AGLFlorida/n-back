import { Image } from 'react-native';

import type { StreakProps, Rank } from './types';
import styles from './styles';

export const streakRank = (t: number): Rank => {
  if (t >= 21) return 'gold';
  if (t >= 14) return 'silver';
  if (t >= 7) return 'bronze';

  return 'none'
}

const Streak = ({ streak }: StreakProps) => {
  if (streak >= 21) {
    return (<Image
      source={require('@/assets/images/achievements/streakGold.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else if (streak >= 14) {
    return (<Image
      source={require('@/assets/images/achievements/streakSilver.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else if (streak >= 7) {
    return (<Image
      source={require('@/assets/images/achievements/streakBronze.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else {
    return (<Image
      source={require('@/assets/images/achievements/streakEmpty.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  }
}

export default Streak;