import { DEFAULT_THEME, THEMES, THEME_STORAGE_KEY, type Theme, getThemeColor } from "~/lib/theme";

if (!("share" in navigator)) {
	document.body.classList.add("noshare");
}

const getTheme = () => {
	return (
		(localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ??
		(window.matchMedia("(prefers-color-scheme: dark)")?.matches ? THEMES.DARK : DEFAULT_THEME)
	);
};

const setTheme = (theme: Theme) => {
	document.documentElement.classList.toggle("dark", theme === "dark");
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", getThemeColor(theme));
	localStorage.setItem(THEME_STORAGE_KEY, theme);
};

declare global {
	interface Window {
		UI: {
			updateTheme(): void;
		};
	}
}

(window as any).UI = {
	switchTheme() {
		const newTheme: Theme = document.documentElement.classList.contains("dark")
			? THEMES.LIGHT
			: THEMES.DARK;

		setTheme(newTheme);
	},

	updateTheme() {
		setTheme(getTheme());
	},
};

window.UI.updateTheme();
