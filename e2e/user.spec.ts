import { test, expect } from "@playwright/test";

test.describe("User page", () => {
	test("opens user pg page correctly", async ({ page }) => {
		await page.goto("/user/pg");

		await expect(page.getByTestId("user")).toBeVisible();
		await expect(page.getByTestId("user-name")).toBeVisible();
		await expect(page.getByTestId("user-name")).toHaveText("pg");
	});
});
