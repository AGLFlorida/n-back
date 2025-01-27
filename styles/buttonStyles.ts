import { StyleSheet, Platform, Pressable, Text } from 'react-native';

import { useTheme } from "@/contexts/ThemeContext";

export const getButtonStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    buttonContainer: {
      borderRadius: 14,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: theme.accentColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    buttonLabel: {
      color: theme.textColor,
      fontSize: 24,
      margin: 20,
    },
  });
}