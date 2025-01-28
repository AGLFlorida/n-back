import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

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

  useEffect(()=>{
    setShowButton((!isLoading && !playing));

    return () => {};
  }, [isLoading, playing]);

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