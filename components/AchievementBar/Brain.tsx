import { Image } from 'react-native';

import styles from './styles';

import type { BrainProps, Rank } from './types';

export const brainRank = (n: number): Rank => {
  if (n >= 4) return 'gold';
  if (n >= 3) return 'silver';
  if (n >= 2) return 'bronze';

  return 'none'
}

const Brain = ({ n }: BrainProps) => {
  if (n >= 4) {
    return (<Image
      source={require('@/assets/images/achievements/brainGold.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else if (n >= 3) {
    return (<Image
      source={require('@/assets/images/achievements/brainSilver.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else if (n >= 2) {
    return (<Image
      source={require('@/assets/images/achievements/brainBronze.png')}
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

export default Brain;