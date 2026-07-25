import { test, expect } from "@playwright/test";

test.describe("Post page", () => {
	test("opens post 8863 correctly", async ({ page }) => {
		await page.goto("/post/8863");

		await expect(page.getByTestId("post")).toBeVisible();
		await expect(page.getByTestId("post-title")).toBeVisible();

		const comments = page.getByTestId("comment");
		await expect(comments.first()).toBeVisible();
	});

	test("collapses and expands comment", async ({ page }) => {
		await page.goto("/post/8863");

		const comment = page.getByTestId("comment").first();
		const toggle = comment.getByTestId("comment-toggle").first();

		// Initially not folded
		await expect(comment).not.toHaveAttribute("data-folded", "true");

		// Click to fold
		await toggle.click();
		await expect(comment).toHaveAttribute("data-folded", "true");

		// Click to unfold
		await toggle.click();
		await expect(comment).not.toHaveAttribute("data-folded", "true");
	});
});
