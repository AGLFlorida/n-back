import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeType } from '@/contexts/types';

const createStyles = (theme: ThemeType) => StyleSheet.create({
  hr: {
    borderBottomColor: theme.screenOptions.headerTintColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
    marginVertical: 8,
  },
});

export const Hr = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme)

return <View style={styles.hr} />
};

