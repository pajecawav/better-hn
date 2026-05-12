import { DEFAULT_THEME, getThemeColor, THEME_STORAGE_KEY, THEMES, type Theme } from "../lib/theme";

const getTheme = () => {
	return (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? DEFAULT_THEME;
};

const setTheme = (theme: Theme) => {
	document.documentElement.classList.toggle("dark", theme === "dark");
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", getThemeColor(theme));
	localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const updateTheme = () => {
	setTheme(getTheme());
};

(window as any).UI = {
	switchTheme() {
		const newTheme: Theme = document.documentElement.classList.contains("dark")
			? THEMES.LIGHT
			: THEMES.DARK;

		setTheme(newTheme);
	},
};

window.addEventListener("pageshow", () => {
	updateTheme();
});
