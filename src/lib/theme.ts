export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export const THEME_COOKIE = "bhn.theme";

export const getThemeColor = (theme: Theme) => (theme == "light" ? "#ffffff" : "#18181b");
