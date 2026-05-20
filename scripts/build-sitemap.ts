import fs from "node:fs";
import path from "node:path";
import { $fetch } from "ofetch";

if (!process.env.CI) {
	console.log("Skipping sitemap generation in non-CI environment");
	process.exit(0);
}

const out = path.resolve(import.meta.dirname, "..", "src/public/sitemap.xml");

console.log(`Generating sitemap to ${out}`);

const tabs = ["top", "new", "ask", "show"];
const ids = await $fetch<number[]>("https://hacker-news.firebaseio.com/v0/beststories.json");

const buildEntry = (pathname: string) =>
	`\
<url>
    <loc>https://bhn.vercel.app/${pathname}</loc>
</url>`.trim();

const sitemap = `\
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${tabs.map(tab => buildEntry(tab)).join("\n")}
    ${ids.map(id => buildEntry(`post/${id}`)).join("\n")}
</urlset>`.trim();

fs.writeFileSync(out, sitemap, "utf8");
