import { useSettings } from "./useSettings";

export type HotkeyMap = Record<string, () => void>;

export const useHotkeys = (hotkeys: HotkeyMap) => {
	const { settings } = useSettings();

	const bufferedKeys: string[] = [];
	let timeoutId: number | undefined = undefined;

	function reset() {
		bufferedKeys.length = 0;
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (!settings.value.hotkeysEnabled) {
			return;
		}

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

	if (process.client) {
		document.body.addEventListener("keypress", handleKeyPress);
	}

	onUnmounted(() => {
		document.body.removeEventListener("keypress", handleKeyPress);
	});
};
