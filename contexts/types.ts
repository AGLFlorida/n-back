import lightMode from "./light";

export type ThemeContextType = {
  theme: typeof lightMode; // type workaround
  themeMode: "light" | "dark"; 
  toggleTheme: (arg0: boolean) => void;
};

export type Toggle = (arg0: boolean) => string;