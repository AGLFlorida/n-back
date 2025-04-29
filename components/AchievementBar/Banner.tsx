import { Text } from "react-native";

import type { BannerProps } from "./types";
import styles from "./styles";

const Banner = ({ t, rank }: BannerProps) => {
  let localStyle = styles.floatingText;
  
  if (rank === 'gold') {
    localStyle = {
      ...localStyle,
      ...styles.gold
    }
    return <Text style={localStyle}>{t}</Text>;
  }

  if (rank === 'silver') {
    localStyle = {
      ...localStyle,
      ...styles.silver
    }
    return <Text style={localStyle}>{t}</Text>;
  }

  if (rank === 'bronze') {
    localStyle = {
      ...localStyle,
      ...styles.bronze
    }
    return <Text style={localStyle}>{t}</Text>;
  }

  return <></>;
}


export default Banner;