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
  if (level >= 15) {
    return (<Image
      source={require('@/assets/images/achievements/medalGold.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else if (level >= 10) {
    return (<Image
      source={require('@/assets/images/achievements/medalSilver.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else if (level >= 5) {
    return (<Image
      source={require('@/assets/images/achievements/medalBronze.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  } else {
    return (<Image
      source={require('@/assets/images/achievements/medalEmpty.png')}
      style={styles.img}
      resizeMode="contain"
    />)
  }
}

export default Medal;