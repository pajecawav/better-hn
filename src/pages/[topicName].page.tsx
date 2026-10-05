import { definePage } from "@pajecawav/yamf";
import { HTTPError } from "nitro";
import { withServerTiming } from "nitro/h3";
import { $fetch } from "ofetch";
import { FeedItem } from "~/components/FeedItem";
import { jsonLdScript, seoHead, WEBSITE_JSON_LD } from "~/lib/seo";
import { buildPageTitle } from "~/lib/title";
import { TOPICS, type TopicItem } from "~/lib/topic";

const ITEMS_PER_PAGE = 30;

/** Per-topic SEO copy; keys mirror AvailableTopic["name"] */
const TOPIC_SEO = {
	top: {
		title: "Top Stories",
		description:
			"Front page of Hacker News: today's top stories, discussions and comments in a clean, fast reader.",
	},
	new: {
		title: "Newest Stories",
		description: "Newest Hacker News stories and discussions, the moment they are submitted.",
	},
	ask: {
		title: "Ask HN",
		description: "Ask HN questions and answers from the Hacker News community.",
	},
	show: {
		title: "Show HN",
		description: "Show HN: projects built and shared by the Hacker News community.",
	},
} as const;

export default definePage({
	render: async (event, { head }) => {
		const topicName = event.context.params?.topicName;
		const topic = TOPICS.find(t => t.name === topicName);
		const page = Number(event.url.searchParams.get("page") ?? "1");

		// TODO: better validation?
		if (!topic || Number.isNaN(page) || page < 1) {
			throw new HTTPError({ statusCode: 404, message: `Unknown topic ${topicName}` });
		}

		const seo = TOPIC_SEO[topic.name];

		event.res.headers.set("cache-control", "public, max-age=60, stale-while-revalidate=10");

		head.push(
			seoHead({
				title: buildPageTitle(seo.title),
				description: seo.description,
				// page=1 renders the same list as the bare path — only page>1
				// earns its own canonical URL
				path: page > 1 ? `/${topic.name}?page=${page}` : `/${topic.name}`,
			}),
		);

		// /top is the canonical home page — declare the sitelinks search box
		if (topic.name === "top") {
			head.push({
				script: [{ type: "application/ld+json", innerHTML: jsonLdScript(WEBSITE_JSON_LD) }],
			});
		}

		// const items = await $fetch<TopicItem[]>(`https://api.hnpwa.com/v0/${topic.value}/${page}.json`),
		const items = await withServerTiming(event, "fetch", () =>
			$fetch<TopicItem[]>(`https://api.hackerwebapp.com/${topic.value}?page=${page}.json`),
		);

		return (
			<>
				<h1 className="sr-only">{seo.title}</h1>
				<div className="feed" data-testid="topic-feed">
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
