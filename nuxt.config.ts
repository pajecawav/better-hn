const themeScript = `
(function() {
    function getTheme() {
        const storedTheme = window.localStorage.getItem("bhn.theme")
        if (typeof storedTheme === "string") {
            return storedTheme;
        }

        const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
        if (userMedia?.matches) {
            return "dark";
        }

        return "light";
    }


    const root = document.documentElement;
    const theme = getTheme();

    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
})();
`.trim();

export default defineNuxtConfig({
	srcDir: "src/",
	typescript: {
		strict: true,
		typeCheck: "build",
	},
	css: ["@/assets/main.css"],
	app: {
		head: {
			script: [{ children: themeScript }],
		},
	},
	routeRules: {
		"/": { redirect: "/top" },
	},
});
