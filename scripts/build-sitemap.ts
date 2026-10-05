import fs from "node:fs";
import path from "node:path";
import { $fetch } from "ofetch";

if (!process.env.CI) {
	console.log("Skipping sitemap generation in non-CI environment");
	process.exit(0);
}

const out = path.resolve(import.meta.dirname, "..", "src/public/sitemap.xml");

console.log(`Generating sitemap to ${out}`);

// /search renders an empty client-side shell — it has no index value
const tabs = ["top", "new", "ask", "show"];
const monthsAgo = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60;

// Algolia caps hitsPerPage at 1000 — the largest single-page window we can get
const { hits } = await $fetch<{
	hits: Array<{ objectID: string; created_at: string }>;
}>("https://hn.algolia.com/api/v1/search", {
	query: {
		tags: "story",
		hitsPerPage: 1000,
		numericFilters: `created_at_i>${monthsAgo}`,
	},
});

const ids = hits.map(hit => hit.objectID);
const lastmodBy = new Map(hits.map(hit => [hit.objectID, hit.created_at]));

const buildEntry = (pathname: string, lastmod?: string) =>
	`\
<url>
    <loc>https://bhn.pajecawav.dev/${pathname}</loc>${
		lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
	}
</url>`.trim();

const sitemap = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${tabs.map(tab => buildEntry(tab)).join("\n")}
    ${ids.map(id => buildEntry(`post/${id}`, lastmodBy.get(id))).join("\n")}
</urlset>`.trim();

fs.writeFileSync(out, sitemap, "utf8");
