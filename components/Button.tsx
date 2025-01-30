import { useState } from 'react';
import { StyleSheet, Pressable, Text, Animated } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { getButtonStyles } from '@/styles/buttonStyles';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  label: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function Button({ label, onPress, onLongPress }: Props) {
  const styles = getButtonStyles();
  const { theme } = useTheme();

  const [scaleAnim] = useState(new Animated.Value(1)); // For scaling effect
  const [opacityAnim] = useState(new Animated.Value(1)); // For opacity effect

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.6, 
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1, 
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, 
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
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
            rx="14"
            ry="14"
          />
        </Svg>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.buttonLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}
