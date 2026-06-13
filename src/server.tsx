import { defineServerEntry } from "@pajecawav/yamf/server";
import { DEFAULT_THEME, getThemeColor } from "./lib/theme";

export default defineServerEntry({
	head: () => {
		return {
			htmlAttrs: {
				lang: "en",
			},
			meta: [{ name: "theme-color", content: getThemeColor(DEFAULT_THEME) }],
		};
	},
});
