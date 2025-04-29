import { Image } from 'react-native';

import styles from "./styles";
import type { MedalProps, Rank } from "./types";

export const medalRank = (level: number): Rank => {
  if (level >= 15) return 'gold';
  if (level >= 10) return 'silver';
  if (level >= 5) return 'bronze';

  return 'none'
}

const Medal = ({ level }: MedalProps) => {
  const rank = medalRank(level);
  if (rank === 'gold') {
    return (<Image
      source={require('@/assets/images/achievements/medalGold.png')}
      style={styles.img}
      resizeMode="contain"
    />);
  } else if (rank === 'silver') {
    return (<Image
      source={require('@/assets/images/achievements/medalSilver.png')}
      style={styles.img}
      resizeMode="contain"
    />);
  } else if (rank === 'bronze') {
    return (<Image
      source={require('@/assets/images/achievements/medalBronze.png')}
      style={styles.img}
      resizeMode="contain"
    />);
  }

  return (<Image
    source={require('@/assets/images/achievements/medalEmpty.png')}
    style={styles.img}
    resizeMode="contain"
  />);

}

export default Medal;