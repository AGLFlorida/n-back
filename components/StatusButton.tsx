import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

import { getGlobalStyles } from '@/styles/globalStyles';
import Button from './Button';

type Props = {
  isLoading: boolean;
  playing: boolean;
  onPress?: () => void;
}

export default function PlayButton({ onPress, isLoading, playing }: Props) {
  const styles = getGlobalStyles();
  const [shouldShowButton, setShowButton] = useState<boolean>((!isLoading && !playing));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShowButton((!isLoading && !playing));

    return () => { };
  }, [isLoading, playing]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim])

  return (
    <View style={[styles.row, { marginTop: 40 }]}>
      {shouldShowButton &&
        <Animated.View style={[styles.cell, styles.clearBorder, { opacity: fadeAnim }]}>
          <Button label=" Play " onPress={onPress} />
        </Animated.View>
      }{!shouldShowButton &&
        <View style={[styles.cell, styles.play]}>
          <Text style={styles.playLabel}>
            {(isLoading) ? "loading..." : "playing"}
          </Text>
        </View>
      }
    </View>
  );
}