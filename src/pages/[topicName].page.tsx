import { definePage } from "@pajecawav/yamf";
import { HTTPError } from "nitro";
import { withServerTiming } from "nitro/h3";
import { $fetch } from "ofetch";
import { FeedItem } from "~/components/FeedItem";
import { buildPageTitle } from "~/lib/title";
import { TOPICS, type TopicItem } from "~/lib/topic";

const ITEMS_PER_PAGE = 30;

export default definePage({
	render: async (event, { head }) => {
		const topicName = event.context.params?.topicName;
		const topic = TOPICS.find(t => t.name === topicName);
		const page = Number(event.url.searchParams.get("page") ?? "1");

		// TODO: better validation?
		if (!topic || Number.isNaN(page) || page < 1) {
			throw new HTTPError({ statusCode: 404, message: `Unknown topic ${topicName}` });
		}

		event.res.headers.set("cache-control", "public, max-age=60, stale-while-revalidate=10");

		head.push({
			title: buildPageTitle(),
		});

		// const items = await $fetch<TopicItem[]>(`https://api.hnpwa.com/v0/${topic.value}/${page}.json`),
		const items = await withServerTiming(event, "fetch", () =>
			$fetch<TopicItem[]>(`https://api.hackerwebapp.com/${topic.value}?page=${page}.json`),
		);

		return (
			<>
				<div className="feed">
					{items.map((item, index) => (
						<FeedItem item={item} index={index + 1 + ITEMS_PER_PAGE * (page - 1)} />
					))}
				</div>

				<a className="more" href={`/${topic.name}?page=${page + 1}`}>
					More...
				</a>
			</>
		);
	},
});
