import { getCookie } from "nitro/h3";
import { defineServerEntry } from "@pajecawav/yamf/server";
import { App } from "./components/App";
import { DEFAULT_THEME, getThemeColor, THEME_COOKIE, type Theme } from "./lib/theme";

export default defineServerEntry({
	Layout: App,
	head: event => {
		const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

		return {
			htmlAttrs: {
				lang: "en",
				class: theme === "dark" ? "dark" : undefined,
			},
			meta: [{ name: "theme-color", content: getThemeColor(DEFAULT_THEME) }],
		};
	},
});
