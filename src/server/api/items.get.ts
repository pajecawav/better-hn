import { Item, TOPICS } from "~~/src/lib/items";

export default defineEventHandler(async event => {
	const query = getQuery(event);

	const topicName = query.topic;
	const topic = TOPICS[topicName as keyof typeof TOPICS];
	if (!topic) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid topic",
		});
	}

	const page = Math.max(1, +(query.page ?? "1") || 1);

	const items = await $fetch<Item[]>(`https://api.hnpwa.com/v0/${topic}/${page}.json`);

	setHeader(event, "cache-control", "public, max-age=60");

	return { topic: topicName, page, items };
});
