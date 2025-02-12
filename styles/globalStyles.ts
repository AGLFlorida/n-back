import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export const themeColors = {
  white: '#ffffff',
  red: '#ff0000',
}

export const useGlobalStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    button: {
      color: themeColors.white,
      fontSize: 20,
      textDecorationLine: 'underline',
    },
    cell: {
      borderColor: theme.borderColor,
      borderWidth: 1,
      padding: 1,
    },
    clearBorder: {
      borderWidth: 0,
    },
    container: {
      backgroundColor: theme.backgroundColor,
      flex: 1,
    },
    grid: {
      backgroundColor: theme.accentColor,
      width: "100%",
    },
    h1: {
      color: theme.textColor,
      fontSize: 24,
      fontWeight: 700,
      marginTop: 20
    },
    heading: {
      color: theme.textColor,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      textDecorationLine: 'underline'
    },
    label: {
      color: theme.textColor,
    },
    listItem: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      marginBottom: 12,
    },
    number: {
      color: theme.textColor,
      fontSize: 18,
      fontWeight: 'bold',
      lineHeight: 26,
      marginRight: 10,
    },
    numberInput: {
      borderColor: theme.borderColor,
      borderRadius: 5,
      borderWidth: 1,
      color: theme.textColor,
      height: 40,
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    placeHolder: {
      backgroundColor: theme.backgroundColor,
      height: 120,
      width: 120,
    },
    play: {
      alignItems: 'center',
      borderColor: theme.screenOptions.tabBarActiveTintColor,
      borderRadius: 14,
      overflow: 'hidden',
      padding: 4,
      width: '50%',
    },
    playLabel: {
      color: theme.screenOptions.tabBarActiveTintColor,
      fontSize: 24,
      margin: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
    },
    settingsCell: {
      borderColor: theme.borderColor,
      borderWidth: 0,
      justifyContent: 'center',
      padding: 3,
    },
    text: {
      color: theme.textColor,
      flex: 1,
      fontSize: 18,
      lineHeight: 26,
    }
  });
};
