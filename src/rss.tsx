import { H3Event } from "h3";
import { raw } from "hono/html";
import { renderToString } from "hono/jsx/dom/server";
import { ServerTiming } from "tiny-server-timing";

interface FeedItem {
	id: string;
	title: string;
	description: string;
	link: string;
	pubDate: string;
}

interface RenderRssFeedOptions {
	event: H3Event;
	timing: ServerTiming;
	feed: {
		title: string;
		link: string;
		description: string;
		items: FeedItem[];
	};
}

export const renderRssFeed = ({
	event,
	timing,
	feed: { title, link, description, items },
}: RenderRssFeedOptions) => {
	setHeader(event, "Content-Type", "application/xml; charset=utf-8");

	const content = timing.time("render", () =>
		renderToString(
			<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
				<channel>
					<title>{title}</title>
					<link>{link}</link>
					<description>{description}</description>
					<docs>https://github.com/pajecawav/better-hn</docs>
					<language>en-us</language>
					{/* TODO */}
					{/*<ttl>5</ttl>*/}
					<atom:link href={link} rel="self" type="application/rss+xml" />

					{items.map(item => (
						<item key={item.id}>
							<title>{item.title}</title>
							<link>{item.link}</link>
							<description>{raw(`<![CDATA[${item.description}]]>`)}</description>
							<pubDate>{item.pubDate}</pubDate>
							<guid isPermaLink="false">{item.link}</guid>
						</item>
					))}
				</channel>
			</rss>,
		),
	);

	setHeaders(event, timing.getHeaders());

	return content;
};
