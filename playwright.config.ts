import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		[process.env.CI ? "github" : "list"],
		["html", { outputFolder: "playwright-report" }],
	],
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	webServer: {
		// NB: run vite directly, bypassing the pnpm wrapper — pnpm 12.6.0 broke
		// signal forwarding for non-interactive runs (pnpm#7374), leaving
		// Playwright unable to kill the webServer on teardown, hanging CI.
		command: "node node_modules/vite/bin/vite.js preview",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
	},
});
