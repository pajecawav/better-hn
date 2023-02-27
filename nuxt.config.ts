const themeScript = `
(function() {
	const storedTheme = window.localStorage.getItem("bhn.theme");
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	if (storedTheme === "dark" || media.matches) {
		document.documentElement.classList.add("dark");
	}
})();
`;

export default defineNuxtConfig({
	srcDir: "src/",
	typescript: {
		strict: true,
		typeCheck: "build",
	},
	css: ["@/assets/main.css"],
	app: {
		head: {
			htmlAttrs: {
				lang: "en",
			},
			meta: [{ name: "description", content: "A Hacker News clone built with Nuxt 3" }],
			script: [{ children: themeScript }],
		},
	},
	routeRules: {
		"/": { redirect: "/top" },
	},
});
