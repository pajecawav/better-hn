import { defineServerEntry } from "@pajecawav/yamf/server";
import { App } from "./components/App";
import { DEFAULT_THEME, getThemeColor } from "./lib/theme";

export default defineServerEntry({
	Layout: App,
	head: () => {
		return {
			htmlAttrs: {
				lang: "en",
			},
			meta: [{ name: "theme-color", content: getThemeColor(DEFAULT_THEME) }],
		};
	},
});
