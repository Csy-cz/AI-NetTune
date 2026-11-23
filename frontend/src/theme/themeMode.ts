/* 主题模式：浅色 / 深色 / 跟随系统。
   DOM 契约集中在这里（data-theme / color-scheme / theme-color），React 侧只管状态。
   存储键与取值都要与 index.html 里的首帧内联脚本保持一致。 */
export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "ain-theme-mode";

/* 浏览器地址栏/滚动条外沿色，与 --ain-bg-page 对应。 */
const THEME_COLOR: Record<ResolvedTheme, string> = { light: "#edf5fc", dark: "#0a121e" };

const MODE_ORDER: ThemeMode[] = ["light", "dark", "system"];

function storage(): Storage | null {
  try {
    return (globalThis as unknown as { localStorage?: Storage }).localStorage ?? null;
  } catch {
    // 隐私模式下访问 localStorage 会抛错。
    return null;
  }
}

export function readStoredMode(): ThemeMode {
  try {
    const raw = storage()?.getItem(THEME_STORAGE_KEY);
    return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
  } catch {
    return "system";
  }
}

export function storeMode(mode: ThemeMode): void {
  try {
    storage()?.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // 写失败只影响下次访问，不影响本次切换。
  }
}

export function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") return systemPrefersDark() ? "dark" : "light";
  return mode;
}

export function nextMode(mode: ThemeMode): ThemeMode {
  return MODE_ORDER[(MODE_ORDER.indexOf(mode) + 1) % MODE_ORDER.length];
}

export function applyTheme(resolved: ResolvedTheme, mode?: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = resolved;
  if (mode) root.dataset.themeMode = mode;
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[resolved]);
}
