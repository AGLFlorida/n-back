import { Toggle } from "./types";

// Light Palette
const PRIMARY_LIGHT = "#D5B8A7"; // #D5B8A7
const SECONDARY_LIGHT = "#7C4837"; // #7C4837
const BACKGROUND_LIGHT = "#BFB6A9" // #BFB6A9

const lightThumbColor: Toggle = (on: boolean) => {
  const c1: string = '#B56954'; // #B56954
  const c2: string = '#ECE7E3'; // #ECE7E3
  return on ? c1 : c2
}

const lightMode = {
  textColor: "#121212", // #121212
  backgroundColor: BACKGROUND_LIGHT, // #BFB6A9
  accentColor: "#F5F5F5", // #F5F5F5
  borderColor: "#A3A3A3", // #A3A3A3
  primaryColor: PRIMARY_LIGHT, // #D5B8A7
  secondaryColor: SECONDARY_LIGHT, // #7C4837
  toggle: {
    trackColor: { 
      false: '#888888', // #888888
      true: PRIMARY_LIGHT
    },
    thumbColor: lightThumbColor, // work around for type errors
  },
  screenOptions: {
    tabBarActiveTintColor: '#1565C0', // #1565C0
    headerStyle: {
      backgroundColor: BACKGROUND_LIGHT, 
    },
    headerShadowVisible: false,
    headerTintColor: '#2E2E2E', // #2E2E2E
    tabBarStyle: {
      backgroundColor: BACKGROUND_LIGHT,
    },
  }
}

export default lightMode;