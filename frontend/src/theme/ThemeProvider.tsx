import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./themeContext";
import type { ThemeValue } from "./themeContext";
import { applyTheme, nextMode, readStoredMode, storeMode, systemPrefersDark } from "./themeMode";
import type { ResolvedTheme, ThemeMode } from "./themeMode";

function subscribeSystem(callback: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  // 系统深浅用 useSyncExternalStore 订阅：切到“跟随系统”后能实时跟随，且不在 effect 里 setState。
  const systemDark = useSyncExternalStore(subscribeSystem, systemPrefersDark, () => false);
  const resolved: ResolvedTheme = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => {
    applyTheme(resolved, mode);
  }, [resolved, mode]);

  const setMode = useCallback((next: ThemeMode) => {
    storeMode(next);
    setModeState(next);
  }, []);

  const cycleMode = useCallback(() => {
    const next = nextMode(mode);
    storeMode(next);
    setModeState(next);
  }, [mode]);

  const value = useMemo<ThemeValue>(() => ({ mode, resolved, setMode, cycleMode }), [mode, resolved, setMode, cycleMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
