import { StyleSheet, Platform } from 'react-native';

import { useTheme } from "@/contexts/ThemeContext";

export const useButtonStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      borderRadius: 14,
      justifyContent: 'center',
      overflow: 'hidden',
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