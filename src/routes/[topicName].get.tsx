import { ServerTiming } from "tiny-server-timing";
import { FeedItem } from "~/components/FeedItem";
import { TOPICS, TopicItem } from "~/lib/topic";
import { renderPage } from "~/render";

const ITEMS_PER_PAGE = 30;

export default defineEventHandler(async event => {
	const topicName = getRouterParam(event, "topicName");
	const topic = TOPICS.find(t => t.name === topicName);
	const page = Number(getQuery(event).page ?? "1");

	// TODO: better validation?
	if (!topic || Number.isNaN(page) || page < 1) {
		throw createError({ statusCode: 404, message: "Unknown topic" });
	}

	const timing = new ServerTiming();

	const items = await timing.timeAsync("fetch", () =>
		$fetch<TopicItem[]>(`https://api.hnpwa.com/v0/${topic.value}/${page}.json`),
	);

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
