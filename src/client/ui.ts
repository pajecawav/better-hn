import Cookies from "js-cookie";
import { DEFAULT_THEME, THEME_COOKIE, Theme, getThemeColor } from "../lib/theme";

const getTheme = () => {
	return (Cookies.get(THEME_COOKIE) as Theme | undefined) ?? DEFAULT_THEME;
};

const setTheme = (theme: Theme) => {
	document.documentElement.classList.toggle("dark", theme === "dark");
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", getThemeColor(theme));
	Cookies.set(THEME_COOKIE, theme, { expires: 365 * 24 * 60 * 60, sameSite: "lax" });
};

const updateTheme = () => {
	setTheme(getTheme());
};

(window as any).UI = {
	switchTheme() {
		const newTheme: Theme = document.documentElement.classList.contains("dark")
			? "light"
			: "dark";

		setTheme(newTheme);
	},
};

window.addEventListener("pageshow", () => {
	updateTheme();
});
