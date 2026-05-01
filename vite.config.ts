import yamf from "@pajecawav/yamf/vite";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		sourcemap: true,
	},
	plugins: [
		yamf({
			nitro: {
				errorHandler: "./src/error.ts",
				compatibilityDate: "2026-04-29",
				preset: process.env.VERCEL ? "vercel" : undefined,
				routeRules: {
					"/": { redirect: "/top" },
					// "/*": { cache: { maxAge: 60 } },
					// "/post/*": { cache: { maxAge: 60 } },
					// "/user/*": { cache: { maxAge: 60 } },
				},
			},
		}),
	],
});
