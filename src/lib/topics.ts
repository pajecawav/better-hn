export const TOPICS = {
	top: "news",
	new: "newest",
	ask: "ask",
	show: "show",
};

export interface TopicItem {
	id: number;
	title: string;
	points: number;
	user: string;
	time: number;
	time_ago: string;
	comments_count: number;
	type: string;
	url: string;
	domain?: string;
}
