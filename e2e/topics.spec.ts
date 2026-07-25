import { test, expect } from "@playwright/test";

const TOPICS = ["top", "new", "ask", "show"] as const;

test.describe("Topic pages", () => {
	for (const topic of TOPICS) {
		test(`opens ${topic} page correctly`, async ({ page }) => {
			await page.goto(`/${topic}`);

			await expect(page).toHaveURL(`/${topic}`);
			await expect(page.getByTestId("topic-feed")).toBeVisible();

			const items = page.getByTestId("feed-item");
			await expect(items.first()).toBeVisible();
			expect(await items.count()).toBeGreaterThan(0);
		});
	}

	test("redirects / to /top", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveURL("/top");
	});
});
