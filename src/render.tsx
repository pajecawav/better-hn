import { EventHandlerRequest, H3Event } from "h3";
import { Child } from "hono/jsx";
import { renderToReadableStream } from "hono/jsx/dom/server";
import { ServerTiming } from "tiny-server-timing";
import { getAssets } from "./assets";
import { App } from "./components/App";
import { SSRContext, SSRContextValue } from "./lib/context";
import { DEFAULT_THEME, Theme, THEME_COOKIE } from "./lib/theme";

interface RenderPageOptions {
	title?: string;
	timing: ServerTiming;
	event: H3Event<EventHandlerRequest>;
}

export const renderPage = async (page: Child, { title, timing, event }: RenderPageOptions) => {
	timing.start("render");

	const assets = await getAssets();

	// TODO: 103 early hints?
	// const hints = [
	// 	...assets.scripts.map(script => `<${script}>; rel=preload; as=script`),
	// 	...assets.css.map(css => `<${css}>; rel=preload; as=style`),
	// ];

	// writeEarlyHints(event, {
	// 	link: hints,
	// });

	const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

	const context: SSRContextValue = {
		url: getRequestURL(event),
		title,
		assets,
		theme,
		timing,
	};

	setHeader(event, "Content-Type", "text/html, charset=UTF-8");

	event.node.res.write("<!DOCTYPE html>");

	// TODO: server-timing
	// timing.end("render");
	// setHeaders(event, timing.getHeaders());

	return renderToReadableStream(
		<SSRContext.Provider value={context}>
			<App>{page}</App>
		</SSRContext.Provider>,
	);
};
