import { defineServerEntry } from "@pajecawav/yamf/server";
import { DEFAULT_THEME, getThemeColor } from "./lib/theme";

export default defineServerEntry({
	head: () => {
		return {
			htmlAttrs: {
				lang: "en",
			},
			meta: [
				{ name: "theme-color", content: getThemeColor(DEFAULT_THEME) },
				// Re-asserted here: unhead's own viewport default wins over the
				// template's tag and drops viewport-fit=cover (needed for the
				// safe-area padding on notched devices)
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
				},
			],
		};
	},
});
