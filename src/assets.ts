import { EventHandlerRequest, H3Event } from "h3";
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

export const sendEarlyHints = async (event: H3Event<EventHandlerRequest>) => {
	const assets = await getAssets();

	const hints = [
		...assets.scripts.map(script => `<${script}>; rel=preload; as=script`),
		...assets.css.map(css => `<${css}>; rel=preload; as=style`),
	];

	writeEarlyHints(event, hints);
};
