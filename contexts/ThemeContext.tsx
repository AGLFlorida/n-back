import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

import security from "@/util/security";

import { ThemeContextType } from "./types";
import lightMode from "./light";
import darkMode from "./dark";

const systemTheme = Appearance.getColorScheme();
const initialTheme = systemTheme === "dark" ? darkMode : lightMode;
const initialThemeMode = systemTheme || "light";

const ThemeContext = createContext<ThemeContextType>({
  theme: initialTheme,
  themeMode: initialThemeMode,
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(initialThemeMode);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await security.get("darkMode");
      
      if (storedTheme === true) {
        setThemeMode("dark");
        setTheme(darkMode);
      } else if (storedTheme === false) {
        setThemeMode("light");
        setTheme(lightMode);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = (dark: boolean) => {
    setThemeMode((dark) ? "dark" : "light");
    setTheme(dark ? darkMode : lightMode);
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
