import { test, expect } from "@playwright/test";

const SITE = "https://bhn.pajecawav.dev";
// playwright.config.ts webServer base url — request fixtures would follow the
// redirect, so the redirect test needs a manual fetch against it
const BASE_URL = "http://localhost:3000";

test.describe("SEO — response codes", () => {
	test("unknown topic responds 404, not a soft-404", async ({ request }) => {
		const res = await request.get("/nonexistent");
		expect(res.status()).toBe(404);

		const body = await res.text();
		expect(body).toContain("noindex");
		expect(body).not.toContain("404 Unknown topic nonexistent");
	});

	test("missing post responds 404 instead of crashing", async ({ request }) => {
		const res = await request.get("/post/999999999999");
		expect(res.status()).toBe(404);
	});

	test("/ permanently redirects to /top", async () => {
		const res = await fetch(new URL("/", BASE_URL), { redirect: "manual" });
		expect(res.status).toBe(308);
		expect(res.headers.get("location")).toBe("/top");
	});
});

test.describe("SEO — topic pages", () => {
	test("every topic gets a unique title and an h1", async ({ page }) => {
		const titles: string[] = [];

		for (const topic of ["top", "new", "ask", "show"]) {
			await page.goto(`/${topic}`);
			const title = await page.title();
			titles.push(title);

			await expect(page.locator("h1")).toHaveCount(1);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				`${SITE}/${topic}`,
			);
		}

		expect(new Set(titles).size).toBe(titles.length);
	});

	test("front page carries full head metadata", async ({ page }) => {
		await page.goto("/top");

		await expect(page).toHaveTitle("Top Stories | Better HN");

		const description = page.locator('meta[name="description"]');
		await expect(description).toHaveCount(1);
		await expect(description).not.toHaveAttribute("content", "");

		await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
			"content",
			"Top Stories | Better HN",
		);
		await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
			"content",
			`${SITE}/top`,
		);
		await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
			"content",
			`${SITE}/og.png`,
		);
		await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
			"content",
			"summary",
		);

		// viewport-fit=cover must survive unhead's viewport default
		await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
			"content",
			/viewport-fit=cover/,
		);
	});

	test("page=1 canonicalizes to the bare path, page=2 keeps the param", async ({ page }) => {
		await page.goto("/top?page=1");
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/top`);

		await page.goto("/top?page=2");
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			`${SITE}/top?page=2`,
		);
	});

	test("only /top declares the WebSite entity", async ({ page }) => {
		await page.goto("/top");
		const ld = await page.locator('script[type="application/ld+json"]').textContent();
		expect(JSON.parse(ld ?? "{}")["@type"]).toBe("WebSite");

		await page.goto("/new");
		await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
	});
});

test.describe("SEO — post page", () => {
	test("article metadata and DiscussionForumPosting JSON-LD", async ({ page }) => {
		await page.goto("/post/8863");

		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			`${SITE}/post/8863`,
		);
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			"content",
			"article",
		);

		const ld = await page.locator('script[type="application/ld+json"]').textContent();
		const json = JSON.parse(ld ?? "{}");
		expect(json["@type"]).toBe("DiscussionForumPosting");
		expect(json.url).toBe(`${SITE}/post/8863`);
		expect(json.headline).toContain("Dropbox");
	});
});

test.describe("SEO — search", () => {
	test("query URLs are noindex and canonicalize to /search", async ({ page }) => {
		await page.goto("/search?q=rust");

		await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			`${SITE}/search`,
		);
	});

	test("bare /search stays indexable", async ({ page }) => {
		await page.goto("/search");
		await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
	});
});

test.describe("SEO — feeds", () => {
	test("RSS feed serves top stories as valid XML-ish output", async ({ request }) => {
		const res = await request.get("/rss.xml");
		expect(res.status()).toBe(200);
		expect(res.headers()["content-type"]).toContain("application/rss+xml");

		const body = await res.text();
		expect(body).toContain("<rss");
		expect(body).toMatch(/<item>.+<\/item>/s);
	});

	test("robots.txt declares the sitemap and stays search-friendly", async ({ request }) => {
		const body = await (await request.get("/robots.txt")).text();
		expect(body).toContain("Sitemap: https://bhn.pajecawav.dev/sitemap.xml");
		// AI search agents are intentionally unblocked
		expect(body).not.toMatch(/^User-agent: (OAI-SearchBot|PerplexityBot|Applebot)$/m);
		// training crawlers stay blocked
		expect(body).toMatch(/^User-agent: GPTBot$/m);
	});
});
