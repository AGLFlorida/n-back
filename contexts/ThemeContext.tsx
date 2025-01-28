import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

import security from "@/util/security";

import { ThemeContextType } from "./types";
import lightMode from "./light";
import darkMode from "./dark";

const ThemeContext = createContext<ThemeContextType>({
  theme: lightMode, 
  themeMode: "light",
  toggleTheme: () => {}
});

const systemTheme = Appearance.getColorScheme();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("THEME PROVIDER RENDER");
  const [theme, setTheme] = useState((systemTheme === "dark") ? darkMode : lightMode); // default to system theme on first load.
  useEffect(() => {console.log("because of Theme hook 1: theme")}, [theme]);

  const [themeMode, setThemeMode] = useState<"light" | "dark">(systemTheme || "light"); // default to system theme.
  useEffect(() => {console.log("because of Theme hook 2: themeMode")}, [theme]);

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
