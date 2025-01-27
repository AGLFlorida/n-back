import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

import security from "@/util/security";

export type ThemeContextType = {
  theme: typeof lightMode; 
  themeMode: "light" | "dark"; 
  toggleTheme: (arg0: boolean) => void;
};

type Toggle = (arg0: boolean) => string;
const lightThumbColor: Toggle = (on: boolean) => {
  const c1: string = '#C99782';
  const c2: string = '#f4f3f4';
  return on ? c1 : c2
}

const lightMode = {
  textColor: "#000",
  backgroundColor: "#dad6d1",
  accentColor: "#fff",
  borderColor: "#bbb",
  toggle: {
    trackColor: { 
      false: '#898A88', 
      true: '#E0C3B5' 
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
  toggle: {
    trackColor: { 
      false: '#767577', 
      true: '#1f3c4a' 
    },
    thumbColor: (on: boolean) => on ? '#36687d' : '#f4f3f4',
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
