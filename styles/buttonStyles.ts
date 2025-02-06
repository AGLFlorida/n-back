import { StyleSheet, Platform } from 'react-native';

import { useTheme } from "@/contexts/ThemeContext";

export const useButtonStyles = () => {
  const { theme } = useTheme();

  const shadowStyle = Platform.select({
    web: {
      boxShadow: `0px 4px 4px ${theme.accentColor}33`  // 33 is 20% opacity in hex
    },
    ios: {
      shadowColor: theme.accentColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  });

  return StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      borderRadius: 14,
      justifyContent: 'center',
      overflow: 'hidden',
      ...shadowStyle,
    },
    buttonLabel: {
      color: theme.textColor,
      fontSize: 24,
      margin: 20,
    },
  });
}