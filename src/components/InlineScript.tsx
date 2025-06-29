import { Theme, THEME_COOKIE } from "~/lib/theme";

const script = `
if (!("share" in navigator)) {
	document.body.classList.add("noshare");
}

(function () {
	function getTheme() {
		let storedTheme = undefined;

		try {
            storedTheme = document.cookie.split("${THEME_COOKIE}=")[1]?.split(";")[0];
		} catch {}

		if (typeof storedTheme === "string") {
			return storedTheme;
		}

		const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
		if (userMedia?.matches) {
			return "${Theme.DARK}";
		}

		return "${Theme.LIGHT}";
	}

	const root = document.documentElement;
	const theme = getTheme();

	root.classList.toggle("dark", theme === "${Theme.DARK}");
})();
`;

export const InlineScript = () => {
	return <script dangerouslySetInnerHTML={{ __html: script }} />;
};
