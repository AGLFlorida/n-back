import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useGlobalStyles, height } from '@/styles/globalStyles';
import Button from './Button';

type Props = {
  isLoading: boolean;
  playing: boolean;
  onPress?: () => void;
  onTutorial?: () => void;
}

export default function PlayButton({ onPress, isLoading, playing, onTutorial = () => { } }: Props) {
  const styles = useGlobalStyles();
  const [shouldShowButton, setShowButton] = useState<boolean>((!isLoading && !playing));
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  const padding = Math.floor(40 * Math.pow(height / 1000, 8));
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
    <View style={[styles.row, { marginTop: padding }]}>
      {shouldShowButton &&
        <>
          <Animated.View style={[styles.cell, styles.clearBorder, { opacity: fadeAnim }]}>
            <Button label={t('buttons.play')} onPress={onPress} />
          </Animated.View>
          <Animated.View style={[styles.cell, styles.clearBorder, { opacity: fadeAnim }]}>
            <Button label={t('buttons.tutorial')} onPress={onTutorial} />
          </Animated.View>
        </>
      }{!shouldShowButton &&
        <View style={[styles.cell, styles.play, {borderWidth: 0}]}>
          <Text style={styles.playLabel}>
            {/* {(isLoading) ? "loading..." : "playing"} */}
          </Text>
        </View>
      }
    </View>
  );
}