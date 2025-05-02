import { EventHandlerRequest, H3Event } from "h3";
import { html, raw } from "hono/html";
import { Child, jsx } from "hono/jsx";
import { renderToReadableStream } from "hono/jsx/dom/server";
import { ServerTiming } from "tiny-server-timing";
import { getAssets, sendEarlyHints } from "./assets";
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

	sendEarlyHints(event, assets);

	const theme = (getCookie(event, THEME_COOKIE) ?? DEFAULT_THEME) as Theme;

	const context: SSRContextValue = {
		url: getRequestURL(event),
		title,
		assets,
		theme,
		timing,
	};

	setHeader(event, "Content-Type", "text/html; charset=UTF-8");

	// TODO: server-timing
	// timing.end("render");
	// setHeaders(event, timing.getHeaders());

	// setHeader(event, "Content-Encoding", "gzip");
	// const compression = new CompressionStream("gzip");

	// TODO: wtf is this
	// const writer = compression.writable.getWriter();
	// await writer.ready;
	// await writer.write(new TextEncoder().encode("<!DOCTYPE html>"));
	// await writer.ready;
	// await writer.releaseLock();

	// const stream = await renderToReadableStream(
	// 	<SSRContext.Provider value={context}>
	// 		<App>{page}</App>
	// 	</SSRContext.Provider>,
	// );

	// return stream;

	const docType = raw("<!DOCTYPE html>");

	return renderToReadableStream(
		html`${docType}${jsx(SSRContext.Provider, { value: context }, (<App>{page}</App>) as any)}`,
	);
};
