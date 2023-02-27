export interface Comment {
	id: number;
	user: string;
	time: number;
	time_ago: string;
	content: string;
	deleted?: boolean;
	comments: Comment[];
	url: string;
}

export interface Post {
	id: number;
	title: string;
	points: number;
	user: string;
	time: number;
	time_ago: string;
	content?: string;
	url: string;
	domain?: string;
	comments: Comment[];
}
