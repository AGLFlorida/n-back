import lightMode from "./light";

export type ThemeType = typeof lightMode; // hacky workarounds ftl...

export type ThemeContextType = {
  theme: ThemeType;
  themeMode: "light" | "dark"; 
  toggleTheme: (arg0: boolean) => void;
};

export type Toggle = (arg0: boolean) => string;