import { ServerTiming } from "tiny-server-timing";
import { fetchTopic, parseTopicParams } from "~/lib/topic";
import { renderRssFeed } from "~/rss";

export default defineEventHandler(async event => {
	const { topic, page } = parseTopicParams(event);

	setHeader(event, "cache-control", "public, max-age=60, stale-while-revalidate=10");

	const timing = new ServerTiming();

	const items = await timing.timeAsync("fetch", () => fetchTopic(topic, page));

	const url = getRequestURL(event);
	const linkUrl = new URL(`/${topic.name}/rss`, url);

	return renderRssFeed({
		event,
		timing,
		feed: {
			link: linkUrl.toString(),
			title: `Better HN - ${topic.name}`,
			description: `Latest ${topic.name} stories from Hacker News`,
			items: items.map(item => {
				const itemUrl = new URL(`/item/${item.id}`, url);

				return {
					id: item.id.toString(),
					title: item.title,
					link: itemUrl.toString(),
					description: `
<p>Article: <a href="${itemUrl.toString()}">${item.title}</a></p>
<p>Comments: <a href="${itemUrl.toString()}">${item.comments_count} ${item.comments_count === 1 ? "comment" : "comments"}</a></p>
<p>Score: ${item.points ?? 0}</p>
`.trim(),
					pubDate: new Date(item.time * 1000).toUTCString(),
					guid: item.id,
				};
			}),
		},
	});
});
