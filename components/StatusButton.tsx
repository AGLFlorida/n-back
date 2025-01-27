import React from 'react';
import { View, Text } from 'react-native';

import { getGlobalStyles } from '@/styles/globalStyles';
import Button from './Button';

type Props = {
  loading?: boolean;
  timerRunning?: boolean;
  onPress?: () => void;
}

export default function PlayButton({ onPress, loading = false, timerRunning = false }: Props) {
  const styles = getGlobalStyles();
  const shouldShowButton: boolean = (!loading && !timerRunning);

  return (
    <View style={[styles.row, { marginTop: 40 }]}>
      {shouldShowButton &&
        <View style={[styles.cell, styles.clearBorder]}>
          <Button label=" Play Again " onPress={onPress} />
        </View>
      }{!shouldShowButton &&
        <View style={[styles.cell, styles.play]}>
          <Text style={styles.playLabel}>
            {(loading) ? "loading..." : "playing"}
          </Text>
        </View>
      }
    </View>
  );
}