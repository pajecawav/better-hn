import fs from "node:fs";
import path from "node:path";
import { $fetch } from "ofetch";

if (!process.env.CI) {
	console.log("Skipping sitemap generation in non-CI environment");
	process.exit(0);
}

const out = path.resolve(import.meta.dirname, "..", "src/public/sitemap.xml");

console.log(`Generating sitemap to ${out}`);

const tabs = ["top", "new", "ask", "show", "search"];
const monthAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

const { hits } = await $fetch<{ hits: Array<{ objectID: string }> }>(
	"https://hn.algolia.com/api/v1/search",
	{
		query: {
			tags: "story",
			hitsPerPage: 200,
			numericFilters: `created_at_i>${monthAgo}`,
		},
	},
);

const ids = hits.map(hit => hit.objectID);

const buildEntry = (pathname: string) =>
	`\
<url>
    <loc>https://bhn.pajecawav.dev/${pathname}</loc>
</url>`.trim();

const sitemap = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${tabs.map(tab => buildEntry(tab)).join("\n")}
    ${ids.map(id => buildEntry(`post/${id}`)).join("\n")}
</urlset>`.trim();

fs.writeFileSync(out, sitemap, "utf8");
