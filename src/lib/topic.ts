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
