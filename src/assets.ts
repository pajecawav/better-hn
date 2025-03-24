import { type Manifest } from "vite";

export interface Assets {
	css: string[];
	scripts: string[];
}

export const getAssets = async (): Promise<Assets> => {
	const manifest = await useStorage("assets:vite").getItem<Manifest>("manifest.json");
	if (!manifest) {
		throw createError({ status: 500, message: "Missing manifest.json" });
	}

	const entryChunk = Object.values(manifest).find(entry => entry.isEntry);
	if (!entryChunk) {
		throw createError({ status: 500, message: "Missing manifest entry" });
	}

	const css = entryChunk.css.map(link => `/${link}`);

	const scripts = [`/${entryChunk.file}`];

	return { css, scripts };
};
