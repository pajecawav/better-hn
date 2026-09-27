import { test, expect } from "@playwright/test";

const HITS_PER_PAGE = 30;

test.describe("Search page", () => {
	test("opens with the default popular stories feed", async ({ page }) => {
		await page.goto("/search");

		await expect(page).toHaveURL("/search");
		await expect(page.getByTestId("search-input")).toBeVisible();
		// the island focuses the input imperatively after hydration
		await expect(page.getByTestId("search-input")).toBeFocused();

		await expect(page.getByTestId("search-feed")).toBeVisible();

		const items = page.getByTestId("feed-item");
		await expect(items.first()).toBeVisible();
		expect(await items.count()).toBeGreaterThan(0);
	});

	test("searches as you type and syncs the query to the URL", async ({ page }) => {
		await page.goto("/search");
		await page.getByTestId("search-input").fill("rust");

		await expect(page).toHaveURL(/q=rust/);

		const items = page.getByTestId("feed-item");
		await expect(items.first()).toBeVisible();
		expect(await items.count()).toBeGreaterThan(0);
	});

	test("sorts by date via the select", async ({ page }) => {
		await page.goto("/search?q=rust");
		await expect(page.getByTestId("search-feed")).toBeVisible();

		await page.getByTestId("sort-select").selectOption("date");

		await expect(page).toHaveURL(/sort=date/);
		await expect(page.getByTestId("search-feed")).toBeVisible();
	});

	test("shows the empty state for a non-matching query", async ({ page }) => {
		await page.goto("/search");
		await page.getByTestId("search-input").fill("qzwxecrv12345noresults");

		await expect(page.getByTestId("search-empty")).toBeVisible();
	});

	test("filters by time range via the select", async ({ page }) => {
		await page.goto("/search");
		await expect(page.getByTestId("search-feed")).toBeVisible();

		await page.getByTestId("range-select").selectOption("week");

		await expect(page).toHaveURL(/range=week/);
		await expect(page.getByTestId("search-feed")).toBeVisible();

		// A week-wide range must not surface items from previous years.
		const infos = page.getByTestId("feed-item").locator(".info");
		await expect(infos.first()).toBeVisible();
		expect(await infos.filter({ hasText: /years? ago/ }).count()).toBe(0);
	});

	test("supports advanced query syntax", async ({ page }) => {
		await page.goto("/search");
		await page.getByTestId("search-input").fill("story:8863");

		const items = page.getByTestId("feed-item");
		await expect(items).toHaveCount(1);
	});

	test("highlights query matches in titles", async ({ page }) => {
		await page.goto("/search");
		await page.getByTestId("search-input").fill("rust");

		await expect(page.getByTestId("search-feed")).toBeVisible();
		await expect(page.locator('[data-testid="feed-item"] em').first()).toBeVisible();
	});

	test("appends the next page via More", async ({ page }) => {
		await page.goto("/search");
		await expect(page.getByTestId("search-feed")).toBeVisible();

		const items = page.getByTestId("feed-item");
		await expect(items.nth(HITS_PER_PAGE - 1)).toBeVisible();

		await page.getByTestId("search-more").click();

		await expect(async () => {
			expect(await items.count()).toBeGreaterThan(HITS_PER_PAGE);
		}).toPass();
	});
});
