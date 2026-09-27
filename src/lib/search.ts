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
	_highlightResult?: {
		title?: {
			value: string;
			matchLevel: "none" | "partial" | "full";
			matchedWords: string[];
		};
	};
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

export interface ParsedQuery {
	query: string;
	tags: string[];
	numericFilters: string[];
}

/**
 * Advanced query syntax, mirroring hn.algolia.com/help:
 *   author:USERNAME / by:USERNAME -> author_USERNAME tag
 *   story:ID                      -> story_ID tag
 *   points>N, comments>N, date>N  -> numericFilters (also <, <=, >=, =)
 * Quoted phrases are preserved verbatim (the API handles them via
 * advancedSyntax). Unrecognized tokens stay part of the plain query.
 */
const ADVANCED_TOKEN_RE = /^(author|by|story|points|comments|date)(:|<=|>=|<|>|=)([^\s"]+)$/i;

const applyAdvancedToken = (token: string, tags: string[], numericFilters: string[]): boolean => {
	const match = ADVANCED_TOKEN_RE.exec(token);
	if (!match) {
		return false;
	}
	const [, key, op, value] = match;
	const normalizedKey = key.toLowerCase();

	if (normalizedKey === "author" || normalizedKey === "by") {
		if (op !== ":") {
			return false;
		}
		tags.push(`author_${value}`);
	} else if (normalizedKey === "story") {
		if (op !== ":") {
			return false;
		}
		tags.push(`story_${value}`);
	} else {
		if (op === ":" || !Number.isFinite(Number(value))) {
			return false;
		}
		const field =
			normalizedKey === "points"
				? "points"
				: normalizedKey === "comments"
					? "num_comments"
					: "created_at_i";
		numericFilters.push(`${field}${op}${value}`);
	}
	return true;
};

export const parseAdvancedQuery = (raw: string): ParsedQuery => {
	const tags: string[] = [];
	const numericFilters: string[] = [];
	const words: string[] = [];

	for (const token of raw.match(/"[^"]*"|\S+/g) ?? []) {
		if (!token.startsWith('"') && applyAdvancedToken(token, tags, numericFilters)) {
			continue;
		}
		words.push(token);
	}

	return { query: words.join(" "), tags, numericFilters };
};

export const algoliaSearch = async ({
	query,
	sort = "relevance",
	range = "all",
	page = 0,
	signal,
}: AlgoliaSearchParams): Promise<AlgoliaSearchResponse> => {
	const endpoint = sort === "date" ? `${API_BASE}/search_by_date` : `${API_BASE}/search`;
	const parsed = parseAdvancedQuery(query);
	const params = new URLSearchParams({
		query: parsed.query,
		tags: ["story", ...parsed.tags].join(","),
		hitsPerPage: String(HITS_PER_PAGE),
		page: String(page),
	});
	const filters = [...parsed.numericFilters];
	if (range !== "all") {
		const since = Math.floor(Date.now() / 1000) - RANGE_SECONDS[range];
		filters.unshift(`created_at_i>${since}`);
	}
	if (filters.length > 0) {
		params.set("numericFilters", filters.join(","));
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

/** Highlighted title markup from Algolia (<em> wraps the matches), if any. */
const highlightedTitle = (hit: AlgoliaHit): string | undefined => {
	const title = hit._highlightResult?.title;
	if (title && title.matchLevel !== "none" && title.matchedWords.length > 0) {
		return title.value;
	}
	return undefined;
};

/** Maps an Algolia story hit onto the TopicItem shape consumed by FeedItem. */
export const toTopicItem = (hit: AlgoliaHit): TopicItem => ({
	id: Number(hit.objectID),
	title: hit.title ?? "Untitled",
	title_html: highlightedTitle(hit),
	points: hit.points ?? null,
	user: hit.author ?? null,
	time: hit.created_at_i ?? 0,
	time_ago: timeAgo(hit.created_at_i ?? 0),
	comments_count: hit.num_comments ?? 0,
	type: "story",
	url: hit.url ?? undefined,
	domain: hit.url ? extractDomain(hit.url) : undefined,
});
