import { defineHandler } from "nitro";
import { $fetch } from "ofetch";
import { SITE_URL } from "~/lib/site";
import type { TopicItem } from "~/lib/topic";

const escapeXml = (text: string) =>
	text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");

export default defineHandler(async event => {
	event.res.headers.set("cache-control", "public, max-age=3600");

	const items = await $fetch<TopicItem[]>("https://api.hackerwebapp.com/news?page=1");

	const feed = `\
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
    <title>Better HN</title>
    <link>${SITE_URL}/top</link>
    <description>An alternative UI for Hacker News — top stories</description>
    <language>en-us</language>
${items
	.map(item => {
		const description = [
			`${item.points} points by ${item.user}`,
			`${item.comments_count} comments`,
			item.domain ? `https://${item.domain}` : "",
		]
			.filter(Boolean)
			.join(" · ");

		return `\
    <item>
        <title>${escapeXml(item.title)}</title>
        <link>${SITE_URL}/post/${item.id}</link>
        <guid isPermaLink="true">${SITE_URL}/post/${item.id}</guid>
        <pubDate>${new Date(item.time * 1000).toUTCString()}</pubDate>
        <description>${escapeXml(description)}</description>
    </item>`;
	})
	.join("\n")}
</channel>
</rss>`;

	return new Response(feed, {
		headers: { "content-type": "application/rss+xml; charset=utf-8" },
	});
});
