type Theme = "light" | "dark";

const THEME_KEY = "bhn.theme";

function getTheme(): Theme | undefined {
	if (typeof window === "undefined") {
		return undefined;
	}

	const storedTheme = localStorage.getItem(THEME_KEY);
	if (storedTheme) {
		return storedTheme as Theme;
	}

	const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
	if (userMedia?.matches) {
		return "dark";
	}

	return "light";
}

export const useTheme = () => {
	const theme = ref<"light" | "dark" | undefined>(getTheme());

	function toggleTheme() {
		theme.value = theme.value === "light" ? "dark" : "light";

		localStorage.setItem(THEME_KEY, theme.value);

		const root = document.documentElement;
		if (theme.value === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}

	return { theme, toggleTheme };
};
