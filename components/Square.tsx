import { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/contexts/ThemeContext'


type Props = {
  indicator?: number
};


export default function Square({ indicator }: Props) {
  const { theme } = useTheme();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
    {indicator !== undefined && <Text style={{textAlign: 'center', margin: 'auto', alignSelf: 'center', fontSize: 20, color: "#fff"}}>{indicator}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
  },
});