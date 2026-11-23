import { createContext, useContext } from "react";
import type { ResolvedTheme, ThemeMode } from "./themeMode";

export type ThemeValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
};

export const ThemeContext = createContext<ThemeValue | null>(null);

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme 必须在 ThemeProvider 内使用。");
  return value;
}
