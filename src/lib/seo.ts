import type { YamfHead } from "@pajecawav/yamf";

export const SITE_URL = "https://bhn.pajecawav.dev";

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
