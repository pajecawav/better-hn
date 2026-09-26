import { $fetch } from "ofetch";
import type { TopicItem } from "~/lib/topic";

const API_BASE = "https://hn.algolia.com/api/v1";

export const HITS_PER_PAGE = 30;

export type SearchSort = "relevance" | "date";

export type SearchRange = "all" | "day" | "week" | "month" | "year";

/** Period lengths in seconds, mirroring the hn.algolia.com ranges. */
const RANGE_SECONDS: Record<Exclude<SearchRange, "all">, number> = {
	day: 24 * 60 * 60,
	week: 7 * 24 * 60 * 60,
	month: 30 * 24 * 60 * 60,
	year: 365 * 24 * 60 * 60,
};

export const RANGE_OPTIONS: { value: SearchRange; label: string }[] = [
	{ value: "all", label: "All time" },
	{ value: "day", label: "Past 24 hours" },
	{ value: "week", label: "Past week" },
	{ value: "month", label: "Past month" },
	{ value: "year", label: "Past year" },
];

/** Minimal shape of an Algolia story hit — every field except objectID is optional. */
export interface AlgoliaHit {
	objectID: string;
	title?: string | null;
	url?: string | null;
	author?: string | null;
	points?: number | null;
	num_comments?: number | null;
	created_at_i?: number;
}

export interface AlgoliaSearchResponse {
	hits: AlgoliaHit[];
	nbHits: number;
	page: number;
	nbPages: number;
	hitsPerPage: number;
}

export interface AlgoliaSearchParams {
	query: string;
	sort?: SearchSort;
	range?: SearchRange;
	page?: number;
	signal?: AbortSignal;
}

export const algoliaSearch = async ({
	query,
	sort = "relevance",
	range = "all",
	page = 0,
	signal,
}: AlgoliaSearchParams): Promise<AlgoliaSearchResponse> => {
	const endpoint = sort === "date" ? `${API_BASE}/search_by_date` : `${API_BASE}/search`;
	const params = new URLSearchParams({
		query,
		tags: "story",
		hitsPerPage: String(HITS_PER_PAGE),
		page: String(page),
	});
	if (range !== "all") {
		const since = Math.floor(Date.now() / 1000) - RANGE_SECONDS[range];
		params.set("numericFilters", `created_at_i>${since}`);
	}

	return await $fetch<AlgoliaSearchResponse>(`${endpoint}?${params}`, { signal });
};

const extractDomain = (url: string): string | undefined => {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return undefined;
	}
};

const timeAgoUnit = (value: number, unit: string): string =>
	`${value} ${unit}${value === 1 ? "" : "s"} ago`;

/** Relative time in the Hacker News style: "3 hours ago". */
export const timeAgo = (unixSeconds: number): string => {
	const seconds = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds);

	if (seconds < 60) {
		return timeAgoUnit(seconds, "second");
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return timeAgoUnit(minutes, "minute");
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return timeAgoUnit(hours, "hour");
	}

	const days = Math.floor(hours / 24);
	if (days < 30) {
		return timeAgoUnit(days, "day");
	}

	const months = Math.floor(days / 30);
	if (months < 12) {
		return timeAgoUnit(months, "month");
	}

	return timeAgoUnit(Math.floor(months / 12), "year");
};

/** Maps an Algolia story hit onto the TopicItem shape consumed by FeedItem. */
export const toTopicItem = (hit: AlgoliaHit): TopicItem => ({
	id: Number(hit.objectID),
	title: hit.title ?? "Untitled",
	points: hit.points ?? null,
	user: hit.author ?? null,
	time: hit.created_at_i ?? 0,
	time_ago: timeAgo(hit.created_at_i ?? 0),
	comments_count: hit.num_comments ?? 0,
	type: "story",
	url: hit.url ?? undefined,
	domain: hit.url ? extractDomain(hit.url) : undefined,
});
