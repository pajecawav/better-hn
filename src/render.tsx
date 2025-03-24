import { EventHandlerRequest, H3Event } from "h3";
import { Child } from "hono/jsx";
import { renderToString } from "hono/jsx/dom/server";
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

	const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

	// TODO: 103 early hints

	const context: SSRContextValue = {
		url: getRequestURL(event),
		title,
		assets,
		theme,
	};

	const html = renderToString(
		<SSRContext.Provider value={context}>
			<App>{page}</App>
		</SSRContext.Provider>,
	);

	timing.end("render");

	setHeaders(event, timing.getHeaders());

	return `
<!DOCTYPE html>
${html}
`;
};
