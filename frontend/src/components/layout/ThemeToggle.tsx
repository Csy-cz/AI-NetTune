import type { ReactNode } from "react";
import { useTheme } from "../../theme/themeContext";
import type { ThemeMode } from "../../theme/themeMode";

const LABEL: Record<ThemeMode, string> = { light: "浅色", dark: "深色", system: "跟随系统" };
const NEXT: Record<ThemeMode, ThemeMode> = { light: "dark", dark: "system", system: "light" };

const ICONS: Record<ThemeMode, ReactNode> = {
  light: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5" />
    </>
  ),
  dark: <path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11Z" />,
  system: (
    <>
      <circle cx="12" cy="12" r="7.4" />
      <path d="M12 4.6a7.4 7.4 0 0 1 0 14.8Z" fill="currentColor" stroke="none" />
    </>
  ),
};

/* 页头三态主题开关：浅色 → 深色 → 跟随系统。 */
export default function ThemeToggle() {
  const { mode, resolved, cycleMode } = useTheme();
  const action = `主题：${LABEL[mode]}（当前${resolved === "dark" ? "深色" : "浅色"}显示），点击切换到${LABEL[NEXT[mode]]}`;
  return (
    <button type="button" className="ain-theme-toggle" data-mode={mode} onClick={cycleMode} aria-label={action} title={action}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[mode]}
      </svg>
    </button>
  );
}
