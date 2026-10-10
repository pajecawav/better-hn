import type { YamfHead } from "@pajecawav/yamf";
import type { Post } from "~/lib/post";
import { SITE_URL } from "~/lib/site";

export interface SeoInput {
	/** Full page title, already built via buildPageTitle */
	title: string;
	description: string;
	/** Canonical path, e.g. "/top" or "/top?page=2" */
	path: string;
	noindex?: boolean;
	ogType?: "website" | "article" | "profile";
	/** ISO date for article pages, adds article:published_time */
	publishedTime?: string;
}

export const buildCanonicalUrl = (path: string) => `${SITE_URL}${path}`;

/** Strips HTML tags and decodes basic entities for meta descriptions */
export const htmlToText = (html: string) =>
	html
		.replace(/<[^>]*>/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();

/**
 * Single source of truth for per-page head metadata: description, canonical
 * URL and Open Graph / Twitter tags. Pushed entries dedupe-replace the
 * template's static fallbacks.
 */
export const seoHead = (input: SeoInput): YamfHead => {
	const canonical = buildCanonicalUrl(input.path);

	return {
		title: input.title,
		meta: [
			{ name: "description", content: input.description },
			...(input.noindex ? [{ name: "robots", content: "noindex" }] : []),
			{ property: "og:title", content: input.title },
			{ property: "og:description", content: input.description },
			{ property: "og:url", content: canonical },
			{ property: "og:type", content: input.ogType ?? "website" },
			...(input.publishedTime
				? [{ property: "article:published_time", content: input.publishedTime }]
				: []),
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:title", content: input.title },
			{ name: "twitter:description", content: input.description },
		],
		link: [{ rel: "canonical", href: canonical }],
	};
};

/** Serializes JSON-LD safely for embedding inside a <script> tag */
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** WebSite + SearchAction for the canonical home page (/top) */
export const WEBSITE_JSON_LD = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Better HN",
	url: SITE_URL,
	description: "An alternative UI for Hacker News built with Nitro and Hono",
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
		},
		"query-input": "required name=search_term_string",
	},
};

/** DiscussionForumPosting for a Hacker News story page */
export const postJsonLd = (post: Post, commentsCount: number) => ({
	"@context": "https://schema.org",
	"@type": "DiscussionForumPosting",
	url: `${SITE_URL}/post/${post.id}`,
	headline: post.title.slice(0, 110),
	...(post.content ? { articleBody: htmlToText(post.content).slice(0, 500) } : {}),
	datePublished: new Date(post.time * 1000).toISOString(),
	author: { "@type": "Person", name: post.user },
	interactionStatistic: [
		{
			"@type": "InteractionCounter",
			interactionType: "https://schema.org/CommentAction",
			userInteractionCount: commentsCount,
		},
		{
			"@type": "InteractionCounter",
			interactionType: "https://schema.org/LikeAction",
			userInteractionCount: post.points,
		},
	],
});
