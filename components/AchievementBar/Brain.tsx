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
  const rank = brainRank(n);
  if (rank === 'gold') {
    return (<Image
      source={require('@/assets/images/achievements/brainGold.png')}
      style={styles.img}
      resizeMode="contain"
    />);
  } else if (rank === 'silver') {
    return (<Image
      source={require('@/assets/images/achievements/brainSilver.png')}
      style={styles.img}
      resizeMode="contain"
    />);
  } else if (rank === 'bronze') {
    return (<Image
      source={require('@/assets/images/achievements/brainBronze.png')}
      style={styles.img}
      resizeMode="contain"
    />);
  }

  return (<Image
    source={require('@/assets/images/achievements/brainEmpty.png')}
    style={styles.img}
    resizeMode="contain"
  />);

}

export default Brain;