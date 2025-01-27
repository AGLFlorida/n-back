// Dark Palette
const PRIMARY_DARK = "#081C26"; // #081C26
const SECONDARY_DARK = "#1E4F63"; // #1E4F63
const BACKGROUND_DARK = "#25292e"; // #25292e

const darkMode = {
  textColor: "#EAEAEA", // #EAEAEA
  backgroundColor: BACKGROUND_DARK,
  accentColor: "#1A1A1A", // #1A1A1A
  borderColor: "#1A1A1A",
  primaryColor: PRIMARY_DARK, // #081C26
  secondaryColor: SECONDARY_DARK, // #4A92AE",
  toggle: {
    trackColor: { 
      false: '#9B9B9B', // #9B9B9B
      true: PRIMARY_DARK
    },
    thumbColor: (on: boolean) => on ? SECONDARY_DARK : '#E7E6E5', // #E7E6E5
  },
  screenOptions: {
    tabBarActiveTintColor: '#ffd33d', // #ffd33d
    headerStyle: {
      backgroundColor: BACKGROUND_DARK,
    },
    headerShadowVisible: false,
    headerTintColor: '#dddddd', // #dddddd
    tabBarStyle: {
      backgroundColor: BACKGROUND_DARK,
    },
  }
}

export default darkMode;
