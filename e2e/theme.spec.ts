import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
	test("switches between light and dark themes", async ({ page }) => {
		await page.emulateMedia({ colorScheme: "light" });
		await page.goto("/top");

		// Initially light (no dark class on html)
		await expect(page.locator("html")).not.toHaveClass(/dark/);

		// Toggle to dark
		await page.getByTestId("theme-toggle").click();
		await expect(page.locator("html")).toHaveClass(/dark/);

		// Toggle back to light
		await page.getByTestId("theme-toggle").click();
		await expect(page.locator("html")).not.toHaveClass(/dark/);
	});
});
