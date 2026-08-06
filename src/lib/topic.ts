import { H3Event } from "h3";

export interface AvailableTopic {
	name: string;
	value: string;
	title: string;
}

export const TOPICS: AvailableTopic[] = [
	{ name: "top", value: "news", title: "Top" },
	{ name: "new", value: "newest", title: "New" },
	{ name: "ask", value: "ask", title: "Ask" },
	{ name: "show", value: "show", title: "Show" },
];

export interface TopicItem {
	id: number;
	title: string;
	points?: number | null;
	user?: string | null;
	time: number;
	time_ago: string;
	comments_count: number;
	type: string;
	url?: string;
	domain?: string;
}

export const parseTopicParams = (event: H3Event) => {
	const topicName = getRouterParam(event, "topicName");
	const topic = TOPICS.find(t => t.name === topicName);
	const page = Number(getQuery(event).page ?? "1");

	// TODO: better validation?
	if (!topic || Number.isNaN(page) || page < 1) {
		throw createError({ statusCode: 404, message: "Unknown topic" });
	}

	return { topic, page };
};

export const fetchTopic = async (topic: AvailableTopic, page: number) => {
	// return $fetch<TopicItem[]>(`https://api.hnpwa.com/v0/${topic.value}/${page}.json`),
	return $fetch<TopicItem[]>(`https://api.hackerwebapp.com/${topic.value}?page=${page}.json`);
};
