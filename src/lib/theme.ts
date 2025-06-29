export const enum Theme {
	LIGHT = "light",
	DARK = "dark",
}

export const DEFAULT_THEME: Theme = Theme.LIGHT;

export const THEME_COOKIE = "bhn.theme";

export const getThemeColor = (theme: Theme) => (theme == Theme.LIGHT ? "#ffffff" : "#18181b");
