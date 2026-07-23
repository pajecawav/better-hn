import { ServerTiming } from "tiny-server-timing";
import { FeedItem } from "~/components/FeedItem";
import { fetchTopic, parseTopicParams } from "~/lib/topic";
import { renderPage } from "~/render";

const ITEMS_PER_PAGE = 30;

export default defineEventHandler(async event => {
	const { topic, page } = parseTopicParams(event);

	setHeader(event, "cache-control", "public, max-age=60, stale-while-revalidate=10");

	const timing = new ServerTiming();

	const items = await timing.timeAsync("fetch", () => fetchTopic(topic, page));

	return renderPage(
		<>
			<div className="feed">
				{items.map((item, index) => (
					<FeedItem item={item} index={index + 1 + ITEMS_PER_PAGE * (page - 1)} />
				))}
			</div>

			<a className="more" href={`/${topic.name}?page=${page + 1}`}>
				More...
			</a>
		</>,
		{ event, timing },
	);
});
