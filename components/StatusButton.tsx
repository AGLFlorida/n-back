import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { getGlobalStyles } from '@/styles/globalStyles';
import Button from './Button';

type Props = {
  isLoading?: boolean;
  timerRunning?: boolean;
  onPress?: () => void;
}

export default function PlayButton({ onPress, isLoading = false, timerRunning = false }: Props) {
  const styles = getGlobalStyles();
  const [shouldShowButton, setShowButton] = useState<boolean>((!isLoading && !timerRunning));

  useEffect(()=>{
    setShowButton((!isLoading && !timerRunning));

    return () => {};
  }, [isLoading, timerRunning]);

  return (
    <View style={[styles.row, { marginTop: 40 }]}>
      {shouldShowButton &&
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Play Again " onPress={onPress} />
        </View>
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