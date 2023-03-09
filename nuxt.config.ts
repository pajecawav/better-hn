const themeScript = `
(function() {
	const storedTheme = window.localStorage.getItem("bhn.theme");
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	if (storedTheme === "dark" || (!storedTheme && media.matches)) {
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
			link: [
				{ rel: "icon", href: "/favicon.ico", sizes: "any" },
				{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png",
				},
				{ rel: "manifest", href: "/manifest.webmanifest" },
			],
			meta: [
				{ name: "application-name", content: "Repeatable" },
				{ name: "description", content: "A Hacker News clone built with Nuxt 3" },
				{ name: "theme-color", content: "#ffffff" },
			],
			script: [{ children: themeScript }],
		},
	},
	routeRules: {
		"/": { redirect: "/top" },
	},
	modules: ["@vite-pwa/nuxt"],
	pwa: {
		manifest: {
			name: "Better HN",
			short_name: "Better HN",
			description: "A Hacker News clone built with Nuxt 3",
			icons: [
				{
					src: "/android-chrome-192x192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "/android-chrome-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "any maskable",
				},
			],
			start_url: "/top",
			theme_color: "#18181b",
			background_color: "#18181b",
			display: "standalone",
			orientation: "portrait",
		},
	},
});
