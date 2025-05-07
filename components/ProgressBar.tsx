import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type ProgressBarProps = {
  progress: number; 
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    elevation: 5,
    height: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  fill: {
    borderRadius: 8,
    height: '100%',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
  }
});

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const { theme } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const prevProgress = useRef(0);
  const setPrevProgress = (t: number) => prevProgress.current = t;

  useEffect(() => {
    if (prevProgress.current == (2/3) && prevProgress.current > progress) {
      Animated.sequence([
        Animated.timing(animatedWidth, {
          toValue: 100, 
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedWidth, {
          toValue: 0, 
          duration: 0, 
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.timing(animatedWidth, {
        toValue: Math.min(100, Math.max(0, progress * 100)), 
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
    setPrevProgress(progress);
  }, [progress]);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: theme.accentColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: theme.screenOptions.tabBarActiveTintColor,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

export default ProgressBar;