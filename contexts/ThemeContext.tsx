import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

import security from "@/util/security";

const PRIMARY_DARK = "#102632"; // #102632
const SECONDARY_DARK = "#39728B"; // #39728B

const PRIMARY_LIGHT = "#E0C3B5"; // #E0C3B5
const SECONDARY_LIGHT = "#8A5745"; // #8A5745

export type ThemeContextType = {
  theme: typeof lightMode; 
  themeMode: "light" | "dark"; 
  toggleTheme: (arg0: boolean) => void;
};

type Toggle = (arg0: boolean) => string;
const lightThumbColor: Toggle = (on: boolean) => {
  const c1: string = '#A45D4E';
  const c2: string = '#f4f3f4';
  return on ? c1 : c2
}

const lightMode = {
  textColor: "#000",
  backgroundColor: "#dad6d1",
  accentColor: "#fff",
  borderColor: "#bbb",
  primaryColor: PRIMARY_LIGHT, // #E0C3B5
  secondaryColor: SECONDARY_LIGHT, // #8A5745
  toggle: {
    trackColor: { 
      false: '#707070', 
      true: PRIMARY_LIGHT
    },
    thumbColor: lightThumbColor, // work around for type errors
  },
  screenOptions: {
    tabBarActiveTintColor: '#002cc2',
    headerStyle: {
      backgroundColor: '#dad6d1',
    },
    headerShadowVisible: false,
    headerTintColor: '#222',
    tabBarStyle: {
      backgroundColor: '#dad6d1',
    },
  }
}

const darkMode = {
  textColor: "#fff",
  backgroundColor: "#25292e",
  accentColor: "#000",
  borderColor: "#000",
  primaryColor: PRIMARY_DARK, // #1f3c4a
  secondaryColor: SECONDARY_DARK, // #244759",
  toggle: {
    trackColor: { 
      false: '#767577', 
      true: PRIMARY_DARK
    },
    thumbColor: (on: boolean) => on ? SECONDARY_DARK : '#f4f3f4',
  },
  screenOptions: {
    tabBarActiveTintColor: '#ffd33d',
    headerStyle: {
      backgroundColor: '#25292e',
    },
    headerShadowVisible: false,
    headerTintColor: '#ddd',
    tabBarStyle: {
      backgroundColor: '#25292e',
    },
  }
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightMode, 
  themeMode: "light",
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(lightMode);
  const systemTheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState<"light" | "dark">(systemTheme || "light");

  const toggleTheme = (dark: boolean) => {
    setThemeMode((dark) ? "dark" : "light"); // trigger a re-render
  }

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await security.get("darkMode") as boolean;
      if (storedTheme === true) {
        setThemeMode("dark");
        setTheme(darkMode);
      } else {
        setThemeMode("light");
        setTheme(lightMode);
      }
    };

    loadTheme();
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
