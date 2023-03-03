export type HotkeyMap = Record<string, () => void>;

export const useHotkeys = (hotkeys: HotkeyMap) => {
	const bufferedKeys: string[] = [];
	let timeoutId: number | undefined = undefined;

	function reset() {
		bufferedKeys.length = 0;
	}

	function handleKeyPress(event: KeyboardEvent) {
		window.clearTimeout(timeoutId);

		bufferedKeys.push(event.key);

		for (let i = 0; i < bufferedKeys.length; i++) {
			const key = bufferedKeys.slice(i).join(" ");
			const fn = hotkeys[key];
			if (fn) {
				fn();
				reset();
				break;
			}
		}

		timeoutId = window.setTimeout(reset, 750);
	}

	if (typeof window !== "undefined") {
		document.body.addEventListener("keypress", handleKeyPress);
	}

	onUnmounted(() => {
		document.body.removeEventListener("keypress", handleKeyPress);
	});
};
