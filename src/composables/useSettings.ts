const SETTINGS_KEY = "bhn.settings";

interface Settings {
	hotkeysEnabled: boolean;
}

const defaultSettings: Settings = {
	hotkeysEnabled: true,
};

function getSettings(): Settings {
	if (process.server) {
		return defaultSettings;
	}

	const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}");
	return { ...defaultSettings, ...settings };
}

export const useSettings = () => {
	const settings = useState("settings", getSettings);

	watch(
		settings,
		newSettings => {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
		},
		{ deep: true }
	);

	return { settings };
};
