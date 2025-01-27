import { StyleSheet, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/contexts/ThemeContext'


type Props = {};


export default function Square({ }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
    <Svg style={StyleSheet.absoluteFill} height="100%" width="100%">
      <Defs>
        <RadialGradient
          id="buttonGradient"
          cx="50%"
          cy="50%"
          rx="70%"
          ry="70%"
          fx="40%"
          fy="40%"
          gradientUnits="objectBoundingBox"
        >
          <Stop offset="20%" stopColor={theme.primaryColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={theme.secondaryColor} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        fill="url(#buttonGradient)"
        rx="25"
        ry="25"
      />
    </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
  },
});