export const THEMES = {
	LIGHT: "light",
	DARK: "dark",
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export const DEFAULT_THEME: Theme = THEMES.LIGHT;

export const THEME_COOKIE = "bhn.theme";

export const getThemeColor = (theme: Theme) => (theme == THEMES.LIGHT ? "#ffffff" : "#18181b");
