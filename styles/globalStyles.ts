import { StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";


export const getGlobalStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    grid: {
      width: "100%",
      backgroundColor: theme.accentColor,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
    },
    cell: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      padding: 1,
    },
    placeHolder: {
      width: 120,
      height: 120,
      backgroundColor: theme.backgroundColor,
    },
    clearBorder: {
      borderWidth: 0,
    },
    numberInput: {
      height: 40,
      borderColor: theme.borderColor,
      borderWidth: 1,
      paddingHorizontal: 20,
      marginVertical: 10,
      borderRadius: 5,
      color: theme.textColor,
    },
    label: {
      color: theme.textColor,
    },
    play: {
      padding: 4,
      borderColor: theme.screenOptions.tabBarActiveTintColor,
    },
    playLabel: {
      color: theme.screenOptions.tabBarActiveTintColor,
    },
    settingsCell: {
      padding: 3, 
      justifyContent: 'center', 
      borderWidth: 0,
      borderColor: theme.borderColor,
    },
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: '#fff',
    },
  });
};
